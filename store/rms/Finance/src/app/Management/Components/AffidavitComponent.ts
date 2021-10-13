import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AffidavitIconComponent } from './AffidavitIconComponent';
import { AffidavitSendComponent } from './AffidavitSendComponent';
import { MatDialogConfig, MatDialog, MatDialogRef, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { ManagementService } from '../service/ManagementService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';
declare var $: any;
import * as _moment from 'moment';
import { Observable, of } from 'rxjs';
import { mergeMap, delay, takeUntil } from 'rxjs/operators';
//import { Location } from '@angular/common';
import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AffidavitViewIconComponent } from './AffidavitViewIconComponent';
import { EmitterService } from 'common/services/emitterService';
import { GridOptions } from 'ag-grid-community';
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
	selector: 'app-affidavit',
	templateUrl: '../../../../../../../Views/Finance/Management/Affidavit.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss', '../../../../../../common/styles/Modal.scss'],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, CustomValidatorService
	]
})

export class AffidavitComponent implements OnInit, OnDestroy {
	@ViewChild('pageSize') pageSize: ElementRef;
	private gridApi;
	private gridColumnApi;

	// addNewReportForm: FormGroup;

	columnDefs: any
	defaultColDef: any
	rowData: any;
	rowClassRules: any;
	deleteid: [];
	searchValue: string;
	updatedId: any;
	getRowHeight;
	private getRowNodeId;
	dataId: any;
	singleClickEdit: any
	brand: string;
	gridId: any;
	gridOptions: GridOptions;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	name: any;
	rowSelection: string;
	panelOpenState = false;
	showDocument: boolean = false;
	config = new MatDialogConfig();
	data: any;
	id: any;
	emailTemplate: any;
	parentCustomer: any;
	customer: any;
	deliveryType: any;
	contractType: any;
	affidavitForm: FormGroup;
	parentCustomerId: any;
	customerId: any;
	deliveryTypeId: any;
	contractTypeId: any;
	required: boolean = false;
	// hasError: boolean = false;
	minStartDate: any;
	minEndDate: any;
	callstartdate = new FormControl(moment());
	callenddate = new FormControl(moment());
	destroyParentCustomerManagement: any;
	destroyCustomerManagement: any;
	destroyDeliveryTypeManagement: any;
	destroyContractTypeManagement: any;
	destroyEmailTypeTemplateManagement: any;
	destroyFormControlSetForAffidavit: any;
	destroySearchAffidavit: any;
	disabledupdatesettlement: boolean = true;
	emailUniqueId: any;
	selectedData: any;
	NoEmail: any = "No Email";
	isRowSelectable: any;
	findParentObject: any;
	rowDataClicked1: any;
	domLayout: any;
	paginationPageSize: any;
	tempArray: any = [];
	loading: boolean = true;
	cascadingParenetCustomer: any;
	cascadingChildCustomer: any;
	cascadingContracttype: any;
	cascadingcallDateStart: any;
	cascadingcallDateEnd: any;
	userInfo: any;
	maxDate: any;
	maxEndDate: any;

