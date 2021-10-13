import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminHomeComponent } from "./admin-home/admin-home.component";
import { IsNewuserGuard } from "lib-bw-svc-apis/src/lib/IsNewuser/is-newuser.guard";
import { AdminGuard } from "lib-bw-svc-apis/src/lib/admin-guard/admin-guard";
import { LinksGuard } from "lib-bw-svc-apis/src/lib/linksGuard/links.guard";
import { ErrorPageComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/errorPage/error-page/error-page.component";

const routes: Routes = [
  {
    path: "",
    component: AdminHomeComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("app-bw-home/src/app/app.module").then((m) => m.AppModule),
      },
      {
        path: "user",
        canLoad: [IsNewuserGuard],
        canActivate: [IsNewuserGuard],
        loadChildren: () =>
          import(
            "app-bw-admin/src/app/user-administration/users-administration.module"
          ).then((m) => m.UsersAdminModule),
      },
      {
        path: "profile",
        canLoad: [IsNewuserGuard],
        canActivate: [IsNewuserGuard],
        loadChildren: () =>
          import("app-bw-profile/src/app/app.module").then((m) => m.AppModule),
      },
      {
        path: "links",
        canLoad: [IsNewuserGuard],
        canActivate: [IsNewuserGuard],
        loadChildren: () =>
          import("app-bw-links/src/app/app.module").then((m) => m.AppModule),
      },
      {
        path: "alerts",
        canLoad: [IsNewuserGuard],
        canActivate: [IsNewuserGuard],
        loadChildren: () =>
          import("app-bw-alerts/src/app/app.module").then((m) => m.AppModule),
      },
      {
        path: "meetings",
        canLoad: [IsNewuserGuard],
        canActivate: [IsNewuserGuard],
        loadChildren: () =>
          import("app-bw-meetings/src/app/app.module").then((m) => m.AppModule),
      },
      {
        path: "collaborations",
        canLoad: [IsNewuserGuard],
        canActivate: [IsNewuserGuard],
        loadChildren: () =>
          import("app-bw-collabs/src/app/app.module").then((m) => m.AppModule),
      },
      {
        path: "search",
        canLoad: [IsNewuserGuard],
        canActivate: [IsNewuserGuard],
        loadChildren: () =>
          import("app-bw-search/src/app/app.module").then((m) => m.AppModule),
      },
      {
        path: "evaluations",
        canLoad: [IsNewuserGuard],
        canActivate: [IsNewuserGuard],
        loadChildren: () =>
          import("app-bw-evaluations/src/app/app.module").then(
            (m) => m.AppModule
          ),
      },
      {
        path: "documents",
        // canLoad: [IsNewuserGuard],
        // canActivate: [IsNewuserGuard],
        loadChildren: () =>
          import("app-bw-reference/src/app/app.module").then(
            (m) => m.AppModule
          ),
      },
      {
        path: "surveys",
        loadChildren: () =>
          import("app-bw-surveys/src/app/app.module").then((m) => m.AppModule),
      },
      {
        path: "votings",
        loadChildren: () =>
          import("app-bw-votings/src/app/app.module").then((m) => m.AppModule),
      },
      {
        path: "error",
        component: ErrorPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
