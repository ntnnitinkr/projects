import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { SecurityService } from './security.service';
import { Observable } from 'rxjs';


@Injectable()
export class AuthGuardService implements CanActivate {
     
constructor(private securityService: SecurityService,  private router: Router) { }
/**if (this.securityService.securityObject.isAuthenticated ) {
  alert("true");
  return true;
 }**/


canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  
  if (this.securityService.securityObject.isAuthenticated==true) {
           return true;
  }
  else{
     // not logged in so redirect to login page with the return url
    this.router.navigate(['/user/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

}


}