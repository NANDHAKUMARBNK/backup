import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material";
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import * as _moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { ViewActivityService } from '../Service/viewActivityService';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RMSApiService } from 'common/services/RMSApiService';
import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
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
	selector: 'app-accountsummary',
	templateUrl: "../../../../../../../Views/Finance/ViewActivity/AccountSummary.html",
	styleUrls: ['../../../../../../common/styles/commonApp.scss'],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, CustomValidatorService
	]

})

export class AccountSummaryComponent {
	parameters: any;
	parentCustomer: any;
	accountSummaryList: FormGroup;
	childCustomer: any;
	portCustomer: any;
	periodCustomer: any;
	statusCustomer: any;
	iframeUrl: any;
	iframeLoader: boolean = false;
	noPrams: boolean = true;
	mincallDate: any;
	mindueDate: any;
	nullableRequired: any;
	periodrequired: boolean = false;
	dueendrequired: boolean = false;
	duestartrequired: boolean = false;
	callendrequired: boolean = false;
	callstartrequired: boolean = false;
	statusrequired: boolean = false;
	portrequired: boolean = false;
	Childrequired: boolean = false;
	Parentrequired: boolean = false;
	showTextSearch: boolean = true;
	searchButton: boolean = false;
	accountSummaryStartDate;
	accountSummaryEndDate;
	accountSummaryDueStartDate;
	accountSummaryDueEndDate;
	reporting_base_url: string;
	constructor(private http: HttpClient, private customValidatorService: CustomValidatorService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router,
		private rMSApiService: RMSApiService, private sanitizer: DomSanitizer,
		private viewActivityService: ViewActivityService) {

			this.reporting_base_url = this.rMSApiService.GetReportUrl();


	}


	ngOnInit() {
		this.accountSummaryList = this.fb.group({
			prmCustomer_Parent: [''],
			prmCustomer_Child: [''],
			prmCruiseLine_Port: [''],
		//	prmStatus: [''],
			prmCallDateBegin: [''],
			prmCallDateEnd: [''],
			prmDueDateBegin: [''],
			prmDueDateEnd: [''],
			prmFinance_DaysDue: ['']
		});
		let defUrl = `${this.reporting_base_url}/App/Default.aspx`;
		var elms = document.getElementById("summaryframe");
		elms.setAttribute("src", defUrl);

		this.setFormcontrols();
		this.accountSummaryStartDate = _moment().subtract(2, 'days').format();
		this.accountSummaryEndDate = _moment().subtract(1, 'day').format();
	};


