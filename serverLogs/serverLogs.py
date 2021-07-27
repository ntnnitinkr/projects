import dash
import dash_core_components as dcc
import dash_bootstrap_components as dbc
import dash_html_components as html
from dash.dependencies import Input, Output, State, ALL
from dash.exceptions import PreventUpdate
import dash_gif_component as gif
import requests
import json
import sys
import time
import math
import configparser
import visdcc
import threading
import uuid
from users import VALID_USERNAME_PASSWORD_PAIRS

# Load the configuration file
dropdownEnvList = []
config = configparser.ConfigParser()
config.read('config.ini')
for section in config.sections():
    dropdownEnvList.append(section)

def getServerJson(url, username, password):
    try:
        response = requests.get(url, auth=(username, password))
        if response.status_code != requests.codes.ok:
            print()
            print("Error connecting to WLS Server!")
            print("HTTP Error code = " + str(response.status_code))
            print("URL  = "+url)
            sys.exit(1)
    except requests.exceptions.Timeout as e:
        print(e)
        sys.exit(1)
    except requests.exceptions.HTTPError as e:
        print(e)
        sys.exit(1)
    except requests.exceptions.RequestException as e:
        # catastrophic error. bail.
        print(e)
        sys.exit(1)
    return json.loads(response.text)

#Get a list of all of the Admin and Managed Servers in the domain
def getServers(wlsDomain,wlsServerUrl,username,password ):
    url = 'http://'+wlsServerUrl+'/management/wls/latest/servers'
    serverJson = getServerJson(url, username, password)
    for server in serverJson["links"]:
        if (server['rel'] != "parent"):
            wlsDomain.addServer(WLSServer(server["title"], server["uri"]))


# Get the url of the list of logs, along with some other basic
# server information
def getLogListUrl(server, username, password):
    serverJson = getServerJson(server.serverUrl, username, password)
    server.setState(serverJson["item"]["state"])
    if server.state == "running":
        server.setHealth(serverJson["item"]["health"]["state"])

    for link in serverJson["links"]:
        if link["rel"] == "logs":
            logListULR = link["uri"]
    return logListULR


#For the given server, get the url for each server log
def getServerLogUrl(server,username,password, logListUrl):
    logListJson = getServerJson(logListUrl, username, password)
    for link in logListJson["links"]:
        if link["rel"] == "items.name":
            if not link["title"].startswith("JMSMessageLog") and \
               not link["title"].startswith("HTTPAccessLog"):
               server.addLog(WLLog(link["title"],link["uri"]))


#Go and find all server logs and read them, and take note of
#the error messages
def searchServerLogs(wlsDomain, username, password):
    global progressBar
    count = 0
    
    for server in wlsDomain.serverList:
        #get the url to the list of logs for the given server
        logListUrl = getLogListUrl(server, username, password)
        
        #we can't get the log of a server that is not running
        if server.state != "running":
            continue
        
        #get the url for each server log of the given server
        getServerLogUrl(server,username,password, logListUrl)
        
        for log in server.logList:
            progressBar['totalCount'] += 1

    for server in wlsDomain.serverList:

        #we can't get the log of a server that is not running
        if server.state != "running":
            continue
        
        for log in server.logList:
            #we are not interested in the HTTPAccessLog
            if log.name != "HTTPAccessLog":
               if server.state != "running":
                   continue

               startTime = time.time()
               print("Reading " + server.name + " : " + log.name)
               progressBar['progressText'] = "Fetching " + server.name + " : " + log.name

               serverLogJson = getServerJson(log.logUrl, username, password)
               for logEntry in serverLogJson["items"]:
                  if logEntry["severity"] == "Error":
                      log.addLogEntry(LogEnty(logEntry["severity"],logEntry["timeStamp"],logEntry["message"]))
                      server.incrementError()
               endTime = time.time()
               log.setDuration(formatTimeOutput(math.floor(endTime-startTime)))
               
               count += 1
               progressBar['progressValue'] = count


