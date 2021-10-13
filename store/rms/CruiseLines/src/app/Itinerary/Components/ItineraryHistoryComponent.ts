import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { DatePipe } from '@angular/common';
import { ToasterComponent } from 'common/components/ToasterComponent';
import {NumericEditorComponent} from 'common/components/NumericEditorComponent'
declare var $:any;

@Component({
	selector: 'app-itineraryhistory',
	templateUrl: '../../../../../../../Views/CruiseLines/ItineraryHistory.html',
	styleUrls: ['../../../styles/cruiseLine.scss'],
	providers: [DatePipe]
})
export class ItineraryHistoryComponent {
	Datadoc: any;
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
	itineraryID: any;
	data: any;

	constructor(private dialogRef: MatDialogRef<ItineraryHistoryComponent>, @Inject(MAT_DIALOG_DATA) data,
		private cruiseLineService: CruiseLineService, private toasterComponent: ToasterComponent,

		private datePipe: DatePipe
	) {
		this.data = data;
		this.columnDefs = [
			{
				headerName: 'Start Date',
				field: "effectiveBeginDateTime",
				sortable: true,
				maxWidth:100,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy')
				}
			},
			{
				headerName: 'End Date',
				field: "effectiveEndDateTime",
				sortable: true,
				maxWidth:100,
				editable: true,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy')
				}
			},
			{
				headerName: 'Amount',
				field: "dailyRate",
				cellRenderer: (params) => {
					return params.data.dailyRate.toFixed(2) + ' USD'
				},
				sortable: true,
				maxWidth:120,
				editable: true,
				cellEditorFramework: NumericEditorComponent

			},
			{
				headerName: 'Updated By',
				field: "appChangeUserName",
				sortable: true,
				maxWidth:250
			},

		];
		this.defaultColDef = {

			editable: true,
			resizable: true,
			autoHeight: true,

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
			'<span class="ag-overlay-loading-center nodata">No record(s) found.</span>';
	}

	ngOnInit() {
		this.getGrid();
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
	};



	getGrid() {
		this.cruiseLineService.getWagesHistoryGrid(this.data.id).subscribe((data: any) => {
			this.rowData = data;
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
	close() {
		this.dialogRef.close();
	}
}