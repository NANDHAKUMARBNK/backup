import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RmmComponent } from './Components/RmmComponent';
import { CustomCellComponent } from './Components/CustomCellDropdown';
import { SharedModule } from 'primeng/components/common/shared';

const routes: Routes = [
	{ path: '', component: RmmComponent }
];

@NgModule({
	declarations: [
		RmmComponent,
        CustomCellComponent
	],
	imports: [
		CommonModule,
		SharedModule,
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
		RouterModule.forChild(routes)
		

	],
	entryComponents: [CustomCellComponent],
	exports: [RouterModule],
	bootstrap: []
})
export class RMMModule { }
