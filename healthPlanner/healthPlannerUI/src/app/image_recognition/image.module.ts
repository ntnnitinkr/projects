import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { ImageComponent } from './image/image.component';
import { ImageRoutingModule } from './image-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ImageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ImageComponent
  ]
})
export class ImageModule { }
