import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { HistoryResendComponent } from './HistoryResendComponent';



@Component({
	selector: 'app-historyresendicon',
	templateUrl: "../../../../../../../Views/Finance/Management/HistoryResendIcon.html",

})
export class HistoryResendIconComponent {
	data: any;
	config = new MatDialogConfig();

	constructor(private dialog: MatDialog) {

	}

	agInit(params) {
		this.data = params.data;

	};
	historyResend() {
		this.config.data = this.data
		let dialogRef = this.dialog.open(HistoryResendComponent, this.config);
	}



}