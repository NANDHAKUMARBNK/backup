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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CouponSalesRoutingModule } from './CouponSalesRouting';
import { CouponSalesComponent } from './Components/CouponSalesComponent';
import { CouponSalesEntryComponent } from './Components/CouponSalesEntryComponent';

@NgModule({
	declarations: [
	   CouponSalesComponent,
	   CouponSalesEntryComponent
	],
	imports: [
		CommonModule,
        SharedModule,
        CouponSalesRoutingModule,
		AgGridModule,
		FlexLayoutModule,
		DialogModule,
		MatDialogModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		FormsModule,
		ReactiveFormsModule,
		ToastModule

	],
	entryComponents: [CouponSalesEntryComponent],
	exports: [RouterModule,],
	bootstrap: []
})
export class CouponSalesModule { }
