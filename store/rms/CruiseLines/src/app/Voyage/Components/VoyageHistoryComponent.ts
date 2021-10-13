import { Component, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { DatePipe } from '@angular/common';
declare var $: any;
import * as _moment from 'moment';
import { ToasterComponent } from 'common/components/ToasterComponent';


@Component({
	selector: 'app-voyagehistory',
	templateUrl: '../../../../../../../Views/CruiseLines/VoyageHistory.html',
	styles: ['../../../styles/cruiseLine.scss'],
	providers: [DatePipe]
})
export class VoyageHistoryComponent {
	// title = 'CruiseLines';
	Datadoc: any;
	@ViewChild('pageSize') pageSize: ElementRef;

	Data: any;
	upload: File;
	cacheId: any;
	private rowSelection;
	display: boolean = false;
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
	brand: string;
	gridId: any;
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	statusL: any;
	histotyData: [];
	columnDefsTo:any;
	rowDataTo:any;
	domLayout: any;
	paginationPageSize: any;
	histotyDataSingle: any;
	modifiledData:boolean=false;
	versionNum:any;
	itinerarySequenceId: any;

	constructor(private dialogRef: MatDialogRef<VoyageHistoryComponent>, @Inject(MAT_DIALOG_DATA) data,
	 private cruiseLineService: CruiseLineService,	private datePipe: DatePipe, private toasterComponent:ToasterComponent) {
		this.Data = data;
		this.columnDefs = [
			{
				headerName: 'Date',
				field: "callDate",
				sortable: true,
				minWidth: 100,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy');
				},
				cellStyle: function (params) {
					return { cursor: 'default' };

				}
			
			},
			{
				headerName: 'Location',
				field: "portName",
				sortable: true,
				minWidth:180,
				cellStyle: function (params) {
					return { cursor: 'default' };

				}
				
			},
			{
				headerName: 'Arrival',
				field: "arrivalTime",
				sortable: true,
				minWidth: 80,
				cellRenderer: (params) => {
					// let date=new Date();
					// let final=date+params.value;
					// console.log(final,'date')

					let remove=params.value;
					 let finalTimeFormat=remove.substring(0, remove.length -3);
					return finalTimeFormat;
					
				},
				cellStyle: function (params) {
					return { cursor: 'default' };

				}
			},
			{
				headerName: 'Departure',
				field: "departureTime",
				sortable: true,
				minWidth: 80,
				cellRenderer: (params) => {
					// let date=new Date();
					// let final=date+params.value;
					// console.log(final,'date')

					let remove=params.value;
					 let finalTimeFormat=remove.substring(0, remove.length -3);
					return finalTimeFormat;
					
				},
				cellStyle: function (params) {
					return { cursor: 'default' };

				}
				// cellRenderer: (params) => {
				// 	return this.datePipe.transform(params.value, 'hh:mm');
				// },

			},
		];


		this.columnDefsTo = [
			{
				headerName: 'Date',
				field: "callDate",
				sortable: true,
				minWidth: 100,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy');
				},
				cellStyle: function (params) {
					return { cursor: 'default' };

				}
			},
			{
				headerName: 'Location',
				field: "portName",
				sortable: true,
				minWidth:100,
				cellStyle: function (params) {
					return { cursor: 'default' };

				}
			},
			{
				headerName: 'Arrival',
				field: "arrivalTime",
				sortable: true,
				minWidth: 80,
				cellRenderer: (params) => {
					// let date=new Date();
					// let final=date+params.value;
					// console.log(final,'date')

					let remove=params.value;
					 let finalTimeFormat=remove.substring(0, remove.length -3);
					return finalTimeFormat;
					
				},
				cellStyle: function (params) {
					return { cursor: 'default' };

				}
				// cellRenderer: (params) => {
				// 	return this.datePipe.transform(params.value, 'hh:mm');
				// },
			},
			{
				headerName: 'Departure',
				field: "departureTime",
				sortable: true,
				minWidth: 80,
				cellRenderer: (params) => {
					// let date=new Date();
					// let final=date+params.value;
					// console.log(final,'date')

					let remove=params.value;
					 let finalTimeFormat=remove.substring(0, remove.length -3);
					return finalTimeFormat;
					
				},
				cellStyle: function (params) {
					return { cursor: 'default' };

				}
				// cellRenderer: (params) => {
				// 	return this.datePipe.transform(params.value, 'hh:mm');
				// },
			},
		];

		this.defaultColDef = {
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
			'<span class="ag-overlay-loading-center nodata" >Select search parameters for results</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';
	};

	ngOnInit() {
		$(".oneSpec").closest(".mat-dialog-container").css('cssText', 'width: 900px !important');
		this.getVoyageHistory();
	};


	getVoyageHistory() {
		let requestVersion='';
		let itinerarySequenceId=''
		this.cruiseLineService.getVoyageHistory(this.Data.voyageId,itinerarySequenceId, requestVersion).subscribe((data: any) => {
			//this.rowData = data.items;
			this.histotyData=data.items;
			//this.rowDataTo = data.items;
		},
		error=>{
			this.toasterComponent.onError(error)
		}
		)
	};





	VoyageHistoryById(item){
		// $(".oneSpec").closest(".mat-dialog-container").css('cssText', 'width: 900px !important');

		this.versionNum=item.versionNum;
		this.itinerarySequenceId=item.itinerarySequenceId;
		this.cruiseLineService.getVoyageHistory(this.Data.voyageId,this.itinerarySequenceId, item.versionNum).subscribe((data: any) => {
			this.rowData = data.items;
			this.modifiledData=true;
			this.histotyDataSingle=data.items[0]
		},
		error=>{
			this.toasterComponent.onError(error)
		}
		);

		let version=item.versionNum +1

		this.cruiseLineService.getVoyageHistory(this.Data.voyageId,this.itinerarySequenceId, version).subscribe((data: any) => {
			this.rowDataTo = data.items;
			this.modifiledData=true;
		},
		error=>{
			this.toasterComponent.onError(error)
		}
		);
		 
	};

	


	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	};

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.rowSelection = "multiple";
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		};
		console.log(this.gridApi.sizeColumnsToFit());
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
	
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


	onRowClicked(e) {

	}

	close() {
		this.dialogRef.close();
	}
}