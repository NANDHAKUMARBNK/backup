import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LibBwUiCompCoreModule } from "lib-bw-ui-comp-core/src/public-api";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertsHomeComponent } from './alerts-home/alerts-home.component';
import { PublishedListComponent } from './published-list/published-list.component';
import { TemplatesListComponent } from './templates-list/templates-list.component';
import { UnpublishedListComponent } from './unpublished-list/unpublished-list.component';
import { CreateAlertTemplateComponent } from './create-alert-template/create-alert-template.component';
import { NewAlertComponent } from "./new-alert/new-alert.component";
import { ViewAlertComponent } from './view-alert/view-alert.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertsHomeComponent,
    PublishedListComponent,
    TemplatesListComponent,
    UnpublishedListComponent,
    CreateAlertTemplateComponent,
    NewAlertComponent,
    ViewAlertComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    LibBwUiCompCoreModule
  ],
  exports: [NewAlertComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
