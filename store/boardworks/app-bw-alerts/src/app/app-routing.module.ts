import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AlertsGuard } from "lib-bw-svc-apis/src/lib/alertsGuard/alerts.guard";
import { AlertsHomeComponent } from "./alerts-home/alerts-home.component";
import { CreateAlertTemplateComponent } from "./create-alert-template/create-alert-template.component";
import { NewAlertComponent } from "./new-alert/new-alert.component";
import { ViewAlertComponent } from "./view-alert/view-alert.component";

const routes: Routes = [
  {
    path: "",
    component: AlertsHomeComponent,
    canActivate: [AlertsGuard],
    data: {
      action: "ViewAlert",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "new-alert",
    component: NewAlertComponent,
    canActivate: [AlertsGuard],
    data: {
      action: "AddAlert",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "edit-alert",
    component: NewAlertComponent,
    canActivate: [AlertsGuard],
    data: {
      action: "EditDeleteAlertTemplate",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "view-alert",
    component: ViewAlertComponent,
    canActivate: [AlertsGuard],
    data: {
      action: "EditDeleteAlertTemplate",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "add-alert-template",
    component: CreateAlertTemplateComponent,
    canActivate: [AlertsGuard],
    data: {
      action: "AddAlert",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "edit-alert-template",
    component: CreateAlertTemplateComponent,
    canActivate: [AlertsGuard],
    data: {
      action: "EditDeleteAlertTemplate",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "use-alert-template",
    component: CreateAlertTemplateComponent,
    canActivate: [AlertsGuard],
    data: {
      action: "EditDeleteAlertTemplate",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
