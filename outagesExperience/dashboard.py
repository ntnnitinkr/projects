######################################################################################
##   Confidentiality Information:                                                   ##
##                                                                                  ##
##       This module is the confidential and proprietary information of IBM;        ##
##       it is not to be copied, reproduced, or transmitted in any form,            ##
##       by any means, in whole or in part, nor is it to be used for any purpose    ##
##       other than that for which it is expressly provided without the written     ##
##       permission of IBM.                                                         ##
##                                                                                  ##
######################################################################################

# dash libs
import dash
from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_bootstrap_components as dbc
import dash_html_components as html
import dash_table
import dash_daq as daq
from datetime import date as Date
from datetime import datetime as dt
from datetime import timedelta
import plotly.graph_objs as go
import plotly.express as px
import dash_leaflet as dl
import requests

# pydata stack
import pandas as pd
import numpy as np
import cx_Oracle

# config file
import config
from config import *
dbnames = []
for name, value in list(locals().items()):
    if name.startswith('DATABASE'):
        x={}
        x[name] = value
        y = x[name]['dbname']
        dbnames.append(y)


#DB connection
def connect_db(dbname):

    if dbname == config.DATABASE_1['dbname']:
        dsn_tns = cx_Oracle.makedsn(config.DATABASE_1['host'], config.DATABASE_1['port'], service_name=config.DATABASE_1['dbname'])
        conn = cx_Oracle.connect(user=config.DATABASE_1['user'], password=config.DATABASE_1['password'], dsn=dsn_tns)
    elif dbname == config.DATABASE_2['dbname']:
        dsn_tns = cx_Oracle.makedsn(config.DATABASE_2['host'], config.DATABASE_2['port'], service_name=config.DATABASE_2['dbname'])
        conn = cx_Oracle.connect(user=config.DATABASE_2['user'], password=config.DATABASE_2['password'], dsn=dsn_tns)
    elif dbname == config.DATABASE_3['dbname']:
        dsn_tns = cx_Oracle.makedsn(config.DATABASE_3['host'], config.DATABASE_3['port'], service_name=config.DATABASE_3['dbname'])
        conn = cx_Oracle.connect(user=config.DATABASE_3['user'], password=config.DATABASE_3['password'], dsn=dsn_tns)
    elif dbname == config.DATABASE_4['dbname']:
        dsn_tns = cx_Oracle.makedsn(config.DATABASE_4['host'], config.DATABASE_4['port'], service_name=config.DATABASE_4['dbname'])
        conn = cx_Oracle.connect(user=config.DATABASE_4['user'], password=config.DATABASE_4['password'], dsn=dsn_tns)
    elif dbname == config.DATABASE_5['dbname']:
        dsn_tns = cx_Oracle.makedsn(config.DATABASE_5['host'], config.DATABASE_5['port'], service_name=config.DATABASE_5['dbname'])
        conn = cx_Oracle.connect(user=config.DATABASE_5['user'], password=config.DATABASE_5['password'], dsn=dsn_tns)
    elif dbname == None:
        raise ValueError("Couldn't not find DB with given name")
    
    return conn

# Get some example data (a list of dicts with {name: country name, latlng: position tuple, ...})
marker_data = requests.get("https://gist.githubusercontent.com/erdem/8c7d26765831d0f9a8c62f02782ae00d/raw"
                           "/248037cd701af0a4957cce340dabb0fd04e38f4c/countries.json").json()
                           
px.set_mapbox_access_token("pk.eyJ1Ijoibml0aW5rdW1hcjEyMzQiLCJhIjoiY2tkaWQxdjBxMDNzMDJ6bzBnNDB4aTkyZyJ9.9NmlWUlLadztPucWTBSRzA")

def fetch_data(q, environ):
    conn = connect_db(environ)
    cur = conn.cursor()
    cur.execute('''alter session set nls_date_format = 'YYYY/MM/DD HH24:MI:SS' ''')
    result = pd.read_sql(
        sql=q,
        con=conn
    )
    cur.close()
    conn.close()
    return result

