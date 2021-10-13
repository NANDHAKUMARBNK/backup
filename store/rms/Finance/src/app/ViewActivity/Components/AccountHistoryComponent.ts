import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";

import { Router, ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { ViewActivityService } from '../Service/viewActivityService';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RMSApiService } from 'common/services/RMSApiService';

import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
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
};


@Component({
	selector: 'app-accounthistory',
	templateUrl: "../../../../../../../Views/Finance/ViewActivity/AccountHistory.html",
	styleUrls: ['../../../../../../common/styles/commonApp.scss'],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },CustomValidatorService
	]

})

export class AccountHistoryComponent {
	parameters: any;
	parentCustomer: any;
	accountHistoryList: FormGroup;
	childCustomer: any;
	documentTypeCustomer: any;
	statusCustomer: any;
	iframeUrl: any;
	iframeLoader = false;
	nullableRequired: any;
	Documentrequired: boolean = false;
	transcationEndrequired: boolean = false;
	transcationstartrequired: boolean = false;
	statusrequired: boolean = false;
	Childrequired: boolean = false;
	Parentrequired: boolean = false;
	minDate: any;
	showTextSearch: boolean = true;
	reporting_base_url: string;
	// iframeLoader: boolean = false;
	constructor(private http: HttpClient, private route: ActivatedRoute, private fb: FormBuilder, private rMSApiService: RMSApiService,
		private router: Router,private customValidatorService:CustomValidatorService,
		private viewActivityService: ViewActivityService) {
			this.reporting_base_url = this.rMSApiService.GetReportUrl();

	}


	ngOnInit() {
		this.accountHistoryList = this.fb.group({
			prmCustomer_Parent: [''],
			prmCustomer_Child: [''],
			//prmStatus: [''],
			prmTrxDateBegin: [''],
			prmTrxDateEnd: [''],
			prmFinance_Document: ['']
		});

		let defUrl = `${this.reporting_base_url}/App/Default.aspx`;
		var elms = document.getElementById("iframe");
		elms.setAttribute("src", defUrl);
		//this.getParametersSummary();
		this.setFormcontrols();
	};



	setFormcontrols() {
		let cascaddingParent = this.rMSApiService.getFinanceReportParentCustomer();
		let cascaddingChild = this.rMSApiService.getFinanceReportChildCustomer();
		let cascaddingport = this.rMSApiService.getFinanaceReportPort();
		let cascaddingStatus = this.rMSApiService.getFinanaceReportStatus();
		let cascaddingperid = this.rMSApiService.getFinanaceReportPeriod();
		let cascaddingtransStartDate=this.rMSApiService.getTransStartDate();
		let cascaddingtransEndDate =this.rMSApiService.getTransEndDate();
	

		if (cascaddingParent) {
			this.accountHistoryList.patchValue({
				prmCustomer_Parent: cascaddingParent
			});
			//this.globalChange();
		};
		if (cascaddingChild) {
			this.accountHistoryList.patchValue({
				prmCustomer_Child: cascaddingChild
			})
			//this.globalChange();
		};
		if (cascaddingport) {
			this.accountHistoryList.patchValue({
				prmCruiseLine_Port: cascaddingport
			})
			//this.globalChange();
		};
		// if (cascaddingStatus) {
		// 	this.accountHistoryList.patchValue({
		// 		prmStatus: cascaddingStatus
		// 	})
		// 	this.globalChange();
		// };
		if (cascaddingperid) {
			this.accountHistoryList.patchValue({
				prmFinance_DaysDue: cascaddingperid
			})
			//this.globalChange();
		};
		if(cascaddingtransStartDate){
			this.minDate = _moment(cascaddingtransStartDate).add(1, 'days').format();
			this.accountHistoryList.patchValue({
				prmTrxDateBegin: cascaddingtransStartDate
			})
			//this.globalChange();
		};
		if(cascaddingtransEndDate){
			this.accountHistoryList.patchValue({
				prmTrxDateEnd: cascaddingtransEndDate
			})
			//this.globalChange();
		};

		if(cascaddingParent || cascaddingChild ||cascaddingport||cascaddingperid||cascaddingtransStartDate||cascaddingtransEndDate ){
			this.generatesrssReport();
		}else{
			this.getParametersSummary();
		}

	}

