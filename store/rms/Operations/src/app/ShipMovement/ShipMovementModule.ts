import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../common/SharedModule'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';

import { DialogService, DynamicDialogRef } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShipMovementComponent } from './Components/ShipMovement';
import { ShipMovementAissgnmentComponent } from './Components/ShipMovementAssignment';
import { ShipMovementRoutingModule } from './ShipMovementRouting';

@NgModule({
	declarations: [
		ShipMovementComponent,
		ShipMovementAissgnmentComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		ShipMovementRoutingModule,
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


	],
	exports: [RouterModule],
	bootstrap: []
})
export class ShipMovementModule { }
