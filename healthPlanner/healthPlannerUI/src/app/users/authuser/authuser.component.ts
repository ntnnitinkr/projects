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
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-authuser',
  templateUrl: './authuser.component.html',
  styleUrls: ['./authuser.component.css']
})
export class AuthuserComponent implements OnInit {
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
    private securityService: SecurityService,
    private service: PatientService
  ) {
    
    localStorage.removeItem('logedUser');
    this._sharedService.emitChange(null);
    
  }

  ngOnInit() {

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmpassword :  new FormControl('', [Validators.required])
    });
    
    
  }

    
  public hasError(controlName: string, errorName: string) {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  public onCancel() {
    this.router.navigate(['']);
  }

  public login(loginFormValue) {

    this.user.username=loginFormValue.username;
    this.user.password=loginFormValue.password;
    this.user.isAdmin="false";
        
      if (this.loginForm.valid  ) {
        if(loginFormValue.password==loginFormValue.confirmpassword){
          var user :  User;
          this.service.saveUser(this.user).subscribe(
            response => {
              MessageBox.show(this.dialog, "", 'Registered Successfully!!!', MessageBoxButton.Ok, "350px")
                .subscribe(result => {
                  let url: string = `/user/login`;
                  this.router.navigate([url]);
                });
            },
            error => {
            }
          );
          //MessageBox.show(this.dialog, "", 'Registered Successfully!!!', MessageBoxButton.Ok, "350px");
          this.router.navigate(['/user/login']);
      }
      else{
        MessageBox.show(this.dialog, "Error", 'Password & Confirm Password Must match!!!', MessageBoxButton.Ok, "350px");
      }
    }
      else{
        MessageBox.show(this.dialog, "Error", 'Some error occured', MessageBoxButton.Ok, "350px");
      }
    
   
  }


}
