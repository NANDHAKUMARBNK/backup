import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LibBwUiCompCoreModule } from 'lib-bw-ui-comp-core/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewCollaborationComponent } from './view-collaboration/view-collaboration.component';
import { AddWorkSpaceComponent } from './add-work-space/add-work-space.component';
import { AddDocumentComponent } from './add-document/add-document.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewCollaborationComponent,
    AddWorkSpaceComponent,
    AddDocumentComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    LibBwUiCompCoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
