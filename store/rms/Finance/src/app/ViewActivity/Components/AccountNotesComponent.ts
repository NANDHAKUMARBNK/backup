import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { Router, ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { ViewActivityService } from '../Service/viewActivityService';
import { FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { RMSApiService } from 'common/services/RMSApiService';

import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { EmitterService } from 'common/services/emitterService';
import { CustomValidatorService } from 'common/CustomValidation/CustomValidatorService';
import { RMSMomentDateAdapter } from 'common/adapter/RMSMomentDateAdapter';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
	parse: {
		dateInput: 'MM/DD/YY',
	},
	display: {
		dateInput: 'MM/DD/YY',
		monthYearLabel: 'MMM YYYY'
	},
}

@Component({
	selector: 'app-accountnotes',
	templateUrl: "../../../../../../../Views/Finance/ViewActivity/AccountNotes.html",
	styleUrls: ['../../../../../../common/styles/commonApp.scss'],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },CustomValidatorService
	]

})

export class AccountNotesComponent {
	parameters: any;
	parentCustomer: any;
	accountNotesList: FormGroup;
	childCustomer: any;
	iframeUrl: any;
	iframeLoader: boolean = false;
	prmActionDateEndrquired: boolean = false;
	prmActionDateBeginrquired: boolean = false;
	Childrequired: boolean = false;
	Parentrequired: boolean = false;
	nullableRequired: any;
	minDate: any;
	showTextSearch: boolean = true;
	reporting_base_url: string;
	constructor(private http: HttpClient, private route: ActivatedRoute, private emitterService: EmitterService, private fb: FormBuilder, private rMSApiService: RMSApiService,
		private router: Router, private customValidatorService: CustomValidatorService,
		private viewActivityService: ViewActivityService) {
			this.reporting_base_url = this.rMSApiService.GetReportUrl();

	}

	ngOnInit() {
		this.accountNotesList = this.fb.group({
			prmCustomer_Parent: [''],
			prmCustomer_Child: [''],
			prmActionDateBegin: [''],
			prmActionDateEnd: ['']
		});

		let defUrl = `${this.reporting_base_url}/App/Default.aspx`;
		var elms = document.getElementById("iframe");
		elms.setAttribute("src", defUrl);

		// this.emitterService.cascaddingitems.subscribe(data => {
		// 	this.parameters = [];
		// 	this.getParametersSummary()
		// })
		this.setFormcontrols();
	};


	setFormcontrols() {
		let cascaddingParent = this.rMSApiService.getFinanceReportParentCustomer();
		let cascaddingChild = this.rMSApiService.getFinanceReportChildCustomer();
		if (cascaddingParent) {
			this.accountNotesList.patchValue({
				prmCustomer_Parent: cascaddingParent
			});
			//this.globalChange();
		};
		if (cascaddingChild) {
			this.accountNotesList.patchValue({
				prmCustomer_Child: cascaddingChild
			})
			//this.globalChange();
		};

		if(cascaddingParent||cascaddingChild){
			this.generatesrssReport();

		}else{
			this.getParametersSummary();

		}


	}


	getParametersSummary() {
		const reqData = {

		};
		this.rMSApiService.showLoader(true);
		this.viewActivityService.getParamtersNotes(reqData).subscribe((data: any) => {
			this.parameters = data.reportInfo.parameters;
			this.SettingDataParameters();
			//this.setFormcontrols()
			this.rMSApiService.showLoader(false);
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.rMSApiService.setData(error)
				this.router.navigate(['/Error'])
			}
		)
	};
	hasError(controlName: string, errorName: string) {
		return this.accountNotesList.controls[controlName].hasError(errorName);
	}
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	SettingDataParameters() {
		this.parameters.forEach((item) => {
			if (item.name == 'prmCustomer_Parent') {
				this.nullableRequired = item;
				if (this.nullableRequired.nullable == false) {
					this.Parentrequired = true
				} else {
					this.Parentrequired = false;
				}
				this.parentCustomer = item.validValues;
			} else if (item.name == 'prmCustomer_Child') {
				this.nullableRequired = item;
				if (this.nullableRequired.nullable == false) {
					this.Childrequired = true
				} else {
					this.Childrequired = false;
				}
				this.childCustomer = item.validValues
			} if (item.name == 'prmActionDateBegin') {
				this.nullableRequired = item;
				if (this.nullableRequired.nullable == false) {
					this.prmActionDateBeginrquired = true
				} else {
					this.prmActionDateBeginrquired = false;
				}
				//this.parentCustomer = item.validValues;
			} else if (item.name == 'prmActionDateEnd') {
				this.nullableRequired = item;
				if (this.nullableRequired.nullable == false) {
					this.prmActionDateEndrquired = true
				} else {
					this.prmActionDateEndrquired = false;
				}
				//this.childCustomer = item.validValues
			}
		})
	}

