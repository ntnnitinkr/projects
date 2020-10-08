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
import dash_html_components as html
import dash_table
import dash_daq as daq
from datetime import date as Date
from datetime import datetime as dt
from datetime import timedelta
import plotly.graph_objs as go
import statsmodels.api as sm
from sklearn.linear_model import LinearRegression

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

###########################
# Data Manipulation / Model
###########################

#Returns the list of batch codes that are stored in the database
def get_batchcd(environ):
    batchcd_query = (
        f'''
        SELECT DISTINCT(BATCH_CD) FROM CISADM.CI_BATCH_RUN
        '''
    )
    batches = fetch_data(batchcd_query, environ)
    batches = list(batches['BATCH_CD'].sort_values(ascending=True))
    return batches
    
#Returns the dataframe of batch codes that are stored in the database
def get_batchcd_df(environ):
    batchcd_query = (
        f'''
        SELECT DISTINCT(BATCH_CD) FROM CISADM.CI_BATCH_RUN
        '''
    )
    batches = fetch_data(batchcd_query, environ)
    batches = batches.sort_values('BATCH_CD', ascending=True)
    return batches

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

def populate_table_static():
    resultsTable = get_batchcd_df(config.DEFAULT_DB)
    batches = resultsTable[['BATCH_CD']]
    return batches
batches_df_table = populate_table_static()
    
def get_results(starttm, endtm, batch, environ):
    results_query = (
        f'''
SELECT BR.BATCH_CD,
    BR.BATCH_NBR,
    SUM(BI.REC_PROC_CNT/2) RECORDS,
    MIN(to_date(M.MESSAGE_PARM,'YYYY-MM-DD-HH24.MI.SS')) START_TM,
    MAX(to_date(M.MESSAGE_PARM,'YYYY-MM-DD-HH24.MI.SS')) END_TM,
    ROUND(( TO_DATE (MAX(to_date(M.MESSAGE_PARM,'YYYY-MM-DD-HH24.MI.SS')), 'YYYY-MM-DD-HH24.MI.SS') - TO_DATE (MIN(to_date(M.MESSAGE_PARM,'YYYY-MM-DD-HH24.MI.SS')), 'YYYY-MM-DD-HH24.MI.SS')) * 1440,2) DURATION_MIN
FROM
    CISADM.CI_BATCH_RUN BR,
    CISADM.CI_BATCH_INST BI,
    CISADM.CI_MSG_LOGPARM M
WHERE BR.BATCH_CD = '{batch}'
    AND BR.BATCH_BUS_DT between to_date('{starttm}','MM-DD-YY') and to_date('{endtm}','MM-DD-YY') --Search By This Date
    AND BI.BATCH_CD = BR.BATCH_CD
    AND BI.BATCH_NBR = BR.BATCH_NBR
    AND BI.SCHEDULER_ID = M.SCHEDULER_ID
    AND M.MESSAGE_PARM LIKE '2___-__-__-__.__.__'
GROUP BY
    BR.BATCH_CD,
    BR.BATCH_NBR
ORDER BY
    BR.BATCH_NBR
'''
    )
    batch_results = fetch_data(results_query, environ)
    return batch_results

# Summary graph for first tab (showlegend=False)
def draw_summary_points_graph(results):
    dates = results['START_TM']
    time = results['DURATION_MIN']
    records = results['RECORDS']

    figure = go.Figure(
        data=[
            go.Bar(x=dates, y=records, name='Records Count', marker=dict( color='rgba(0,131,143 ,1)' )),
            go.Scatter(x=dates, y=time, mode='lines+markers', name='Execution Time', yaxis='y2', marker=dict( color='rgba(245,124,0 ,1)' ))
        ],
        layout=go.Layout(
            title='',
            yaxis=dict( title='Number of Records', side='right', titlefont=dict(color='rgba(0,131,143 ,1)'), tickfont=dict( color='rgba(0,131,143 ,1)' ), zerolinecolor= 'rgba(0, 0, 0, 1)', showgrid=False),
            yaxis2=dict( title='Duration (in minutes)', titlefont=dict(color='rgba(245,124,0 ,1)'), tickfont=dict( color='rgba(245,124,0 ,1)' ),overlaying='y', side='left', gridcolor= 'rgba(233, 233, 233, 1)'),
            margin={'t': 20},
            #paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            showlegend=False
        )
    )

    return figure

