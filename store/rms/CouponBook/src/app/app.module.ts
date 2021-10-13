import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RMSSharedModule } from 'common/modules/RMSSharedModule';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgGridModule } from 'ag-grid-angular';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { DialogService, DynamicDialogRef, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, DateAdapter, MAT_DATE_FORMATS, } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { NumericEditorComponent} from 'common/components/NumericEditorComponent'

@NgModule({
  declarations: [
	AppComponent,
	NumericEditorComponent
  ],
  imports: [
	  BrowserModule,
	  AppRoutingModule,
	  FlexLayoutModule,
	  AgGridModule,
	  RMSSharedModule,
	  DialogModule,
	  MatDialogModule,
	  MatDatepickerModule,
	  MatNativeDateModule,
	  MatFormFieldModule,
	  MatInputModule,
	  MatSelectModule,
	  FormsModule,
	  ReactiveFormsModule,
	  ToastModule,
	  
  ],
	providers: [DialogService, DynamicDialogRef, MatDialogConfig, MatDatepickerModule, MessageService],
	entryComponents: [
		NumericEditorComponent
	],
 	bootstrap: [AppComponent],
  
})
export class CouponBooksModule { }
