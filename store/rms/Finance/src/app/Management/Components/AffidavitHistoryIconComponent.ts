import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
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
import { DatePipe } from '@angular/common';
@Component({
	selector: 'app-affidavithistoryicon',
	templateUrl: "'../../../../../../common/styles/AgGrid.scss',../../../../../../../Views/Finance/Management/AffidavitHistoryIcon.html",
	providers: [DatePipe]

})
export class AffidavitHistoryIconComponent {
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
	gridColumnApi: any;
	items: any;
	Data: any;

	constructor(private dialogRef: MatDialogRef<AffidavitHistoryIconComponent>, @Inject(MAT_DIALOG_DATA) data, private toasterComponent: ToasterComponent, private datePipe: DatePipe, private managementService: ManagementService, private http: HttpClient, private route: ActivatedRoute, ) {
		this.Data = data;
		this.columnDefs = [

			{
				headerName: 'Delivered',
				field: "deliveredDateTime",
				sortable: true,
				autoHeight: true,
				
				width: 200,
				cellRenderer: (params) => {
					let callDate = params.value;
					return this.datePipe.transform(callDate, 'MM/dd/yy');
				},
				cellStyle: { 'cursor': "initial" },
			},
			{
				headerName: 'Calls',
				field: "totalCalls",
				sortable: true,
				autoHeight: true,
				width: 200,
				cellStyle: { 'cursor': "initial" },
			},
			{
				headerName: 'Oldest Call',
				field: "oldestCall",
				sortable: true,
				autoHeight: true,
				width: 200,
				cellRenderer: (params) => {
					let oldestCall = params.value;
					return this.datePipe.transform(oldestCall, 'MM/dd/yy');
				},
				cellStyle: { 'cursor': "initial" },

			},


		];


		this.defaultColDef = {
			// editable: true,
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
			"<span class='ag-overlay-loading-center nodata'>No Data found.</span>";
	}

	ngOnInit() {
		console.log(this.Data, 'dataamodal')
		this.getAffidavitContractId();
		if (this.Data.title == 'History') {
			this.getHistory();
		}

	};


	getHistory() {
		let contractID = this.Data.salesId.contractID;
		this.managementService.getAffidavitDetailsBasedOncontractID(contractID).subscribe((response: any) => {

			this.rowData = response;
		}, error => {
			this.toasterComponent.onError(error);
		}
		)
	};

	getAffidavitContractId() {
		let contractId = this.Data.salesId.contractID;
		this.managementService.getAffidavitDetails(contractId).subscribe((response: any) => {

			this.items = response[0];

		}, error => {
			this.toasterComponent.onError(error);
		}
		)
	}
	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	};

	onSelectName(e): void {
		this.name = e.id   // Create new variable to store the name, if you will reassign the selectedName model value which holds ID and Name based on the template [ngValue], it will not reflect the updated data if you reassign it to just name. I suggest you create new one that acts as your official model name to store the selected name. 
		// and fetch its ID as well, depends on how you want to use this.
	}

	// inline Edit Service
	onCellValueChanged(e) {
		this.updatedId = e.data.id
		this.onColumnResized();
		let obj = e.data
		obj.name = e.data.employee_name
	}

	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	};
	close() {
		this.dialogRef.close();
	}
	saveDoc() {
		this.dialogRef.close();
	}
	save() {

	}
	cancel() {
		this.dialogRef.close();
	}


}
