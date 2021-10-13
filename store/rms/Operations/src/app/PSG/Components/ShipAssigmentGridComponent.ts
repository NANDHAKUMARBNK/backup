import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PsgService } from '../../Service/PsgService';
import { RMSApiService } from 'common/services/RMSApiService';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
declare var $:any;


@Component({
	selector: 'app-shipgrid',
	templateUrl: '../../../../../../../Views/Operations/ShipAssigmentGrid.html',
	styleUrls: ['../../../styles/PsgList.scss', '../../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe]
})
export class ShipAssigmentGridComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	private rowSelection;
	display: boolean = false;
	gridApi: any;
	gridColumnApi: any;
	columnDefs: any;
	defaultColDef: any;
	rowData: any;
	deleteid: [];
	searchValue: string;
	updatedId: any;
	getRowHeight: any;
	private getRowNodeId;
	dataId: any;
	emitterSubscribe: any;
	singleClickEdit: any
	brand: string;
	id: any
	gridId: any;
	formatDate: any;
	overlayNoRowsTemplate: any;
	paginationPageSize: number;
	domLayout:any;


	constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private service: PsgService, private datePipe: DatePipe,
		private rMSApiService: RMSApiService,  private messageService: MessageService
	) {
		this.id = this.route.snapshot.paramMap.get('id')
		this.columnDefs = [
			{
				headerName: 'Ship',
				field: "shipName",
				sortable: true,
				width:200
			},
			{
				headerName: 'Role',
				field: "roleTypeName",
				sortable: true,
				width:100,
				autoHeight: true,
			},
			{
				headerName: 'Embark',
				field: "embarkDateTime",
				sortable: true,
				width:100,
				autoHeight: true,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy');
				}
			},
			{
				headerName: 'Debark',
				field: "disembarkDateTime",
				sortable: true,
				width:100,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy');
				}
			},

		];
		this.defaultColDef = {
			resizable: true,
		}

		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No record(s) found.</span>';

		// Row HEIGHT
		this.getRowHeight = function (params) {
			if (params.node.level === 0) {
				return 28;
			} else {
				return 25;
			}
		};
	}

	ngOnInit() {

	
		this.getGrid()
		//   this.emitterSubscribe = this.emitterService.refreshReportList.subscribe(d => {
		//    // this.rowData = []
		//     this.getGrid()
		//   })

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
		//  minRowHeight = 30;
		// currentRowHeight = minRowHeight;
		// params.api.sizeColumnsToFit();
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
	//Get Grid Data
	getGrid() {
		this.rMSApiService.showLoader(true);
		this.service.getShipAssigment(this.id).subscribe((data: any) => {
			this.rowData = data.items;
			this.rMSApiService.showLoader(false);
			// if(this.rowData.length <= 10){
			// 	$('.ag-paging-panel').hide();
			// }else{
			// 	$('.ag-paging-panel').show();
			// }
		},
			error => {
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);
				this.router.navigateByUrl('/Error');
			}
		)
	};

	// QuickFilter 
	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	}

	//Rowclick navigate to profile Page and Pass Params To URL
	onRowClicked(e) {
		this.gridId = e.data
		//this.gridcruiseLineID = e.data.vendorAssignmentId
		this.router.navigate(['/PSG/Profile/ship',
			{ vendorAssignmentId: this.gridId.vendorAssignmentId, vendorId: this.id, cruiseLineID: this.gridId.cruiseLineID, effectiveBeginDate: this.gridId.effectiveBeginDate, shipId: this.gridId.shipID, effectiveEndDate: this.gridId.effectiveEndDate, embarkdate: this.gridId.embarkDateTime, disembark: this.gridId.disembarkDateTime, embarkId: this.gridId.embarkItinerarySequenceID, disembarId: this.gridId.disembarkItinerarySequenceID }])

	}
	//AddAssignment Click to profile Page and Pass Params To URL
	addAssignment() {
		this.router.navigate(['/PSG/Profile/ship', { vendorId: this.id }])
	}
}

//let groupHeight = 100;
//var swimmingHeight = 50;

var minRowHeight = 30;
var currentRowHeight = minRowHeight;