	constructor(private http: HttpClient, private customValidatorService: CustomValidatorService, private toasterComponent: ToasterComponent, private fb: FormBuilder, private router: Router, private datePipe: DatePipe, private emitterService: EmitterService,
		private route: ActivatedRoute, private dialog: MatDialog, private rMSApiService: RMSApiService, private managementService: ManagementService) {
		this.columnDefs = [
			{
				headerName: '',
				sortable: true,
				autoHeight: true,
				width: 100,
				headerCheckboxSelectionFilteredOnly: true,
				checkboxSelection: true,
				cellRenderer: params => {
					if (params.data.affidavitEmail == "" ||params.data.affidavitEmail==null ) {
						return `No Email`
					}
				},
			},
			{
				headerName: 'Customer',
				field: "customerName",
				sortable: true,
				autoHeight: true,
				editable: false,
				width: 150,

			},
			{
				headerName: 'Parent',
				field: "parentCustomerName",
				sortable: true,
				autoHeight: true,
				width: 180,
			},
			{
				headerName: 'Port',
				field: "portName",
				sortable: true,
				autoHeight: true,
				width: 100,
			},
			{
				headerName: 'Contract Type',
				field: "typeName",
				sortable: true,
				autoHeight: true,
				width: 180
			},
			{
				headerName: 'Delivery Type',
				field: "deliveryType",
				sortable: true,
				autoHeight: true,
				width: 180,
			},
			{
				headerName: 'Oldest Call',
				field: "oldestCall",
				sortable: true,
				autoHeight: true,
				//	editable: false,
				width: 140,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy');
				},
				
				cellStyle: function (params) {
					let oldestCall_Data_withoutDateFormat = params.data.oldestCall;
					
					let agGridOldestCallField = _moment(oldestCall_Data_withoutDateFormat).format('MM/DD/YY');
					
					let currentDayDate = _moment();
					
					let days = currentDayDate.diff(agGridOldestCallField, 'days');
					
					if (days >= 30 && days < 60)
						return { backgroundColor: 'yellow' }
					else if (days >= 60)
						return { backgroundColor: 'red' }

				}
			},
			{
				headerName: '# Sent',
				field: "numSent",
				sortable: true,
				autoHeight: true,
				//	editable: false,
				width: 120
			},
			{
				headerName: '',
				field: "icon",
				width: 80,
				//editable: false,
				//checkboxSelection: true,
				cellRendererFramework: AffidavitIconComponent,
				cellStyle: { 'cursor': 'default' },
			}
		];

		// this.rowData = [
		// 	{
		// 		affidavitEmail: "brian.allender@cerebratesolutions.com; brian.allender@outlook.com; robert.marenco@onboardmedia.com",
		// 		categoryName: "Promo",
		// 		commissionTypeName: "Incremental Promo",
		// 		contactName: null,
		// 		contractID: 22829,
		// 		contractRateID: null,
		// 		customerID: 3,
		// 		customerName: "$10 Silver Store - COZ",
		// 		deliveryType: "Manual",
		// 		lastAffidavitID: 1,
		// 		numSent: null,
		// 		oldestCall: "2019-09-02T08:00:00",
		// 		parentCustomerName: "$10 Silver Store",
		// 		portName: "Cozumel",
		// 		totalCalls: 50,
		// 		typeName: "All Merchandise",
		// 		GPCustomerID: "FIOR001",
		// 		parentGPCustomerID: "66DI0100"
		// 	},
		// 	{
		// 		affidavitEmail: "brian.allender@cerebratesolutions.com; brian.allender@outlook.com; robert.marenco@onboardmedia.com",
		// 		categoryName: "Promo",
		// 		commissionTypeName: "Incremental Promo",
		// 		contactName: null,
		// 		contractID: 22829,
		// 		contractRateID: null,
		// 		customerID: 3,
		// 		customerName: "$10 Silver Store - COZ",
		// 		deliveryType: "Manual",
		// 		lastAffidavitID: 2,
		// 		numSent: 1,
		// 		oldestCall: "2019-09-02T08:00:00",
		// 		parentCustomerName: "$10 Silver Store",
		// 		portName: "Cozumel",
		// 		totalCalls: 50,
		// 		typeName: "All Merchandise",
		// 		GPCustomerID: "FIOR001",
		// 		parentGPCustomerID: "DIMI0101"
		// 	},
		// 	{
		// 		affidavitEmail: "brian.allender@cerebratesolutions.com; brian.allender@outlook.com; robert.marenco@onboardmedia.com",
		// 		categoryName: "Promo",
		// 		commissionTypeName: "Incremental Promo",
		// 		contactName: null,
		// 		contractID: 22829,
		// 		contractRateID: null,
		// 		customerID: 3,
		// 		customerName: "$10 Silver Store - COZ",
		// 		deliveryType: "Manual",
		// 		lastAffidavitID: null,
		// 		numSent: null,
		// 		oldestCall: "2019-09-02T08:00:00",
		// 		parentCustomerName: "$10 Silver Store",
		// 		portName: "Cozumel",
		// 		totalCalls: 50,
		// 		typeName: "All Merchandise",
		// 		GPCustomerID: "DIMI0201A",
		// 		parentGPCustomerID: "66DI0100"
		// 	}
		// ]

