import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class LinksGuard implements CanActivate {
  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const pagePermission = this.storageService.getData('pagePermission') && JSON.parse(this.storageService.getData('pagePermission'));
    let routePermision = route.data;


    if (pagePermission.Links) {
      let check = pagePermission.Links.filter((element: any) => element.action == routePermision.action && element.permission == routePermision.permission);
      if (check.length > 0) {
        return true
      }
    }
    this.router.navigate(['admin/error'])

    return false

  }




}
