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
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogConfig, MatCheckboxModule, MatRadioModule } from "@angular/material";
import {MatExpansionModule} from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FileUploadModule } from 'primeng/primeng';
import { ViewActivityRoutingModule } from './ViewActivityRouting';
import { AccountSummaryComponent } from './Components/AccountSummaryComponent';
import { ViewActivityTabComponent } from './Components/ViewActivityComponentTab';
import { AccountDetailComponent } from './Components/AccountDetailComponent';
import { AccountHistoryComponent } from './Components/AccountHistoryComponent';
import { AccountStatementComponent } from './Components/AccountStatementComponent';
import { AccountNotesComponent } from './Components/AccountNotesComponent';

@NgModule({
	declarations: [
		AccountSummaryComponent,
		ViewActivityTabComponent,
		AccountDetailComponent,
		AccountHistoryComponent,
		AccountStatementComponent,
		AccountNotesComponent
   ],
    imports: [
		CommonModule,
		SharedModule,
        ViewActivityRoutingModule,
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
    providers:[RouterModule,MatExpansionModule],
    entryComponents: [],
    exports:[RouterModule,MatExpansionModule]
})
export class ViewActivityModule { }
