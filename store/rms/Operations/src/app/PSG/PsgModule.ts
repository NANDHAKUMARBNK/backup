import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../common/SharedModule'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

import { PsgListComponent } from './Components/PsgListComponent';
import { PsgProfileComponent } from './Components/PsgProfileComponent';
import { ProfileComponent } from './Components/ProfileComponent';
import { ShipAssigmentGridComponent } from './Components/ShipAssigmentGridComponent';
import { ShipAssignmentComponent } from './Components/ShipAssignment';
import { DocumentsNotesComponent } from 'common/components/DocumentImageNotesComponent';
import { AgGridModule } from 'ag-grid-angular';


import { DialogService, DynamicDialogRef } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PsgRoutingModule } from './PsgRouting';


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
		PsgListComponent,
		PsgProfileComponent,
		ProfileComponent,
		ShipAssigmentGridComponent,
		ShipAssignmentComponent,
		//DocumentsNotesComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		PsgRoutingModule,
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
	entryComponents: [],
	exports: [RouterModule,],
	bootstrap: []
})
export class PSGModule { }