#output the error statistics to the command line
def outputStatisticsConsole(wlsDomain):
    print("+----------------------+--------------------------+----------+--------+")
    printStatLine("Server", "State", "Health", "Errors")
    print("+----------------------+--------------------------+----------+--------+")
    for server in wlsDomain.serverList:
        printStatLine(server.name,server.state,server.health,server.errorCount)
    print("+----------------------+--------------------------+----------+--------+")

    print()
    print()
    print("+----------------------+-------------------------+-----------+--------+")
    print("| Server               | Log                     | Duration  | Errors |")
    print("+----------------------+-------------------------+-----------+--------+")
    for server in wlsDomain.serverList:
        for log in server.logList:
           print('| {:20} | {:23} | {:9} | {:>6} |'.format(server.name, log.name,log.duration, log.counter))
    print("+----------------------+-------------------------------------+--------+")


def printStatLine(server,state,health, count):
    print("| {:20} | {:24} | {:8} | {:>6} |".format(server,state,health, count))


#convert the number of seconds to hh:mm:ss format
def formatTimeOutput(seconds):
    m, s = divmod(seconds, 60)
    h, m = divmod(m, 60)
    return "{:02}:{:02}:{:02}".format(h,m,s)


class WLSDomain:
    def __init__(self):
        self.serverList= []

    def addServer(self, server):
        self.serverList.append(server)


class WLSServer:
    def __init__(self, name, serverUrl):
        self.logList = []
        self.name = name
        self.serverUrl = serverUrl
        self.health = ""
        self.state  = ""
        self.errorCount = 0

    def addLog(self, wlLog):
        self.logList.append(wlLog)

    def setHealth(self, health):
        self.health = health

    def setState(self, state):
        self.state = state
    def incrementError(self):
        self.errorCount = self.errorCount + 1

class WLLog:
    def __init__(self, name, logUrl):
        self.name = name
        self.logUrl = logUrl
        self.logEntryList = []
        self.counter      = 0;
        self.duration     = ""

    def addLogEntry(self, logEntry):
        self.logEntryList.append(logEntry)
        self.counter  = self.counter + 1

    def setDuration(self,duration):
        self.duration = duration

class LogEnty:
    def __init__(self, severity, when, message):
        self.severity = severity
        self.when     = when
        self.message  = message


# Home page layout
def layout():
    return html.Div(className="page", children=[
            html.Div(className="page-header", children=[
                    dbc.Button("Manage Servers", id="manage-server-button", color="secondary", className="button-manage-blue"),
                    dbc.Modal(
                            [
                                dbc.ModalHeader("Log in"),
                                dbc.ModalBody(children=[html.P("Please log in to manage servers."),
                                                        dbc.Input(id='login-username', placeholder="Username", type="text", className="login-input"),
                                                        dbc.Input(id='login-password', placeholder="Password", type="password", className="login-input"),
                                                        html.Div(id='login-error'),]),
                                dbc.ModalFooter(
                                    [dbc.Button("Login", id="login-button", className="ml-auto", n_clicks=0),],
                                ),
                            ], id="login-modal", is_open=False, centered=True,),
                    html.Div(className="page-header-left", children=[
                            dbc.Jumbotron(className="jumbotron", children=[
                                    dbc.Container([
                                            html.H1("It's time ", className="display-3"),
                                            html.H1("to fetch logs", className="display-3"),
                                            html.Div(className="blank"),
                                            html.P("Please select environment ", className="lead"),
                                            html.P("and click on fetch logs button: ", className="lead"),
                                    ], fluid=False,)
                            ], fluid=False,),
                            html.Div(className="dropdown-container", children=[
                                    dcc.Dropdown(options=[{'label': name, 'value': name} for name in dropdownEnvList],
                                        id='env-selector',
                                        placeholder="Select Environment...",
                                        searchable=False,
                                        clearable=False,),
                                    dbc.Button("Fetch Logs", id="loading-button", color="primary", className="button-blue"),
                                    ]),
                            
                            ]),
                    html.Div(className="logo-card", children=[
                            html.Div(className="logo-gif", children=[
                                    gif.GifPlayer(
                                            gif='assets/oncor_logo.gif',
                                            still='assets/oncor_logo.png',
                                            autoplay=True,
                                        ),
                                    ]),
                            ]),
                    html.Div(className="page-header-right", children=[
                            html.Img(className="page-header-background", src="/assets/transmission.png")
                            ]),
                    ]),
            
            html.Div(className="page-body", children=[
                html.Div(className="card-layout", children=[
                        dbc.Collapse(id="collapse", children=[
                                html.P(id="progress-text"),
                                dbc.Progress(id="progress", color="#0B0B33", animated=True, striped=True, className="mb-3"),
                                ]),
                        html.Div(className="card-layout-left", id="loading-output-1"),
                        html.Div(className="card-layout-right", id="loading-output-2"),
                        ]),
                dcc.Store(id="submitted-store"),
                dcc.Store(id="finished-store"),
                dcc.Interval(id="interval", interval=2000),
                visdcc.Run_js(id = 'javascript'),
                dcc.Location(id='url', refresh=False),
                html.Div(id='log-content'),
                ]),
    ])