# History graph for second tab (showlegend=True)
def draw_points_graph(results):
    dates = results['START_TM']
    time = results['DURATION_MIN']
    records = results['RECORDS']

    figure = go.Figure(
        data=[
            go.Bar(x=dates, y=records, name='Records Count', marker=dict( color='rgba(0,131,143 ,1)' )),
            go.Scatter(x=dates, y=time, mode='lines+markers', name='Execution Time', yaxis='y2', marker=dict( color='rgba(245,124,0 ,1)' ))
        ],
        layout=go.Layout(
            title='',
            yaxis=dict( title='Number of Records', side='right', titlefont=dict(color='rgba(0,131,143 ,1)'), tickfont=dict( color='rgba(0,131,143 ,1)' ), zerolinecolor= 'rgba(0, 0, 0, 1)', showgrid=False),
            yaxis2=dict( title='Duration (in minutes)', titlefont=dict(color='rgba(245,124,0 ,1)'), tickfont=dict( color='rgba(245,124,0 ,1)' ),overlaying='y', side='left', gridcolor= 'rgba(233, 233, 233, 1)'),
            margin={'t': 20},
            #paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            #showlegend=False
        )
    )

    return figure

# Graph to show forcasted result for tab third  (showlegend=True)
def draw_pred_points_graph(results, forecast):
    dates = results['START_TM']
    time = results['DURATION_MIN']
    records = results['RECORDS']
    #pred = results['PREDICT']
    fc = forecast['FORECAST']
    fc_durt = forecast['PRED_DURT']
    fc_dates = forecast.index

    figure = go.Figure(
        data=[
            go.Bar(x=dates, y=records, name='Acutal Records Count', marker=dict( color='rgba(0,131,143 ,1)' )),
            #go.Bar(x=dates, y=pred, name='Predicted Records Count', marker=dict( color='rgba(255,56,36 ,1)' )),
            go.Bar(x=fc_dates, y=fc, name='Forecasted Records Count', marker=dict( color='rgba(255,56,36 ,1)' )),
            go.Scatter(x=dates, y=time, mode='lines+markers', name='Actual Execution Time', yaxis='y2', marker=dict( color='rgba(245,124,0 ,1)' )),
            go.Scatter(x=fc_dates, y=fc_durt, mode='lines+markers', name='Predicted Execution Time', yaxis='y2', marker=dict( color='rgba(0,118,225 ,1)' ))
        ],
        layout=go.Layout(
            title='',
            yaxis=dict( title='Number of Records', side='right', titlefont=dict(color='rgba(0,131,143 ,1)'), tickfont=dict( color='rgba(0,131,143 ,1)' ), zerolinecolor= 'rgba(0, 0, 0, 1)', showgrid=False),
            yaxis2=dict( title='Duration (in minutes)', titlefont=dict(color='rgba(245,124,0 ,1)'), tickfont=dict( color='rgba(245,124,0 ,1)' ),overlaying='y', side='left', gridcolor= 'rgba(233, 233, 233, 1)'),
            margin={'t': 20},
            #paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            #showlegend=False
        )
    )

    return figure

# Data prediction model
def data_predict(data):

    data['START_TM'] = pd.to_datetime(data['START_TM'])
    data = data.drop_duplicates(subset='START_TM', keep='last').set_index(['START_TM'])
    result = data 
    data = data['RECORDS']
    model = sm.tsa.statespace.SARIMAX(data,
                                order=(0, 0, 1),
                                seasonal_order=(1, 1, 1, 12),
                                enforce_stationarity=False,
                                enforce_invertibility=False)
    result_fit = model.fit()
    pred_results = result_fit.get_prediction(start=60, dynamic=False)
    pred_results = pred_results.predicted_mean
    result['PREDICT'] = abs(pred_results)
    
    # Get forecast steps ahead in future 
    n_steps=24
    idx = pd.date_range(data.index[-1], periods=n_steps, freq='B')
    forecast = result_fit.forecast(steps=n_steps)
    forecast = pd.DataFrame(np.column_stack([forecast]), index=idx, columns=['FORECAST'])
    
    regressor = LinearRegression()  
    regressor.fit(result[['RECORDS']], result[['DURATION_MIN']]) 
    forecast_durt = regressor.predict(forecast)
    forecast['PRED_DURT'] = abs(forecast_durt)

    result = result.reset_index()
    return result, forecast

