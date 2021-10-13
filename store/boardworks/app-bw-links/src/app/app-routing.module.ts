import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinksGuard } from 'lib-bw-svc-apis/src/lib/linksGuard/links.guard';
import { CreateNewFolderComponent } from './links/create-new-folder/create-new-folder.component';
import { CreateNewLinksComponent } from './links/create-new-links/create-new-links.component';
import { LinksTabComponent } from './links/links-tab/links-tab.component';

const routes: Routes = [
  {
    path: '', component: LinksTabComponent,
    canActivate: [LinksGuard],
    data: { action: 'ViewLinks', permission: 'Allow' },
  },
  {
    path: "folder/:id/:lastFolder/:name", component: LinksTabComponent,
    canActivate: [LinksGuard],
    data: { action: 'ViewLinks', permission: 'Allow' },

  },
  {
    path: 'createFolder', component: CreateNewFolderComponent,
    canActivate: [LinksGuard],
    data: { action: 'AddFolder', permission: 'Allow' },

  },
  {
    path: 'createLink/:tab', component: CreateNewLinksComponent,
    canActivate: [LinksGuard],
    data: { action: 'AddItem', permission: 'Allow' },
  },
  {
    path: 'createInsideFloder/:id/:name', component: CreateNewFolderComponent,
    canActivate: [LinksGuard],
    data: { action: 'AddFolder', permission: 'Allow' },
  },
  {
    path: 'createInsideLink/:id/:name', component: CreateNewLinksComponent,
    canActivate: [LinksGuard],
    data: { action: 'AddItem', permission: 'Allow' },
  },
  {
    path: 'editFloder/:id/:page', component: CreateNewFolderComponent,
    canActivate: [LinksGuard],
    data: { action: 'EditFolder', permission: 'Allow' },
  },
  {
    path: 'editLink/:id/:page', component: CreateNewLinksComponent,
    canActivate: [LinksGuard],
    data: { action: 'EditItem', permission: 'Allow' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
