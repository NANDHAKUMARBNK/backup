import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../common/SharedModule'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

import { AgGridModule } from 'ag-grid-angular';


import { DialogService, DynamicDialogRef } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PortListComponent } from './Components/PortListComponent';

import { PortRoutingModule } from './PortRouting';
import { PortGridComponent } from './Components/PortGridComponent';
import { PortProfileComponent } from './Components/PortProfileComponent';
import { ProfileComponent } from './Components/ProfileCompent';
import { ToasterComponent } from 'common/components/ToasterComponent';


@NgModule({
	declarations: [
		PortListComponent,
		PortProfileComponent,
		ProfileComponent,
		PortGridComponent,
	],
	imports: [
		CommonModule,
		SharedModule,
		PortRoutingModule,
		AgGridModule,
		FlexLayoutModule,
		DialogModule,
		MatDialogModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatCheckboxModule,
		FormsModule,
		ReactiveFormsModule,
		ToastModule
	],
	entryComponents: [],
	providers: [ToasterComponent],
	exports: [RouterModule],
	bootstrap: []
})
export class PortModule { }
