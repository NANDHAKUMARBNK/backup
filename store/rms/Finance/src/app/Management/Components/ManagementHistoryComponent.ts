import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoryResendIconComponent } from './HistoryResendIconComponent';
import { HistoryViewIconComponent } from './HistoryViewIconComponent';
import { ManagementService } from '../service/ManagementService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
declare var $: any;
import * as _moment from 'moment';
//import { Location } from '@angular/common';
import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RMSApiService } from 'common/services/RMSApiService';
import { CustomValidatorService } from 'common/CustomValidation/CustomValidatorService';
import { RMSMomentDateAdapter } from 'common/adapter/RMSMomentDateAdapter';
import { EmitterService } from 'common/services/emitterService';
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
	selector: 'app-managementhistory',
	templateUrl: '../../../../../../../Views/Finance/Management/ManagementHistory.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss',],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, CustomValidatorService
	]
})

export class ManagementHistoryComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	private gridApi;
	private gridColumnApi;

	// addNewReportForm: FormGroup;
	historyForm: FormGroup;
	columnDefs: any
	defaultColDef: any
	rowData: any;
	deleteid: [];
	searchValue: string;
	updatedId: any;
	getRowHeight;
	private getRowNodeId;
	dataId: any;
	singleClickEdit: any
	brand: string;
	gridId: any;
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	name: any;
	rowSelection: string;
	panelOpenState = false;
	showDocument: boolean = false;
	config = new MatDialogConfig();
	data: any;
	id: any;
	historyParentCustomerId: any;
	historyChildCustomerId: any;
	historyInvoiceNumberId: any;
	historyParentCustomer: any;
	historyChildCustomer: any;
	historyInvoiceNumber: any;
	required: boolean = false;
	//hasError: boolean = false;
	minHistoryInvoiceStartDate: any;
	minHistoryInvoiceEndDate: any;
	invoicestartdate = new FormControl(moment());
	invoiceenddate = new FormControl(moment());
	findParentObject: any;
	domLayout: any;
	paginationPageSize: any;
	loading: boolean = true;
	todayDate: string;
	typeData: any;
	constructor(private http: HttpClient, private datePipe: DatePipe, private rMSApiService: RMSApiService,
		private managementService: ManagementService, private toasterComponent: ToasterComponent,
		private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
		private customValidatorService: CustomValidatorService, private emitterService: EmitterService,
		private dialog: MatDialog) {
		this.columnDefs = [
			{
				headerName: 'Resend',
				field: "region",
				width: 80,
				cellRendererFramework: HistoryResendIconComponent,

			},
			{
				headerName: 'View',
				field: "embark",
				width: 70,
				cellRendererFramework: HistoryViewIconComponent,
				sortable: true,
			},
			{
				headerName: 'Type',
				field: "typeName",
				sortable: true,
				autoHeight: true,
				width: 120,
				cellStyle: { 'cursor': "initial" },
			},

			{
				headerName: 'Invoice #',
				field: "invoiceNum",
				sortable: true,
				autoHeight: true,
				width: 140,
				cellStyle: { 'cursor': "initial" },
			},
			{
				headerName: 'Parent',
				field: "parentCustomerName",
				sortable: true,
				autoHeight: true,
				width: 240,
				cellStyle: { 'cursor': "initial" },
			},
			{
				headerName: 'Customer',
				field: "customerName",
				sortable: true,
				autoHeight: true,
				width: 330,
				cellStyle: { 'cursor': "initial" },
			},
			
			{
				headerName: 'Sent',
				field: "deliveredDateTime",
				sortable: true,
				autoHeight: true,
				width: 90,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy');
				},
				cellStyle: { 'cursor': "initial" },
			},
			{
				headerName: 'Email',
				field: "emailAddress",
				sortable: true,
				autoHeight: true,
				width: 230,
				cellStyle: { 'cursor': "initial" },
			},
		];

		this.defaultColDef = {
			resizable: true,
		}
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

	ngOnInit() {
		this.formControlSetForHistory();
		this.historyParentCustomerManagement();
		this.valuesChanges();
		this.getType();
		//this.historyInvoiceNumberManagement();
		setTimeout(() => {
			this.cassadingFormControls()

		}, 800);

		this.emitterService.refreshHistory.subscribe(d => {
			this.rowData = [];
			this.searchHistory();
		})

		this.todayDate = moment().subtract(90, 'days').format();
		this.historyForm.patchValue({
			invoicestartdate: this.todayDate
		})
		this.minHistoryInvoiceEndDate = this.todayDate;
		//this.minHistoryInvoiceStartDate = _moment().subtract(2, 'days').format();
		//this.minHistoryInvoiceEndDate = _moment().subtract(1, 'day').format();

	}
	maxDate: any;
	maxEndDate: any;
	invoiceDateChange(e) {
		this.minHistoryInvoiceEndDate = _moment(e.value).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
		this.rMSApiService.setFinaceStartDate(e.value);
		this.maxDate = _moment(e.value).add(1, 'day').format();
		this.maxEndDate = _moment().subtract(1, "day").format();
	};

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
		}
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
		// this.gridApi.sizeColumnsToFit();
	//	console.log(this.gridApi.sizeColumnsToFit())
		//  minRowHeight = 30;
		// currentRowHeight = minRowHeight;
		// params.api.sizeColumnsToFit();
	}
	hasError(controlName: string, errorName: string) {
		return this.historyForm.controls[controlName].hasError(errorName);
	}
	validatedate(event) {

		this.customValidatorService.isDateMaxlengthForamt(event)


	}
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	};
	onRowClicked(e) {
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


	}
	formControlSetForHistory() {
		this.historyForm = this.fb.group({
			parentCustomerHistoryCtrl: [''],
			childCustomerHistoryCtrl: [''],
			invoiceNumberHistoryCtrl: ['', [Validators.minLength(3), Validators.maxLength(25)]],
			invoicestartdate: [null],
			invoiceenddate: [null],
			typeId:['']
		});

	};

	cassadingFormControls() {
		let cascadingParenetCustomer = this.rMSApiService.getFinanceParentCustomer();
		let cascadingChildCustomer = this.rMSApiService.getFinanceChildCustomer();
		this.findParentObject = cascadingParenetCustomer;

		if (cascadingParenetCustomer) {
			this.historyForm.patchValue({
				parentCustomerHistoryCtrl: cascadingParenetCustomer.name
			});

		};
		if (cascadingChildCustomer) {
			this.historyForm.patchValue({
				childCustomerHistoryCtrl: cascadingChildCustomer
			});

		};

		let patchValue = this.historyForm.value;
		let parentCustomer = cascadingParenetCustomer;
		if (patchValue.parentCustomerHistoryCtrl || patchValue.childCustomerHistoryCtrl) {
			if (parentCustomer == undefined || parentCustomer == NaN || parentCustomer == null || parentCustomer == "")
				parentCustomer = ''
			else
				parentCustomer = cascadingParenetCustomer.parentGPCustomerId;
			this.managementService.getChildCustomerHistoryManagement(parentCustomer).subscribe((response: any) => {
				this.historyChildCustomer = response.items;
			},
				error => {
					this.toasterComponent.onError(error)
				}
			);
			if (cascadingChildCustomer == undefined || cascadingChildCustomer == NaN || cascadingChildCustomer == null)
				cascadingChildCustomer = '';
			else
				cascadingChildCustomer = this.rMSApiService.getFinanceChildCustomer();

			if (parentCustomer == undefined || parentCustomer == NaN || parentCustomer == null || parentCustomer == "")
				parentCustomer = ''
			else
				parentCustomer = cascadingParenetCustomer.id

			let historyInvoiceNumberId = '';
			let beginDate = '';
			let endDate = '';
			let type=''
			this.rMSApiService.showLoader(true);
			this.managementService.getGridHistoryManagementList(parentCustomer, cascadingChildCustomer, type,historyInvoiceNumberId, beginDate, endDate).subscribe((data: any) => {
				this.rowData = data.items;
				this.rMSApiService.showLoader(false);

			},
				error => {
					this.rMSApiService.setData(error)
					this.rMSApiService.showLoader(false);
					this.router.navigate(['/Error'])
				}

			);


		} else {
			this.valuesChanges();
			this.searchHistory();
		}
	}
	searchHistory() {
		if (this.historyForm.invalid) {
			return;
		}
		let parentId = this.findParentObject;
		if (parentId) {
			parentId = this.findParentObject.id
		} else {
			parentId = '';
		}
		this.historyParentCustomerId = this.historyForm.get('parentCustomerHistoryCtrl').value;
		this.historyChildCustomerId = this.historyForm.get('childCustomerHistoryCtrl').value;
		this.historyInvoiceNumberId = this.historyForm.get('invoiceNumberHistoryCtrl').value;
		let typeId=this.historyForm.get('typeId').value;
		let startDate = this.historyForm.get('invoicestartdate').value;
		let end = this.historyForm.get('invoiceenddate').value;
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
		this.managementService.getGridHistoryManagementList(parentId, this.historyChildCustomerId,typeId, this.historyInvoiceNumberId, beginDate, endDate).subscribe((data: any) => {
			this.rowData = data.items;
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
	}
	//***************cancel button*********************/
	cancel() {
		this.historyForm = this.fb.group({
			parentCustomerHistoryCtrl: [''],
			childCustomerHistoryCtrl: [''],
			invoiceNumberHistoryCtrl: [''],
			invoicestartdate: [null],
			invoiceenddate: [null],
			typeId:['']
		})
		this.minHistoryInvoiceEndDate = moment().format();
		
		this.required = false;
		this.rowData = [];
		this.rMSApiService.removeFinanceParentCustomer();
		this.rMSApiService.removeFinanceChildCustomer();
		this.maxDate = "";
		this.maxEndDate = "";
		this.findParentObject = '';

		this.valuesChanges();
	};

	// Get parent customer from History Management service to bind the data
	historyParentCustomerManagement() {
		this.loading = true;
		this.managementService.getParentCustomerHistoryManagement().subscribe((response: any) => {
			this.historyParentCustomer = response.items;
			this.loading = false;
		},
			error => {
				this.loading = false;
				this.toasterComponent.onError(error)
			}
		)
	};

	getParentCustomer() {
		let parentId = this.historyForm.get('parentCustomerHistoryCtrl').value;

		if (parentId) {
			this.findParentObject = this.historyParentCustomer.find(item => item.name == parentId);
		}
		this.rMSApiService.setFinanceParentCustomer(this.findParentObject);
		//this.rMSApiService.showLoader(true);
		this.managementService.getChildCustomerHistoryManagement(this.findParentObject.parentGPCustomerId).subscribe((response: any) => {
			this.historyChildCustomer = response.items;
			//this.rMSApiService.showLoader(false);
		},
			error => {
			//	this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)
	};

	valuesChanges() {
		let parentGPCustomerId = '';
		this.rMSApiService.showLoader(true);
		this.managementService.getChildCustomerHistoryManagement(parentGPCustomerId).subscribe((response: any) => {
			this.historyChildCustomer = response.items;
			this.rMSApiService.showLoader(false);
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)
	}
	childcustomer(event) {
		this.rMSApiService.setFinanceChildCustomer(event.value);
	};


	getType(){
		this.managementService.getType().subscribe((data:any)=>{
			this.typeData=data.items;
		})
	}
	// Get invoice number from History Management service to bind the data
	historyInvoiceNumberManagement() {
		this.managementService.getInvoiceNumberHistoryManagement().subscribe((response: any) => {
			this.historyInvoiceNumber = response.items;
		},
			error => {
				this.toasterComponent.onError(error)
			})
	};
	// historyInvoiceEndDate(e) {
	// 	this.minHistoryInvoiceEndDate = moment(e.value).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
	// }

	ngOnDestory() {
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
