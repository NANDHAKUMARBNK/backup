import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../common/SharedModule'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { DocumentsNotesComponent } from 'common/components/DocumentImageNotesComponent';
import { AgGridModule } from 'ag-grid-angular';
import { DialogService, DynamicDialogRef, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogConfig, MatCheckboxModule, MatRadioModule } from "@angular/material";
import {MatExpansionModule} from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FileUploadModule } from 'primeng/primeng';
import { ManagementRoutingModule } from './ManagementRouting';
import { AffidavitComponent } from './Components/AffidavitComponent';
import { AffidavitIconComponent } from './Components/AffidavitIconComponent';
import { AffidavitTabComponent } from './Components/AffidavitTabComponent';
import { ManagementSalesComponent } from './Components/SalesComponent';
import { AffidavitDetailComponent } from './Components/AffidavitDetailComponent';
import { AffidavitSendComponent } from './Components/AffidavitSendComponent';
import { SalesHistoryComponent } from './Components/SalesHistoryComponent';
import { SalesHistoryIconComponent } from './Components/HistoryIconComponent';
import { SalesCommentIconComponent } from './Components/SalesCommentIcon';
import { SalesCommentComponent } from './Components/SalesCommentComponent';
import { SalesInvoiceComponent } from './Components/SalesInvoiceComponent';
import { SalesPreviewIconComponent } from './Components/SalesPreviewIconComponent';
import { ManagementHistoryComponent } from './Components/ManagementHistoryComponent';
import { HistoryResendIconComponent } from './Components/HistoryResendIconComponent';
import { HistoryViewIconComponent } from './Components/HistoryViewIconComponent';
import { HistoryResendComponent } from './Components/HistoryResendComponent';
import { AffidavitViewIconComponent } from './Components/AffidavitViewIconComponent';
import { SalesSelectComponent } from './Components/SalesSelectComponent';
import { ManagementSalesV2Component } from './Components/SalesComponentV2';
import { SaelsInputEditorComponent } from './Components/salesInputComponet';
import { AffidavitHistoryIconComponent } from './Components/AffidavitHistoryIconComponent';




@NgModule({
	declarations: [
		AffidavitComponent,
		AffidavitViewIconComponent,
        AffidavitIconComponent,
		AffidavitTabComponent,
		ManagementSalesV2Component,
		ManagementSalesComponent,
		AffidavitDetailComponent,
		AffidavitHistoryIconComponent,
		AffidavitSendComponent,
		SalesHistoryIconComponent,
		SalesHistoryComponent,
		SalesCommentIconComponent,
		SalesCommentComponent,
		SalesPreviewIconComponent,
		SalesInvoiceComponent,
		ManagementHistoryComponent,
		HistoryResendIconComponent,
		HistoryViewIconComponent,
		HistoryResendComponent,
		SalesSelectComponent,
		SaelsInputEditorComponent
	
	],
	imports: [
		CommonModule,
		SharedModule,
        ManagementRoutingModule,
		AgGridModule.withComponents([]),
		FlexLayoutModule,
		DialogModule,
		MatDialogModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		FormsModule,
		MatCheckboxModule,
		MatRadioModule,
		ReactiveFormsModule,
		ToastModule,
		MatExpansionModule,
		FileUploadModule,
	],
	providers: [DialogService,DynamicDialogRef, MatDialogConfig, MatDatepickerModule, MessageService,AffidavitTabComponent,AffidavitComponent],
	entryComponents: [AffidavitIconComponent,AffidavitViewIconComponent,AffidavitDetailComponent,AffidavitHistoryIconComponent,AffidavitSendComponent,SalesHistoryIconComponent,SalesHistoryComponent,
		SalesCommentIconComponent, SalesCommentComponent, SalesPreviewIconComponent, HistoryResendIconComponent, HistoryViewIconComponent, HistoryResendComponent, SalesSelectComponent,SaelsInputEditorComponent],
	exports: [RouterModule,MatExpansionModule],
	bootstrap: []
})
export class ManagementModule { }
