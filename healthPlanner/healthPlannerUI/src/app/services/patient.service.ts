import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {   OPENSHIFT_API_URL, APIGATEWAY_URL, GET_ALL_PATIENT_URL, CREATE_PATIENT_URL, UPDATE_PATIENT_URL, DELETE_PATIENT_URL, GET_COVID_URL , IMAGE_RESULT_URL, CREATE_USER_URL, GET_USER_URL} from '../shared/constant';
import { Patient } from '../model/patient';
import { Observable } from 'rxjs';
import { AppUser } from '../security/app-user';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get<any>(`${APIGATEWAY_URL}/${GET_ALL_PATIENT_URL}`);
  }

  getDataById(id: String): Observable<any> {
    return this.http.get<any>(`${APIGATEWAY_URL}/${GET_ALL_PATIENT_URL}/${id}`);
  }

  saveData(patient: Patient): Observable<any> {
    return this.http.post(`${APIGATEWAY_URL}/${CREATE_PATIENT_URL}`, patient, { responseType: 'text' as 'json' });
  }

  updateData(id: String, patient: Patient): Observable<any> {
    return this.http.put(`${APIGATEWAY_URL}/${UPDATE_PATIENT_URL}/${id}`, patient);
  }

  deleteData(id: String): Observable<any> {
    return this.http.delete(`${APIGATEWAY_URL}/${DELETE_PATIENT_URL}/${id}`);
  }
  
  covidData(): Observable<any> {
    return this.http.get<any>(`${APIGATEWAY_URL}/${GET_COVID_URL}`);
  }

  imageResult(fileData: File): Observable<any> {
    const formData = new FormData();  
    formData.append('file', fileData); 
    return this.http.post<any>(`${OPENSHIFT_API_URL}/${IMAGE_RESULT_URL}`, formData, { responseType: 'text' as 'json' });
  }

  saveUser(user: User): Observable<any> {
    return this.http.post(`${APIGATEWAY_URL}/${CREATE_USER_URL}`, user, { responseType: 'text' as 'json' });
  }

  
  getAppUsers(): Promise<User[]> {
    return this.http.get(`${APIGATEWAY_URL}/${GET_USER_URL}`).toPromise()
    .then(response => response as User[]);
  }

}