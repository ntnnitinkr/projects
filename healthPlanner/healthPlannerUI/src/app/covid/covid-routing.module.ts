import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CovidListComponent } from '../covid/covid-list/covid-list.component';


const patientRoutes: Routes = [
  { path: 'datalist', component: CovidListComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(patientRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class CovidRoutingModule { }