	getParametersSummary() {
		const reqData = {

		}
		this.rMSApiService.showLoader(true);
		this.viewActivityService.getParamtersHistory(reqData).subscribe((data: any) => {
			this.parameters = data.reportInfo.parameters;
			this.setDataParameteres();
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
	validatedate(event) {


		this.customValidatorService.isDateMaxlengthForamt(event)


	} 
	hasError(controlName: string, errorName: string) {
		return this.accountHistoryList.controls[controlName].hasError(errorName);
	}
	iframeloaded() {
		this.iframeLoader = false;
	};
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	setDataParameteres() {
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

			} else if (item.name == 'prmFinance_Document') {
				this.nullableRequired = item;
				this.documentTypeCustomer = item.validValues
				if (this.nullableRequired.nullable == false) {
					this.Documentrequired = true
				} else {
					this.Documentrequired = false;
				}
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
	}

	globalChange() {
		let valuesArray = []
		let listForm = this.accountHistoryList.value;
	
		Object.keys(listForm).forEach(item => {
		
			let value = this.accountHistoryList.value[item];
			let tempArray = (value == "" || value == null) ? [] : [value];
			let tempObj = { "Name": item, "Values": tempArray }
			valuesArray.push(tempObj);
		
		});
		const reqData = {
			Values: valuesArray
		}
		this.rMSApiService.showLoader(true);
		this.viewActivityService.getParamtersHistory(reqData).subscribe((data: any) => {
			this.parameters = data.reportInfo.parameters;
			this.setDataParameteres();
			this.rMSApiService.showLoader(false);
			
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.rMSApiService.setData(error)
				this.router.navigate(['/Error'])
			},
		)


	};

	parentCustomerChange(event) {
		this.rMSApiService.setFinanceReportParentCustomer(event.value)
	}

	childCustomerChange(event) {
		this.rMSApiService.setFinanceReportChildCustomer(event.value);
		//this.getParametersSummary();
	};

	portCustomerChange(event) {
		this.rMSApiService.setFinanaceReportPort(event.value);
		//this.getParametersSummary();
	};
	statusCustomerChange(event) {
		this.rMSApiService.setFinanaceReportStatus(event.value);
		//this.getParametersSummary();
	};
	periodCustomerChange(event) {
		this.rMSApiService.setFinanaceReportPeriod(event.value);
	};

	transactionStartDate(event) {
		let startdate = _moment(event.value).add(1, 'days').format();
		this.rMSApiService.setTransStartDate(event.value);
	
		this.minDate = startdate;
		this.globalChange();
	};

	transactionEndDate(event){
		this.rMSApiService.setTransEndDate(event.value);
	}



	generatesrssReportHistory() {
		this.setDataParameteres();
		setTimeout(() => {
			if (this.accountHistoryList.invalid) {
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
		let listForm = this.accountHistoryList.value;
	
		Object.keys(listForm).forEach(item => {
		
			let value = this.accountHistoryList.value[item];
			let tempArray = (value == "" || value == null) ? [] : [value];
			let tempObj = { "Name": item, "Values": tempArray }
			valuesArray.push(tempObj);
		
		});
		const reqData = {
			Values: valuesArray
		}
		this.rMSApiService.showLoader(true);
		this.viewActivityService.getParamtersHistory(reqData).subscribe((data: any) => {
			this.parameters = data.reportInfo.parameters;
			this.setDataParameteres();
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
		this.Documentrequired = false;
		this.transcationEndrequired= false;
		this.transcationstartrequired = false;
		this.statusrequired= false;
		this.Childrequired = false;
		this.Parentrequired = false;

		this.accountHistoryList.reset();

		this.accountHistoryList.markAsUntouched();
		this.accountHistoryList.markAsPristine();

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