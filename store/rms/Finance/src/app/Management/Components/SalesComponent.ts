import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MatDialogConfig, MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { SalesHistoryIconComponent } from './HistoryIconComponent';
import { SalesCommentIconComponent } from './SalesCommentIcon';
import { SalesHistoryComponent } from './SalesHistoryComponent';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ManagementService } from '../service/ManagementService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { DatePipe } from '@angular/common';
import { interval } from 'rxjs';
declare var $: any;
import * as _moment from 'moment';
//import { Location } from '@angular/common';
import { default as _rollupMoment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RMSApiService } from 'common/services/RMSApiService';
import { SalesSelectComponent } from './SalesSelectComponent';
import { EmitterService } from 'common/services/emitterService';
import { NumericEditorComponent } from 'common/components/NumericEditorComponent'
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
	selector: 'app-financesales',
	templateUrl: '../../../../../../../Views/Finance/Management/sales.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss', '../../../../../../common/styles/Modal.scss'],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, CustomValidatorService
	]
})

export class ManagementSalesComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	private gridApi;
	private gridColumnApi;

	// addNewReportForm: FormGroup;

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
	parentCustomerSales: any;
	customerSales: any;
	shipSales: any;
	portSales: any;
	statusSales: any;
	contractTypeSales: any;
	salesForm: FormGroup;
	parentCustomerSalesId: any;
	customerSalesId: any;
	shipSalesId: any;
	portSalesId: any;
	statusSalesId: any;
	contractTypeSalesId: any;
	required: boolean = false;
	//hasError: boolean = false;
	minSalesStartDate: any;
	minSalesEndDate: any;
	callstartdate = new FormControl(moment());
	callenddate = new FormControl(moment());
	saletenminutes: boolean = false;
	salezerominutes: boolean = false;
	updateSales: boolean = true;
	amountChanged: any;
	salesEditArray: any = [];
	salesTypeId: any;
	updatetypeId: any;
	SelecttypeId: any = [];
	findParentObject: any;
	domLayout: any;
	paginationPageSize: any;
	cascadingParenetCustomercheck: any;
	shipid: string;
	cascadingcallDateEnd: any;
	cascadingContracttype: any;
	cascadingcallDateStart: any;
	cascadingChildCustomer: any;
	cascadingParenetCustomer: any;
	loading: boolean = true;
	subscription: any;
	combinefeid: any;
	settypeBoolean: boolean = false;
	typeChangeDataAvaliable: any = [];
	typeDataSelect: any;

	// @HostListener('window:beforeunload') goToPage() {
	// 	this.salesUnlock();
	// }

	constructor(private http: HttpClient, private datePipe: DatePipe, private router: Router, private emitterService: EmitterService,
		private toasterComponent: ToasterComponent, private customValidatorService: CustomValidatorService, private fb: FormBuilder, private rMSApiService: RMSApiService,
		private managementService: ManagementService, private route: ActivatedRoute, private dialog: MatDialog) {
		

		this.columnDefs = [
			{
				headerName: 'Customer',
				field: "gPCustomerID",
				sortable: true,
				editable: false,
				autoHeight: true,
				width: 125
			},

			{
				headerName: 'Call Date',
				field: "callDate",
				sortable: true,
				editable: false,
				autoHeight: true,
				width: 90,
				cellRenderer: (params) => {
				
					return this.datePipe.transform(params.value, 'MM/dd/yy');
				}
			},
			{
				headerName: 'Ship',
				field: "shipName",
				sortable: true,
				editable: false,
				autoHeight: true,
				width: 90
			},
			{
				headerName: 'Contract',
				field: "typeName",
				sortable: true,
				autoHeight: true,
				editable: false,
				width: 125
			},
			{
				headerName: 'Status',
				field: "statusName",
				sortable: true,
				editable: false,
				autoHeight: true,
				width: 100
			},

			{
				headerName: 'Sales/Fee',
				field: "salesFeeDisplay",
				sortable: true,
				editable: false,
				autoHeight: true,
				width: 150,
				//cellRenderer: (params) => {
				//	if (params.value)
				//		return '$' + params.value.toFixed(2);
				//	else
				//		return

				//},
			},
			{
				headerName: 'Type',
				field: "SalesTypeOptions",
				autoHeight: true,
				cellRendererFramework: SalesSelectComponent,
				width: 150,
				editable: function (params) {
				
					if (params.data.SalesTypeControl == 'DRPDWN') {
						return
					}
				
				},
				cellEditor: 'agSelectCellEditor',
				cellEditorParams: { values:  this.rowData.SalesTypeOptions.salesTypeValue},
				cellRenderer: function (params: any) {
				
					if (params.data.SalesTypeControl == 'LABEL') {
						return `<p>${params.data.SalesTypeLabel} </p>`
					}
					
				},




			},
			{
				headerName: 'Amount',
				field: "amountDefault",
				sortable: true,
				//editable: false,
				autoHeight: true,
				width: 100,
				//cellRendererFramework: SalesInputComponent,
				cellEditorFramework: NumericEditorComponent,
				cellRenderer: function (params) {
					if (params.data.lockUserID) {
						return ' <i class="fas fa-lock"></i>'
					} else if (params.data.SalesTypeControl == 'LABEL') {
						if(params.data.amountIsEditable==0){
							return `<p>${params.data.amountDefault}  </p>`
						}
					
					}
				},
				editable: function (params) {
					// allow `min_value` cell to be edited for rows with correct `validation_type`
					if (params.data.SalesTypeControl == 'LABEL') {
						if(params.data.amountIsEditable >=1){
							return
						}
						
					}
				//	return params.data.lockUserID == null || params.data.amountIsEditable>=1;
				},


			},
			{
				headerName: '',
				field: "",
				width: 100,
				cellRendererFramework: SalesHistoryIconComponent,
			},
			// {
			// 	headerName: '',
			// 	field: "embark",
			// 	width: 100,
			// 	cellRendererFramework: SalesCommentIconComponent,
			// },

		];

		this.defaultColDef = {
			resizable: true,
			suppressCellSelection: true
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
		//	this.valuesChanges();
		this.formControlSetForAffidavit();
		this.parentCustomerSalesManagement();
		this.valuesChanges();
		this.shipSalesManagement();
		this.portSalesManagement();
		this.statusSalesManagement();
		this.contractTypeSalesManagement();
		this.setFormControls();

		this.minSalesStartDate = _moment().subtract(2, 'days').format();
		this.minSalesEndDate = _moment().subtract(1, 'day').format();
		setInterval(() => {
			let minute = new Date().getMinutes();
			if (minute >= 50 && minute < 60) {
				this.saletenminutes = true;
				this.salezerominutes = false;
			} else if (minute > 0 && minute < 5) {
				this.salezerominutes = true;
				this.saletenminutes = false;
			} else if (minute >= 35 && minute < 40) {
			}
		}, 1000);

		this.emitterService.updateSales.subscribe(d => {
			if (this.salesEditArray) {
				this.salesEditArray = [];
			} if (this.updatetypeId) {
				this.updatetypeId = [];
			} if (this.SelecttypeId) {
				this.SelecttypeId = [];
			}
		})

		this.emitterService.salesSelect.subscribe(data => {
			this.SelecttypeId = data;
			// let typeChange;
			// this.rowData.forEach(item=>{
			// 	if(item.progressAmount){
			// 		typeChange=item.progressAmount
			// 		this.typeChangeDataAvaliable.push(typeChange)
			// 	}
			// })
			// if(this.typeChangeDataAvaliable.length>=1&& this.SelecttypeId.length >= 1){
			// 	this.settypeBoolean=true;
			// 	this.updateSales = false;
			if (this.salesEditArray.length >= 1 && this.SelecttypeId.length >= 1) {
				this.updateSales = false;
			}
			// }else{
			// 	this.updateSales = true;
			// }
			// if (this.salesEditArray.length >= 0 && this.SelecttypeId.length >= 1) {
			// 	this.updateSales = true;
			// }else if(this.salesEditArray.length >= 1 && this.SelecttypeId.length >= 1){
			// 	this.updateSales = false;
			// }
		});

		this.subscription = this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				if (this.router.url == '') {

				} else {
					//this.salesUnlock();
				}

			};


		});
	}
	maxDate: any;
	maxEndDate: any;



	getsalesSelect() {
		this.managementService.getTypeSalesGrid().subscribe((data: any) => {
			this.typeDataSelect = data.items;
			this.rMSApiService.setcascaddingitem(this.typeDataSelect)


		});
	}

	dateValueChanged(e) {
		this.minSalesEndDate = _moment(e.value).add(1, 'day').format();
		this.rMSApiService.setFinaceStartDate(e.value);
		this.maxDate = _moment(e.value).add(1, 'day').format();
		this.maxEndDate = _moment().subtract(1, "day").format();
	};
	hasError(controlName: string, errorName: string) {
		return this.salesForm.controls[controlName].hasError(errorName);
	}
	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	};
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		//this.rowSelection = "multiple";
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		}
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
	};


	// salesFinance management starts
	formControlSetForAffidavit() {
		this.salesForm = this.fb.group({
			parentCustomerSalesCtrl: [''],
			customerSalesCtrl: [''],
			shipSalesCtrl: [''],
			portSalesCtrl: [''],
			statusSalesCtrl: [''],
			callstartdate: [null],
			callenddate: [null],
			contractTypeSalesCtrl: [''],
		});

	};





	setFormControls() {
		this.cascadingParenetCustomer = this.rMSApiService.getFinanceParentCustomer();
		this.cascadingChildCustomer = this.rMSApiService.getFinanceChildCustomer();
		this.cascadingcallDateStart = this.rMSApiService.getFinaceStartDate();
		this.cascadingContracttype = this.rMSApiService.getFinanceContract();
		this.cascadingcallDateEnd = this.rMSApiService.getFinaceEndDate();
		this.shipid = localStorage.getItem('salesthis.shipid')
		this.cascadingParenetCustomercheck = this.cascadingParenetCustomer
		this.findParentObject = this.cascadingParenetCustomer;

		if (this.shipid) {
			this.salesForm.patchValue({
				shipSalesCtrl: parseInt(this.shipid)
			})
		};
		if (this.cascadingParenetCustomer) {
			this.salesForm.patchValue({
				parentCustomerSalesCtrl: this.cascadingParenetCustomer.name
			})
		};
		if (this.cascadingChildCustomer) {
			this.salesForm.patchValue({
				customerSalesCtrl: this.cascadingChildCustomer
			})
		};

		if (this.cascadingcallDateStart) {
			this.salesForm.patchValue({
				callstartdate: this.cascadingcallDateStart
			})
		};
		if (this.cascadingcallDateEnd) {
			this.salesForm.patchValue({
				callenddate: this.cascadingcallDateEnd
			});
		}
		if (this.cascadingContracttype) {
			this.salesForm.patchValue({
				contractTypeSalesCtrl: this.cascadingContracttype
			});

		};
		//this.casccadingApi(this.cascadingParenetCustomer,this.cascadingChildCustomer,this.shipid,this.this.cascadingContracttype,this.cascadingcallDateEnd,this.cascadingcallDateStart)
	};

	casccadingApi() {
		let patchValue = this.salesForm.value;
		if (patchValue.parentCustomerSalesCtrl || patchValue.customerSalesCtrl || patchValue.shipSalesCtrl || patchValue.portSalesCtrl || patchValue.statusSalesCtrl || patchValue.callstartdate || patchValue.callenddate || patchValue.contractTypeSalesCtrl) {
			this.parentCustomerSalesManagement();
			if (this.cascadingParenetCustomer == undefined || this.cascadingParenetCustomer == NaN || this.cascadingParenetCustomer == null)
				this.cascadingParenetCustomer.parentGPCustomerId = ''
			else
				this.cascadingParenetCustomer = this.rMSApiService.getFinanceParentCustomer();

			this.managementService.getCustomerSalesManagement(this.cascadingParenetCustomer.parentGPCustomerId).subscribe((response: any) => {
				this.customerSales = response.items;
			},
				error => {
					this.toasterComponent.onError(error)
				}
			);
			if (this.cascadingChildCustomer == undefined || this.cascadingChildCustomer == NaN || this.cascadingChildCustomer == null)
				this.cascadingChildCustomer = '';
			else
				this.cascadingChildCustomer = this.rMSApiService.getFinanceChildCustomer();

			if (this.cascadingParenetCustomer == undefined || this.cascadingParenetCustomer == NaN || this.cascadingParenetCustomer == null)
				this.cascadingParenetCustomer.id = ''
			else
				this.cascadingParenetCustomer = this.rMSApiService.getFinanceParentCustomer();


			if (this.shipid == undefined)
				this.shipid = '';
			else
				this.shipid = localStorage.getItem('salesthis.shipid');
			let portSalesId = '';
			let statusSalesId = this.salesForm.get('statusSalesCtrl').value;
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
			this.managementService.getGridSalesManagementList(this.cascadingParenetCustomer.id, this.cascadingChildCustomer, this.shipid, portSalesId, statusSalesId, beginDate, endDate, this.cascadingContracttype).subscribe((data: any) => {
				this.rowData = data;
				this.rowData.forEach(item => {
					item.focus = true;
				});
				this.rMSApiService.showLoader(false);

			},
				error => {
					this.rMSApiService.showLoader(false);
					this.router.navigate(['/Error'])
				}
			)

			//this.searchSales();	


		} else {
			this.valuesChanges();

		}
	}

	searchSales() {
		if (this.salesForm.invalid) {
			return;
		}
		let parentId = this.findParentObject
		if (parentId) {
			parentId = this.findParentObject.id
		} else {
			parentId = '';
		}

		this.parentCustomerSalesId = this.salesForm.get('parentCustomerSalesCtrl').value;
		this.customerSalesId = this.salesForm.get('customerSalesCtrl').value;
		this.shipSalesId = this.salesForm.get('shipSalesCtrl').value;
		this.portSalesId = this.salesForm.get('portSalesCtrl').value;
		this.statusSalesId = this.salesForm.get('statusSalesCtrl').value;
		let startDate = this.salesForm.get('callstartdate').value;
		let end = this.salesForm.get('callenddate').value;
		this.contractTypeSalesId = this.salesForm.get('contractTypeSalesCtrl').value;

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
		this.managementService.getGridSalesManagementList(parentId, this.customerSalesId, this.shipSalesId, this.portSalesId, this.statusSalesId, beginDate, endDate, this.contractTypeSalesId).subscribe((data: any) => {
			this.rowData = data;
		
			if (this.salesEditArray) {
				this.salesEditArray = [];
			} if (this.updatetypeId) {
				this.updatetypeId = [];
			} if (this.SelecttypeId) {
				this.SelecttypeId = [];
			};
			this.updateSales = true;
			this.rowData.forEach(item => {
				item.focus = true;
				//item.lockUserID=0;
				if (item.processedAmount == 0) {
					item.processedAmount = null;
				};
				if (item.feeAmount == 0) {
					item.feeAmount = null;
				}
				if (item.progressAmount == 0) {
					item.progressAmount = null;
				};
				if (item.lockUserID == 0) {
					item.lockUserID = 1
				};
			
			});

			this.rMSApiService.showLoader(false);

		},
			error => {
				this.rMSApiService.setData(error)
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error'])

			}
		)
	};
	validatedate(event) {


		this.customValidatorService.isDateMaxlengthForamt(event)


	}
	updateSalesClick() {
		this.updatetypeId = this.rMSApiService.getSalesType();
		this.updatetypeId.forEach(item => {
			this.salesTypeId = item;
		});
		let editsalesObj;
		let finaleditObj = [];



		this.salesEditArray.forEach(item => {
			if (item.statusCode == 'SUBMTD') {
				this.salesTypeId = item.progressTypeId
			};
	
			editsalesObj = { 'customerId': item.customerId, 'contractRateId': item.contractRateId, 'itinerarySequenceId': item.itinSequenceId, 'inProgressTrxId': item.progressTrxId, 'salesTypeId': this.salesTypeId, 'amount': item.progressAmount }
			finaleditObj.push(editsalesObj)
		});





	
		this.managementService.updateSales(finaleditObj).subscribe((data: any) => {
			if (this.data.retID >0) {
				this.emitterService.updateSales.emit(true)
				this.searchSales();
				this.updateSales = true;
				
				this.toasterComponent.onSucess();
			}else{
				this.toasterComponent.dynamicMessage(this.data);
				
			}
		
		},
			error => {
				//this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)
	}

	onCellValueChanged(event) {
		var staticType = false;
		// this.rowData.forEach(item => {
		// 	if (item.statusCode == 'SUBMTD') {
		// 		this.updatetypeId = item.typeId;
		// 	}
		// });
		let sumbitTypeId;
		if (event.data.statusCode == 'SUBMTD') {
			sumbitTypeId = event.data.progressTypeId;
		}
		this.amountChanged = event.data;
		if (this.amountChanged.progressAmount) {
			this.salesEditArray.push(this.amountChanged);
		} else {
			this.salesEditArray = [];
			//this.emitterService.salesSelect.emit();
		}
		//  if (this.amountChanged.progressAmount) {

		// };
		if (this.salesEditArray.length >= 1 && this.SelecttypeId.length >= 1 && this.amountChanged.progressAmount) {
			this.updateSales = false;
		} else if (staticType && this.salesEditArray.length >= 1 && this.amountChanged.progressAmount) {
			this.updateSales = false;
		} else if (this.salesEditArray.length >= 1 && sumbitTypeId && this.amountChanged.progressAmount) {
			this.updateSales = false;
			sumbitTypeId = null
		}
		else {
			this.updateSales = true;
			//this.salesEditArray=[];
		};

		this.managementService.salesLockPost(event.data.contractSalesId).subscribe((data: any) => {
			//this.searchSales();
			if (data.retID <= 0) {
				this.toasterComponent.contractValidation(data);
			};
		}, error => {
			//this.toasterComponent.onError(error)
		}
		)

	}
	//***************cancel button*********************/
	cancel() {
		this.salesForm = this.fb.group({
			parentCustomerSalesCtrl: [''],
			customerSalesCtrl: [''],
			shipSalesCtrl: [''],
			portSalesCtrl: [''],
			statusSalesCtrl: [''],
			callstartdate: [null],
			callenddate: [null],
			contractTypeSalesCtrl: [''],
		})
		this.minSalesEndDate = moment().format();
		this.maxDate = moment().format();
		this.maxEndDate = moment().format();
		this.required = false;
		this.rMSApiService.removeFinanceParentCustomer();
		this.rMSApiService.removeFinanceChildCustomer();
		this.rMSApiService.removeFinanceContract();
		this.rMSApiService.removeFinanaceReportStatus();
		this.rMSApiService.removeFinaceStartDate();
		this.rMSApiService.removeFinaceEndDate();
		this.rMSApiService.removePort();
		this.rowData = [];
		this.valuesChanges();
		this.findParentObject = '';
	};


	// Get parent customer from SalesManagement service to bind the data
	parentCustomerSalesManagement() {
		this.loading = true;
		this.managementService.getParentCustomerSalesManagement().subscribe((response: any) => {
			this.parentCustomerSales = response.items;
			this.loading = false;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};

	getParentCustomer() {
		let parentId = this.salesForm.get('parentCustomerSalesCtrl').value;
		this.findParentObject = this.parentCustomerSales.find(item => item.name == parentId);
		this.rMSApiService.setFinanceParentCustomer(this.findParentObject);

		this.managementService.getCustomerSalesManagement(this.findParentObject.parentGPCustomerId).subscribe((response: any) => {
			this.customerSales = response.items;

		},
			error => {

				this.toasterComponent.onError(error)
			}
		)
	}
	valuesChanges() {
		let parentGPCustomerId = '';
		this.managementService.getCustomerSalesManagement(parentGPCustomerId).subscribe((response: any) => {
			this.customerSales = response.items;
		},
			error => {

				this.toasterComponent.onError(error)
			}
		)
	}
	childcustomer(event) {
		this.rMSApiService.setFinanceChildCustomer(event.value);
	};

	contractChange(event) {
		this.rMSApiService.setFinanceContract(event.value)
	}

	// Get ship from SalesManagement service to bind the data
	shipSalesManagement() {
		this.managementService.getShipSalesManagement().subscribe((response: any) => {
			this.shipSales = response;
		},
			error => {
				this.toasterComponent.onError(error)
			})
	}
	// Get port from SalesManagement service to bind the data
	portSalesManagement() {
		let shipid = this.salesForm.get('shipSalesCtrl').value;
		this.managementService.getPortSalesManagement(shipid).subscribe((response: any) => {
			this.portSales = response;
		},
			error => {
				this.toasterComponent.onError(error)
			})
	}
	// Get status from SalesManagement service to bind the data
	statusSalesManagement() {
		this.managementService.getStatusSalesManagement().subscribe((response: any) => {
			this.statusSales = response.items;
			this.statusSales.forEach(item => {
				if (item.code == 'UNRPTD') {
					this.salesForm.patchValue({
						statusSalesCtrl: item.id
					})
				};
			});

			if (this.cascadingParenetCustomercheck) {
				this.casccadingApi();
			}
			if (!this.cascadingParenetCustomercheck || !this.cascadingChildCustomer) {
				this.searchSales();
			}


		},
			error => {
				this.toasterComponent.onError(error)
			})
	};

	// Get ContractType from SalesManagement service to bind the data
	contractTypeSalesManagement() {
		this.managementService.getContractTypeSalesManagement().subscribe((response: any) => {
			this.contractTypeSales = response.items;
		},
			error => {
				this.toasterComponent.onError(error)
			})
	};

	callendDateChange(e) {
		this.rMSApiService.setFinaceEndDate(e.value)
	};


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


	};

	salesUnlock() {
		this.managementService.salesUnlock().subscribe(data => {
		})
	}

	ngOnDestroy() {
		this.salesUnlock();
		if (this.salesEditArray) {
			this.salesEditArray = [];
		} if (this.updatetypeId) {
			this.updatetypeId = [];
		} if (this.SelecttypeId) {
			this.SelecttypeId = [];
		}
		if (this.router.url == '/Management/sales' || this.router.url == '/Management/invoice' || this.router.url == '/Management/history' || this.router.url == '/Management/Affidavit') {
		} else {
			this.rMSApiService.removeFinanceParentCustomer();
			this.rMSApiService.removeFinanceChildCustomer();
			this.rMSApiService.removeFinanceContract();
			this.rMSApiService.removeFinanaceReportStatus();
			this.rMSApiService.removeFinaceStartDate();
			this.rMSApiService.removeFinaceEndDate();
		};
		//this.salesUnlock();
		// this.rMSApiService.removeFinanceParentCustomer();
		// this.rMSApiService.removeFinanceChildCustomer();
		// this.rMSApiService.removeFinanceContract();
		// this.rMSApiService.removeFinanaceReportStatus();
		// this.rMSApiService.removeFinaceStartDate();
		// this.rMSApiService.removeFinaceEndDate();
		// this.rMSApiService.removePort();
		localStorage.removeItem('salesthis.shipid');
	}
}