# Server Health Status layout
def serverHealthStatusLayout(color, name, state, health, errorCount):
    if len(health) == 0:
        health = "--"
    return dbc.Card(className="card-"+color, body=True, children=[
                html.Div(className="card-"+color+"-title-layout", children=[
                        html.Div(className="card-icon-background-"+color, children=[
                                html.Img(className="card-icon", src="/assets/white-server-icon.jpg")
                                ]),
                        html.Div(name, className="card-title")
                        ]),
                html.Div(className="card-subtitle-layout", children=[
                        html.Div(className="server-state-cluster", children=[
                                html.Div(state, className="server-card-subtitle"),
                                html.Div("State", className="server-card-title"),
                                ]),
                        html.Div(className="server-error-cluster", children=[
                                html.Div(str(errorCount), className="server-card-subtitle"),
                                html.Div("Errors", className="server-card-title"),
                                ]),
                        html.Div(className="server-health-cluster", children=[
                                html.Div(health, className="server-card-subtitle"),
                                html.Div("Health", className="server-card-title"),
                                ]),
                        ])
                ])

# Server Logs Status layout
def serverLogStatusLayout(color, serverName, logName, duration, logCounter):
    buttonColor = ''
    if color == 'green':
        buttonColor = 'success'
    elif color == 'yellow':
        buttonColor = 'warning'
    else :
        buttonColor = 'danger'
    
    return dbc.Card(className="card-white", body=True, children=[
                html.Div(className="card-icon-background-grey", children=[
                        html.Img(className="card-icon-color", src="/assets/color-server-icon.png")
                        ]),
                html.Div(className="server-name-cluster", children=[
                        html.Div(logName, className="server-details-subtitle"),
                        html.Div(serverName, className="server-details-title"),
                        ]),
                html.Div(className="server-duration-cluster", children=[
                        html.Div(duration, className="server-details-subtitle"),
                        html.Div("Duration", className="server-details-title"),
                        ]),
                html.Div(className="server-button-cluster", children=[
                        dcc.Link(href="/"+serverName+logName, children=[dbc.Button(str(logCounter)+" Error", color=buttonColor, className="button-error-"+color)]),
                        ]),
                ])

# Error List layout
def errorLogsLayout(serverName, logName, errorList):
    return html.Div(className="error-page", children=[
                dbc.Card(id="card-log-layout", className="card-log-layout", body=True, children=[
                    html.Div(serverName, className="log-title"),
                    html.Div(logName, className="log-subtitle"),
                    html.Div(children=errorList),
                    ]),
            ])

