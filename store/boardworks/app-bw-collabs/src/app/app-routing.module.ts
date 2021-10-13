import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollaborationGuard } from 'lib-bw-svc-apis/src/lib/collaborationGuard/collaboration.guard';
import { AddDocumentComponent } from './add-document/add-document.component';
import { AddWorkSpaceComponent } from './add-work-space/add-work-space.component';
import { ViewCollaborationComponent } from './view-collaboration/view-collaboration.component';

const routes: Routes = [
  {
    path:'',
    component:ViewCollaborationComponent,
    canActivate: [CollaborationGuard],
    data: { action: 'ViewCollaboration', permission: 'Allow' , allowPrivate:'AllowPrivate'},
  },
  {
    path:'addWorkSpace',
    component:AddWorkSpaceComponent,
    canActivate: [CollaborationGuard],
    data: { action: 'AddWorkspace', permission: 'Allow', allowPrivate:'AllowPrivate' },

  },
  {
    path:'addDocument/:id',
    component:AddDocumentComponent,
    canActivate: [CollaborationGuard],
    data: { action: 'AddEditDeleteDocument', permission: 'Allow',allowPrivate:'AllowPrivate' },
  },
  {
    path:'editWorkSpace/:id',
    component:AddWorkSpaceComponent,
    canActivate: [CollaborationGuard],
    data: { action: 'AddWorkspace', permission: 'Allow', allowPrivate:'AllowPrivate' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