	parentCustomerChange(event) {
		this.globalChange()
		this.rMSApiService.setFinanceReportParentCustomer(event.value);
		//this.getParametersSummary();
	};
	childCustomerChange(event) {
		this.rMSApiService.setFinanceReportChildCustomer(event.value);
		//this.getParametersSummary();
	};

	actionDate(event) {
		let startdate = _moment(event.value).add(1, 'days').format();
		//this.rMSApiService.setcallEndDate(startdate);
	
		this.minDate = startdate;
		this.globalChange();
	}

	iframeloaded() {
		this.iframeLoader = false;
	};
	validatedate(event) {


		this.customValidatorService.isDateMaxlengthForamt(event)


	} 
	globalChange() {
		let valuesArray = []
		let listForm = this.accountNotesList.value;
	
		Object.keys(listForm).forEach(item => {
		
			let value = this.accountNotesList.value[item];
			let tempArray = (value == "" || value == null) ? [] : [value];
			let tempObj = { "Name": item, "Values": tempArray }
			valuesArray.push(tempObj);
			
		});
		const reqData = {
			Values: valuesArray
		}
		this.rMSApiService.showLoader(true);
		this.viewActivityService.getParamtersNotes(reqData).subscribe((data: any) => {
			this.parameters = data.reportInfo.parameters;
			this.SettingDataParameters();
			this.rMSApiService.showLoader(false);
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.rMSApiService.setData(error)
				this.router.navigate(['/Error'])
			},
		)


	};



	generateNotesReport() {
		this.SettingDataParameters();
		setTimeout(() => {
			if (this.accountNotesList.invalid) {
				return;
			} else {
				this.generatesrssReport();
			}
		}, 200)


	}

	generatesrssReport() {


		this.iframeLoader = true;
		this.showTextSearch = false;
		let valuesArray = []
		let listForm = this.accountNotesList.value;
	
		Object.keys(listForm).forEach(item => {
			
			let value = this.accountNotesList.value[item];
			let tempArray = (value == "" || value == null) ? [] : [value];
			let tempObj = { "Name": item, "Values": tempArray }
			valuesArray.push(tempObj);
		
		});
		const reqData = {
			Values: valuesArray
		}
		this.rMSApiService.showLoader(true);
		this.viewActivityService.getParamtersNotes(reqData).subscribe((data: any) => {
			this.parameters = data.reportInfo.parameters;
			this.SettingDataParameters();
			this.iframeUrl = data.url;
			var elms = document.getElementById("iframe");
			//elms.setAttribute("height", "768px");
			elms.setAttribute("src", data.url);
			this.rMSApiService.showLoader(false);
		
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.rMSApiService.setData(error)
				this.router.navigate(['/Error'])
			}

		)
	}


	cancel() {
		this.showTextSearch = true;
		var elms = document.getElementById("iframe");
		elms.setAttribute("height", "768px");
		elms.setAttribute("src", "");
		this.prmActionDateEndrquired = false;
		this.prmActionDateBeginrquired = false;
		this.Childrequired = false;
		this.Parentrequired = false;
		this.accountNotesList.reset();
		this.accountNotesList.markAsUntouched();
		this.accountNotesList.markAsPristine();

		this.rMSApiService.removeFinanaceReportPeriod();
		this.rMSApiService.removedueStartDate();
		this.rMSApiService.removedueEndDate();
		this.rMSApiService.removeCallStartDate();
		this.rMSApiService.removecallEndDate();
		this.rMSApiService.removeFinanaceReportPort();
		this.rMSApiService.removeFinanaceReportStatus();
		this.rMSApiService.removeFinanceReport();
		this.rMSApiService.removeFinanceReportParentCustomer();
		this.rMSApiService.removeFinanceReportChildCustomer();


		//this.emitterService.cascaddingitems.emit(true)


		//this.accountNotesList.untouched();
	};

	ngOnDestroy() {
		if(this.router.url=='/ViewActivity/AccountSummary' || this.router.url=='/ViewActivity/AccountDetail' || this.router.url =='/ViewActivity/AccountHistory' || this.router.url=='/ViewActivity/AccountStatement' || this.router.url =='/ViewActivity/AccountNotes'){
		
		}else{
			this.rMSApiService.removeFinanaceReportPeriod();
		this.rMSApiService.removedueStartDate();
		this.rMSApiService.removedueEndDate();
		this.rMSApiService.removeCallStartDate();
		this.rMSApiService.removecallEndDate();
		this.rMSApiService.removeFinanaceReportPort();
		this.rMSApiService.removeFinanaceReportStatus();
		this.rMSApiService.removeFinanceReport();
		this.rMSApiService.removeFinanceReportParentCustomer();
		this.rMSApiService.removeFinanceReportChildCustomer();
		}

	}

}