# Manage Servers layout
def manageServersLayout(name, host, port, username, count):
    return html.Div(className="card-manage-server", id="card-manage-server", children=[
                html.Div(className="card-icon-background-grey", children=[
                        html.Img(className="card-icon-color", src="/assets/color-server-icon.png")
                        ]),
                html.Div(className="server-envname-cluster", children=[
                        html.Div(name, className="server-details-subtitle"),
                        html.Div("Env Name", className="server-details-title"),
                        ]),
                html.Div(className="server-host-cluster", children=[
                        html.Div(host, className="server-details-subtitle"),
                        html.Div("Host", className="server-details-title"),
                        ]),
                html.Div(className="server-port-cluster", children=[
                        html.Div(port, className="server-details-subtitle"),
                        html.Div("Port", className="server-details-title"),
                        ]),
                html.Div(className="server-username-cluster", children=[
                        html.Div(username, className="server-details-subtitle"),
                        html.Div("Username", className="server-details-title"),
                        ]),
                html.Div(className="delete-button-cluster", children=[
                        dbc.Button("Edit", id={'type': 'edit-button', 'index': str(count)}, color="info", className="button-edit"),
                        dcc.ConfirmDialogProvider(id={'type': 'delete-button','index': str(count)},
                                                  message='Are you sure you want to delete?',
                                                  children=[html.Button("Delete", className="button-delete"),]
                        )
                ]),
            ])

# Add Server layout
def addServerLayout():
    return html.Div(id="input-layout", className="input-layout", children=[
            dbc.Input(id={'type': 'env-name-input', 'index': '1'}, placeholder="Environment Name", type="text", className="input"),
            dbc.Input(id={'type': 'host-input', 'index': '1'}, placeholder="Host", type="text", className="input"),
            dbc.Input(id={'type': 'port-input', 'index': '1'}, placeholder="Port", type="text", className="input"),
            dbc.Input(id={'type': 'user-input', 'index': '1'}, placeholder="Username", type="text", className="input"),
            dbc.Input(id={'type': 'password-input', 'index': '1'}, placeholder="Password", type="text", className="input"),
            dbc.Button("Add Server", id={'type': 'add-button', 'index': '1'}, color="primary", className="button-blue"),
            ])

wlsDomain = WLSDomain()
fetch_thread = threading.Thread()
progressBar = {'totalCount': 0, 'progressValue': 0, 'progressText': "Starting"}
external_scripts = ['https://code.jquery.com/jquery-3.6.0.min.js']
external_stylesheets = [dbc.themes.BOOTSTRAP]

app = dash.Dash(__name__, external_stylesheets=external_stylesheets, external_scripts = external_scripts)
app.config.suppress_callback_exceptions=True
app.title = 'Server Logs'
app.layout = layout

@app.callback(
    [Output("submitted-store", "data")], 
    [Input("loading-button", "n_clicks")],
    [State("env-selector", "value")]
)
def submit(n_clicks, env):
    global fetch_thread
    global wlsDomain
    
    if n_clicks and env:    
        wlsServerUrl = config[env]['host'] + ":" + config[env]['port']
        username     = config[env]['user']
        password     = config[env]['password']

        if not fetch_thread.is_alive():
            wlsDomain = WLSDomain()
            getServers(wlsDomain,wlsServerUrl,username,password)
            
            fetch_thread = threading.Thread(target=searchServerLogs, name="Fetcher", args=(wlsDomain,username,password))
            fetch_thread.start()
            id_ = str(uuid.uuid4())
            return [id_]
    
    return dash.no_update

@app.callback(
    [Output("loading-output-1", "children"),
     Output("loading-output-2", "children"),
     Output("progress-text", "children"),
     Output("progress", "value"),
     Output("collapse", "is_open"),
     Output("finished-store", "data")], 
    [Input("interval", "n_intervals")],
    [State("submitted-store", "data")], prevent_initial_call=True)
