import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ImageComponent } from '../image_recognition/image/image.component';


const patientRoutes: Routes = [
  { path: 'data', component: ImageComponent }
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
export class ImageRoutingModule { }
