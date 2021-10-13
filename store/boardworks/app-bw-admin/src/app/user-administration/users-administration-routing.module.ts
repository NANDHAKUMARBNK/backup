import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminGuard } from "lib-bw-svc-apis/src/lib/admin-guard/admin-guard";
import { CreateCommitteesComponent } from "./create-committees/create-committees.component";
import { CreateGroupsComponent } from "./create-groups/create-groups.component";
import { EditUserProfileComponent } from "./edit-user-profile/edit-user-profile.component";
import { ReportsComponent } from "./reports/reports.component";
import { UsersComponent } from "./users/users.component";

const routes: Routes = [
  {
    path: "",
    component: UsersComponent,
    canActivate: [AdminGuard],
    data: {
      action: "ViewUsers",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "reports",
    component: ReportsComponent,
    canActivate: [AdminGuard],
    data: {
      action: "ViewUsers",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "committees",
    component: CreateCommitteesComponent,
    canActivate: [AdminGuard],
    data: {
      action: "ViewUsers",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "groups",
    component: CreateGroupsComponent,
    canActivate: [AdminGuard],
    data: {
      action: "ViewUsers",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "committees/edit/:id",
    component: CreateCommitteesComponent,
    canActivate: [AdminGuard],
    data: {
      action: "EditUserCommittees",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "groups/edit/:id",
    component: CreateGroupsComponent,
    canActivate: [AdminGuard],
    data: {
      action: "EditUserGroups",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "edit/:id",
    component: EditUserProfileComponent,
    canActivate: [AdminGuard],
    data: {
      action: "EditUserPersonalInformation",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersAdminRoutingModule {}
