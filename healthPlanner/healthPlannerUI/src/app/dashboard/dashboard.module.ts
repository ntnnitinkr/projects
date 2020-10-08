import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardCardSpawnerComponent } from './dashboard-card-spawner/dashboard-card-spawner.component';
import { DashboardUsersComponent } from './dashboard-users/dashboard-users.component';
import { ZingchartAngularModule } from 'zingchart-angular'; 

@NgModule({
  declarations: [DashboardComponent,  DashboardCardSpawnerComponent, DashboardUsersComponent],
  imports: [
    CommonModule, ZingchartAngularModule,
  ]
})
export class DashboardModule { }