def get_results(environ):
    results_query = (
        f'''
SELECT 
    *
FROM
    CM_CUST_EXP
'''
    )
    batch_results = fetch_data(results_query, environ)
    return batch_results

df = get_results('CCBDEV7')
df = df.dropna()
df = df.drop_duplicates(subset = ["PREM_ID"])
df = df[:1000]
df[['ACCT_ID','PREM_ID','ETOR_NUM']] = df[['ACCT_ID','PREM_ID','ETOR_NUM']].astype('int64')
df[['PREMLAT','PREMLONG','OUT_DURATION']] = df[['PREMLAT','PREMLONG','OUT_DURATION']].astype(float)
data = df

# Create app.
app = dash.Dash(external_stylesheets=['https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', dbc.themes.BOOTSTRAP],
                prevent_initial_callbacks=False)
app.layout = html.Div([
    html.Div([], style={'padding': '10px'}),
    dcc.Tabs(id="tabs-with-classes", value='tab-1', parent_className='custom-tabs', className='custom-tabs-container', children=[
        dcc.Tab(label='OUTAGE MAP', value='tab-1', className='custom-tab', selected_className='custom-tab--selected', children=[
            html.Div([], style={'padding': '10px', 'background-color': 'white'}),
            dbc.Jumbotron([
                html.H1("Customer Experience", className="display-3"),
                html.Hr(className="my-2"),
                html.P(
                    "Below map is to show the customer experience "
                    "based on outages.", className="lead"
                    ),
            ]),
            
            # Input Grid
            html.Div([
                html.Div([
                    html.Div([
                        html.Div(dcc.Dropdown(placeholder='Select Postal Code...',id='postal-selector', options=[
                                    {'label': postal, 'value': postal} for postal in list(df['POSTAL'].sort_values(ascending=True).unique())
                                    ],), style={'padding-right': '50px'}, className='four columns'),   
                                    
                        html.Button('SUBMIT', id='postal-button',style={'color':'white', 'background-color': '#5A6268','box-shadow': '0 1px 1px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'}, className='two columns')
                    ]),
                ], className='eleven columns'),

                # Empty
                html.Div(className='six columns'),
            ], style={'padding-bottom': '20px'}, className='twleve columns'),
            
            dl.Map(id='outage-map', zoom=7, center=(31, -97), style={'width': '100%', 'height': '100vh', 'margin': "auto", "display": "block"}),
        ]),
#        dcc.Tab(label='OUTAGE MAP SECOND', value='tab-2', className='custom-tab', selected_className='custom-tab--selected', children=[
#            html.Div([], style={'padding': '10px', 'background-color': 'white'}),
#            dbc.Jumbotron([
#                html.H1("Customer Experience", className="display-3"),
#                html.Hr(className="my-2"),
#                html.P(
#                    "Below map is to show the customer experience "
#                    "based on outages.", className="lead"
#                    ),
#            ]),
#            dcc.Graph(id='outage-map-second', figure = 
#                px.scatter_mapbox(data_frame=df, lat=df["PREMLAT"], lon=df["PREMLONG"], color="ETOR_NUM", size="ETOR_NUM", opacity=0.8, 
#                    hover_name="PREM_ID", hover_data=["ETOR_NUM"], color_continuous_scale=px.colors.cyclical.IceFire, size_max=15, zoom=5), 
#                style={'height': '700px',}),
#            
#        ]),
        dcc.Tab(label='OUTAGE TABLE', value='tab-3', className='custom-tab', selected_className='custom-tab--selected', children=[
            html.Div([], style={'padding': '10px', 'background-color': 'white'}),
            dbc.Jumbotron([
                html.H1("Customer Experience", className="display-3"),
                html.Hr(className="my-2"),
                html.P(
                    "Below data is to show the customer experience "
                    "based on outages.", className="lead"
                    ),
            ]),
            
            html.Div([
                html.Div('Provide one input in below fields to get result: ', style={'padding-top': 20, 'padding-bottom':20, 'margin-left': '20px'}),
                ]),
            
            # Input Grid
            html.Div([
                
                html.Img(id='table-image', src=app.get_asset_url('search.png'), style={'width':'150px', 'height':'150px', 'position': 'relative', 'float': 'right', 'margin-right':'200px','margin-bottom':'10px'}),
                
                html.Div([
                    html.Div([
                        html.Div(dcc.Dropdown(options=[
                                    {'label': 'Postal Code', 'value': 'postal'},
                                    {'label': 'Premise Id', 'value': 'premise'},
                                    {'label': 'Account Id', 'value': 'account'},
                                    ],
                                    id='table-entry-selector',
                                    placeholder="Select Entry Type...",
                                    searchable=False,
                                    clearable=False
                                    ), style={'margin-right': '50px', 'margin-left': '50px'}, className='four columns'),
                                    
                        html.Div(dcc.Dropdown(placeholder='Select Id...',id='table-id-selector'), className='four columns'),   
                    ]),
                ]),
                
                html.Div([
                    
                    html.Div([
                        html.Button('SUBMIT', id='table-button',style={'color':'white', 'background-color': '#5A6268','box-shadow': '0 1px 1px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'})
                    ], style={'margin-left': '50px', 'margin-top': '20px'}, className='four columns'),
                    
                ], style={'padding-bottom': '20px', 'display':'inline', 'float': 'left'}),
                
            ], style={'display':'block'}),
            
            html.Div([
                dash_table.DataTable(
                    id='outage-table',
                    #data=df.to_dict('records'),
                    columns= [{"name": i, "id": i} for i in df.columns],
                    style_cell={'font_size': '18px', 'textAlign': 'center'},
                    style_header={
                    #    'backgroundColor': 'rgb(230, 230, 230)',
                        'font_size': '18px',
                        'fontWeight': 'bold'
                    },
                    #n_fixed_rows=2,
                    #virtualization=True,
                    #selected_rows=[3],
                    #style_as_list_view=True,
                    row_selectable='multi',
                    sorting=True,
                    sorting_type="multi",
                    pagination_mode="fe",
                    #filtering=True,
                )
            ], className='ten columns', style={'margin-left':'50px', 'margin-top':'20px', 'margin-bottom':'800px'})
        ]),
    ])
])

