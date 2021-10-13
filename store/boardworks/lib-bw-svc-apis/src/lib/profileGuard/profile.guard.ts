import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const pagePermission = this.storageService.getData('pagePermission') && JSON.parse(this.storageService.getData('pagePermission'));
    let routePermision = route.data;


    if (pagePermission.Profiles) {
      let check = pagePermission.Profiles.filter((element: any) => (element.action == routePermision.action || element.action == routePermision.otherAction) && (element.permission == routePermision.permission || element.permission == routePermision.permissionPrivate));
      if (check.length > 0) {
        return true
      }
    }
    this.router.navigate(['admin/error'])

    return false
  }

}