def load_output(n, submitted):
    card_list_1 = []
    card_list_2 = []
    color = ""
    global progressBar
    global wlsDomain
    if n and submitted:
        if progressBar['totalCount'] != 0:
            progressPercent = int ( 100 * progressBar['progressValue'] / progressBar['totalCount'] )
            progressText = progressBar['progressText'] + " - " + str(progressPercent) + "% complete"
        else:
            progressPercent = 0
            progressText = progressBar['progressText']
        
        if progressPercent < 100:
            return dash.no_update, dash.no_update, progressText, progressPercent, True, dash.no_update
        else:
            for server in wlsDomain.serverList:
                if server.errorCount > 0:
                    color = 'green'
                else:
                    if server.state == 'running':
                        color = 'green'
                    else:
                        color = 'red'
                card_list_1.append(serverHealthStatusLayout(color, server.name, server.state, server.health, server.errorCount))
            
            for server in wlsDomain.serverList:
                for log in server.logList:
                    if log.counter > 0:
                        color = 'yellow'
                    else:
                        color = 'green'
                    card_list_2.append(serverLogStatusLayout(color, server.name, log.name, log.duration, log.counter))
                    
            outputStatisticsConsole(wlsDomain)
            progressBar = {'totalCount': 0, 'progressValue': 0, 'progressText': "Starting"}
            return card_list_1, card_list_2, progressText, progressPercent, False, submitted
            
    return dash.no_update, dash.no_update, dash.no_update, None, False, dash.no_update
    
@app.callback(
    [Output("interval", "disabled")],
    [Input("submitted-store", "data"), 
     Input("finished-store", "data")])
def disable_interval(submitted, finished):
    if submitted:
        if finished and finished ==  submitted:
            # most recently submitted job has finished, no need for interval
            return [True]
        # most recent job has not yet finished, keep interval going
        return [False]
    # no jobs submitted yet, disable interval
    return [True]

@app.callback(Output('log-content', 'children'),
              Output('env-selector', 'options'),
              Output('javascript', 'run'),
              Output("login-modal", "is_open"),
              Output('login-error', 'children'),
              Input('url', 'pathname'),
              Input({'type': 'delete-button', 'index': ALL}, 'submit_n_clicks'),
              Input({'type': 'add-button', 'index': ALL}, "n_clicks"),
              Input('login-button', "n_clicks"),
              Input('manage-server-button', "n_clicks"),
              State({'type': 'env-name-input', 'index': ALL}, "value"),
              State({'type': 'host-input', 'index': ALL}, "value"),
              State({'type': 'port-input', 'index': ALL}, "value"),
              State({'type': 'user-input', 'index': ALL}, "value"),
              State({'type': 'password-input', 'index': ALL}, "value"),
              State('login-username', 'value'),
              State('login-password', 'value'), prevent_initial_call=True)
