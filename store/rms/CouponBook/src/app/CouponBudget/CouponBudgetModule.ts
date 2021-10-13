import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../common/SharedModule'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { DocumentsNotesComponent } from 'common/components/DocumentImageNotesComponent';
import { AgGridModule } from 'ag-grid-angular';
import { DialogService, DynamicDialogRef } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, } from "@angular/material";
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CouponBudgetRoutingModule } from './CouponBudgetRouting';
import { BudgetListComponent } from './Components/BudgetListComponent';
import { AddBudgetModalComponent } from './Components/AddBudgetModalComponent';
import { UplaodComponent } from './Components/UploadBudgetComponent';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
	declarations: [
		BudgetListComponent,
		AddBudgetModalComponent,
		UplaodComponent
		
		//DocumentsNotesComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		CouponBudgetRoutingModule,
		AgGridModule,
		FlexLayoutModule,
		DialogModule,
		MatDialogModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatButtonToggleModule,
		MatIconModule,
		FormsModule,
		ReactiveFormsModule,
		ToastModule,
		FileUploadModule

	],
	entryComponents: [AddBudgetModalComponent],
	providers: [MatDatepickerModule],
	exports: [RouterModule,],
	bootstrap: []
})
export class CouponBudgetModule { }
