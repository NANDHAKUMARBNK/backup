import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
//import { PsgService } from '../../Service/PsgService'
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog, } from "@angular/material";
import { InventoryTransferComponent } from './InventoryTransfercomponent';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { CouponBookService } from '../../Service/CouponBookService';
import { DatePipe } from '@angular/common';
import { CustomValidatorService } from 'common/CustomValidation/CustomValidatorService';
declare var $: any;

@Component({
	selector: 'app-couponinventory',
	templateUrl: '../../../../../../../Views/CouponBook/InventoryList.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe, CustomValidatorService]
})
export class InventoryListComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	appName = 'InventoryList';
	private gridApi;
	private gridColumnApi;
	columnDefs: any
	Location: any;
	InventoryItem: any;
	TransactionType: any;
	ShowResult: any;
	defaultColDef: any
	rowData: any;
	deleteid: [];
	searchValue: string;
	updatedId: any;
	getRowHeight;
	singleClickEdit: any
	brand: string;
	gridId: any;
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	rowSelection: string;
	config = new MatDialogConfig();
	id: any;
	inventoryListForm: FormGroup;
	paramData: any;
	domLayout: any;
	paginationPageSize: any;
	constructor(private http: HttpClient, private route: ActivatedRoute,
		private router: Router, private dialog: MatDialog,
		private sharedDataService: SharedDataService,
		private emitterService: EmitterService,
		private rMSApiService: RMSApiService,
		private toasterComponent: ToasterComponent,
		private datepipe: DatePipe,
		private fb: FormBuilder, private customValidatorService: CustomValidatorService,
		private couponBookService: CouponBookService
	) {
		this.route.params.subscribe(params => {
			this.paramData = params;
		});
		this.columnDefs = [
			{
				headerName: 'Item',
				field: "itemShortName",
				//sortable: true,
				autoHeight: true,
				width: 90
			},
			{
				headerName: 'Location',
				field: "itemLocationName",
				//sortable: true,
				autoHeight: true,
				width: 175
			},
			{
				headerName: 'Date',
				field: "transactionDate",
				//sortable: true,
				autoHeight: true,
				//editable: true,
				cellRenderer: (params) => {
					return this.datepipe.transform(params.value, 'MM/dd/yy')
				},
				editable: false,
				width: 90
			},
			{
				headerName: 'Type',
				field: "typeName",
				//sortable: true,
				autoHeight: true,
				width: 130
			},
			{
				headerName: 'Units',
				field: "unitQty",
				//sortable: true,
				autoHeight: true,
				width: 40,
				cellStyle: { 'text-align': "right" }

			},
			{
				headerName: 'On Hand',
				field: "itemLocationInventoryQty",
				autoHeight: true,
				//sortable: true,
				width: 70,
				cellStyle: { 'text-align': "right", 'margin-left': "-10px" }
			},

		];

		this.defaultColDef = {
			//editable: true,
			resizable: true,
		}
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
		this.formcontrolsSet();
		this.getlocation();
		this.getinventoryItem();
		this.gettransactionType();
		this.getshowResult();



		this.emitterService.refreshTransferGrid.subscribe(data => {
			this.rowData = [];
			this.searchGrid();

		})
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
		this.rowSelection = "multiple";
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		}
		console.log(this.gridApi.sizeColumnsToFit());
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
	};



	formcontrolsSet() {
		this.inventoryListForm = this.fb.group({
			locationId: [''],
			itemId: [''],
			transactionId: [''],
			showresultsId: ['']
		});
	}

	//Get Location  
	getlocation() {
		this.couponBookService.getLocationList().subscribe((data: any) => {
			
			this.Location = data
			if (this.paramData.locationId) {
				this.inventoryListForm.patchValue({
					locationId: parseInt(this.paramData.locationId)
				});
			};

		},
			//error => {
			//	this.toasterComponent.onError(error);
			//}
		);
	};
	//Get Inventory item
	getinventoryItem() {
		this.couponBookService.getinventoryItemList().subscribe((data: any) => {
			this.InventoryItem = data.items;
		},
			//error => {
			//	this.toasterComponent.onError(error);
			//}
		);
	};

	//Get Transaction Type
	gettransactionType() {
		this.couponBookService.gettransactionTypeList().subscribe((data: any) => {
			this.TransactionType = data.items
		},
			//error => {
			//	this.toasterComponent.onError(error);
			//}
		);
	};

	//Get show Result
	getshowResult() {
		this.couponBookService.getshowResultList().subscribe((data: any) => {
			this.ShowResult = data.items;

			this.ShowResult.forEach(item => {
				if (item.code == "LAST") {
					this.inventoryListForm.patchValue({
						showresultsId: item.id
					});
				}
			});
			this.searchGrid();
			// if (this.paramData.id) {
			// 	this.inventoryListForm.patchValue({
			// 		showresultsId: this.ShowResult[0].id
			// 	});
			// } else {
			// 	this.inventoryListForm.patchValue({
			// 		showresultsId: this.ShowResult[1].id
			// 	});
			// }
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);

	};


	/*================= Page Size change==============*/

	onPageSizeChanged() {
		var value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");
		// if(value == 10){
		// 	element.classList.add("gridHeight10");
		// 	element.classList.remove("gridHeight50");
		// 	element.classList.remove("gridHeight100");
		// }else if(value == 50){
		// 	element.classList.add("gridHeight50");
		// 	element.classList.remove("gridHeight10");
		// 	element.classList.remove("gridHeight100");
		// }else if(value == 100){
		// 	element.classList.remove("gridHeight10");
		// 	element.classList.remove("gridHeight50");
		// 	element.classList.add("gridHeight100");
		// }

	}

	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	}


	/*========Search grid click on serach and ngonit calling same api ===========*/
	searchGrid() {

		let location = this.inventoryListForm.get('locationId').value;
		let item = this.inventoryListForm.get('itemId').value;
		let type = this.inventoryListForm.get('transactionId').value;
		let showresults = this.inventoryListForm.get('showresultsId').value;

		if (location == null) {
			location = ''
		} else {
			location = this.inventoryListForm.get('locationId').value;
		}
		if (item == null) {
			item = ''
		} else {
			item = this.inventoryListForm.get('itemId').value;
		}
		if (type == null) {
			type = ''
		} else {
			type = this.inventoryListForm.get('transactionId').value;
		}
		if (showresults == null) {
			showresults = ''
		} else {
			showresults = this.inventoryListForm.get('showresultsId').value;

		}
		this.rMSApiService.showLoader(true);
		this.couponBookService.getListSearch(location, item, type, showresults).subscribe((data: any) => {
			this.rowData = data;
			this.rMSApiService.showLoader(false);
			// if(this.rowData.length <= 10){
			// 	$('.ag-paging-panel').hide();
			// }else{
			// 	$('.ag-paging-panel').show();
			// }
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error'])
			}
		);
	};


	addTransfer() {
		this.config.data = {
		}
		let dialogRef = this.dialog.open(InventoryTransferComponent, this.config);
	};

	// editTransfer(e) {
	// 	this.config.data = {
	// 		id:e.data.id
	// 	}
	// 	let dialogRef = this.dialog.open(InventoryTransferComponent, this.config);
	// };
	quickReport() {
		let location = this.inventoryListForm.get('locationId').value;
		let item = this.inventoryListForm.get('itemId').value;
		let type = this.inventoryListForm.get('transactionId').value;
		let showresults = this.inventoryListForm.get('showresultsId').value;

		if (location == null) {
			location = ''
		} else {
			location = this.inventoryListForm.get('locationId').value;
		}
		if (item == null) {
			item = ''
		} else {
			item = this.inventoryListForm.get('itemId').value;
		}
		if (type == null) {
			type = ''
		} else {
			type = this.inventoryListForm.get('transactionId').value;
		}
		if (showresults == null) {
			showresults = ''
		} else {
			showresults = this.inventoryListForm.get('showresultsId').value;
		}
		window.location.href = `api/coupons/collateral/inventory/downloadSummary?locationID=${location}&itemID=${item}&typeID=${type}&showTypeID=${showresults}`;
	}

	// quickReport() {
	// 	window.location.href = `api/coupons/collateral/inventory/downloadSummary`;
	// }

	cancel() {
		this.inventoryListForm.reset();
		// this.formcontrolsSet();
		// this.searchGrid();
		this.rowData = [];
	}
}



