import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { StorageService } from "../storage/storage.service";

@Injectable({
  providedIn: "root",
})
export class VotingsGuardGuard
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
    const userToken =
      this.storageService.getData("userToken") &&
      JSON.parse(this.storageService.getData("userToken"));
    const pagePermission =
      this.storageService.getData("pagePermission") &&
      JSON.parse(this.storageService.getData("pagePermission"));
    let routePermission = route.data;

    if (pagePermission.Votings) {
      let check = pagePermission.Votings.filter(
        (element: any) =>
          element.action == routePermission.action &&
          (element.permission == routePermission.permission ||
            element.permission == routePermission.allowPrivate)
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
    return true;
  }
}
