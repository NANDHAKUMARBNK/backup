import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ProfileGuard } from 'lib-bw-svc-apis/src/lib/profileGuard/profile.guard';

const routes: Routes = [
  {
    path: '', component: ProfileComponent,
    canActivate: [ProfileGuard],
    data: { action: 'ViewProfiles', otherAction: 'ViewEditOwnProfile', permission: 'Allow', permissionPrivate: "AllowPrivate" },
  },

  {
    path: 'view/:id', component: ViewProfileComponent,
    canActivate: [ProfileGuard],
    data: { action: 'EditOtherProfiles', otherAction: 'ViewEditOwnProfile', permission: 'Allow', permissionPrivate: "AllowPrivate" },
  },

  {
    path: 'edit/:id', component: EditProfileComponent,
    canActivate: [ProfileGuard],
    data: { action: 'ViewEditOwnProfile', otherAction: 'EditOtherProfiles', permission: 'Allow', permissionPrivate: "AllowPrivate" },
  },

  // {
  //   path: 'view/:page', component: ViewProfileComponent,
  //   canActivate: [ProfileGuard],
  //   data: { action: 'ViewEditOwnProfile', otherAction: 'EditOtherProfiles', permission: 'Allow', permissionPrivate: "AllowPrivate" },
  // },
  // {
  //   path: 'edit/:page', component: EditProfileComponent,
  //   canActivate: [ProfileGuard],
  //   data: { action: 'ViewEditOwnProfile', otherAction: 'ViewEditOwnProfile', permission: 'Allow', permissionPrivate: "AllowPrivate" },
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
