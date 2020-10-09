# HealthPlanner
## Health Planner is a web application. It is built on top of Angular8 and React. Code is written in HTML, Typescript and Python.

##############################################Disclaimer##############################################
This application is part of RedHatHackathonPlus2020 which was conducted by IBM. I was a part of team of five members. Below were my responsibilities in building this project:
1. To develop microservices using Python. (because I know Python programming language)
2. To enhance the features of application like COVID data, Watson Services and Machine Learning. (because I have an experience in analytics/machine learning)
3. To create navigation structure of whole UI. (because I can suggest very easily in building user-friendly app)
4. To design theme so that application looks very attractive and impressive. (because I am a graphic designer and animator)
Below is the demo of this application which was created by me. Please click on below video to see the demo. <a href="https://github.com/ntnnitinkr/projects/blob/master/healthPlanner/assets/RedhatHackathon_CloudRacers_HealthPlanner_Implemention_v4.1.pptx">Click here</a> to see the presentation.
<p align="center">
  <a href="https://drive.google.com/file/d/1-6Z4xW2q7a--uM8-ziXcY8xZ96tk5m29/view?usp=drivesdk">
    <img src="https://github.com/ntnnitinkr/projects/blob/master/healthPlanner/assets/Screenshots/Video_Screenshot.png" width="300" title="Demo Video">
  </a>
</p>
######################################################################################################

### Features of this application are-
1. Registration - This application is primary used by hospital staff as well as customers who would like to register for a treatment at a hospital. This application has the ability register the new customers by staff or used by the customer to self register themselves.
2. List of Patients - In this application, hospital staff can view, update or delete patient details from list of patients. Hospital staff can see detailed history of their patients in this application. 
3. Diagnosis - In this, user can directly upload their x-ray report and see the result if he/she has pneumonia or not. This whole diagnosis process is done using Machine Learning.
4. Covid data - In this covid era, everyone want to see latest information about Covid-19. Anyone can search and view latest data related to Covid-19 like total number of cases, active cases, number of deaths, number of recoveries, number of rise in a day, etc.
5. Multi-cloud architecture - This application has been build on multi cloud architecture where the core application is hosted on the Red Hat Cluster, API Manager and Watson services hosted on IBM Cloud and Jenkins being run for Private cloud.
6. Microservices - Microservices are build using Python which are Highly maintainable, Loosely coupled, Independently deployable, etc.
7. API gateways - API gateways are used to secure routes. It is also helpful to restrict or monitor the traffic to the application.
7. Secure - No data saving in local machine and is directly stored securely on the Mongo DB.
8. Interactive -It is highly interactive and user friendly web application.

### The capabilities of this application are:
1. Hospital can manage all of their patients data at one place
2. Latest consolidated Covid-19 data
3. Diagnose medical report without human interaction

### This application is divided into four parts:
1. Registration Page - When any open application, the first page will open with login screen. User can fill admin detail if he/she is of hospital staff. If user is patient, then he/she can register themselves or login with their credintials. After logging in, new users can fill up their medical history like allergies, etc.
2. Patient List Page - This freature is only available to hospital staff(admins). So, they can manage their patient data in single screen.
3. Diagnosis Page - In this page, we have added most useful and demanding feature which is Artificial Intelligence. We have implemented Image Recognition using Watson Visual Recognition service. So, we are classifying different types of images using machine learning. What we have done here, we created Watson Visual Recognition service and trained the model with different type of sets of images using deep learning algorithms. When a user uploads an image of his x-ray or ultrasound and click on submit button, then, that image goes to Watson service through all secure routes and the result will be retured after comparing to those model of different classes which were developed using deep learning. So, in this way, image is classified and user got the result if he/she has pnemonia or he/she is normal.
3. Covid Result Page - In this covid era, everyone want to know the status of his/her country and want to compare it with other countries. So, what we have done here, we have used an open source API to get Covid-19 data and consolidated it on a single page in decreasing order of total number of cases. We can search and see all result like total number of cases, active cases, number of deaths, number of recoveries, number of rise in a day, etc.

## Installation steps to run in PC:
This application is deployed on Red Hat. So, we just need a link to access this application.

## Registration Page:
<p align="left">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/healthPlanner/assets/Screenshots/Web_app_1.png" width="300" title="Login Page">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/healthPlanner/assets/Screenshots/Web_app_2.png" width="300" title="Home Page">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/healthPlanner/assets/Screenshots/Web_app_4.png" width="300" title="Fillup Details Page">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/healthPlanner/assets/Screenshots/Web_app_5.png" width="300" title="Fillup Details Page 2">
</p>

## Patient List Page:
<p align="left">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/healthPlanner/assets/Screenshots/Web_app_7.png" width="300" title="Patient List Page">
</p>

## Diagnosis Page:
<p align="left">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/healthPlanner/assets/Screenshots/Web_app_6.png" width="300" title="Diagnosis Page">
</p>

## Covid-19 Page:
<p align="left">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/healthPlanner/assets/Screenshots/Web_app_3.png" width="300" title="Covid-19 Page">
</p>

## Watson Service used by me in application:
<p align="center">
  <img src="https://github.com/ntnnitinkr/projects/blob/master/healthPlanner/assets/Screenshots/Watson.jpg" width="950" title="Watson Page">
</p>
