# OutageExperience
## Outage Experience is the Utility based on Dash which is Python framework for building web applications. It is built on top of Flask, Plotly.js, React and React Js. Code is written in python.

### Features of this utility are-
1. Analysis - Analyse the area where customers are unhappy and take required action
2. Resolution for Unsatisfaction - Take the required steps in the area before loosing unsatisfied customer area
3. Secure - No data saving in local machine from Database
4. Interactive -It is highly interactive and user friendly web application.

### The capabilities of this utility are:
1. Overall customer experience in terms of outages can be seen in map
2. Analysis can be done on the basis of Zip code, Premise ID and Account ID
3. Helps in growing revenue on directly hitting the weakest areas which needs more focus

### This utility is divided into two parts:
1. Outage Map - On load, first tab is populated with a map which provide an overview of Number of Outages based each of Service Areas(eg Metro and Non-Metro). In map, we can zoom in/out to do deep analysis in particular area. On click of the Service Outage, it provides an overview of Outages based on the Zip Codes. On click of the Zip, it provides an overview of Outages based for the various accounts as well as the perceived emotion of the Accounts(based on the ETOR). Every emoji shows the customer experience if he/she is happy, sad or angry. On clicking any of the emoji, detailed informed will be poped up about that premise.
2. Outage Table - In this tab, user can search customers on basis of zip code, premise id and accound id. On search, we will see the detailed information about that customer like when and how many times he/she faced outage, is it resolved or not, etc.

## Installation steps to run in PC:
1. Install python interpreter(python-3.X.X.exe).
2. Run install_library.bat from 1_time_install folder.
3. Configure DataBase in config.py file.
4. Run start_batch_dash.bat to execute application in browser.

## Outage Map 1:
<p align="center">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/outagesExperience/Screenshots/Web_app_1.png" width="950" title="Outage Map Tab">
</p>

## Outage Map 2:
<p align="center">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/outagesExperience/Screenshots/Web_app_2.png" width="950" title="Outage Map Tab">
</p>

## Outage Table Tab:
<p align="center">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/outagesExperience/Screenshots/Web_app_3.png" width="950" title="Outage Table Tab">
</p>
