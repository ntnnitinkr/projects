# HealthPlanner
## Health Planner is a web application. It is built on top of Angular8, React and React Js. Code is written in HTML, Typescript and Python.

### Features of this utility are-
1. Analysis - Isolate the problem through analysis of the IT data
2. Resolution of Performance Issues - Reducing & Preventing CC&B Performance Issues
3. Secure - No data saving in local machine from Database
4. Interactive -It is highly interactive and user friendly web application.

### The capabilities of this utility are:
1. Predict problems before they become service impacting
2. Diagnose application performance issues using operational data
3. Ensure CC&B Batches are operating as efficiently as possible 

### This utility is divided into three parts:
1. Summary - On load, screen is populated with the summary of Past performance of default Batch . We can set any batch. For that batch, the page will show the summary like latest execution run, number of records processed, time taken, two week graph, etc. A table is also displayed for all batches from which we can select any batch to see the summary.
2. History - In this tab, user can get the graph of any batch from any environment with any date range. On providing inputs from user, the graph will be displayed. A table will also be displayed below graph for all records.
3. Prediction - In this tab, user can see the prediction of number of records, execution time, etc. Once user selects the environment and batch name, forecast graph will be displayed on screen. We have used Machine Learning in this to predict data.

## Installation steps to run in PC:
1. Install python interpreter(python-3.X.X.exe).
2. Run install_library.bat from 1_time_install folder.
3. Configure DataBase in config.py file.
4. Run start_batch_dash.bat to execute application in browser.

## Summary Tab:
<p align="center">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/BatchPerformance/images/Summary.png" width="950" title="Summary Tab">
</p>

## History Tab:
<p align="center">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/BatchPerformance/images/History.png" width="950" title="History Tab">
</p>

## Prediction Tab:
<p align="center">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/BatchPerformance/images/Prediction.png" width="950" title="Prediction Tab">
</p>
