import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
//import { PsgService } from '../../Service/PsgService'
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog, } from "@angular/material";
import { ContractService } from '../Service/ContractService';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import moment from 'moment';
import { DatePipe } from '@angular/common';
declare var $: any;

//import { Location } from '@angular/common';

@Component({
	selector: 'app-retailergrid',
	templateUrl: '../../../../../../../Views/Finance/RetailerGrid.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe]
})
export class RetailerGridComponent {
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
	customerId: any;
	gpcustomerId: any;
	parentCustomerId: any;
	paginationPageSize: number;
	domLayout: any;

	constructor(private http: HttpClient, private route: ActivatedRoute,
		private fb: FormBuilder, private router: Router, private dialog: MatDialog,
		//private service: PsgService,
		private sharedDataService: SharedDataService,
		private emitterService: EmitterService,
		private contractService: ContractService, private toasterComponent: ToasterComponent,
		private rMSApiService: RMSApiService, private datePipe: DatePipe

	) {
		this.customerId = this.route.snapshot.queryParamMap.get('customerId');
		this.gpcustomerId = this.route.snapshot.queryParamMap.get('gpCustomerId');
		
		this.parentCustomerId = this.route.snapshot.queryParamMap.get('parentCustomerId');
		console.log(this.gpcustomerId,'this.gpcustomerId')

	

		this.columnDefs = [
			{
				headerName: 'Category',
				field: "categoryName",
				sortable: true,
				autoHeight: true,
				width: 110
			},
			{
				headerName: 'Contract',
				field: "contractNumber",
				sortable: true,
				autoHeight: true,
				width: 125
			},
			{
				headerName: 'Cruise Line',
				field: "cruiseLineName",
				sortable: true,
				autoHeight: true,
				editable: true,
				width: 150
			},
			{
				headerName: 'Type',
				field: "typeName",
				sortable: true,
				autoHeight: true,
				width: 110
			},
			{
				headerName: 'Start',
				field: "effectiveStartDate",
				sortable: true,
				autoHeight: true,
				width: 100,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy')
				}
			},
			{
				headerName: 'End',
				field: "effectiveEndDate",
				sortable: true,
				autoHeight: true,
				width: 100,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy')
				}
			},
		];

		this.defaultColDef = {
			editable: true,
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
			'<span class="ag-overlay-loading-center nodata" style=\"margin-top:-137px; border-radius:5px; font-size:15px;">Searching...please wait</span>';
		this.overlayNoRowsTemplate =
			"<span class='ag-overlay-loading-center nodata'>No data to display</span>";
	}

	ngOnInit() {
		this.getContractGrid();

	}
	onPageSizeChanged() {
		//var value=100;
		let value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");
		//document.getElementById("#myGrid").style.height = "";
		//this.gridPagination.onPageSized(value, element);

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
		// this.gridApi.sizeColumnsToFit();
		console.log(this.gridApi.sizeColumnsToFit());
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
	}


	getContractGrid() {
		this.contractService.getContractGrid(this.gpcustomerId).subscribe((data: any) => {
			this.rowData = data.items;
			// if (this.rowData.length <= 10) {
			// 	$('.ag-paging-panel').hide();
			// } else {
			// 	$('.ag-paging-panel').show();
			// }

		},
			error => {
				this.rMSApiService.setData(error)
				this.router.navigate(['/Error'])

			}
		)
	}

	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	};
	onRowClicked(e) {
		this.gridId = e.data;
		this.router.navigate(['/Retailer/Contract'], { queryParams: { 'contractId': this.gridId.id, 'id': this.gridId.id, 'gpcustomerId': this.gpcustomerId, 'customerId': this.customerId, 'categoryCode': this.gridId.categoryCode, 'categoryId': this.gridId.categoryId, 'parentCustomerId': this.parentCustomerId,'cruiseLineId': this.gridId.cruiseLineId,'typeId':this.gridId.typeId } });
	}
	addContract() {
		//this.router.navigate([`/Retailer/Profile?customerId${this.customerId}&gpCustomerId${this.gpcustomerId}Contract`], { queryParams: { 'gpcustomerId': this.gpcustomerId } });
		this.router.navigate([`/Retailer/Contract`], { queryParams: { 'gpcustomerId': this.gpcustomerId, 'customerId': this.customerId } });
	}

	removesearch() {
		this.searchValue = null
		this.gridApi.setQuickFilter(this.searchValue)
	}
	backpage() {
		this.router.navigateByUrl('/Retailer')
	}

}
var minRowHeight = 30;
var currentRowHeight = minRowHeight;


