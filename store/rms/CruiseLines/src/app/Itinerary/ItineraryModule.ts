import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';

import { AgGridModule } from 'ag-grid-angular';
import { DialogService, DynamicDialogRef } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'common/SharedModule';
import { RouterModule } from '@angular/router';
import { ItineraryRoutingModule } from './ItineraryRouting';
import { ItineraryWagesComponent } from './Components/ItineraryWagesComponent';
import { ItineraryHistoryComponent } from './Components/ItineraryHistoryComponent';
import { HistoryIconComponent } from './Components/HistoryIconComponent';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { IntineraryEditorComponent } from './Components/intineraryinputComponent';

@NgModule({
	declarations: [
		ItineraryWagesComponent,
		ItineraryHistoryComponent,
		HistoryIconComponent,
		IntineraryEditorComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		ItineraryRoutingModule,
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
	entryComponents: [ItineraryHistoryComponent, HistoryIconComponent,IntineraryEditorComponent],
	providers: [ToasterComponent],
	exports: [RouterModule],
})
export class ItineraryModule { }
