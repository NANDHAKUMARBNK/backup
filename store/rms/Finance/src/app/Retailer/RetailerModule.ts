import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../common/SharedModule'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { DocumentsNotesComponent } from 'common/components/DocumentImageNotesComponent';
import { AgGridModule } from 'ag-grid-angular';
import { DialogService, DynamicDialogRef, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogConfig, MatCheckboxModule, MatRadioModule, MatDatepicker } from "@angular/material";
import {MatExpansionModule} from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RetailerRoutingModule } from './RetailerRouting';
import { RetailerListComponent } from './Components/RetailerListComponent';
import { RetailerProfileComponent } from './Components/RetailerProfileComponent';
import { RetailerGridComponent } from './Components/RetailerGridComponent';
import { RetailerContractComponent } from './Components/RetailerContractComponent';
import { ContractProfileComponent } from './Components/ContractProfilecomponent';
import { ContractGridComponent } from './Components/ContractGridComponent';
import { ApplyChildrenModalComponent } from './Components/ApplyChildrenModalComponent';
import { ContractRateFlatComponent } from './Components/ContractRateFlatComponent';
import { ContractIncrementalComponent } from './Components/RetailerContractIncrementalComponent';
import { RatePercentageComponent } from './Components/RatePercentageComponent';
import { FileUploadModule } from 'primeng/primeng';
import { CheckBoxChildrenComponent } from './Components/contractChildrenCheckboxComponent';
import { ContractRateRootComponent } from './Components/ContarctRatesRootComponent';
import { RatesGridCheckboxComponent } from './Components/RatesGridCheckboxComponent';

@NgModule({
	declarations: [
		RetailerListComponent,
		RetailerProfileComponent,
		RetailerGridComponent,
		RetailerContractComponent,
		ContractProfileComponent,
		ContractGridComponent,
		ApplyChildrenModalComponent,
		ContractRateFlatComponent,
		ContractIncrementalComponent,
		RatePercentageComponent,
		CheckBoxChildrenComponent,
		ContractRateRootComponent,
		RatesGridCheckboxComponent
		
	],
	imports: [
		CommonModule,
		SharedModule,
        RetailerRoutingModule,
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
		MatCheckboxModule,
		MatRadioModule,
		ReactiveFormsModule,
		ToastModule,
		MatExpansionModule,
		FileUploadModule,
	],
	providers: [DialogService, DynamicDialogRef, MatDialogConfig, MatDatepickerModule, MessageService, MatDatepicker],
	entryComponents: [ApplyChildrenModalComponent, CheckBoxChildrenComponent, RatesGridCheckboxComponent],
	exports: [RouterModule,MatExpansionModule],
	bootstrap: []
})
export class RetailerModule { }
