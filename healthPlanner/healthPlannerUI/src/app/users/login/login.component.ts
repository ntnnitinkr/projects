import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router, NavigationExtras } from '@angular/router'
import { User } from '../../model/user';
import { SharedService } from '../../services/shared.service';
import { MessageBox, MessageBoxButton } from 'src/app/shared/message-box';
import { AppUser } from '../../security/app-user';
import { AppUserAuth } from '../../security/app-user-auth';
import { SecurityService }  from '../../security/security.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public event : Event;
  public logedUser: User = null;
  user: User = new User();
  securityObject: AppUserAuth = null;

  @Output() updateView = new EventEmitter();
 

 
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private _sharedService: SharedService,
    private securityService: SecurityService
  ) {
    
    localStorage.removeItem('logedUser');
    this._sharedService.emitChange(null);
    
  }

  ngOnInit() {

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    
    
  }

    
  public hasError(controlName: string, errorName: string) {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  public onCancel() {
    //this.location.back();
  }

  public login(loginFormValue) {

    this.user.username=loginFormValue.username;
    this.user.password=loginFormValue.password;
    
    this.securityService.login(this.user)
    .subscribe(resp => {
      this.securityObject = resp;
      this.logedUser = new User();
     
      if (this.loginForm.valid && this.securityObject.isAuthenticated==true) {
            this.logedUser.username = loginFormValue.username;
            this.logedUser.password = loginFormValue.password;
            localStorage.setItem('logedUser', JSON.stringify(this.logedUser));
            localStorage.setItem('logedUserName', JSON.stringify(this.logedUser.username));
            this._sharedService.emitChange(this.logedUser);
            this.router.navigate(['/home']);
      }
      else{
        MessageBox.show(this.dialog, "Error", 'Invalid User Name or Password', MessageBoxButton.Ok, "350px");
      }
    });
   
      /**if (this.loginForm.valid) {
      if (loginFormValue.username === "admin" && loginFormValue.password === "admin" || 
      (loginFormValue.username === "user" && loginFormValue.password === "user")) {
        
          MessageBox.show(this.dialog, "Alert", 'Login Successfully', MessageBoxButton.Ok, "350px")
          .subscribe(result => {
            this.logedUser = new User();
            this.logedUser.username = loginFormValue.username;
            this.logedUser.password = loginFormValue.password;
            localStorage.setItem('logedUser', JSON.stringify(this.logedUser));
            localStorage.setItem('logedUserName', JSON.stringify(this.logedUser.username));
            this._sharedService.emitChange(this.logedUser);
            this.router.navigate(['/home']);
          });
      }
      else
        MessageBox.show(this.dialog, "Error", 'Invalid User Name or Password', MessageBoxButton.Ok, "350px");
    }**/
  }

}
