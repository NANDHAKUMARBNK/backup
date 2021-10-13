import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const usertoken = this.storageService.getData('userToken') && JSON.parse(this.storageService.getData('userToken'));
      const loggedInBoard = this.storageService.getData('loggedInBoard');
      const token = usertoken && usertoken.token || '';
      if (token && loggedInBoard) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const usertoken = this.storageService.getData('userToken') && JSON.parse(this.storageService.getData('userToken'));
    const token = usertoken && usertoken.token || '';
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const usertoken = this.storageService.getData('userToken') && JSON.parse(this.storageService.getData('userToken'));
      const loggedInBoard = this.storageService.getData('loggedInBoard');
      const token = usertoken && usertoken.token || '';
      if (token && loggedInBoard) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
  }
}
