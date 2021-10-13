import { Component, Inject, Sanitizer } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { Router, ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { ViewActivityService } from '../Service/viewActivityService';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RMSApiService } from 'common/services/RMSApiService';
import { DomSanitizer } from '@angular/platform-browser';

import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
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
	selector: 'app-accountstatement',
	templateUrl: "../../../../../../../Views/Finance/ViewActivity/AccountStatement.html",
	styleUrls: ['../../../../../../common/styles/commonApp.scss'],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, CustomValidatorService
	]

})

export class AccountStatementComponent {
	parameters: any;
	parentCustomer: any;
	accountStatementList: FormGroup;
	childCustomer: any;
	statusCustomer: any;
	iframeUrl: any;
	iframeLoader: boolean = false;
	nullableRequired: any;
	transcationEndrequired: boolean = false;
	transcationstartrequired: boolean = false;
	statusrequired: boolean = false;
	Childrequired: boolean = false;
	Parentrequired: boolean = false;
	minDate: any;
	showTextSearch: boolean = true;
	reporting_base_url: string;

	constructor(private http: HttpClient, private route: ActivatedRoute, private fb: FormBuilder, private rMSApiService: RMSApiService,
		private router: Router, private sanitizer: DomSanitizer, private customValidatorService: CustomValidatorService,
		private viewActivityService: ViewActivityService) {
			this.reporting_base_url = this.rMSApiService.GetReportUrl();

	}

	ngOnInit() {
		this.accountStatementList = this.fb.group({
			prmCustomer_Parent: [''],
			prmCustomer_Child: [''],
			//prmStatus: [''],
			prmTrxDateBegin: [''],
			prmTrxDateEnd: ['']
		});

		let defUrl = `${this.reporting_base_url}/App/Default.aspx`;
		var elms = document.getElementById("iframe");
		elms.setAttribute("src", defUrl);

		this.setFormcontrols();
	};

	setFormcontrols() {
		let cascaddingParent = this.rMSApiService.getFinanceReportParentCustomer();
		let cascaddingChild = this.rMSApiService.getFinanceReportChildCustomer();
		let cascaddingtransStartDate = this.rMSApiService.getTransStartDate();
		let cascaddingtransEndDate = this.rMSApiService.getTransEndDate();
		//let cascaddingStatus = this.rMSApiService.getFinanaceReportStatus();

		if (cascaddingParent) {
			this.accountStatementList.patchValue({
				prmCustomer_Parent: cascaddingParent
			});
			//this.globalChange();
		};
		if (cascaddingChild) {
			this.accountStatementList.patchValue({
				prmCustomer_Child: cascaddingChild
			})
		};
		if (cascaddingtransStartDate) {
			this.minDate = _moment(cascaddingtransStartDate).add(1, 'days').format();
			this.accountStatementList.patchValue({
				prmTrxDateBegin: cascaddingtransStartDate
			})
			//this.globalChange();
		};
		if (cascaddingtransEndDate) {
			this.accountStatementList.patchValue({
				prmTrxDateEnd: cascaddingtransEndDate
			})
			//this.globalChange();
		};

		 if(cascaddingParent || cascaddingChild || cascaddingtransStartDate ||cascaddingtransEndDate ){
			this.generatesrssReport();
		 }else{
			this.getParametersSummary();

		 }
		// if (cascaddingStatus) {
		// 	this.accountStatementList.patchValue({
		// 		prmStatus: cascaddingStatus
		// 	})
		// };


	}


