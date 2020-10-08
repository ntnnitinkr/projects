import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { CovidListComponent } from './covid-list/covid-list.component';
import { CovidRoutingModule } from './covid-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CovidRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    CovidListComponent
  ]
})
export class CovidModule { }
