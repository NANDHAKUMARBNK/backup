import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RMSSharedModule } from 'common/modules/RMSSharedModule';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { DialogService, DynamicDialogRef, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogConfig, } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgGridModule } from 'ag-grid-angular';
import { NotesModalComponent } from 'common/components/NotesModal';
import { DocModalComponent } from 'common/components/DocModalComponent';
import { ErrorModalComponent } from 'common/components/ErrorModalComponent';
import { ToastModule } from 'primeng/toast';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { NumericEditorComponent} from 'common/components/NumericEditorComponent'
import { ConfirmationModalComponent } from 'common/components/ConfirmationModal';


@NgModule({
	declarations: [
		AppComponent,
		NumericEditorComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		RMSSharedModule,
		FlexLayoutModule,
		AgGridModule,
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
	providers: [DialogService, DynamicDialogRef, MatDialogConfig, MatDatepickerModule, MessageService],
	exports: [],
	entryComponents: [NotesModalComponent, DocModalComponent, ErrorModalComponent, ConfirmationModalComponent,
		NumericEditorComponent
	],

	bootstrap: [AppComponent]
})
export class AppModule { }
