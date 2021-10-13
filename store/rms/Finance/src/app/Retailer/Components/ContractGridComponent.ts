import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
//import { PsgService } from '../../Service/PsgService'
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog, } from "@angular/material";
import { ContractService } from '../Service/ContractService';
import { ToasterComponent } from 'common/components/ToasterComponent';
declare var $: any;

//import { Location } from '@angular/common';

@Component({
	selector: 'app-contractgrid',
	templateUrl: '../../../../../../../Views/Finance/ContractGrid.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss']
})
export class ContractGridComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	VoyageListForm: FormGroup;
	private rowSelection;
	display: boolean = false;
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
	emitterSubscribe: any;
	singleClickEdit: any
	brand: string;
	gridId: any;
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	status: any;
	statusId: any;
	isactive: any;
	venderid: number;
	vendorId: any;
	config = new MatDialogConfig();
	isactiveL: any;
	shipsName: any;
	roleManagerName: any;
	selectedName: any;
	name: any;
	statusName: any;
	contractId: any;
	hideContractGrid: boolean = false;
	categoryCode: any;
	categoryId: any;
	paginationPageSize: number;
	domLayout: any;
	constructor(private http: HttpClient, private route: ActivatedRoute,
		private fb: FormBuilder, private router: Router, private dialog: MatDialog,
		//private service: PsgService,
		private sharedDataService: SharedDataService,
		private emitterService: EmitterService,
		private contractService: ContractService,
		private toasterComponent: ToasterComponent,

	) {
		this.contractId = this.route.snapshot.queryParamMap.get('contractId');
		this.categoryCode = this.route.snapshot.queryParamMap.get('categoryCode');
		this.categoryId = this.route.snapshot.queryParamMap.get('categoryId');


		this.columnDefs = [
			{
				headerName: 'Commission Type',
				field: "commissionTypeName",
				sortable: true,
				autoHeight: true,
				editable: true,
				width: 200
			},
			{
				headerName: 'Rate Summary',
				field: "summary",
				sortable: true,
				autoHeight: true,
				width: 200
			},
			{
				headerName: 'Ship Info',
				field: "contractRateInfo",
				sortable: true,
				autoHeight: true,
				width: 200
			},

		];

		this.defaultColDef = {
			editable: true,
			resizable: true,
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
			'<span class="ag-overlay-loading-center nodata" style=\"margin-top:-137px; border-radius:5px; font-size:15px;">No Record(s) Found.</span>';
		this.overlayNoRowsTemplate =
			"<span class='ag-overlay-loading-center nodata'>No record(s) found.</span>";

	}

	ngOnInit() {
		if (this.contractId) {
			this.contarctGrid();
		}

		if (this.contractId && this.categoryCode == "MEDIA") {
			this.hideContractGrid = false;
		} else if (this.contractId) {
			this.hideContractGrid = true;
		}
	}
	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.rowSelection = "multiple";
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		}
		console.log(this.gridApi.sizeColumnsToFit())

		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
		//  minRowHeight = 30;
		// currentRowHeight = minRowHeight;
		// params.api.sizeColumnsToFit();
	};
	onPageSizeChanged() {
		//var value=100;
		let value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		//this.gridApi.setRowData(this.searchList(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");
		//document.getElementById("#myGrid").style.height = "";
		//this.gridPagination.onPageSized(value, element);

	}

	contarctGrid() {
		this.contractService.contractGrid(this.contractId).subscribe((data: any) => {
			this.rowData = data.items;
			// if (this.rowData.length <= 10) {
			// 	$('.ag-paging-panel').hide();
			// } else {
			// 	$('.ag-paging-panel').show();
			// }
		},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	}


	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	};
	onRowClicked(e) {
		this.gridId = e.data;
		this.router.navigate(['/Retailer/Rates'], { queryParams: { 'categoryId': this.categoryId, 'contractId': this.contractId, 'contractRateId': this.gridId.id, 'commissionTypeCode': this.gridId.commissionTypeCode, 'calculationTypeId': this.gridId.calculationTypeId, 'calculationTypeCode': this.gridId.calculationTypeCode } })
	}
	addContractRate() {
		this.router.navigate(['/Retailer/Rates'], { queryParams: { 'categoryId': this.categoryId, 'contractId': this.contractId, } })
	}

	removesearch() {
		this.searchValue = null
		this.gridApi.setQuickFilter(this.searchValue)
	}

}
var minRowHeight = 30;
var currentRowHeight = minRowHeight;


