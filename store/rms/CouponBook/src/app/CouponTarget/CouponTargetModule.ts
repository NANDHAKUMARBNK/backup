import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../common/SharedModule'
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AgGridModule } from 'ag-grid-angular';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonToggleModule, } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CouponTargetRoutingModule } from './CouponTargetRouting';
import { TargetListComponent } from './Components/CouponTargetList';
import { UplaodTargetComponent } from './Components/UploadTargetComponent';
import { AddTargetModalComponent } from './Components/AddTargetModalComponent';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
	declarations: [
		TargetListComponent,
		UplaodTargetComponent,
		AddTargetModalComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		CouponTargetRoutingModule,
		AgGridModule,
		FlexLayoutModule,
		DialogModule,
		MatDialogModule,
        MatDatepickerModule,
		MatButtonToggleModule,
		MatButtonToggleModule,
		MatNativeDateModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		FormsModule,
		ReactiveFormsModule,
		ToastModule,
		FileUploadModule

	],
	entryComponents: [AddTargetModalComponent],
	providers: [MatDatepickerModule],
	exports: [RouterModule],
	bootstrap: []
})
export class CouponTargetModule { }
