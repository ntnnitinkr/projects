export const OPENSHIFT_API_URL = 'https://hackothon-api-covid-cc-uc-2-cloudracers.container-crush-01-4044f3a4e314f4bcb433696c70d13be9-0000.che01.containers.appdomain.cloud';
export const APIGATEWAY_URL = 'https://60114285.us-south.apigw.appdomain.cloud/ibmgateway';
//export const APIGATEWAY_URL = 'http://localhost:5000';


/**export const GET_ALL_PATIENT_URL =  "user/get";
export const CREATE_PATIENT_URL  =  "user/create";
export const UPDATE_PATIENT_URL  =  "user/update" ;
export const DELETE_PATIENT_URL  =  "user/delete";
export const GET_COVID_URL       =  "covid/get";
export const IMAGE_RESULT_URL    =  "image/result";
export const CREATE_USER_URL     =  "auth/create";
export const GET_USER_URL        =  "auth/get";**/

export const GET_ALL_PATIENT_URL =  "getall/user/get";
export const CREATE_PATIENT_URL  =  "create/user/create";
export const UPDATE_PATIENT_URL  =  "update/user/update" ;
export const DELETE_PATIENT_URL  =  "remove/user/delete";
export const GET_COVID_URL       =  "getcovid/covid/get";
export const IMAGE_RESULT_URL    =  "image/result";
export const CREATE_USER_URL     =  "authadd/auth/create";
export const GET_USER_URL        =  "authget/auth/get";

//export const GET_ALL_PATIENT_URL =  "request";
//export const CREATE_PATIENT_URL  =  "request";
//export const UPDATE_PATIENT_URL  =  "request" ;
//export const DELETE_PATIENT_URL  =  "request";

//export const GET_ALL_PATIENT_URL =  "healthplanner/get/patient";
//export const CREATE_PATIENT_URL  =  "healthplanner/create/patient";
//export const UPDATE_PATIENT_URL  =  "healthplanner/update/patient" ;
//export const DELETE_PATIENT_URL  =  "healthplanner/delete/patient";

export const GENDER: Array<any> = [
    { option: "Male", value: "Male", checked: false },
    { option: "Female", value: "Female", checked: false }
];

export const MARITAL_STATUS: Array<any> = [
    { option: "Married", value: "Married", checked: false },
    { option: "Unmarried", value: "Unmarried", checked: false }
];

export const DISEASE_TYPE: Array<any> = [
   
    { name: "Anemia", checked: false },
    { name: "Arthritis", checked: false },
    { name: "Asthma", checked: false },
    { name: "COPD (Emphysema)", checked: false },
    { name: "Cancer", checked: false },
    { name: "Diabetes", checked: false },
    { name: "Liver Disease", checked: false },
    { name: "Osteoarthritis", checked: false },
    { name: "Thyroid", checked: false },
    { name: "Osteoporosis", checked: false },
    { name: "None", checked: false }
];

export const YES_NO: Array<any> = [
    { option: "Yes", value: "Yes", checked: false },
    { option: "No", value: "No", checked: false }
];

export const EXCERCISE_TYPE: Array<any> = [
    { option: "Moderate", value: "Moderate", checked: false },
    { option: "Vigorous", value: "Vigorous", checked: false },
    { option: "Sedentary", value: "Sedentary", checked: false }
];

export const USAGE_TYPE: Array<any> = [
    { option: "No", value: "No", checked: false },
    { option: "Daily", value: "Daily", checked: false },
    { option: "Weekly", value: "Weekly", checked: false },
    { option: "Less", value: "Less", checked: false },
    { option: "Former User", value: "Former User", checked: false }
];

export const ALERGIC_TYPE: Array<any> = [
    { name: "Food", checked: false },
    { name: "Pollen", checked: false },
    { name: "Animals", checked: false },
    { name: "Medication", checked: false }
];

export const DIET_TYPE: Array<any> = [
    { option: "Veg", value: "Veg", checked: false },
    { option: "Non-Veg", value: "Non-Veg", checked: false },
    { option: "Vegan", value: "Vegan", checked: false }
];