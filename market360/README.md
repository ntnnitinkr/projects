# MARKET 360
## Market 360 is an Executive Dashboard and User Interfaces to monitor / track Market Transactions.

### Features of this utility are-
1. Executive Dashboard – Inbound Transactions - Dashboard gives a view of the Total Transaction in each hour in BizLink and MTM. 
2. Executive Dashboard – Outbound Transactions  - Dashboard gives a view of the Total Transaction in each hour in BizLink and MTM. 
3. Transaction Monitoring - Functional users can access the application to view the time the transaction was processed in various Edge Systems.
4. Unprocessed Priority Reconnect- Ability for the functional users to view unprocessed priority reconnects
5. Unprocessed Transaction- Ability for the functional users to do Data Reconciliation between BizLink and MTM

### The capabilities of this utility are:
1. Complete market transaction life cycle monitoring & reconciliation
2. Visibility of market transaction flow across Oncor applications
3. Monitor Unprocessed Priority Reconnect transactions
4. Capture required market transaction data from required systems in near real time
5. Implement retention policy to keep only 5 days active data
6. Maintain historical data in another set of tables. Apply retention on these tables as per the business requirement

### Benefits of this utility are:
1. Centralized Health Check Dashboard - Live health check report of any applications at one place and simply by one click. 
2. High Visibility - Ensure high visibility of market transaction flow across Oncor applications
3. Data Insights - Analyze the data, understand the pattern and make better business decision
4. Analysis and Reporting - Market Operation analysis & reporting requirement from one source
5. Market handshake - Complete transaction life cycle monitoring & reconciliation
6. High Application availability - Increase functional  and IT team productivity for all business users by faster reconciliation of Data during Unplanned Outages

## Technical Overview Solution:
1. Web Based dashboard for Real Time Market Transaction monitoring using Material UI and Angular JS
2. ESB component to call database procedure and create a Json file using the output data
3. Parameterized procedure to return the required data via ref cursor 
4. Node JS to create API's to get Data from DB for Angular JS frontend.

## Installation steps to run in PC:
1. For Angular app - 
      npm install i    -  to install libraries
      ng serve    -  to start app
2. For Node - 
      npm install   - to install libraries
      npm start  -  to start node
3. Configure DataBase in config file.
4. Run application in browser.

## Login Screen:
<p align="center">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/market360/Screenshots/M360_1.png" width="950" title="Login Screen">
</p>


