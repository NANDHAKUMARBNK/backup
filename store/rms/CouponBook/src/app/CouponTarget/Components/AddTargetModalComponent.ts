import { Component, OnDestroy, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { error } from 'selenium-webdriver';
import { EmitterService } from 'common/services/emitterService';
import { CouponBookService } from '../../Service/CouponBookService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { RMSApiService } from 'common/services/RMSApiService';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { RMSMomentDateAdapter } from 'common/adapter/RMSMomentDateAdapter';
import { CustomValidatorService } from 'common/CustomValidation/CustomValidatorService';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
	parse: {
		dateInput: 'MM/DD/YY',
	},
	display: {
		dateInput: 'MM/DD/YY',
		monthYearLabel: 'MMM YYYY'
	},
};


@Component({
	selector: 'app-addtarget',
	templateUrl: '../../../../../../../Views/CouponBook/AddTargetModal.html',
	styles: [],
	providers: [
		// `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
		// application's root module. We provide it at the component level here, due to limitations of
		// our example generation script.
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, CustomValidatorService
	],
})
export class AddTargetModalComponent {
	appName = 'couponBook';
	addTargetForm: FormGroup;
	minDate: any;
	dateval: any;
	date = new Date();
	today: any;
	effectiveStart = new FormControl(moment());
	effectiveEnd = new FormControl(moment());
	//nameRegExwithspace = '^[a-zA-Z0-9_ ]*$'

	constructor(private dialogRef: MatDialogRef<AddTargetModalComponent>, @Inject(MAT_DIALOG_DATA) data, private router: Router, private couponBookService: CouponBookService,
		private toasterComponent: ToasterComponent, private rMSApiService: RMSApiService, private customValidatorService: CustomValidatorService,
		private sharedDataService: SharedDataService, private activeroute: ActivatedRoute, private fb: FormBuilder, private emitterService: EmitterService) {

	}
	ngOnInit() {
		this.formControlsSet();
	};

	formControlsSet() {
		this.addTargetForm = this.fb.group({
			name: ['', [Validators.required, Validators.maxLength(60)]],
			effectiveStart: ['', Validators.required],
			effectiveEnd: ['', Validators.required],

		})
	};
	hasError(controlName: string, errorName: string) {
		return this.addTargetForm.controls[controlName].hasError(errorName);
	}
	dateChange() {
		if (moment(this.addTargetForm.get('effectiveStart').value.isValid())) {
			this.minDate = moment(this.addTargetForm.get('effectiveStart').value).add(1, 'days');
		}
	}

	save() {
		if (this.addTargetForm.invalid) {
			return;
		}
		const reqData = {
			name: this.addTargetForm.get('name').value,
			effectiveStartDate: this.addTargetForm.get('effectiveStart').value,
			effectiveEndDate: this.addTargetForm.get('effectiveEnd').value,
		};
		this.rMSApiService.showLoader(true);
		this.couponBookService.saveTarget(reqData).subscribe((data: any) => {
			this.rMSApiService.showLoader(false);
			this.dialogRef.close();
			this.emitterService.refreshtargetProfile.emit(true);
		},
			error => {
				this.rMSApiService.showLoader(false);

			}
		)
	};

	close() {
		this.dialogRef.close()
	}
	//Begin Date Change event capture
	// dateChange(event) {
	// 	this.minDate =  moment(event).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
	// 	//this.today = this.date;

	// }
	validatedate(event) {

		this.customValidatorService.isDateMaxlengthForamt(event)

	}
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
}