def display_log(pathname, delete_n_clicks, add_n_clicks, login_n_clicks, manage_n_clicks, envName, host, port, user, password, loginUsername, loginPassword):
    errorList = []
    htmlList = []
    dropdownEnvList = []
    
    global config
    config = configparser.ConfigParser()
    config.read('config.ini')
    
    count = 0
    for section in config.sections():
        dropdownEnvList.append(section)
        count = count + 1
    options=[{'label': name, 'value': name} for name in dropdownEnvList]
    
    button_id_str = dash.callback_context.triggered[0]['prop_id'].split(".")
    if button_id_str[1] == 'submit_n_clicks':
        button_id_dict = json.loads(button_id_str[0])
        index = int(button_id_dict['index'])
        y = 0
        for section in config.sections():
            y += 1
            if index == y:
                config.remove_section(section)
                dropdownEnvList.remove(section)
                with open('config.ini', 'w') as configfile:
                    config.write(configfile)
    
        count = 0
        for section in config.sections():
            count = count + 1
            htmlList.append(manageServersLayout(section, config[section]['host'], config[section]['port'], config[section]['user'], count))
        htmlList.append(addServerLayout())
        options=[{'label': name, 'value': name} for name in dropdownEnvList]
        return htmlList, options, '''document.getElementById("card-manage-server").scrollIntoView({ block: 'start',  behavior: 'smooth' })''', False, dash.no_update
    
    for click in add_n_clicks:
        if click:
            if envName[0] and host[0] and port[0] and user[0] and password[0]:
                config[envName[0]] = {'host': str(host[0]),
                                  'port': str(port[0]),
                                  'user': str(user[0]),
                                  'password': str(password[0])}
                with open('config.ini', 'w') as configfile:
                    config.write(configfile)
                if envName[0] not in dropdownEnvList:
                    dropdownEnvList.append(envName[0])
                count = 0
                for section in config.sections():
                    count = count + 1
                    htmlList.append(manageServersLayout(section, config[section]['host'], config[section]['port'], config[section]['user'], count))
                htmlList.append(addServerLayout())
                options=[{'label': name, 'value': name} for name in dropdownEnvList]
                return htmlList, options, '''document.getElementById("card-manage-server").scrollIntoView({ block: 'start',  behavior: 'smooth' })''', False, dash.no_update
    
    if button_id_str[0] == 'manage-server-button':
        return dash.no_update, options, '', True, dash.no_update
    
    elif button_id_str[0] == 'login-button':
        if loginUsername and loginPassword:
            if VALID_USERNAME_PASSWORD_PAIRS.get(loginUsername):
                if VALID_USERNAME_PASSWORD_PAIRS[loginUsername] == loginPassword:
                    count = 0
                    for section in config.sections():
                        count = count + 1
                        htmlList.append(manageServersLayout(section, config[section]['host'], config[section]['port'], config[section]['user'], count))
                    htmlList.append(addServerLayout())
                    return htmlList, options, '', False, dash.no_update
                else:
                    return dash.no_update, options, '', True, html.Div('Password is not correct.', className="error-message")
            else:
                return dash.no_update, options, '', True, html.Div('Username is not correct.', className="error-message")
        else :
            return dash.no_update, options, '', True, html.Div('Required both inputs.', className="error-message")
    
    if not pathname:
        raise PreventUpdate
    
    elif pathname:
        for server in wlsDomain.serverList:
            if server.errorCount > 0:
                for log in server.logList:
                    outputCounter = 0
                    if log.counter > 0 and pathname == '/'+server.name+log.name:
                        for error in log.logEntryList:
                            outputCounter = outputCounter + 1
                            errorList.append(html.Div(str(outputCounter)+"/"+str(log.counter)+" - "+server.name+" - "+log.name, className="log-name"))
                            errorList.append(html.Div(error.when+" "+error.severity+" "+error.message, className="log-text"))
                        htmlList.append(errorLogsLayout(server.name, log.name, errorList))
        return htmlList, options, '''document.getElementById("card-log-layout").scrollIntoView({ block: 'start',  behavior: 'smooth' })''', False, dash.no_update

@app.callback(Output({'type': 'env-name-input', 'index': ALL}, "value"),
              Output({'type': 'host-input', 'index': ALL}, "value"),
              Output({'type': 'port-input', 'index': ALL}, "value"),
              Output({'type': 'user-input', 'index': ALL}, "value"),
              Output({'type': 'password-input', 'index': ALL}, "value"),
              Input({'type': 'edit-button', 'index': ALL}, "n_clicks"), prevent_initial_call=True)
def edit_config(edit_n_clicks):
    global config
    config = configparser.ConfigParser()
    config.read('config.ini')
    button_id_str = dash.callback_context.triggered[0]['prop_id'].split(".")
    button_id_dict = json.loads(button_id_str[0])
    index = int(button_id_dict['index'])
    
    y = 0
    for section in config.sections():
        y += 1
        if index == y:
            #javascript = '''document.getElementById("input-layout").scrollIntoView({ block: 'start',  behavior: 'smooth' })'''
            return [section], [config[section]['host']], [config[section]['port']], [config[section]['user']], [config[section]['password']]
    return [None], [None], [None], [None], [None]

# start Flask server
if __name__ == '__main__':
    app.run_server(
        debug=False,
        host='0.0.0.0',
        port=8050
    )