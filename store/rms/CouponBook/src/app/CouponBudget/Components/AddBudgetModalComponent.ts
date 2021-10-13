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
import { RMSMomentDateAdapter } from 'common/adapter/RMSMomentDateAdapter';
declare var $: any;
import { default as _rollupMoment } from 'moment';
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
	selector: 'app-addbuget',
	templateUrl: '../../../../../../../Views/CouponBook/AddBudgetModal.html',
	styles: [],
	providers: [
		// `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
		// application's root module. We provide it at the component level here, due to limitations of
		// our example generation script.
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },CustomValidatorService
	],
})
export class AddBudgetModalComponent {
	appName = 'couponBook';
	addBudgetForm: FormGroup;
	minDate: any;
	dateval: any;
	date = new Date();
	today: any;
	//nameRegExwithspace = '^[a-zA-Z0-9_ ]*$'

	dateFormat = '^(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/\d{2}$'
	effectiveStart = new FormControl(moment());
	effectiveEnd = new FormControl(moment());
	endDate: any;
	endDateValue: any;

	constructor(private dialogRef: MatDialogRef<AddBudgetModalComponent>, @Inject(MAT_DIALOG_DATA) data, private router: Router, private couponBookService: CouponBookService,
		private toasterComponent: ToasterComponent,private customValidatorService:CustomValidatorService, private rMSApiService: RMSApiService,
		private sharedDataService: SharedDataService, private activeroute: ActivatedRoute, private fb: FormBuilder, private emitterService: EmitterService) {

	};

	ngOnInit() {
		this.formControlsSet();
	};

	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	


	formControlsSet() {
		this.addBudgetForm = this.fb.group({
			name: ['', [Validators.required, Validators.maxLength(60)]],
			effectiveStart: ['', Validators.required],
			effectiveEnd: ['', [Validators.required]],

		})
	};
	hasError(controlName: string, errorName: string) {
		return this.addBudgetForm.controls[controlName].hasError(errorName);
	}

	save() {
		if (this.addBudgetForm.invalid) {
			return;
		}
		const reqData = {
			name: this.addBudgetForm.get('name').value,
			effectiveStartDate: this.addBudgetForm.get('effectiveStart').value,
			effectiveEndDate: this.addBudgetForm.get('effectiveEnd').value,
		}
		this.rMSApiService.showLoader(true);
		this.couponBookService.savebudget(reqData).subscribe((data: any) => {
			this.dialogRef.close();
			this.emitterService.refreshbudgetProfile.emit(true);
			this.rMSApiService.showLoader(false);

		},
			error => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)
	}
	close() {
		this.dialogRef.close()
	}

	//Begin Date Change event capture
	dateChange() {
		if (moment(this.addBudgetForm.get('effectiveStart').value.isValid())) {
			this.minDate = moment(this.addBudgetForm.get('effectiveStart').value).add(1, 'days');
		}
	}

	enddateChange(event) {
		if (event) {
			this.endDateValue = moment(event).format('YYYY-MM-DDTHH:mm:ss');
		}

	}
	validatedate(event) {

		this.customValidatorService.isDateMaxlengthForamt(event)

		// const allowedRegex = /[0-9\/]/g
	
		// if (!event.key.match(allowedRegex)) {

		// 	event.preventDefault()
		// } else {
		// 	let inputValue = this.addBudgetForm.get('effectiveStart').value
		// 	if (inputValue) {
				
		// 	}
		// }

	}

}