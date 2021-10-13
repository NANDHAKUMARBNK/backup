import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgGridModule } from 'ag-grid-angular';
import { RMSSharedModule } from 'common/modules/RMSSharedModule';

import { AppComponent } from './app.component';

import { AgGridComponent } from 'common/components/AgGridComponent';

import { DialogService, DynamicDialogRef, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, DateAdapter, MAT_DATE_FORMATS, } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileModalComponent } from 'common/components/ProfileModalComponent';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ToastModule } from 'primeng/toast';
import { DocumentsNotesComponent } from 'common/components/DocumentImageNotesComponent';
import { RMSApiService } from 'common/services/RMSApiService';
import { DocModalComponent } from 'common/components/DocModalComponent';
import { NotesModalComponent } from 'common/components/NotesModal';
import { ConfirmStatusComponent } from 'common/components/ConfirmStatusComponent';
import { ErrorModalComponent } from 'common/components/ErrorModalComponent';
const MY_DATE_FORMATS = {
	parse: {
		dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
	},
	display: {
		// dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
		//dateInput: 'input',
		monthYearLabel: { year: 'numeric', month: 'short' },
		dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
		monthYearA11yLabel: { year: 'numeric', month: 'long' },
	}
};

@NgModule({
	declarations: [
		AppComponent,
		AgGridComponent,
        
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
	entryComponents: [ProfileModalComponent, DocModalComponent, NotesModalComponent, ConfirmStatusComponent, ErrorModalComponent],
	exports: [],
	bootstrap: [AppComponent]
})
export class OperationsModule { }
