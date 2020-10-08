import { Component, OnInit} from '@angular/core';
import {SharedService} from 'src/app/services/shared.service';
import {LoginComponent} from 'src/app/users/login/login.component';
import { AppUserAuth } from '../security/app-user-auth';
import { SecurityService } from '../security/security.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private changeText: boolean;
  private logedUser :String;
  private userName: String;
  private checkUser : boolean;
  private securityObject: AppUserAuth = null;
  
  
  ngOnInit() {
    this.trackLoggerUser();
   
      console.log(window.location.href);
      //this.triggerJS();
      //alert("Angularjs call function on page load.");
         
  }

  constructor(private securityService: SecurityService){
    this.securityObject = 
       securityService.securityObject;
  }
  public executeSelectedChange = (event : any) => {
    console.log(event);
  }

  public triggerJS(){
    location.replace("https://corona.lmao.ninja/v2/countries?sort=cases");
    /*
    location.assign("New_WebSite_Url");
    //Use assign() instead of replace if you want to have the first page in the history (i.e if you want the user to be able to navigate back when New_WebSite_Url is loaded)
    */
    }

    public trackLoggerUser(){
      this.userName=localStorage.getItem('logedUserName');
      
      if (this.userName.indexOf("admin") >0){
        this.checkUser = true;
      }
      else
      this.checkUser=false;

    }
   
}