#########################
# Dashboard Layout / View
#########################

#On initial page load load of page
def onLoad_graph():
    figure = go.Figure(
        data=[
            go.Bar(x=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], y=[23, 11, 2, 34, 5, 12, 45, 3, 12, 32, 11, 13, 32, 14, 11], name='Records Count', marker=dict( color='rgba(0,131,143 ,1)' )),
            go.Scatter(x=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], y=[34, 4, 24, 11, 13, 3, 24, 5, 12, 45,4, 11, 5, 42, 5], mode='lines+markers', name='Execution Time', yaxis='y2', marker=dict( color='rgba(245,124,0 ,1)' ))
        ],
        layout=go.Layout(
            title='',
            yaxis=dict( title='Number of Records', side='right', titlefont=dict(color='rgba(0,131,143 ,1)'), tickfont=dict( color='rgba(0,131,143 ,1)' ), zerolinecolor= 'rgba(0, 0, 0, 1)', showgrid=False),    
            yaxis2=dict( title='Duration (in minutes)', titlefont=dict(color='rgba(245,124,0 ,1)'), tickfont=dict( color='rgba(245,124,0 ,1)' ), overlaying='y', side='left', gridcolor= 'rgba(233, 233, 233, 1)'),
            margin={'t': 20},
            #paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            showlegend=False
        )
    )
    return figure

def generate_table(dataframe, max_rows=10):
    dataframe['START_TM'] = dataframe['START_TM'].map(lambda x: dt.strftime(x, '%Y-%m-%d %H:%M:%S'))
    dataframe['END_TM'] = dataframe['END_TM'].map(lambda x: dt.strftime(x, '%Y-%m-%d %H:%M:%S'))
    return html.Table(
        # Header
        [html.Tr([html.Th(col) for col in dataframe.columns])] +

        # Body
        [html.Tr([
            html.Td(dataframe.iloc[i][col]) for col in dataframe.columns
        ]) for i in range(min(len(dataframe), max_rows))]
    )

# Set up Dashboard and create layout
app = dash.Dash(__name__)

