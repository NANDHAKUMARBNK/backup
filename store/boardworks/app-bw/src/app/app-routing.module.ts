import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UiThemeComponent } from "./ui-theme/ui-theme.component";
import { AuthGuard } from 'lib-bw-svc-apis/src/lib/auth/auth.guard';
import { NoLoginGuard } from 'lib-bw-svc-apis/src/lib/NoLoginGuard/no-login.guard';

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "ui-themes",
    component: UiThemeComponent,
    data: {
      name: "Sandeep",
      title: "nmdkdmdmd",
    },
  },
  {
    path: "login",
    canActivate: [NoLoginGuard],
    canLoad: [NoLoginGuard],
    loadChildren: () =>
      import("app-bw-ext/src/app/Authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: "admin",
    data: {
      role: '',
      title: 'BoardWorks Admin'
    },
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () =>
      import("app-bw-admin/src/app/app.module").then((m) => m.AppModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
