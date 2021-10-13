import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { StorageService } from "../storage/storage.service";

@Injectable({
  providedIn: "root",
})
export class AdminGuard
  implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad
{
  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const pagePermission: any =
      this.storageService.getData("pagePermission") &&
      JSON.parse(this.storageService.getData("pagePermission"));
    let routePermision: any = route.data;
    if (pagePermission.UserAdministration) {
      let check: any = pagePermission.UserAdministration.filter(
        (element: any) =>
          element.action == routePermision.action &&
          (element.permission == routePermision.permission ||
            element.permission == routePermision.allowPrivate)
      );
      if (check.length > 0) {
        return true;
      }
    }
    this.router.navigate(["admin/error"]);
    return false;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const pagePermission: any =
      this.storageService.getData("pagePermission") &&
      JSON.parse(this.storageService.getData("pagePermission"));
    let routePermision: any = route.data;
    if (pagePermission.UserAdministration) {
      let check: any = pagePermission.UserAdministration.filter(
        (element: any) =>
          element.action == routePermision.action &&
          (element.permission == routePermision.permission ||
            element.permission == routePermision.allowPrivate)
      );
      if (check.length > 0) {
        return true;
      }
    }
    this.router.navigate(["admin/error"]);
    return false;
  }
}
