import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AffidavitDetailComponent } from './AffidavitDetailComponent';
import { AffidavitSendComponent } from './AffidavitSendComponent';
import { AffidavitHistoryIconComponent } from './AffidavitHistoryIconComponent';


@Component({
	selector: 'app-emailicon',
	templateUrl: "../../../../../../../Views/Finance/Management/AffidavitIcon.html",

})
export class AffidavitIconComponent {
	data: any;
	numSent;
	config = new MatDialogConfig();
	showHistoryIcon: boolean=false;

	constructor(private dialog: MatDialog) {

	}
	ngOnInit() {
		
	}
	agInit(params) {
		this.data = params.data;
		//console.log(params)
		this.numSent = this.data.numSent;

		if(this.data.numSent>0 && this.data.lastAffidavitID)
			this.showHistoryIcon=true;
		else
			this.showHistoryIcon=false;
		
	};
	// /*============= itineraryHistory click on grid open popup =============*/

	affidavitHistoryIcon() {
		this.config.data = {
			salesId: this.data,
			title: "History"

		}
		let dialogRef = this.dialog.open(AffidavitHistoryIconComponent, this.config);
	};

	affidavitSearchIcon() {
		this.config.data = {
			salesId: this.data,
			title: "Search"

		}
		let dialogRef = this.dialog.open(AffidavitDetailComponent, this.config);
	};
	

}