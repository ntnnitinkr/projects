import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthuserComponent } from './authuser/authuser.component';
//import { AuthGuardService } from '../security/authguard.service';

const userRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'authuser', component: AuthuserComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class UserRoutingModule { }
