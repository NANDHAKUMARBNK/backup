
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
//import { PsgService } from '../../Service/PsgService'
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog, } from "@angular/material";

//import { Location } from '@angular/common';

@Component({
	selector: 'app-ratepercentage',
	templateUrl: '../../../../../../../Views/Finance/RatePercentage.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss']
})
export class RatePercentageComponent {
	minfee = new FormControl('');
	amount = new FormControl('');
	rateSummary = new FormControl('');

	constructor(private http: HttpClient, private route: ActivatedRoute,
		private fb: FormBuilder, private router: Router, private dialog: MatDialog,
		//private service: PsgService,
		private sharedDataService: SharedDataService,
		private emitterService: EmitterService,
	) {

	}

	ngOnInit() {



	};

	/*====== change event flatfree bind the data in summary =======*/


	amountChange(event) {
		this.rateSummary.patchValue(event.target.value)
	};


	validateMoneyFormat(event) {
	
		var t = event.target.value;
		event.target.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
	}

	isNumber(evt) {
		var iKeyCode = (evt.which) ? evt.which : evt.keyCode
		if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
			return false;

		return true;
	}


}


