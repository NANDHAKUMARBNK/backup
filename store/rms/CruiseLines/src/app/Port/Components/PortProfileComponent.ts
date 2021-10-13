import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { RMSApiService } from 'common/services/RMSApiService';
import { MatDialog } from '@angular/material';
import { ErrorModalComponent } from 'common/components/ErrorModalComponent';
import { ToasterComponent } from 'common/components/ToasterComponent';
declare var $:any;

@Component({
	selector: 'app-portprofile',
	templateUrl: '../../../../../../../Views/CruiseLines/PortProfile.html',
	styleUrls: ['../../../styles/cruiseLine.scss']
})
export class PortProfileComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	// title = 'CruiseLines';
	//@Input() hideGrid: any;
	//showGriddiffrent: any;
	@Output() showGriddiffrent = new EventEmitter<string>();
	showGrid: boolean = false;
	CRUISELINE_PORT = "CRUISELINE_PORT";
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
	active: any;
	paginationPageSize: number;

	constructor(private location: Location, private route: ActivatedRoute, private cruiseLineService: CruiseLineService,
		private rMSApiService: RMSApiService, private dialog: MatDialog, private toasterComponent: ToasterComponent,
 ) {
		this.portId = this.route.snapshot.paramMap.get('id') // read params from URL portId
		this.active = this.route.snapshot.paramMap.get('active')
		this.columnDefs = [
			{
				headerName: 'OBM Code',
				field: "code",
				sortable: true,
				autoHeight: true,
				width:150
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
				field: "isActiveProgram",
				cellRenderer: params => {
					if (params.data.isRevenueProgram == true) {
						return `<i class="far fa-check-circle" style="font-size:14px;"></i>`
					}

				},

				autoHeight: true,
				sortable: true,
				width:200

			},
			{
				headerName: 'Voyages',
				field: "activeVoyageQty",
				sortable: true,
				autoHeight: true,
				width:200
			},
			// {
			// 	headerName: 'Port Mapping',
			// 	field: "activeVoyageQty",
			// 	sortable: true,
			// 	autoHeight: true,
			// 	width:200
			// },
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
	}

	hideGrid(e) {
		//this.showGrid = this.showGriddiffrent.emit(e);
		if (e == true) {
			this.showGrid = true;
		} else {
			this.showGrid = false;
		}

	};


	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	};

	onGridReady(params) {
		this.getPortDetailGrid();
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		//this.rowSelection = "multiple";
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
	};

	/* =========== get id call Api ================*/
	getPortDetailGrid() {
		this.rMSApiService.showLoader(true);
		this.cruiseLineService.getPortDetilGrid(this.portId).subscribe(
			(data: any) => {
				this.rowData = data;
				this.rMSApiService.showLoader(false);
				// if(this.rowData.length <= 10){
				// 	$('.ag-paging-panel').hide();
				// }else{
				// 	$('.ag-paging-panel').show();
				// }
			},
			error => {
				this.toasterComponent.onError(error);
			}
			
		)
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

	backpage() {
		this.location.back()

	}
	portnameId:any;
	gotoFinance(){
		window.location.href = '/Finance/#/Retailer';
		this.portnameId = parseInt(localStorage.getItem('portId'));
		
	}
}