app.layout = html.Div([
 
    # Page Header
    html.Div([
        html.H1('BATCH PERFORMANCE RESULTS', style={'font-family':'sans-serif', 'text-align':'center', 'color':'white', 'background-color': '#018786'})
    ]),
    
    dcc.Tabs(id="tabs", colors={"border": "#DDDDDD", "primary": "#018786", "background": "#ECECEC"}, children=[
        dcc.Tab(label='SUMMARY', children=[
            
            html.Div(dcc.Dropdown(options=[
                                    {'label': env, 'value': env} for env in dbnames
                                    ],
                                    id='summary-env-selector',
                                    value=config.DEFAULT_DB,
                                    searchable=False,
                                    clearable=False
                                    ), style={'padding': 20, 'margin-left':'20px', 'position':'relative', 'zIndex':'999'}, className='four columns'),
            
            html.Div(id='summary-controls',children=[html.Button("Print PDF", id='summary-print-pdf')], style={'padding': 20, 'float': 'right', 'margin-left':'800px'}),
            
            html.Div([
                html.Div([
                    html.H6(["BATCH CODES"], 
                        style={'text-align':'center', 'color':'white', 'background-color': '#018786'},
                        className="subtitle" ),
                        
                            dash_table.DataTable(
                                id='summary-table',
                                data=batches_df_table.to_dict('records'),
                                columns= [{"name": i, "id": i} for i in batches_df_table.columns],
                                style_cell={'font_size': '18px', 'textAlign': 'center'},
                                style_cell_conditional=[
                                        {
                                            'if': {'column_id': 'BATCH_CD'},
                                            'textAlign': 'left',
                                            'width': '90%'
                                        },
                                ],
                                style_header={
                                #    'backgroundColor': 'rgb(230, 230, 230)',
                                    'font_size': '18px',
                                    'fontWeight': 'bold'
                                },
                                n_fixed_rows=2,
                                virtualization=True,
                                #selected_rows=[3],
                                #style_as_list_view=True,
                                row_selectable='single',
                                sorting=True,
                                sorting_type="multi",
                                pagination_mode="fe",
                                filtering=True,
                            )
                ], className='four columns', style={"height":"250px"}),
                
                html.Div([
                    html.H6(["LATEST BATCH EXECUTION"], 
                    style={'text-align':'center', 'color':'white', 'background-color': '#018786'},
                    className="subtitle" ),
                    
                    html.Div([
                        html.H5(["BATCH"], id='batchcd-div'),
                        html.P('Batch Name', style={'color':'grey','margin-bottom': '20px'}),
                        html.H5(["RECORDS"], id='records-div'),
                        html.P('Number of Records Processed', style={'color':'grey','margin-bottom': '20px'}),
                    ], className="five columns", style={"margin-left": "20px", "max-height":"250px"}),
                    
                    html.Div([
                        html.H5(["RUN NUMBER"], id='batchnbr-div'),
                        html.P('Batch Run Number', style={'color':'grey', 'margin-bottom': '20px'}),
                        html.H5(["DATE"], id='date-div'),
                        html.P('Batch Execution Start Time', style={'color':'grey', 'margin-bottom': '20px'}),
                    ], className="five columns", style={"margin-left": "20px", "max-height":"250px"}),
                ], className='four columns', style={'display':'inline-block', 'margin-left': '50px'}),
                
                html.Div([
                    html.H6(["LATEST BATCH EXECUTION DURATION"], 
                    style={'text-align':'center', 'color':'white', 'background-color': '#018786'},
                    className="subtitle" ),
                    
                    html.Div([
                        daq.Gauge( id='gauge-duration',
                            color={"gradient":True,"ranges":{"green":[0,6],"yellow":[6,8],"red":[8,10]}},
                            value=2,
                            max=10,
                            min=0,
                            showCurrentValue=True,
                            units="MINUTES",
                        ),
                    ], style={'text-align':'center', 'margin-left': 'auto', 'margin-right': 'auto', 'max-height':'250px'}),
                ], className='four columns', style={'display':'inline-block', 'margin-left': '50px'}),
                
                html.Div([    
                    html.Div([
                        html.H6(["TWO WEEK BATCH EXECUTION HISTORY"],
                        style={'text-align':'center', 'color':'white', 'background-color': '#018786'},
                        className="subtitle" ),
                        
                        dcc.Graph(id='summary-batch-graph', figure = onLoad_graph(), style={'height': '300px',}),
                    ]),
                    
                ], className='row', style={'display':'inline-block', 'width': '65%', 'height': '200px', 'margin-left':'20px', 'margin-right':'15px' , 'float': 'right'}),
                
            ], className='row', style={'margin-left':'30px'}),
            
        ]),
    
        dcc.Tab(label='PERFORMANCE HISTORY', children=[
            html.Div(id='controls',children=[html.Button("Print PDF", id='print-pdf')], style={'padding': 20, 'float': 'right', 'margin-left':'1500px'}),
            
            html.Div([
                html.Div('Provide input in below fields to get result: ', style={'padding-top': 20, 'padding-bottom':20}),
                ], className='twleve columns'),
                
            # Input Grid
            html.Div([
                html.Div([
                    
                    html.Div([
                        html.Div(dcc.Dropdown(options=[
                                    {'label': env, 'value': env} for env in dbnames
                                    ],
                                    id='env-selector',
                                    placeholder="Select Environment...",
                                    searchable=False,
                                    clearable=False
                                    ), style={'padding-right': '50px'}, className='three columns'),
                    
                        html.Div(dcc.DatePickerSingle(id='start-date-picker', placeholder='Start Date', max_date_allowed=Date.today(), initial_visible_month=Date.today()), className = 'two columns'),
                        
                        html.Div(dcc.DatePickerSingle(id='end-date-picker', placeholder='End Date', max_date_allowed=Date.today(), initial_visible_month=Date.today()), className = 'two columns'),
                        
                        html.Div(dcc.Dropdown(placeholder='Select Batch Code...',id='batch-selector'), className='two columns'),   
                        
                    ]),
                    
                ], className='eleven columns'),

                # Empty
                html.Div(className='six columns'),
            ], className='twleve columns'),
            
            # Empty
            html.Div([
                html.Div('', className='twleve columns', style={'padding': 10}),
                
                # Submit Button
                html.Div([
                    
                    html.Button('Submit', id='button',style={'color':'white', 'background-color': '#018786','box-shadow': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'}, className='two columns')
                ]),
                
                html.Div('', className='twleve columns', style={'padding': 10}),
            ], className='twleve columns'),

            # Batch Results Grid
             html.Div([
                # Batch Graph
                html.Div([
                    # graph
                    dcc.Graph(id='batch-graph', figure = onLoad_graph())
                ], className='twleve columns'),
            
                # Batch Results Table
                html.Div(
                    html.Table(id='batch-table'),
                    className='twleve columns'
                )
            ]),
        ]),
        dcc.Tab(label='PERFORMANCE PREDICTION', children=[
            html.Div(id='pred-controls',children=[html.Button("Print PDF", id='pred-print-pdf')], style={'padding': 20, 'float': 'right', 'margin-left':'1500px'}),
        
            html.Div([
                html.Div('Provide input in below fields to get result: ', style={'padding-top': 20, 'padding-bottom':20}),
                ], className='twleve columns'),
                
            # Input Grid
            html.Div([
                html.Div([
                    
                    html.Div([
                        html.Div(dcc.Dropdown(options=[
                                    {'label': env, 'value': env} for env in dbnames
                                    ],
                                    id='pred-env-selector',
                                    placeholder="Select Environment...",
                                    searchable=False,
                                    clearable=False
                                    ), style={'padding-right': '50px'}, className='three columns'),
                        
                        html.Div(dcc.Dropdown(placeholder='Select Batch Code...',id='pred-batch-selector', options=[
                                    {'label': batch, 'value': batch} for batch in list(batches_df_table['BATCH_CD'].sort_values(ascending=True))
                                    ],), className='two columns'),   
                    ]),
                    
                ], className='eleven columns'),

                # Empty
                html.Div(className='six columns'),
            ], className='twleve columns'),
            
            # Empty
            html.Div([
                html.Div('', className='twleve columns', style={'padding': 10}),
                
                # Submit Button
                html.Div([
                    
                    html.Button('Submit', id='pred-button',style={'color':'white', 'background-color': '#018786','box-shadow': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'}, className='two columns')
                ]),
                
                html.Div('', className='twleve columns', style={'padding': 10}),
            ], className='twleve columns'),

            # Batch Results Grid
             html.Div([
                # Batch Graph
                html.Div([
                    # graph
                    dcc.Graph(id='pred-batch-graph', figure = onLoad_graph())
                ], className='twleve columns'),
            
                # Batch Results Table
                html.Div(
                    html.Table(id='pred-batch-table'),
                    className='twleve columns'
                )
            ]),
        ]),
    ]),    
])


#############################################
# Interaction Between Components / Controller
#############################################

# Loading summary on selecting batch (first tab)
@app.callback(
                [
                    dash.dependencies.Output(component_id='batchcd-div', component_property='children'),
                    dash.dependencies.Output(component_id='records-div', component_property='children'),
                    dash.dependencies.Output(component_id='batchnbr-div', component_property='children'),
                    dash.dependencies.Output(component_id='date-div', component_property='children'),
                    dash.dependencies.Output(component_id='gauge-duration', component_property='value'),
                    dash.dependencies.Output(component_id='gauge-duration', component_property='color'),
                    dash.dependencies.Output(component_id='gauge-duration', component_property='max'),
                    dash.dependencies.Output(component_id='summary-batch-graph', component_property='figure'),
                ],
                [
                    dash.dependencies.Input(component_id='summary-table', component_property='data'),
                    dash.dependencies.Input(component_id='summary-table', component_property='selected_rows'),
                    dash.dependencies.Input(component_id='summary-env-selector', component_property='value'),
                ]
)
def get_active_cell_value(data, selected_rows, environ):
    batch = str(data[selected_rows[0]]['BATCH_CD'])
    
    start_date = Date.today() - timedelta(days=15)
    starttm = start_date.strftime('%m-%d-%Y')
    end_date = Date.today()
    endtm = end_date.strftime('%m-%d-%Y')
    
    results = get_results(starttm, endtm, batch, environ)
    
    if len(results) > 0:
        records = results['RECORDS'].iloc[-1]
        batchnbr = results['BATCH_NBR'].iloc[-1]
        execut_date = dt.strftime(results['START_TM'].iloc[-1], '%Y-%m-%d %H:%M:%S')
        duration = results['DURATION_MIN'].iloc[-1]
    else:
        records = 'NO RECORD'
        batchnbr = 'NO RECORD'
        execut_date = 'NO RECORD'
        duration = 0
        
    if results["DURATION_MIN"].max() > 10 :
        del_results = results[:-1]
        if len(del_results) > 0:
            threshold = int(del_results["DURATION_MIN"].mean())
        else:
            threshold = int(duration + (duration/4))
        lwr_threshold = int(threshold - (threshold/4))
        max_durat = int(threshold + (threshold/4))
        guage_color={"gradient":True,"ranges":{"green":[0,lwr_threshold],"yellow":[lwr_threshold,threshold],"red":[threshold,max_durat]}}
    else:
        guage_color={"gradient":True,"ranges":{"green":[0,6],"yellow":[6,8],"red":[8,10]}}
        max_durat = 10
    
    figure = []
    if len(results) > 0:
        figure = draw_summary_points_graph(results)
    else:
        figure = onLoad_graph()
    
    return [batch], [records], [batchnbr], [execut_date], duration, guage_color, max_durat, figure

# Load Batch Codes in Dropdown (second tab)
@app.callback(
    Output(component_id='batch-selector', component_property='options'),
    [
        Input(component_id='env-selector', component_property='value')
    ]
)
def populate_batch_selector(envir):
    batch_cd = get_batchcd(envir)
    return [
        {'label': batch, 'value': batch}
        for batch in batch_cd
    ]

# Load Batch results (second tab)
@app.callback(
    [
        dash.dependencies.Output(component_id='batch-graph', component_property='figure'),
        dash.dependencies.Output(component_id='batch-table', component_property='children')
    ],
    [
        dash.dependencies.Input(component_id='button', component_property='n_clicks')
    ],
	[
        dash.dependencies.State(component_id='start-date-picker', component_property='date'),
        dash.dependencies.State(component_id='end-date-picker', component_property='date'),
        dash.dependencies.State(component_id='batch-selector', component_property='value'),
        dash.dependencies.State(component_id='env-selector', component_property='value')
    ]
)
def load_results(n_clicks, start_date, end_date, batch, environ):

    start_date = dt.strptime(start_date, '%Y-%m-%d')
    starttm = start_date.strftime('%m-%d-%Y')
    end_date = dt.strptime(end_date, '%Y-%m-%d')
    endtm = end_date.strftime('%m-%d-%Y')
    
    results = get_results(starttm, endtm, batch, environ)
    table = generate_table(results, max_rows=200)
    figure = []
    if len(results) > 0:
        figure = draw_points_graph(results)

    return figure, table

# Load Forcasted Batch results (third tab)
@app.callback(
    [
        dash.dependencies.Output(component_id='pred-batch-graph', component_property='figure'),
        dash.dependencies.Output(component_id='pred-batch-table', component_property='children')
    ],
    [
        dash.dependencies.Input(component_id='pred-button', component_property='n_clicks')
    ],
	[
        dash.dependencies.State(component_id='pred-batch-selector', component_property='value'),
        dash.dependencies.State(component_id='pred-env-selector', component_property='value')
    ]
)
def load_results(n_clicks, batch, environ):
    
    start_date = Date.today() - timedelta(days=120)
    starttm = start_date.strftime('%m-%d-%Y')
    end_date = Date.today()
    endtm = end_date.strftime('%m-%d-%Y')
    
    results = get_results(starttm, endtm, batch, environ)
    results, forecast = data_predict(results)
    table = generate_table(results, max_rows=200)
    figure = []
    if len(results) > 0:
        figure = draw_pred_points_graph(results, forecast)
    
    return figure, table

# start Flask server
if __name__ == '__main__':
    app.run_server(
        debug=False,
        host='0.0.0.0',
        port=8050
    )