import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LibBwUiCompCoreModule } from "lib-bw-ui-comp-core/src/lib/lib-bw-ui-comp-core.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CorporateInfoComponent } from "./corporate-info/corporate-info.component";
import { ViewWorkflowComponent } from "./view-workflow/view-workflow.component";
import { NewFolderComponent } from "./new-folder/new-folder.component";
import { SubFolderComponent } from './sub-folder/sub-folder.component';
import { SignatureRequestsComponent } from './signature-requests/signature-requests.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { CreateSignatureRequestComponent } from './signature-requests/create-signature-request/create-signature-request.component';

@NgModule({
  declarations: [
    AppComponent,
    CorporateInfoComponent,
    NewFolderComponent,
    ViewWorkflowComponent,
    SignatureRequestsComponent,
    UploadDocumentComponent,
    SubFolderComponent,
    CreateSignatureRequestComponent
  ],
  imports: [AppRoutingModule, LibBwUiCompCoreModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
