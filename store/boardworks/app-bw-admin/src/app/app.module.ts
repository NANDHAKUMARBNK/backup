import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { LibBwUiCompCoreModule } from 'lib-bw-ui-comp-core/src/public-api';
import { CommonModule } from '@angular/common';
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NotificationModule, NotificationService } from '@progress/kendo-angular-notification';
import { IconsModule } from '@progress/kendo-angular-icons';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ToastrService } from 'lib-bw-svc-apis/src/lib/bw-toastr/toastr.service';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

@NgModule({
  declarations: [
    AppComponent,
    AdminHomeComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    DialogsModule,
    LibBwUiCompCoreModule,
    LibBwUiCompCoreModule,
    GridModule,
    InputsModule,
    DropDownsModule,
    NotificationModule,
    IconsModule,
    LayoutModule,
    PDFModule,
    ExcelModule,
    PDFExportModule
  ],
  providers: [
    NotificationService,
    ToastrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
