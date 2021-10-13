import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LibBwUiCompCoreModule } from 'lib-bw-ui-comp-core/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateNewFolderComponent } from './links/create-new-folder/create-new-folder.component';
import { CreateNewLinksComponent } from './links/create-new-links/create-new-links.component';
import { LinksFloderComponent } from './links/links-floder/links-floder.component';
import { LinksTabComponent } from './links/links-tab/links-tab.component';
import { LinksComponent } from './links/links/links.component';

@NgModule({
  declarations: [
    AppComponent,
    LinksFloderComponent,
    LinksComponent,
    CreateNewLinksComponent,
    CreateNewFolderComponent,
    LinksTabComponent
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
