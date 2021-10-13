import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { RMSSharedModule } from 'common/modules/RMSSharedModule';
import { ToastModule } from 'primeng/toast';
import { ReportTreeComponent } from './Components/ReportTreeComponent';
import { MessageService} from 'primeng/api';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgGridModule } from 'ag-grid-angular';
import { TreeModule } from 'primeng/tree';

import { AppComponent } from './app.component';
import { ReportProfileComponent } from './Components/ReportProfileComponent';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatDatepickerModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatNativeDateModule, MatCheckboxModule, MatLabel, MatOptionModule, MatRadioModule,MatIconModule} from '@angular/material';


@NgModule({
	declarations: [
		AppComponent,
		ReportTreeComponent,
		ReportProfileComponent,
	
	],
	imports: [
		BrowserModule,
		TreeModule,
		AppRoutingModule,
		RMSSharedModule,
		FlexLayoutModule,
		AgGridModule,
		TreeModule,
		ReactiveFormsModule,
		FormsModule,
		MatDialogModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatIconModule,
		MatRadioModule
	],
	providers: [MessageService],
	bootstrap: [AppComponent]
})
export class AppModule { }
