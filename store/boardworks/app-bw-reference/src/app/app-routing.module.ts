import { CreateSignatureRequestComponent } from './signature-requests/create-signature-request/create-signature-request.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { NewFolderComponent } from './new-folder/new-folder.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CorporateInfoComponent } from "./corporate-info/corporate-info.component";
import { ViewWorkflowComponent } from "./view-workflow/view-workflow.component";
import { SubFolderComponent } from "./sub-folder/sub-folder.component";

const routes: Routes = [
  {
    path: "",
    component: CorporateInfoComponent,
    // canActivate: [CollaborationGuard],
    // data: { action: 'ViewCollaboration', permission: 'Allow' , allowPrivate:'AllowPrivate'},
  },
  { path: "view-workflow", component: ViewWorkflowComponent },
  { path: "newFolder", component: NewFolderComponent },
  { path: "uploadDoc", component: UploadDocumentComponent },
  { path: "subFolder", component: SubFolderComponent },
  { path: 'signatureRequest', component: CreateSignatureRequestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
