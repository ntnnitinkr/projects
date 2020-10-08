import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { MatDialog } from '@angular/material';
import { MessageBox, MessageBoxButton } from '../shared/message-box';
import { SecurityService } from '../security/security.service';
import { AppUserAuth } from '../security/app-user-auth';


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  private securityObject: AppUserAuth = null;
  @Output() sidenavClose = new EventEmitter();

  constructor(
    private router: Router,
    private _sharedService: SharedService,
    public dialog: MatDialog,
    private securityService: SecurityService
  ) { 
    this.securityObject = securityService.securityObject;
  }

  ngOnInit() {
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  
  public logout() {
    this.securityService.logout();
    MessageBox.show(this.dialog, "Confirm Action", 'Do you want to logout ?', MessageBoxButton.YesNo, "350px")
      .subscribe(result => {
        const dialogResult = (result === undefined) ? "none" : result.result;
        if (dialogResult == "yes") {
          localStorage.removeItem("logedUser");
          localStorage.removeItem("logedUserName");
          localStorage.clear();
          this._sharedService.emitChange(null);
          this.router.navigate(['']);
        }
      });
      
  }

}