	getParametersSummary() {
		const reqData = {

		}
		this.rMSApiService.showLoader(true);
		this.viewActivityService.getParamtersStatement(reqData).subscribe((data: any) => {
			this.parameters = data.reportInfo.parameters;
			this.setDataParameters()
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
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	parentCustomerChange(event) {
		this.rMSApiService.setFinanceReportParentCustomer(event.value);
	};
	childCustomerChange(event) {
		this.rMSApiService.setFinanceReportChildCustomer(event.value);
		//this.getParametersSummary();
	};
	statusCustomerChange(event) {
		this.rMSApiService.setFinanaceReportStatus(event.value);
		//this.getParametersSummary();
	};

	transactionStartDate(event) {
		let startdate = _moment(event.value).add(1, 'days').format();
		//this.rMSApiService.setcallEndDate(startdate);
		this.rMSApiService.setTransStartDate(event.value);
		
		this.minDate = startdate;
		this.globalChange();
	};
	transactionEndDate(event) {
		this.rMSApiService.setTransEndDate(event.value)
	}
	iframeloaded() {
		this.iframeLoader = false;
	}


	setDataParameters() {
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

			// } else if (item.name == 'prmStatus') {
			// 	this.nullableRequired = item;
			// 	this.statusCustomer = item.validValues
			// 	if (this.nullableRequired.nullable == false) {
			// 		this.statusrequired = true
			// 	} else {
			// 		this.statusrequired = false;
			// 	}


			} else if (item.name == 'prmTrxDateBegin') {
				this.nullableRequired = item;
				//this.documentTypeCustomer = item.validValues
				if (this.nullableRequired.nullable == false) {
					this.transcationstartrequired = true
				} else {
					this.transcationstartrequired = false;
				}
			} else if (item.name == 'prmTrxDateEnd') {
				this.nullableRequired = item;
				//this.documentTypeCustomer = item.validValues
				if (this.nullableRequired.nullable == false) {
					this.transcationEndrequired = true
				} else {
					this.transcationEndrequired = false;
				}
			}
		})
	};



	globalChange() {
		let valuesArray = []
		let listForm = this.accountStatementList.value;
	
		Object.keys(listForm).forEach(item => {
		
			let value = this.accountStatementList.value[item];
			let tempArray = (value == "" || value == null) ? [] : [value];
			let tempObj = { "Name": item, "Values": tempArray }
			valuesArray.push(tempObj);
		
		});
		const reqData = {
			Values: valuesArray
		}
		this.rMSApiService.showLoader(true);
		this.viewActivityService.getParamtersStatement(reqData).subscribe((data: any) => {
			this.parameters = data.reportInfo.parameters;
			this.setDataParameters()
		
			this.rMSApiService.showLoader(false);

		},
			error => {
				this.rMSApiService.showLoader(false);
				this.rMSApiService.setData(error)
				this.router.navigate(['/Error'])
			},
		)
	};


	generatesrssReportStatement() {
		this.setDataParameters();
		setTimeout(() => {
			if (this.accountStatementList.invalid) {
				return;
			} else {
				this.generatesrssReport();
			}
		}, 200)
	}
	validatedate(event) {


		this.customValidatorService.isDateMaxlengthForamt(event)


	} 
	hasError(controlName: string, errorName: string) {
		return this.accountStatementList.controls[controlName].hasError(errorName);
	}
	generatesrssReport() {

		this.iframeLoader = true;
		this.showTextSearch = false;
		let valuesArray = []
		let listForm = this.accountStatementList.value;
	
		Object.keys(listForm).forEach(item => {
		
			let value = this.accountStatementList.value[item];
			let tempArray = (value == "" || value == null) ? [] : [value];
			let tempObj = { "Name": item, "Values": tempArray }
			valuesArray.push(tempObj);
		
		});
		const reqData = {
			Values: valuesArray
		}
		this.rMSApiService.showLoader(true);
		this.viewActivityService.getParamtersStatement(reqData).subscribe((data: any) => {
			this.parameters = data.reportInfo.parameters;
			this.setDataParameters();
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
		this.transcationEndrequired = false;
		this.transcationstartrequired = false;
		this.statusrequired = false;
		this.Childrequired = false;
		this.Parentrequired = false;

		this.accountStatementList.reset();
		this.accountStatementList.markAsUntouched();
		this.accountStatementList.markAsPristine();

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
		this.rMSApiService.removeTransStartDate();
		this.rMSApiService.removeTransEndDate();
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