		this.defaultColDef = {
			resizable: true,
		}
		this.isRowSelectable = function (rowNode) {
			return rowNode.data ? rowNode.data.affidavitEmail : false
		};
		// Row HEIGHT
		this.getRowHeight = function (params) {
			if (params.node.level === 0) {
				return 28;
			} else {
				return 25;
			}
		};
		this.overlayLoadingTemplate =
			'<span class="ag-overlay-loading-center nodata" >Searching...please wait</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';




	}

	emailTemplateFormCtrl: FormControl = new FormControl();


	ngOnInit() {
		this.emailTemplateManagement();
		this.parentCustomerManagement();
		this.deliveryTypeManagement();
		this.contractTypeManagement();
		this.formControlSetForAffidavit();
		this.cascaddingData()
		//this.valuesChanges();
		this.minStartDate = _moment().subtract(1, 'days').format();
		this.minEndDate = _moment().subtract(1, 'day').format();
		this.maxEndDate=_moment().format();
		this.casscadingApi();
		//this.cancel();
		this.emitterService.refreshsaveAffidavit.subscribe(data => {
			this.rowData = [];
			this.searchAffidavit();
			this.tempArray = [];

			this.rMSApiService.removeCheckedDataSettlement();
			this.emailTemplateFormCtrl.reset();
			if (this.selectedData) {
				this.selectedData = [];
			};
			if (this.emailUniqueId)
				this.emailUniqueId = "";

			this.disabledupdatesettlement = true;

		})
	};


	//Reactive Forms
	formControlSetForAffidavit() {
		this.affidavitForm = this.fb.group({
			parentcustomer: [''],
			customer: [''],
			deliverytype: [''],
			callstartdate: [null],
			callenddate: [null],
			contracttype: [''],
		});


	};


	cascaddingData() {
		this.cascadingParenetCustomer = this.rMSApiService.getFinanceParentCustomer();
		this.cascadingChildCustomer = this.rMSApiService.getFinanceChildCustomer();
		this.cascadingContracttype = this.rMSApiService.getFinanceContract();
		this.cascadingcallDateStart = this.rMSApiService.getFinaceStartDate();
		this.cascadingcallDateEnd = this.rMSApiService.getFinaceEndDate();
		this.findParentObject = this.cascadingParenetCustomer;
		if (this.cascadingParenetCustomer) {
			this.affidavitForm.patchValue({
				parentcustomer: this.cascadingParenetCustomer.name
			})
		};
		if (this.cascadingChildCustomer) {
			this.affidavitForm.patchValue({
				customer: this.cascadingChildCustomer
			});

		};

		if (this.cascadingcallDateStart) {
			this.affidavitForm.patchValue({
				callstartdate: this.cascadingcallDateStart
			})
		};

		if (this.cascadingcallDateEnd) {
			this.affidavitForm.patchValue({
				callenddate: this.cascadingcallDateEnd
			})
		};
		if (this.cascadingContracttype) {
			this.affidavitForm.patchValue({
				contracttype: this.cascadingContracttype
			})
		};
		let parent;

	};


	casscadingApi() {
		let parentCustomer = this.cascadingParenetCustomer;

		if (parentCustomer || this.cascadingChildCustomer || this.cascadingcallDateStart || this.cascadingcallDateEnd || this.cascadingContracttype) {
			if (parentCustomer == undefined || parentCustomer == NaN || parentCustomer == null)
				parentCustomer = ''
			else
				parentCustomer = this.cascadingParenetCustomer.parentGPCustomerId;

			this.managementService.getChildCustomerBasedOnParentId(parentCustomer).subscribe((response: any) => {
				this.customer = response.items;
			},
				error => {

					this.toasterComponent.onError(error)
				}
			);

			if (this.cascadingChildCustomer == undefined || this.cascadingChildCustomer == NaN || this.cascadingChildCustomer == null)
				this.cascadingChildCustomer = '';
			else
				this.cascadingChildCustomer = this.rMSApiService.getFinanceChildCustomer();

			if (parentCustomer == undefined || parentCustomer == NaN || parentCustomer == null || parentCustomer == "")
				parentCustomer = ''
			else
				parentCustomer = this.cascadingParenetCustomer.id;
			let deliveryTypeId = '';
			let beginDate = this.rMSApiService.getFinaceStartDate();
			let endDate = this.rMSApiService.getFinaceEndDate();
			if (beginDate == undefined || beginDate == NaN || beginDate == null || beginDate == "") {
				beginDate = ''
			} else {
				beginDate = this.datePipe.transform(this.cascadingcallDateStart, 'yyyy-MM-dd');
			}
			if (endDate == undefined || endDate == NaN || endDate == null || endDate == "") {
				endDate = ''
			} else {
				endDate = this.datePipe.transform(this.cascadingcallDateEnd, 'yyyy-MM-dd');
			}
			if (this.cascadingContracttype == undefined || this.cascadingContracttype == NaN || this.cascadingContracttype == null)
				this.cascadingContracttype = ''
			else
				this.cascadingContracttype = this.rMSApiService.getFinanceContract();
			this.rMSApiService.showLoader(true);
			this.managementService.getGridManagementList(parentCustomer, this.cascadingChildCustomer, deliveryTypeId, beginDate, endDate, this.cascadingContracttype).subscribe((data: any) => {
				this.rowData = data.items;
				this.rMSApiService.showLoader(false);
			},
				error => {
					this.rMSApiService.setData(error)
					this.rMSApiService.showLoader(false);
					this.router.navigate(['/Error'])
				}
			)


			//this.searchAffidavit();
		} else {
			this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
			let userFindSales = this.userInfo.roles.find(item => item == 'Finance Sales Admin');
			let userFindOps = this.userInfo.roles.find(item => item == 'Finance Operations');
			if (userFindSales && userFindOps) {
				this.searchAffidavit();
			}
			if (userFindSales) {
			} else {
				this.searchAffidavit();
			}

			this.valuesChanges();
		}
	}


	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	};
	onGridReady(params) {

		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.rowSelection = "multiple";
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		};
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
	};

	// Get email template from management service to bind the data
	emailTemplateManagement() {

		this.managementService.getemailTemplateManagement().subscribe((response: any) => {
			this.emailTemplate = response.items;

		},
			error => {

				this.toasterComponent.onError(error)
			}
		)
	}
	// Get parent customer from Management service to bind the data
	parentCustomerManagement() {
		this.loading = true;
		this.managementService.getParentCustomerManagement().subscribe((response: any) => {
			this.parentCustomer = response.items;
			this.loading = false;


		},
			error => {
				this.loading = false;
				this.toasterComponent.onError(error)
			}
		)
	}

	// Get DeliveryType from Management service to bind the data
	deliveryTypeManagement() {

		this.managementService.getDeliveryTypeManagement().subscribe((response: any) => {
			this.deliveryType = response.items;

		},
			error => {

				this.toasterComponent.onError(error)
			})
	}
	// Get ContractType from Management service to bind the data
	contractTypeManagement() {

		this.managementService.getContractTypeManagement().subscribe((response: any) => {
			this.contractType = response.items;

		},
			error => {

				this.toasterComponent.onError(error)
			})
	};


	getParentCustomer() {

		let parentId = this.affidavitForm.get('parentcustomer').value;
		if (parentId) {
			this.findParentObject = this.parentCustomer.find(item => item.name == parentId);
		}
		this.rMSApiService.setFinanceParentCustomer(this.findParentObject);
		this.emitterService.refreshfinance.emit(this.findParentObject.name);
		this.managementService.getChildCustomerBasedOnParentId(this.findParentObject.parentGPCustomerId).subscribe((response: any) => {
			this.customer = response.items;

		},
			error => {

				this.toasterComponent.onError(error)
			}
		)
	};

	valuesChanges() {
		let parentGPCustomerId = '';
		this.rMSApiService.showLoader(true);
		this.managementService.getChildCustomerBasedOnParentId(parentGPCustomerId).subscribe((response: any) => {
			this.customer = response.items;
			this.rMSApiService.showLoader(false);
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)
	}

	changeEmailEvent(e) {
		this.emailUniqueId = e.value;
		if (this.emailUniqueId && this.selectedData.length <= 0) {
			this.disabledupdatesettlement = true;
		} else if (this.emailUniqueId && this.selectedData.length >= 1) {
			this.disabledupdatesettlement = false;

		}
		else if (this.emailUniqueId) {
			this.disabledupdatesettlement = true;
		}
		else {
			this.disabledupdatesettlement = true;
		}
	}

	valueChanged(e) {
		this.rMSApiService.setFinaceStartDate(e.value);
		this.minEndDate = _moment(e.value).add(1, 'day').format();
		this.maxDate = _moment(e.value).add(1, 'day').format();
	//	this.maxEndDate = _moment().subtract(1, "day").format();
	};

	setchildCustomer(e) {
		this.rMSApiService.setFinanceChildCustomer(e.value)
	}
	callendDateChange(e) {
		this.rMSApiService.setFinaceEndDate(e.value)
	}
	/* get value from contractType and store value in service */
	contractTypeChange(event) {
		this.rMSApiService.setFinanceContract(event.value);
	};

	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue);
	};

	onCellClicked(e) {

		this.gridId = e.data;
		if (e.colDef.field == 'icon' || e.colDef.headerName == "") {
		} else {
			this.router.navigate(['/Retailer/Profile'], { queryParams: { 'customerId': this.gridId.customerID, 'gpCustomerId': this.gridId.gpCustomerID, 'parentCustomerId': this.gridId.parentGPCustomerID } })

		}


	}
	removesearch() {
		this.searchValue = null
		this.gridApi.setQuickFilter(this.searchValue)
	}
	onPageSizeChanged() {
		var value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");
		// if (value == 10) {
		// 	element.classList.add("gridHeight10");
		// 	element.classList.remove("gridHeight50");
		// 	element.classList.remove("gridHeight100");
		// } else if (value == 50) {
		// 	element.classList.add("gridHeight50");
		// 	element.classList.remove("gridHeight10");
		// 	element.classList.remove("gridHeight100");
		// } else if (value == 100) {
		// 	element.classList.remove("gridHeight10");
		// 	element.classList.remove("gridHeight50");
		// 	element.classList.add("gridHeight100");
		// }

	}
	affidavitSend() {
		let dialogRef = this.dialog.open(AffidavitSendComponent,
			{
				data: {
					email_uniqueId: this.emailTemplateFormCtrl.value,
					checkBoxData: this.selectedData
				},
			}
		);
	};
	// Search Button
	searchAffidavit() {
		if (this.affidavitForm.invalid) {
			return;
		};
		let parentId = this.findParentObject;
		if (parentId) {
			parentId = this.findParentObject.id
		} else {
			parentId = '';
		}
		this.parentCustomerId = this.affidavitForm.get('parentcustomer').value;
		this.customerId = this.affidavitForm.get('customer').value;
		this.deliveryTypeId = this.affidavitForm.get('deliverytype').value;
		let startDate = this.affidavitForm.get('callstartdate').value;
		let end = this.affidavitForm.get('callenddate').value;
		this.contractTypeId = this.affidavitForm.get('contracttype').value;
		let beginDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
		if (beginDate == null) {
			beginDate = ''
		} else {
			beginDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
		};
		let endDate = this.datePipe.transform(end, 'yyyy-MM-dd');
		if (endDate == null) {
			endDate = ''
		} else {
			endDate = this.datePipe.transform(end, 'yyyy-MM-dd');
		};
		this.rMSApiService.showLoader(true);
		this.managementService.getGridManagementList(parentId, this.customerId, this.deliveryTypeId, beginDate, endDate, this.contractTypeId).subscribe((data: any) => {
			this.rowData = data.items;
			//this.rowData[0].affidavitEmail=null;
			// this.rowData[0].numSent=0;
			// this.rowData.map(row => row.noEmail = "NoEmail");
			// if (this.rowData.length <= 10) {
			// 	$('.ag-paging-panel').hide();
			// } else {
			// 	$('.ag-paging-panel').show();
			// }
			this.rMSApiService.showLoader(false);
		},
			error => {
				this.rMSApiService.setData(error)
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error'])
			}
		)
	};

	selectionChanged(params) {
		this.selectedData = this.gridApi.getSelectedRows();

		if (this.selectedData.length > 0 && this.emailUniqueId) {
			this.disabledupdatesettlement = false;
			this.tempArray = this.selectedData;
			//this.selectedData=[];
		} else if (this.selectedData.length < 0) {
			this.tempArray = this.tempArray.filter(element => element.id != this.selectedData.id);

		} else if (this.selectedData.length >= 1) {
			this.disabledupdatesettlement = true;
			this.tempArray = this.selectedData;
		} else if (this.emailUniqueId && !this.selectedData) {
			this.disabledupdatesettlement = true;
		} else if (this.selectedData.length >= 0) {
			//this.tempArray = this.selectedData
			this.disabledupdatesettlement = true;
			this.tempArray = this.selectedData;
		};

		this.rMSApiService.setCheckedDataSettlement(this.tempArray);
	}


	hasError(controlName: string, errorName: string) {
		return this.affidavitForm.controls[controlName].hasError(errorName);
	}

	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	validatedate(event) {


		this.customValidatorService.isDateMaxlengthForamt(event)


	}
	//***************cancel button*********************/
	cancel() {
		this.affidavitForm = this.fb.group({
			parentcustomer: [''],
			customer: [''],
			deliverytype: [''],
			callstartdate: [null],
			callenddate: [null],
			contracttype: ['']
		})
		
		this.required = false;
		this.rowData = [];
		this.rMSApiService.removeFinanceParentCustomer();
		this.rMSApiService.removeFinanceChildCustomer();
		this.rMSApiService.removeFinanceContract();
		this.rMSApiService.removeFinanaceReportStatus();
		this.rMSApiService.removeFinaceStartDate();
		this.rMSApiService.removeFinaceEndDate();
		this.minEndDate = ""
		this.maxDate = "";
		this.maxEndDate = "";
		this.findParentObject = '';
		this.valuesChanges();
		//this.affidavitSend();
	};


	ngOnDestroy() {
		if (this.router.url == '/Management/sales' || this.router.url == '/Management/invoice' || this.router.url == '/Management/history' || this.router.url == '/Management/Affidavit') {

		} else {
			this.rMSApiService.removeFinanceParentCustomer();
			this.rMSApiService.removeFinanceChildCustomer();
			this.rMSApiService.removeFinanceContract();
			this.rMSApiService.removeFinanaceReportStatus();
			this.rMSApiService.removeFinaceStartDate();
			this.rMSApiService.removeFinaceEndDate();
		}

	}
}