import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { LibBwUiCompCoreModule } from 'lib-bw-ui-comp-core/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewProfileComponent,
    ProfileComponent,
    EditProfileComponent
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
