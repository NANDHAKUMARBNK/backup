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
import { ShipListComponent } from './Components/ShipListComponent';
import { ShipProfileComponent } from './Components/ShipProfileComponent';
import { ProfileDetailComponent, CustomDateFormat2, CustomDateFormat1 } from './Components/ProfileDetailcomponent';
import { ShipRoutingModule } from './ShipRouting';
import { ToasterComponent } from 'common/components/ToasterComponent';


@NgModule({
	declarations: [
		ShipListComponent,
		ShipProfileComponent,
		ProfileDetailComponent,
		CustomDateFormat2,
		CustomDateFormat1
		
	],
	imports: [
		CommonModule,
		SharedModule,
		ShipRoutingModule,
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
	providers: [ToasterComponent],
	exports: [RouterModule,],
	bootstrap: []
})
export class ShipModule { }
