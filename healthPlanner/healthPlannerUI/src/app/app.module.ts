import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule} from '@agm/core';
import {DashboardUsersComponent} from './dashboard/dashboard-users/dashboard-users.component';
import { SharedService } from './services/shared.service';
import { ZingchartAngularModule } from 'zingchart-angular'; 
import {MatAutocompleteModule,MatInputModule} from '@angular/material/';
import {SecurityService} from './security/security.service';
import {AuthGuardService} from './security/authguard.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LayoutComponent,
    SidenavListComponent,
    DashboardUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    ZingchartAngularModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatInputModule,
    AgmCoreModule.forRoot({
      apiKey:'*******************************'
    })
  ],
  providers: [
    SharedService,
    SecurityService,
    AuthGuardService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