	setFormcontrols() {
		let cascaddingParent = this.rMSApiService.getFinanceReportParentCustomer();
		let cascaddingChild = this.rMSApiService.getFinanceReportChildCustomer();
		let cascaddingport = this.rMSApiService.getFinanaceReportPort();
		let cascaddingStatus = this.rMSApiService.getFinanaceReportStatus();
		let cascaddingperid = this.rMSApiService.getFinanaceReportPeriod();
		let cascaddingcallStart = this.rMSApiService.getCallStartDate();
		let cascaddingcallEnd = this.rMSApiService.getcallEndDate();
		let cascaddingdueStart = this.rMSApiService.getdueStartDate();
		let cascaddingdueEnd = this.rMSApiService.getdueEndDate();

		if (cascaddingParent) {
			this.accountSummaryList.patchValue({
				prmCustomer_Parent: cascaddingParent
			});
			//this.globalChange();
		};
		if (cascaddingChild) {
			this.accountSummaryList.patchValue({
				prmCustomer_Child: cascaddingChild
			})
			//this.globalChange();
		};
		if (cascaddingport) {
			this.accountSummaryList.patchValue({
				prmCruiseLine_Port: cascaddingport
			})
			//this.globalChange();
		};
		// if (cascaddingStatus) {
		// 	this.accountSummaryList.patchValue({
		// 		prmStatus: cascaddingStatus
		// 	})
		// };
		if (cascaddingperid) {
			this.accountSummaryList.patchValue({
				prmFinance_DaysDue: cascaddingperid
			})
			//this.globalChange();
		};
		if (cascaddingcallStart) {
			this.accountSummaryList.patchValue({
				prmCallDateBegin: cascaddingcallStart
			})
			//this.globalChange();
		};

		if (cascaddingcallEnd) {
			this.accountSummaryList.patchValue({
				prmCallDateEnd: cascaddingcallEnd
			})
			//this.globalChange();
		}

		if (cascaddingdueStart) {
			this.accountSummaryList.patchValue({
				prmDueDateBegin: cascaddingdueStart
			})
			//this.globalChange();
		}


		if (cascaddingdueEnd) {
			this.accountSummaryList.patchValue({
				prmDueDateEnd: cascaddingdueEnd
			})
			//this.globalChange();
		};
		let accountDetailList = this.rMSApiService.getFinanceReport();

		if (accountDetailList || cascaddingParent || cascaddingChild || cascaddingport || cascaddingperid  || cascaddingcallStart || cascaddingcallEnd || cascaddingdueStart || cascaddingdueEnd) {
			this.generatesrssReport();
		}else{
			this.getParametersSummary();

		};
	

	}
	validatedate(event) {


		this.customValidatorService.isDateMaxlengthForamt(event)


	} 
	hasError(controlName: string, errorName: string) {
		return this.accountSummaryList.controls[controlName].hasError(errorName);
	}
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	getParametersSummary() {
		const reqData = {

		}
		this.rMSApiService.showLoader(true);
		this.viewActivityService.getParamtersAccountSummary(reqData).subscribe((data: any) => {
			this.parameters = data.reportInfo.parameters;

			this.SettingDataParameters()

			//this.iframeLoader = true;
			//this.iframeUrl = data.url;
		//	this.setFormcontrols();
			this.rMSApiService.showLoader(false);
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.rMSApiService.setData(error)
				this.router.navigate(['/Error'])
			}
		)
	};


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

			} else if (item.name == 'prmCruiseLine_Port') {
				this.nullableRequired = item;
				if (this.nullableRequired.nullable == false) {
					this.portrequired = true
				} else {
					this.portrequired = false;
				}
				this.portCustomer = item.validValues

			} else if (item.name == 'prmFinance_DaysDue') {
				this.nullableRequired = item;
				if (this.nullableRequired.nullable == false) {
					this.periodrequired = true
				} else {
					this.periodrequired = false;
				}
				this.periodCustomer = item.validValues

			// } else if (item.name == 'prmStatus') {
			// 	this.nullableRequired = item;
			// 	this.statusCustomer = item.validValues
			// 	if (this.nullableRequired.nullable == false) {
			// 		this.statusrequired = true
			// 	} else {
			// 		this.statusrequired = false;
			// 	}
			} else if (item.name == 'prmCallDateBegin') {
				this.nullableRequired = item;

				if (this.nullableRequired.nullable == false) {
					this.callstartrequired = true
				} else {
					this.callstartrequired = false;
				}
			} else if (item.name == 'prmCallDateEnd') {
				this.nullableRequired = item;

				if (this.nullableRequired.nullable == false) {
					this.callendrequired = true
				} else {
					this.callendrequired = false;
				}
			} else if (item.name == 'prmDueDateBegin') {
				this.nullableRequired = item;

				if (this.nullableRequired.nullable == false) {
					this.duestartrequired = true
				} else {
					this.duestartrequired = false;
				}
			} else if (item.name == 'prmDueDateEnd') {
				this.nullableRequired = item;

				if (this.nullableRequired.nullable == false) {
					this.dueendrequired = true
				} else {
					this.dueendrequired = false;
				}
			}
		})
	}



	globalChange() {
		let valuesArray = []
		let listForm = this.accountSummaryList.value;
		Object.keys(listForm).forEach(item => {
			let value = this.accountSummaryList.value[item];
			let tempArray = (value == "" || value == null) ? [] : [value];
			let tempObj = { "Name": item, "Values": tempArray }
			valuesArray.push(tempObj);
		});
		const reqData = {
			Values: valuesArray
		}
	
		this.rMSApiService.showLoader(true);
		this.viewActivityService.getParamtersAccountSummary(reqData).subscribe((data: any) => {
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
	iframeloaded() {
		this.iframeLoader = false;
		this.noPrams = false;
	}

	parentCustomerChange(event) {
	
		let tempArray = [];

		this.rMSApiService.setFinanceReportParentCustomer(event.value);
		//this.getParametersSummary();
	};
	childCustomerChange(event) {
		this.rMSApiService.setFinanceReportChildCustomer(event.value);
		//this.getParametersSummary();
	};

	portCustomerChange(event) {
		this.rMSApiService.setFinanaceReportPort(event.value);
		//this.getParametersSummary();
	};
	// statusCustomerChange(event) {
	// 	this.rMSApiService.setFinanaceReportStatus(event.value);
	// 	//this.getParametersSummary();
	// };
	periodCustomerChange(event) {
		this.rMSApiService.setFinanaceReportPeriod(event.value);
	};

	startCallChange(event) {
	
		let startdate = _moment(event.value).add(1, 'days').format();
		this.rMSApiService.setCallStartDate(startdate);
		
		this.mincallDate = startdate;
		this.globalChange();
	};

	endCallChange(event) {
		this.rMSApiService.setcallEndDate(event.value)
		this.globalChange();
	}

	duestartChange(event) {
		let startdate = _moment(event.value).add(1, 'days').format();
		this.mindueDate = startdate;
		this.rMSApiService.setDueStartDate(startdate);
		this.globalChange();

	};
	endDueChange(event) {
		this.rMSApiService.setdueEndDate(event.value)
		this.globalChange();
	};



	generatesrssSummary() {
		this.SettingDataParameters()
		setTimeout(() => {
			if (this.accountSummaryList.invalid) {
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
		let listForm = this.accountSummaryList.value;
		this.rMSApiService.setFinanceReport(listForm);
		
		Object.keys(listForm).forEach(item => {
		
			let value = this.accountSummaryList.value[item];
			let tempArray = (value == "" || value == null) ? [] : [value];
			let tempObj = { "Name": item, "Values": tempArray }
			valuesArray.push(tempObj);
		
		});
		const reqData = {
			Values: valuesArray
		}
		this.rMSApiService.showLoader(true);
		this.viewActivityService.getParamtersAccountSummary(reqData).subscribe((data: any) => {
			this.parameters=data.reportInfo.parameters;
			//this.setFormcontrols();
			this.SettingDataParameters();
			this.noPrams = false;
			var elms = document.getElementById("summaryframe");
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
		var elms = document.getElementById("summaryframe");
		elms.setAttribute("height", "768px");
		elms.setAttribute("src", "");
		this.periodrequired = false;
		this.dueendrequired = false;
		this.duestartrequired = false;
		this.callendrequired = false;
		this.callstartrequired = false;
		this.statusrequired = false;
		this.portrequired = false;
		this.Childrequired = false;
		this.Parentrequired = false;
		this.accountSummaryList.reset();
		//this.parameters = [];
		this.accountSummaryList.markAsUntouched();
		this.accountSummaryList.markAsPristine();

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