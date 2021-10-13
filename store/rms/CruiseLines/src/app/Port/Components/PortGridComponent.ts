import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { RMSApiService } from 'common/services/RMSApiService';
declare var $:any;

@Component({
	selector: 'app-portprofilegrid',
	templateUrl: '../../../../../../../Views/CruiseLines/PortProfileGrid.html',
	styleUrls: ['../../../styles/cruiseLine.scss', '../../../../../../common/styles/AgGrid.scss']
})
export class PortGridComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	shipListForm: FormGroup;
	private rowSelection;
	display: boolean = false;
	private gridApi;
	private gridColumnApi;
	columnDefs: any
	defaultColDef: any
	rowData: any;
	deleteid: [];
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
	portId: any;
	showGrid: any;
	paginationPageSize: number;
	domLayout: any;
	//@Input() showGriddiffrent: any;

	constructor(private fb: FormBuilder, private router: Router,
		private route: ActivatedRoute,
		private sharedDataService: SharedDataService,
		private cruiseLineService: CruiseLineService,
		private emitterService: EmitterService,
		private rmsApiService: RMSApiService
	) {

		this.portId = this.route.snapshot.paramMap.get('id') // read params from URL portId

		this.columnDefs = [
			{
				headerName: 'OBM Code',
				field: "code",
				sortable: true,
				autoHeight: true,
				width:125
			},
			{
				headerName: 'Name',
				field: "name",
				sortable: true,
				autoHeight: true,
				width:200
			},
			{
				headerName: 'Country ',
				field: "countryName",
				sortable: true,
				autoHeight: true,
				width:200
			},
			{
				headerName: 'Active Program',
				field: "isRevenueProgram",
				autoHeight: true,
				sortable: true,
				width:125

			},
			{
				headerName: 'Voyages',
				field: "activeVoyageQty",
				sortable: true,
				autoHeight: true,
				width:125
			},
		]
		this.defaultColDef = {
			editable: true,
			resizable: true,
			//  width: 100
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
			'<span class="ag-overlay-loading-center nodata" style=\"margin-top:-137px; border-radius:5px; font-size:15px;">Data not loaded yet.</span>';
		this.overlayNoRowsTemplate =
			"<span class='ag-overlay-loading-center nodata'>No record(s) found.</span>";

	}

	ngOnInit() {
		this.getPortDetailGrid();

		this.showGrid = this.rmsApiService.getData();
	

	};

	showGriddiffrent(e) {
		
	};


	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	}

	onGridReady(params) {
		this.getPortDetailGrid();
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
		//  minRowHeight = 30;
		// currentRowHeight = minRowHeight;
		// params.api.sizeColumnsToFit();
	}


	getPortDetailGrid() {
		this.cruiseLineService.getPortDetilGrid(this.portId).subscribe((data: any) => {
			this.rowData = data;
			// if(this.rowData.length <= 10){
			// 	$('.ag-paging-panel').hide();
			// }else{
			// 	$('.ag-paging-panel').show();
			// }
		},

		)
	}

	onRowClicked(e) {
		this.gridId = e.data.id
		this.router.navigate(['/Port/Profile'])
	}
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






	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter()
	}

	backpage() {
		this.router.navigateByUrl('/Port')
	}
}
var minRowHeight = 30;
var currentRowHeight = minRowHeight;
