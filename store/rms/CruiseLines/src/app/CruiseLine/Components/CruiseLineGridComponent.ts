import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { EmitterService } from 'common/services/emitterService';
import { AddFeeComponent } from './AddFeeComponent';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { RMSApiService } from 'common/services/RMSApiService';
import { DatePipe } from '@angular/common';
declare var $: any;


@Component({
	selector: 'app-cruiselinegrid',
	templateUrl: '../../../../../../../Views/CruiseLines/CruiseLineGrid.html',
	styleUrls: ['../../../styles/cruiseLine.scss', '../../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe] 
})
export class CruiseLineGridComponent {
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
	config = new MatDialogConfig();
	singleClickEdit: any
	brand: string;
	id: any
	gridId: any;
	domLayout: any;
	paginationPageSize: number;

	constructor(private http: HttpClient, private dialog: MatDialog, private router: Router, private route: ActivatedRoute,
		private cruiseLineService: CruiseLineService, private emitterService: EmitterService,
		private rMSApiService: RMSApiService,
		private datePipe: DatePipe,
	) {
		//this.getGrid() 
		this.id = this.route.snapshot.paramMap.get('id')
		this.columnDefs = [
			{
				headerName: 'Description',
				field: "descTypeName",
				sortable: true,
				width: 200
			},
			{
				headerName: 'Type',
				field: "feeTypeName",
				sortable: true,
				width: 100
			},
			{
				headerName: 'Start',
				field: "beginDate",
				sortable: true,
				autoHeight: true,
				width: 100,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy');
				}
			},
			{
				headerName: 'End',
				field: "endDate",
				sortable: true,
				width: 100,
				autoHeight: true,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy');
				}
			},
			{
				headerName: 'Amount',
				field: "feeAmt",
				autoHeight: true,
				sortable: true,
				width: 100,
				cellRenderer: (params) => {
					if (params.data.feeTypeName == "Amount")
						return '$' + params.value;
					else if (params.data.feeTypeName == "Percent")
						return params.value;
				},
			},
		];

		this.defaultColDef = {
			editable: true,
			sortable: true,
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
	};

	ngOnInit() {
		this.getGrid();
		this.emitterService.refreshAddFee.subscribe((d) => {
			this.rowData = [];
			this.getGrid();
		})
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
		console.log(this.gridApi.sizeColumnsToFit());
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
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
	getGrid() {
		this.rMSApiService.showLoader(true);
		this.cruiseLineService.getFeeGrid(this.id).subscribe((data: any) => {
			this.rowData = data;
		
			this.rMSApiService.showLoader(false);
			// if (this.rowData.length <= 10) {
			// 	$('.ag-paging-panel').hide();
			// } else {
			// 	$('.ag-paging-panel').show();
			// }
		},
			error => { //if any error comes change Route 
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);
				this.router.navigateByUrl('/Error')

			}
		)
	}

	/*==================  rowclicked open popup edit values  and pass id */
	onRowClicked(e) {
		this.gridId = e.data.shipID
		this.config.data = {
			gridid: e.data.id,
			id: this.id
		}
		let dialogRef = this.dialog.open(AddFeeComponent, this.config);
	};

	/*================== open Popup and pass id */
	addFee() {
		//this.gridId = e.data.shipID
		this.config.data = {
			id: this.id
		}
		let dialogRef = this.dialog.open(AddFeeComponent, this.config);
	}

}
var minRowHeight = 30;
var currentRowHeight = minRowHeight;