# Load Map with selected data
@app.callback(
    [
        dash.dependencies.Output(component_id='outage-map', component_property='children')
    ],
    [
        dash.dependencies.Input(component_id='postal-button', component_property='n_clicks')
    ],
	[
        dash.dependencies.State(component_id='postal-selector', component_property='value'),
    ]
)
def load_results(n_clicks, postal):
    
    #df = get_results('CCBDEV7')
    df = data
    
    if postal is not None:
        df = df[df.POSTAL.isin([postal])]
    
    #df[['ACCT_ID','PREM_ID','ETOR_NUM']] = df[['ACCT_ID','PREM_ID','ETOR_NUM']].astype('int64')
    #df[['PREMLAT','PREMLONG']] = df[['PREMLAT','PREMLONG']].astype(float)

    positions = df[['PREMLAT','PREMLONG']].values.tolist()
    premiseId = df[['PREM_ID']].values.tolist()
    accountId = df[['ACCT_ID']].values.tolist()
    etorNoList = df[['ETOR_NUM']].values.tolist()

    Row_list =[] 
    # Iterate over each row 
    for index, rows in df.iterrows(): 
        # Create list for the current row 
        my_list =[rows.PREMLAT, rows.PREMLONG] 
        Row_list.append(my_list) 
    
    marker = []
    for row, premise, account, etorNo in zip(Row_list, premiseId, accountId, etorNoList):
        etor = int(''.join(map(str,etorNo)))
        if etor < 11:
            marker_temp = dl.Marker(position=row, icon={"iconUrl": "/assets/smile3.png", "iconSize": [35, 35] }, children=[
                                dl.Tooltip("Premise - " + ' '.join(map(str, premise))),
                                dl.Popup([
                                    html.H1("Details"),
                                    html.P("Customer Outage Experience"),
                                    html.P("Location = " + ' '.join(map(str, row))),
                                    html.P("Premise Id = " + ' '.join(map(str, premise))),
                                    html.P("Account Id = " + ' '.join(map(str, account))),
                            ])
                        ])
            marker.append(marker_temp)
        
        elif etor > 10 and etor < 21:
            marker_temp = dl.Marker(position=row, icon={"iconUrl": "/assets/sad.png", "iconSize": [35, 35] }, children=[
                                dl.Tooltip("Premise - " + ' '.join(map(str, premise))),
                                dl.Popup([
                                    html.H1("Details"),
                                    html.P("Customer Outage Experience"),
                                    html.P("Location = " + ' '.join(map(str, row))),
                                    html.P("Premise Id = " + ' '.join(map(str, premise))),
                                    html.P("Account Id = " + ' '.join(map(str, account))),
                            ])
                        ])
            marker.append(marker_temp)
            
        elif etor > 20 :
            marker_temp = dl.Marker(position=row, icon={"iconUrl": "/assets/angry.png", "iconSize": [35, 35] }, children=[
                                dl.Tooltip("Premise - " + ' '.join(map(str, premise))),
                                dl.Popup([
                                    html.H1("Details"),
                                    html.P("Customer Outage Experience"),
                                    html.P("Location = " + ' '.join(map(str, row))),
                                    html.P("Premise Id = " + ' '.join(map(str, premise))),
                                    html.P("Account Id = " + ' '.join(map(str, account))),
                            ])
                        ])
            marker.append(marker_temp)

    cluster = dl.MarkerClusterGroup(id="markers", children=marker, options={"polygonOptions": {"color": "red"}})
    
    result=[dl.TileLayer(url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"), 
            dl.LocateControl(options={'locateOptions': {'enableHighAccuracy': True}}), cluster]
    
    return [result]

# Load Entry Codes in Dropdown
@app.callback(
    Output(component_id='table-id-selector', component_property='options'),
    [
        Input(component_id='table-entry-selector', component_property='value')
    ]
)
def populate_batch_selector(type):
    df = data
    if type == "postal" :
        return [
            {'label': postal, 'value': postal} for postal in list(df['POSTAL'].sort_values(ascending=True).unique())
        ]
    elif type == "premise" :
        return [
            {'label': prem, 'value': prem} for prem in list(df['PREM_ID'].sort_values(ascending=True).unique())
        ]
    elif type == "account" :
        return [
            {'label': acct, 'value': acct} for acct in list(df['ACCT_ID'].sort_values(ascending=True).unique())
        ]
    else :
        return []
        
    
# Load Table with selected data
@app.callback(
    [
        dash.dependencies.Output(component_id='outage-table', component_property='data'),
        dash.dependencies.Output(component_id='table-image', component_property='src')
    ],
    [
        dash.dependencies.Input(component_id='table-button', component_property='n_clicks')
    ],
	[
        dash.dependencies.State(component_id='table-entry-selector', component_property='value'),
        dash.dependencies.State(component_id='table-id-selector', component_property='value'),
    ]
)
def load_results_table(n_clicks, type, id):
    df = data
    etorSum = None
    if type == "postal" and id is not None:
        df = df[df.POSTAL.isin([id])]
    elif type == "premise" and id is not None:
        df = df[df.PREM_ID.isin([id])]
    elif type == "account" and id is not None:
        df = df[df.ACCT_ID.isin([id])]
    else :
        df = pd.DataFrame()
        result = pd.DataFrame()
    
    if type is not None and id is not None:
        result = df.to_dict('records')
        etorSum = df['ETOR_NUM'].sum()
    
    if etorSum is None:
        image_src = app.get_asset_url('search.png')
    elif etorSum < 31 :
        image_src = app.get_asset_url('smile3.png')
    elif etorSum > 30 and etorSum < 101 :
        image_src = app.get_asset_url('sad.png')
    elif etorSum > 100 :
        image_src = app.get_asset_url('angry.png')
        
    if type is None or id is None:
        df = pd.DataFrame()
        result = df.to_dict('records')
        image_src = app.get_asset_url('search.png')
        
    return result, image_src

# start Flask server
if __name__ == '__main__':
    app.run_server(
        debug=False,
        host='0.0.0.0',
        port=8050
    )