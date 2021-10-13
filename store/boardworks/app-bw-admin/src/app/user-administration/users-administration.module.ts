import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UsersAdminRoutingModule } from "./users-administration-routing.module";
import { LibBwUiCompCoreModule } from "lib-bw-ui-comp-core/src/lib/lib-bw-ui-comp-core.module";
import { UsersComponent } from "./users/users.component";
import { CreateCommitteesComponent } from "./create-committees/create-committees.component";
import { CreateGroupsComponent } from "./create-groups/create-groups.component";
import { ReportsComponent } from './reports/reports.component';
import { EditUserProfileComponent } from './edit-user-profile/edit-user-profile.component';

@NgModule({
  declarations: [
    UsersComponent,
    CreateCommitteesComponent,
    CreateGroupsComponent,
    ReportsComponent,
    EditUserProfileComponent,
  ],
  imports: [CommonModule, UsersAdminRoutingModule, LibBwUiCompCoreModule],
})
export class UsersAdminModule {}
