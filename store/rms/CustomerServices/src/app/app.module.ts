import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, DateAdapter, MAT_DATE_FORMATS, } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs'
import { AgGridModule } from 'ag-grid-angular'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RMSSharedModule } from 'common/modules/RMSSharedModule';
import { ClaimListComponent } from './Components/ClaimListComponent';
import { ToastModule } from 'primeng/toast';
import { TabsComponent } from './Components/TabsComponent';
import { ClaimAddEitComponent } from './Components/ClaimAddEditComponent';
import { ClaimDetailComponent } from './Components/ClaimDetailComponent';
import { ClaimUpdateComponent } from './Components/ClaimUpdate';
import { ClaimUpdateModalComponent } from './Components/ClaimUpdateModalComponent';
import { ClaimDocumentComponent } from './Components/ClaimDocumentComponent';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { CustomLoadingCellRenderer } from './Components/CustomLoaderAgGrid';
import { ConfirmationModalComponent } from 'common/components/ConfirmationModal';

@NgModule({
  declarations: [
	  AppComponent,
	  ClaimListComponent,
	  TabsComponent,
	  ClaimAddEitComponent,
	  ClaimDetailComponent,
	  ClaimUpdateComponent,
	  ClaimUpdateModalComponent,
	  ClaimDocumentComponent,
	  CustomLoadingCellRenderer
  ],
  imports: [
    BrowserModule,
	  AppRoutingModule,
	  RMSSharedModule,
	  FlexLayoutModule,
	  AgGridModule.withComponents([CustomLoadingCellRenderer]),
	  DialogModule,
	  MatDialogModule,
	  MatDatepickerModule,
	  MatNativeDateModule,
	  MatFormFieldModule,
	  MatInputModule,
	  MatSelectModule,
      MatTabsModule,
	  FormsModule,
	  ReactiveFormsModule,
	  ToastModule,
	  FileUploadModule,
  ],
	providers: [MessageService],
	entryComponents: [ClaimUpdateModalComponent, ConfirmationModalComponent
],
  bootstrap: [AppComponent]
})
export class AppModule { }
