import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RMSSharedModule } from 'common/modules/RMSSharedModule';
import { DocModalComponent } from 'common/components/DocModalComponent';
import { NotesModalComponent } from 'common/components/NotesModal';
import { DialogService, DynamicDialogRef, MessageService } from 'primeng/components/common/api';
import { MatDialogConfig, MatDatepickerModule, MatCheckboxModule, MatRadioModule, MatNativeDateModule } from '@angular/material';
import { ToastModule } from 'primeng/toast';
import { NumericEditorComponent} from 'common/components/NumericEditorComponent'
import { ConfirmationModalComponent } from 'common/components/ConfirmationModal';

@NgModule({
	declarations: [
		AppComponent,
		NumericEditorComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		RMSSharedModule,
		ToastModule,
		MatCheckboxModule,
		MatRadioModule,
		MatDatepickerModule,
		MatNativeDateModule,
	],

	providers: [DialogService, DynamicDialogRef, MatDialogConfig, MatDatepickerModule, MessageService],
	entryComponents: [NotesModalComponent, DocModalComponent, ConfirmationModalComponent, NumericEditorComponent],
	bootstrap: [AppComponent]
})
export class AppModule { }
