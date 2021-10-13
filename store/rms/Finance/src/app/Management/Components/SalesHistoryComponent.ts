import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { error } from 'util';
import { RMSApiService } from 'common/services/RMSApiService';
import { ErrorModalComponent } from 'common/components/ErrorModalComponent';
import { ToasterComponent } from 'common/components/ToasterComponent';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { ManagementService } from '../service/ManagementService';

declare var $: any;
@Component({
	selector: 'app-saleshistory',
	templateUrl: "../../../../../../../Views/Finance/Management/SalesHistory.html",
	styleUrls: ['../../../../../../common/styles/footer.scss'],
	providers: [DatePipe]
})
export class SalesHistoryComponent {
	columnDefs: any
	defaultColDef: any
	rowData: any;
	deleteid: [];
	searchValue: string;
	updatedId: any;
	getRowHeight;
	private getRowNodeId;
	dataId: any;
	singleClickEdit: any
	brand: string;
	gridId: any;
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	name: any;
	rowSelection: string;
	panelOpenState = false;
	showDocument: boolean = false;
	gridApi: any;
	historyData: any;
	gridColumnApi: any;
	totalAmount: any;
	totalFeeAmount: any;
	decimalFeeAmount: any;

	constructor(@Inject(MAT_DIALOG_DATA) public configData: any, private datePipe: DatePipe,
		private toastercomponent: ToasterComponent, private managementService: ManagementService, private http: HttpClient, private route: ActivatedRoute, private dialogRef: MatDialogRef<SalesHistoryComponent>) {

		this.columnDefs = [

			{
				headerName: 'Type',
				field: "typeName",
				sortable: true,
				autoHeight: true,
				editable: false,
				width: 80,
				cellStyle: { 'cursor': "initial" },
			},
			{
				headerName: 'Status',
				field: "statusName",
				sortable: true,
				autoHeight: true,
				editable: false,
				width: 120,
				cellStyle: { 'cursor': "initial" },
			},
			{
				headerName: 'Document #',
				field: "documentNumber",
				sortable: true,
				autoHeight: true,
				editable: false,
				width: 150,
				cellStyle: { 'cursor': "initial" },
			},
			{
				headerName: 'User',
				field: "fullName",
				sortable: true,
				autoHeight: true,
				editable: false,
				width: 170,
				cellStyle: { 'cursor': "initial" },
			},
			{
				headerName: 'Date',
				field: "enteredDateTime",
				sortable: true,
				autoHeight: true,
				editable: false,
				width: 110,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy');
				},
				cellStyle: { 'cursor': "initial" },
			},

			{
				headerName: 'Sales',
				field: "amount",
				sortable: true,
				autoHeight: true,
				editable: false,
				width: 100,
				cellRenderer: (params) => {
					let amt = params.data.amount;
					if (amt == null) {
						return;
					}
					let decimalAmt = amt.toFixed(2);
					if (decimalAmt) {
						return '$' + decimalAmt;
					}
				},
				cellStyle: { 'cursor': "initial" },
			},
			{
				headerName: 'Fee Amt',
				field: "feeAmount",
				sortable: true,
				autoHeight: true,
				editable: false,
				width: 130,
				cellRenderer: (params) => {
					let feeAmt = params.data.feeAmount;
					if (feeAmt == null) {
						return;
					}
					let decimalFeeAmount = feeAmt.toFixed(2);
					if (decimalFeeAmount) {
						return '$' + decimalFeeAmount;
					}
				},
				cellStyle: { 'cursor': "initial" },
			},
		];

		this.defaultColDef = {
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
			'<span class="ag-overlay-loading-center nodata" style=\"margin-top:-137px; border-radius:5px; font-size:15px;">Data not loaded yet.</span>';
		this.overlayNoRowsTemplate =
			"<span class='ag-overlay-loading-center nodata'>No record(s) found.</span>";
	}

	ngOnInit() {
		$(".oneSpec").closest(".mat-dialog-container").css('cssText', 'width: 900px !important');
		this.getSalesHistoryDialog();
		this.getGrid();
	}
	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	};


	close() {
		this.dialogRef.close();
	}
	getSalesHistoryDialog() {
		this.managementService.getSlaesHistory(this.configData.salesId).subscribe((response: any) => {
			this.historyData = response[0];
		},
			error => {
				this.toastercomponent.onError(error)
			})
	};


	getGrid() {
		this.managementService.getSalesHistoryGrid(this.configData.salesId).subscribe((response: any) => {
			this.rowData = response.items;
			let totalAmt = response.totalAmount;
			//response.totalFeeAmount=-0.00;
			let decimalAmt = totalAmt.toFixed(2);
			this.totalAmount = '$' + decimalAmt;
			let totalFeeAmount = response.totalFeeAmount;
			let decimalFeeAmount = totalFeeAmount.toFixed(2);
			this.totalFeeAmount = '$' + decimalFeeAmount;
			console.log(response,'response')
		},
			error => {
				this.toastercomponent.onError(error);
			})
	};

	//print sales voyages 
	print() {
		//console.log("hello only config data", this.configData);
		//console.log("second ",this.configData.contractRateId);
		window.location.href = `api/finance/sales/history/report?itinerarySequenceId=${this.configData.itineraryId}&contractRateId=${this.configData.contractRateId}`;
	}

}
