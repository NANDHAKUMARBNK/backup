import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../common/SharedModule'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AgGridModule } from 'ag-grid-angular';
import { DialogService, DynamicDialogRef } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CruiseLineComponent } from './Components/CruiseLineComponent';
import { CruiseLineProfileComponent } from './Components/CruiseLineProfileComponent';
import { ProfileComponent } from './Components/profileComponent';
import { CruiseLineGridComponent } from './Components/CruiseLineGridComponent';
import { AddFeeComponent } from './Components/AddFeeComponent';
import { CruiseLineRoutingModule } from './CruiseLineRouting';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { CustomNumericComponent } from 'common/components/CustomNumeric';

@NgModule({
	declarations: [
		CruiseLineComponent,
		CruiseLineProfileComponent,
		ProfileComponent,
		CruiseLineGridComponent,
		AddFeeComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		CruiseLineRoutingModule,
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
	entryComponents: [AddFeeComponent],
	providers:[],
	exports: [RouterModule,AddFeeComponent],
	bootstrap: []
})
export class CruiseModule { }
