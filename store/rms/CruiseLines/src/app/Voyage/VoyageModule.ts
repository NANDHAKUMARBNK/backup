import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'common/SharedModule';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

import { AgGridModule } from 'ag-grid-angular';

import { CalendarModule } from 'primeng/calendar';
import { DialogService, DynamicDialogRef } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VoyageListComponent } from './Components/VoyageListComponent';
import { VoyageRoutingModule } from './VoyageRouting';
import { VoyageProfileComponent } from './Components/VoyageProfilecomponent';
import { VoyageGridComponent } from './Components/VoyageGridComponent';
import { VoyageDetailComponent } from './Components/VoyageDetailComponent';
import { VoyageSequenceComponent } from './Components/VoyageSequenceComponent';
import { VoyageHistoryComponent } from './Components/VoyageHistoryComponent';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { VoyageCurdComponent } from './Components/VoyagesGridCurdComponent';
import { ItinerarySelectComponent } from './Components/ItinerarySelect';
import { ItineraryDateComponent } from './Components/ItineraryDate';
import { ItineraryArrivalComponent } from './Components/ItineraryArrival';
import { ItineraryDepatureComponent } from './Components/ItineraryDepature';


@NgModule({
	declarations: [
		VoyageListComponent,
		VoyageProfileComponent,
		VoyageDetailComponent,
		VoyageGridComponent,
		VoyageSequenceComponent,
		VoyageHistoryComponent,
		VoyageCurdComponent,
		ItinerarySelectComponent,
		ItineraryDateComponent,
		ItineraryArrivalComponent,
		ItineraryDepatureComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		VoyageRoutingModule,
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
		ToastModule,
		CalendarModule


	],
	entryComponents: [VoyageSequenceComponent, VoyageHistoryComponent, VoyageCurdComponent, ItinerarySelectComponent, ItineraryDateComponent, ItineraryArrivalComponent, ItineraryDepatureComponent],
	providers: [],
	exports: [RouterModule,],
	bootstrap: []
})
export class VoyageModule { }
