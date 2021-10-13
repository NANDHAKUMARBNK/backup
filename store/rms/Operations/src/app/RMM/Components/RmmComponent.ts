import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { CustomCellComponent } from './CustomCellDropdown';
import { PsgService } from '../../Service/PsgService';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { Router } from '@angular/router';
declare var $: any;


@Component({
	selector: 'app-rmm',
	templateUrl: '../../../../../../../Views/Operations/Rmm.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss', '../../../styles/PsgList.scss']
})
export class RmmComponent {

	@ViewChild('pageSize') pageSize: ElementRef;

	private rowSelection;
	display: boolean = false;
	private gridApi;
	private gridColumnApi;
	// addNewReportForm: FormGroup;

	columnDefs: any;
	overlayNoRowsTemplate: any;
	//domLayout: any;
	defaultColDef: any;
	rowData: object[] = [];
	deleteid: [];
	searchValue: string;
	updatedId: any;
	getRowHeight;

	private getRowNodeId;
	dataId: any;
	emitterSubscribe: any;
	paginationNumberFormatter: any;
	overlayLoadingTemplate: any;

	singleClickEdit: any
	brand: string;
	gridId: any;
	rmmDropdownList: any;
	mangerList: any;
	domLayout: any;
	paginationPageSize: any;

	constructor(private http: HttpClient, private emitterService: EmitterService, private router: Router,
		private fb: FormBuilder,
		private service: PsgService,
		private rMSApiService: RMSApiService
	) {
		this.columnDefs = [

			{
				headerName: 'Cruise Line',
				field: "cruiseLineName",
				sortable: true,
				width: 300
				//cellStyle: {'padding-top': '4px'}
			},
			{
				headerName: 'Ship',
				field: "shipName",
				sortable: true,
				autoHeight: true,
				width: 300
				//cellStyle: {'padding-top': '4px'},
			},
			{
				headerName: 'Shopping Expert',
				field: "psgName",
				sortable: true,
				autoHeight: true,
				width: 300
				//cellStyle: {'padding-top': '4px'},
			},
			{
				headerName: 'Name',
				field: "rmmId",
				autoHeight: true,
				width: 300,
				cellRendererFramework: CustomCellComponent,
			},
		];

		this.defaultColDef = {
			resizable: true,
		};

		this.paginationPageSize = 10;

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
		this.getGrid();
		this.emitterService.refreshRmmList.subscribe(d => {
			this.rowData = [];
			this.getGrid()
		})
	}


	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	};

	onPageSizeChanged(newPageSize) {
		var value = this.pageSize.nativeElement.value;
		// = document.getElementById("page-size").value;
	
		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");
	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.rowSelection = "multiple";
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		}
		
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
	}

	getGrid() {
	
		this.rMSApiService.showLoader(true);
		this.service.getRmmGrid().subscribe(
			(res: any) => {
				//this.rowData = this.rowData.concat(res.items);
				this.rowData = res.items;
				this.rMSApiService.showLoader(false);
				
			},
			error => {
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);
				this.router.navigateByUrl('/Error')
			}
		)
	};
}

var minRowHeight = 30;
var currentRowHeight = minRowHeight;