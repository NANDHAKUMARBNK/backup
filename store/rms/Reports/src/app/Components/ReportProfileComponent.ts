import { Component, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { ReportsService } from '../Service/ReportService';
import { TreeNode, MenuItem, MessageService } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { RMSApiService } from 'common/services/RMSApiService';
declare var $: any;
import { default as _rollupMoment } from 'moment';
import { DatePipe } from '@angular/common';
import { RMSMomentDateAdapter } from 'common/adapter/RMSMomentDateAdapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material';

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
	selector: 'app-reportprofile',
	templateUrl: '../../../../../../Views/Reports/ReportProfile.html',
	styleUrls: ['../../../../../common/styles/Report.scss'],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	]

})
export class ReportProfileComponent {
	//myFormGroup: FormGroup;
	iframeLoader: boolean = false;
	reportData: any;
	FromGroup: any;
	treeId: any;
	formReports: FormGroup;
	formGroup: any;
	formParameters: any;
	nameObj: any = [];
	reporting_base_url: any;
	reportName: any;
	nameData: any;
	todayDateReport: any;

	hideNodata: boolean = false;

	@ViewChild('iframeReport', { read: ViewContainerRef }) public iframeReport;


	constructor(private reportsService: ReportsService, private router: Router, private route: ActivatedRoute, private rMSApiService: RMSApiService) {
		this.treeId = this.route.snapshot.paramMap.get('id');
		this.reportName = this.route.snapshot.paramMap.get('name');
		this.reporting_base_url = this.rMSApiService.GetReportUrl();
	};

	ngOnInit() {

		this.getReportsId();
		//this.renderingForms();
		this.ErrorPageApi();
		this.todayDateReport = new Date();



		//this.formGroup = {};

		let defUrl = `${this.reporting_base_url}/App/Default.aspx`;
		var elms = document.getElementById("renderReport");
		elms.setAttribute("src", defUrl);
	};


	getReportsId() {
		this.reportsService.getReportsId(this.treeId).subscribe((data: any) => {
			this.nameData = data;
		})
	};

	ErrorPageApi() {
		this.rMSApiService.showLoader(true);
		this.reportsService.getReportsSuceessPage().subscribe(data => {
			this.rMSApiService.showLoader(false);
			let reports = "Reports"
			let sucess = data;
			if (sucess == true) {
				this.renderingForms();
			} else {

				// this.rMSApiService.setData(sucess);
				this.router.navigate(['/Error'], { queryParams: { 'reports': reports } });
			}
		},
			error => {
				this.rMSApiService.setData(error)
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error']);
			}
		)
	}

	renderingForms() {
		const reqData = {};
		this.rMSApiService.showLoader(true);
		this.reportsService.getReportProfile(this.treeId, reqData).subscribe((data: any) => {
			this.reportData = data;
			this.formParameters = this.reportData.parameters;


			if (this.formParameters.length == []) {
				this.hideNodata = true;
				this.iframeLoader = true;
				let renderUrl = `${this.reporting_base_url}/App/Render.aspx?id=${this.treeId}`;
				var elms = document.getElementById("renderReport");

				elms.setAttribute("height", "768px");
				elms.setAttribute("src", renderUrl);
				this.rMSApiService.showLoader(false);
			}

			this.renderDynamicForm(this.formParameters); //krishna commented purpose required feild text
			this.formReports = new FormGroup(this.formGroup);
			this.rMSApiService.showLoader(false);

		},
			error => {
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error'])
			}
		);
	};

	renderDynamicForm(formParameters) {

		this.formGroup = [];
		formParameters.forEach(formControl => {
			formControl['required'] = false;
			this.formGroup[formControl.name] = new FormControl('');
			if (formControl != null && formControl.nullable == false) {
				formControl['star'] = true;
				this.formGroup[formControl.name] = new FormControl('', Validators.required);

			};
		});

	}

	renderChanges() {
		let requestOBJ = {}
		let valuesArray = []




	
		Object.keys(this.formReports.value).forEach(item => {
			let strBuffer = item;
			let value = this.formReports.value[item];

			var filterItem = this.formParameters.filter(ele=>{
				return ele.name == item;
			})

			if(filterItem != null && filterItem.length > 0){
				if(filterItem[0].parameterType == "DateTime"){
					value= (value)?moment(value).format("YYYY-MM-DD"):"";
					let tempArray = (value == "" || value == null) ? [] : [value];
					let tempObj = { "Name": item, "Values": tempArray }
					valuesArray.push(tempObj);
				}else{
					let tempArray = (value == "" || value == null) ? [] : [value];
					let tempObj = { "Name": item, "Values": tempArray }
					valuesArray.push(tempObj);
				}
			}
			

		})
		requestOBJ['Values'] = valuesArray;
		this.reportsService.getReportProfile(this.treeId, requestOBJ).subscribe((data: any) => {
			this.formParameters = data.parameters;
			this.formParameters.forEach(item => {
				item['required'] = true;
				if (item != null && item.nullable == false) {
					item['star'] = true;
				}

			})
			this.renderDynamicForm(data.parameters)
		})

	};


	isValidation() {
		let validation = []
		this.formParameters.forEach(item => {
			let checknull = item.nullable;
			let checkName = item.name;


			validation.push(checknull);
		});


	}

	backList() {
		this.router.navigate(['/'])
	};

	constructURLParams() {
		let urlParam = [];
		//this.formParameters[0].nullable = false;
		let keys = Object.keys(this.formReports.value);
		for (var i = 0; i < keys.length; i++) {
			let name = keys[i];
			let strBuffer = name;
			let value = this.formReports.value[name];
			let currentObj = this.formParameters.find(data => data.name == name)
			if (currentObj != null && currentObj.nullable == false && value == "") {

				currentObj['required'] = true;
				currentObj['star'] = false;
				urlParam = [];
				break;
			}
			if (this.isDateField(name, value) == false)
				strBuffer += "|" + this.handleNulls(value);
			else
				strBuffer += "|" + this.isDateField(name, value);
			urlParam.push(strBuffer);

		}

		return (urlParam.length == 0) ? "" : urlParam.join('@');
	}

	handleNulls(value) {
		return (value == "" || value == null) ? "" : value;
	}

	isDateField(name, value) {
		if (value == "" || value == null)
			return "";
		let selectedObj = this.formParameters.find(item => item.name == name);
		if (selectedObj.parameterType == "DateTime") {
			return moment(value).format("YYYY-MM-DD");
		} else {
			return false;
		}
	}


	iframeloaded() {


		this.iframeLoader = false;
	}

	render() {
		let urlParamString = this.constructURLParams();
		if (this.formReports.invalid) {
			return;
		}
		let uniqueNumber = Date.parse(this.todayDateReport)

		if (urlParamString != "") {
			this.iframeLoader = true;
			//this.isValidation();
			let renderUrl = `${this.reporting_base_url}/App/Render.aspx?id=${this.treeId}&p=${urlParamString}&i=${uniqueNumber}`;

			var elms = document.getElementById("renderReport");
			elms.setAttribute("src", renderUrl);
			elms.setAttribute("height", "768px");
		}
		this.rMSApiService.showLoader(false)
	};

	close() {
		this.formReports.reset();
		//this.nameData="";
		let renderUrl = '';

		var elms = document.getElementById("renderReport");
		elms.setAttribute("height", "768px");
		elms.setAttribute("src", renderUrl);
	}
}



