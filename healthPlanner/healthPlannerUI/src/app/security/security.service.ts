import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { AppUserAuth } from './app-user-auth';
import { AppUser } from './app-user';
import { LOGIN_MOCKS } from './login-mocks';
import { PatientService } from '../services/patient.service';
import { MessageBox } from '../shared/message-box';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  public securityObject: AppUserAuth = new AppUserAuth();
  user: User = new User();
  users: User[];

  constructor(private service: PatientService) { 
    
  }

  resetSecurityObject(): void {
    this.securityObject.userName = "";
    this.securityObject.password = ""; 
    //this.securityObject.bearerToken = "";
    this.securityObject.isAuthenticated = false;
    this.securityObject.canAccessPatients = false;
    //this.securityObject.canAddProduct = false;
    //this.securityObject.canSaveProduct = false;
    //this.securityObject.canAccessCategories 
     // = false;
    //this.securityObject.canAddCategory = false;
    localStorage.removeItem("password");
  }

  login(entity: User): 
           Observable<AppUserAuth> {
  //this.resetSecurityObject();

  this.service.getAppUsers().then(
    users => { 
      this.users=users;
     } );
     for (let i = 0; i < this.users.length; i++) {
         if (entity!=null && (this.users[i].username.toLowerCase()==(entity.username.toLowerCase()))) {
       if(this.users[i].password==entity.password){
          this.securityObject.isAuthenticated=true;
         
          if(this.users[i].isAdmin=="true"){
                this.securityObject.canAccessPatients = true;
            }else{
              this.securityObject.canAccessPatients = false;
            }
          break;
        }
        else{
          this.securityObject.isAuthenticated=false;
          this.securityObject.canAccessPatients = false;
          break;
        }
    }
   }

   
 
  
  /**this.service.getAppUsers().forEach(element => {
    element.user.username.toLowerCase() ===
    entity.username.toLowerCase()
    if(this.securityObject.password==entity.password){
      this.securityObject.isAuthenticated=true;
    }
    else{
      this.securityObject.isAuthenticated=false;
    }
  });**/

  /**Object.assign(this.securityObject,
    this.service.getAppUsers().subscribe(
       user => user.userName.toLowerCase() ===
               entity.userName.toLowerCase()));
  if(this.securityObject.password==entity.password){
    this.securityObject.isAuthenticated=true;
  }
  else{
    this.securityObject.isAuthenticated=false;
  }
  if (this.securityObject.userName !== "") {
   
    localStorage.setItem("password",
       this.securityObject.password);
  }
  
  Object.assign(this.securityObject,
    LOGIN_MOCKS.find(
       user => user.userName.toLowerCase() ===
               entity.userName.toLowerCase()));
  if(this.securityObject.password==entity.password){
    this.securityObject.isAuthenticated=true;
  }
  else{
    this.securityObject.isAuthenticated=false;
  }
  if (this.securityObject.userName !== "") {
   
    localStorage.setItem("password",
       this.securityObject.password);
  }**/
  return of<AppUserAuth>(this.securityObject);
}

logout(): void {
  this.resetSecurityObject();
}
  
onCancel(entity: User){
  this.securityObject.isAuthenticated=true;
  return of<AppUserAuth>(this.securityObject);
}
}
