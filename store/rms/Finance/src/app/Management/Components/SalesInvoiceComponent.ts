import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesPreviewIconComponent } from './SalesPreviewIconComponent';
import { ManagementService } from '../service/ManagementService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { RMSApiService } from 'common/services/RMSApiService';
import { EmitterService } from 'common/services/emitterService';
import { DatePipe } from '@angular/common';
declare var $: any;
//import { Location } from '@angular/common';
@Component({
	selector: 'app-salesinvoice',
	templateUrl: '../../../../../../../Views/Finance/Management/SalesInvoice.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss', '../../../../../../common/styles/Modal.scss'],
	providers: [DatePipe]
})

export class SalesInvoiceComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	private gridApi;
	private gridColumnApi;
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
	emailTemplateFormCtrl: FormControl = new FormControl();
	name: any;
	isRowSelectable: any;
	rowSelection: string;
	panelOpenState = false;
	showDocument: boolean = false;
	config = new MatDialogConfig();
	data: any;
	id: any;
	required: boolean = false;
	hasError: boolean = false;
	parentCustomerSalesInvoice: any;
	childCustomerSalesInvoice: any;
	salesInvoiceForm: FormGroup;
	parentCustomerSalesInvoiceId: any;
	childCustomerSalesInvoiceId: any;
	emailTemplate: any;
	disabledupdatesettlement: boolean = true;
	//flatFeeCheckbox: boolean = false;
	emailUniqueId: any;
	selectedData: any;
	selectAllChecked = new FormControl(false);
	flatFee = new FormControl(false);
	domLayout: any;
	paginationPageSize: any;
	tempArray: any = [];
	loading: boolean = true;
	availableCheckBox: boolean;
	typeData: any;
	constructor(private http: HttpClient, private fb: FormBuilder, private emitterService: EmitterService, private router: Router, private toasterComponent: ToasterComponent, private managementService: ManagementService, private route: ActivatedRoute, private dialog: MatDialog, private rMSApiService: RMSApiService , private datePipe:DatePipe) {
		this.columnDefs = [
			{
				headerName: '',
				sortable: true,
				autoHeight: true,
				width: 70,
				headerCheckboxSelectionFilteredOnly: true,
				checkboxSelection: true,
				cellRenderer: params => {
					if (params.data.isEmailAvailable == false) {

						return `No Email`
					}
				},
				cellStyle: { 'cursor': "initial", "margin": "0px", "padding": "0px" }
			},

			{
				headerName: 'Preview',
				width: 80,
				cellRendererFramework: SalesPreviewIconComponent,
			},
			{
				headerName: 'Invoice Type',
				field: "invoiceTypeName",
				width: 140,
				sortable: true,
				cellStyle: { 'cursor': "initial" }
			},
			{
				headerName: 'Due Date',
				field: "dueDate",
				sortable: true,
				autoHeight: true,
				editable: false,
				width: 100,
				cellStyle: { 'cursor': "initial" },
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy');
				},
			},
			{
				headerName: 'Document #',
				field: "gpDocumentNumber",
				width: 135,
				sortable: true,
				cellStyle: { 'cursor': "initial" }
			},


			{
				headerName: 'Parent',
				field: "parentCustomerName",
				sortable: true,
				autoHeight: true,
				width: 240,
				cellStyle: { 'cursor': "initial" }
			},
			{
				headerName: 'Customer',
				field: "customerName",
				sortable: true,
				autoHeight: true,
				editable: false,
				width: 300,
				cellStyle: { 'cursor': "initial" }
			},
			{
				headerName: 'Port',
				field: "portName",
				sortable: true,
				autoHeight: true,
				editable: false,
				width: 100,
				cellStyle: { 'cursor': "initial" }
			},


		];
		this.defaultColDef = {
			//editable: true,
			resizable: true,
		}
		this.isRowSelectable = function (rowNode) {
			return rowNode.data ? rowNode.data.isEmailAvailable : true
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
	};

	ngOnInit() {

		this.formControlSetForSalesInvoice();
		this.parentCustomerSalesInvoiceManagement();
		this.valuesChanges();
		this.getType();
		this.casaddingData();
		this.emailTemplateManagement();

		this.emitterService.refreshInvoiceEmail.subscribe(data=>{
			this.emailTemplate=[];
			this.emailTemplateFormCtrl.reset();
			this.emailTemplateManagement();
		})
		this.emitterService.refreshSubmitSalesInvoice.subscribe(data => {
			this.rowData = [];
			this.searchSalesInvoice();
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

	}
	// changeEmailEvent(e) {
	// 	this.emailUniqueId = e.value;
	// 	if (this.emailUniqueId && this.selectedData) {
	// 		this.disabledupdatesettlement = false;
	// 	}
	// 	else {
	// 		this.disabledupdatesettlement = true;
	// 	}
	// }
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
	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	};
	selectAllRows(e) {
		if (this.selectAllChecked.value == true) {
			this.gridApi.selectAll();
			// this.gridApi.forEachNode(function (node) {
			// 	if (node.selectable == true && e.checked == true) {
			// 		node.setSelected(true);
			// 	}
			// 	// else if (e.checked == false) {
			// 	// 	node.setSelected(false);
			// 	// }
			// });
		}
		if (this.selectAllChecked.value == false && e.checked == false) {
			this.gridApi.deselectAll();
		}

	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.rowSelection = "multiple";

		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
		// this.gridApi.sizeColumnsToFit();
		//console.log(this.gridApi.sizeColumnsToFit())
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
	formControlSetForSalesInvoice() {
		this.salesInvoiceForm = this.fb.group({
			parentCustomerSalesInvoiceCtrl: [''],
			childCustomerSalesInvoiceCtrl: [''],
			contract: [true],
			typeId: ['']
		});

	};


	casaddingData() {
		let cascadingParenetCustomer = this.rMSApiService.getFinanceParentCustomer();
		let cascadingChildCustomer = this.rMSApiService.getFinanceChildCustomer();
		this.findParentObject = cascadingParenetCustomer;



		if (cascadingParenetCustomer) {
			this.salesInvoiceForm.patchValue({
				parentCustomerSalesInvoiceCtrl: cascadingParenetCustomer.name
			})
		};
		if (cascadingChildCustomer) {
			this.salesInvoiceForm.patchValue({
				childCustomerSalesInvoiceCtrl: cascadingChildCustomer
			})
		};
		let parentCustomer = cascadingParenetCustomer;
		if (cascadingParenetCustomer || cascadingChildCustomer) {
			if (parentCustomer == undefined || parentCustomer == NaN || parentCustomer == null || parentCustomer == "")
				parentCustomer = ''
			else
				parentCustomer = cascadingParenetCustomer.parentGPCustomerId;

			this.managementService.getChildCustomerSalesInvoiceManagement(parentCustomer).subscribe((response: any) => {
				this.childCustomerSalesInvoice = response.items;
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
				parentCustomer = cascadingParenetCustomer.id;
			let isFlatFeeOnly = true;
			let typeId = ''
			this.rMSApiService.showLoader(true);
			this.managementService.getGridSalesInvoiceManagementList(parentCustomer, cascadingChildCustomer, typeId, isFlatFeeOnly).subscribe((data: any) => {
				this.rowData = data.items;
				this.rMSApiService.showLoader(false);
			},
				error => {
					this.rMSApiService.setData(error)
					this.rMSApiService.showLoader(false);
					this.router.navigate(['/Error'])
				}
			)
		} else {
			this.valuesChanges();
			this.searchSalesInvoice();
		}
	}
	isFlatFeeOnly: any;

	searchSalesInvoice() {
		if (this.salesInvoiceForm.invalid) {
			return;
		};
		let parentId = this.findParentObject;
		if (parentId) {
			parentId = this.findParentObject.id
		} else {
			parentId = '';
		}
		this.parentCustomerSalesInvoiceId = this.salesInvoiceForm.get('parentCustomerSalesInvoiceCtrl').value;
		this.childCustomerSalesInvoiceId = this.salesInvoiceForm.get('childCustomerSalesInvoiceCtrl').value;
		this.isFlatFeeOnly = this.salesInvoiceForm.get('contract').value;
		let typeId = this.salesInvoiceForm.get('typeId').value;
		this.rMSApiService.showLoader(true);
		this.managementService.getGridSalesInvoiceManagementList(parentId, this.childCustomerSalesInvoiceId, typeId, this.isFlatFeeOnly).subscribe((data: any) => {
			this.rowData = data.items;
			//this.rowData[0].lastSent="21/19/2019"
			//this.rowData[0].isEmailAvailable = true;
			this.rowData.map(row => {
				if (row.isEmailAvailable == true) {
					this.availableCheckBox = true;
				} else {
					this.availableCheckBox = false;
				}
				row.noEmail = "NoEmail"
			}
			);


			this.rMSApiService.showLoader(false);
		},
			error => {
				this.rMSApiService.setData(error)
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error'])
			}
		)
	}


	selectionChanged(params) {
		this.selectedData = this.gridApi.getSelectedRows();

		if (this.selectedData.length > 0 && this.emailUniqueId) {
			this.disabledupdatesettlement = false;
			this.tempArray = this.selectedData;

			//this.selectedData=[];
		} else if (this.selectedData.length < 0) {
			//this.tempArray = this.tempArray.filter(element => element.id != this.selectedData.id);

		} else if (this.selectedData.length >= 1) {
			this.disabledupdatesettlement = true;
			this.tempArray = this.selectedData;
			//this.selectedData=[];
		} else if (this.emailUniqueId && !this.tempArray) {
			this.disabledupdatesettlement = true;
		} else if (this.selectedData.length >= 0) {
			this.disabledupdatesettlement = true;
		}
		this.rMSApiService.setCheckedDataSettlement(this.tempArray);
	}
	//**********Submit Button*************/
	responseData: any;
	submit() {
		let checkData = this.rMSApiService.getCheckedDataSettlement();

		let tempArray = [];
		checkData.forEach(element => {
			let temobj = { "customerId": element.customerID, "documentNumber": element.gpDocumentNumber }
			tempArray.push(temobj);
		});

		const req = {
			emailTemplateCode: this.emailTemplateFormCtrl.value,
			invoiceRequest: tempArray
		}
		this.rMSApiService.showLoader(true);
		this.managementService.submitSalesInvoice(req).subscribe((response: any) => {
			this.responseData = response;
			this.emailTemplateFormCtrl.reset();
			//this.emitterService.refreshInvoiceEmail.emit(true);
			this.disabledupdatesettlement=true;
			if (this.selectedData) {
				this.selectedData = [];
			};
			if (this.emailUniqueId)
				this.emailUniqueId = "";
			this.rMSApiService.showLoader(false);
			if (this.responseData.retID > 0) {
				this.searchSalesInvoice();
				this.toasterComponent.onSucess();
				//this.router.navigate(['/Management/Affidavit']);
			} else {
				this.toasterComponent.contractValidation(this.responseData);
			}
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)
	}
	//***************cancel button*********************/
	cancel() {
		this.salesInvoiceForm = this.fb.group({
			parentCustomerSalesInvoiceCtrl: [''],
			childCustomerSalesInvoiceCtrl: [''],
			contract: [''],
			typeId: ['']

		})
		this.required = false;
		this.rowData = [];
		this.rMSApiService.removeFinanceParentCustomer();
		this.rMSApiService.removeFinanceChildCustomer();
		this.findParentObject = '';

		this.valuesChanges();
	};
	// Get email Template from Sales invoice Management service to bind the data
	emailTemplateManagement() {
		this.managementService.getEmailTemplateSalesInvoiceManagement().subscribe((response: any) => {
			this.emailTemplate = response.items;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	}
	// Get parent customer from Sales invoice Management service to bind the data
	parentCustomerSalesInvoiceManagement() {
		this.loading = true;
		this.managementService.getParentCustomerSalesInvoiceManagement().subscribe((response: any) => {
			this.parentCustomerSalesInvoice = response.items;
			this.loading = false;
		},
			error => {
				this.loading = false;
				this.toasterComponent.onError(error)
			}
		)
	};
	getType() {
		this.managementService.getType().subscribe((data: any) => {
			this.typeData = data.items;
		})
	}
	// 

	findParentObject: any;
	getParentCustomer() {
		let parentId = this.salesInvoiceForm.get('parentCustomerSalesInvoiceCtrl').value;
		this.findParentObject = this.parentCustomerSalesInvoice.find(item => item.name == parentId);
		this.rMSApiService.setFinanceParentCustomer(this.findParentObject);
		//this.rMSApiService.showLoader(true);
		this.managementService.getChildCustomerSalesInvoiceManagement(this.findParentObject.parentGPCustomerId).subscribe((response: any) => {
			this.childCustomerSalesInvoice = response.items;
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
		this.managementService.getChildCustomerSalesInvoiceManagement(parentGPCustomerId).subscribe((response: any) => {
			this.childCustomerSalesInvoice = response.items;
			this.rMSApiService.showLoader(false);
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)
	};

	childCustomer(event) {
		this.rMSApiService.setFinanceChildCustomer(event.value)

	}
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
		//this.rMSApiService.removeFinanceParentCustomer();
		//this.rMSApiService.removeFinanceChildCustomer();
	}


}