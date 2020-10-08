import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardUsersComponent} from './dashboard/dashboard-users/dashboard-users.component';
import { ZingchartAngularModule } from 'zingchart-angular'; 
import {MatAutocompleteModule,MatInputModule} from '@angular/material';
import { AuthGuardService } from './security/authguard.service';



const routes: Routes = [
  { path: 'user', loadChildren: "./users/user.module#UserModule" },
  { path: 'patient', loadChildren: "./patients/patient.module#PatientModule" , canActivate: [AuthGuardService]},
  { path: 'covid', loadChildren: "./covid/covid.module#CovidModule" , canActivate: [AuthGuardService]},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/user/login', pathMatch: 'full' },
  { path: 'image', loadChildren: "./image_recognition/image.module#ImageModule" , canActivate: [AuthGuardService]},
  //{ path: 'imageData', component: ImageComponent },
  { path: 'dashboard', component: DashboardUsersComponent, canActivate: [AuthGuardService]}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ZingchartAngularModule, MatAutocompleteModule, MatInputModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
