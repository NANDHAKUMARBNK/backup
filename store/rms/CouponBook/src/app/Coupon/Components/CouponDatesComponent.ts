import { Component, Inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CouponBookService } from '../../Service/CouponBookService';
import { EffectiveStartComponent } from './effectiveStartDateComponent';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { EffectiveEndComponent } from './EffectiveEndComponent';
import { RMSApiService } from 'common/services/RMSApiService';
import moment from 'moment';

import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
declare var $: any;


@Component({
	selector: 'app-coupondates',
	templateUrl: '../../../../../../../Views/CouponBook/CouponDates.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe]
})
export class CouponDatesComponent implements OnDestroy {


	@ViewChild('pageSize') pageSize: ElementRef;
	private gridApi;
	private gridColumnApi;
	columnDefs: any
	defaultColDef: any
	rowData: any;
	getRowHeight;
	private getRowNodeId;
	gridId: any;
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	statusL: any;
	updatedId: any;
	locationId: any;
	components: any;
	nameData: any;
	dateExit: any;
	updates: any = [];
	datesObj: object[] = [];
	endDateObj: any = []
	finalDateObj: any = [];
	newRows: any = [];
	currertId: any;
	newGridID: number;
	getNamesSubscription: Subscription;
	saveDatesSubscription: Subscription;
	getGridSubscription: Subscription;
	isEmptyData: boolean = false;
	// paginationPageSize: number;
	// domLayout: any;



	constructor(private dialogRef: MatDialogRef<CouponDatesComponent>, @Inject(MAT_DIALOG_DATA) data, private couponBookService: CouponBookService, private datepipe: DatePipe,
		private toasterComponent: ToasterComponent, private emitterService: EmitterService, private rmsApiService: RMSApiService) {
		this.locationId = data;
		this.rmsApiService.setRowDateId(this.locationId);
		this.columnDefs = [
			{
				headerName: 'Effective Start',
				field: "effectiveStartDate",
				cellRendererFramework: EffectiveStartComponent,
				width:300
			},
			{
				headerName: 'Effective End',
				field: "effectiveEndDate",
				cellRendererFramework: EffectiveEndComponent,
				width:300
			},
		];

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
	};

	ngOnInit() {
		this.getDateNames();
		this.getGrid();
		this.rmsApiService.resetNewDatesData();
	}

	onPageSizeChanged() {
		//var value=100;
		let value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		//this.gridApi.setRowData(this.searchList(value));
		let element = document.getElementById("myGrid");
		//this.gridApi.setDomLayout("autoHeight");
		//document.getElementById("#myGrid").style.height = "";
		//this.gridPagination.onPageSized(value, element);

	}


	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		}
		//this.paginationPageSize = 100;
		//this.gridApi.setDomLayout("autoHeight");

	};

	getDateNames() {
		this.getNamesSubscription = this.couponBookService.getDateNames(this.locationId.id).subscribe((data: any) => {
			this.nameData = data;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};

	getGrid() {
		this.rmsApiService.showLoader(true);
		this.getGridSubscription = this.couponBookService.getProfileDatesGrid(this.locationId.id).subscribe((data: any) => {
			this.rowData = data;
			this.rmsApiService.showLoader(false);
			let dateValidationArray = this.rowData.map(function (row) {
				return { "id": row.id, "startdate_min": null, "startdate_max": null, "enddate_min": moment(row.effectiveStartDate).add(1, 'days').format("YYYY-MM-DD"), "enddate_max": moment(row.maxSalesDate).add(1, 'days').format("YYYY-MM-DD") }
			});
			this.rmsApiService.setDateValidation(dateValidationArray);
			this.rmsApiService.setExistingDatesData(this.rowData);
			this.newGridID = this.rowData[this.rowData.length - 1].id;
			// if (this.rowData.length <= 10) {
			// 	$('.ag-paging-panel').hide();
			// } else {
			// 	$('.ag-paging-panel').show();
			// }
		},
			error => {
				this.rmsApiService.showLoader(false);
				this.toasterComponent.onError(error);
			}
		)
	};

	insertNewResult() {
		if (this.rowData.length <= 0 && !this.isEmptyData) {
			this.isEmptyData = true;
			this.newGridID = 0;
		}
		this.newGridID++;
		this.updates = this.gridApi.updateRowData(
			{
				add: [{
					date: this.columnDefs,
					id: this.newGridID
				}]
			}
		);
		let tempObj = { "id": this.newGridID, "itemLocationId": this.locationId.id, "is_temp": true, "effectiveStartDate": null, "effectiveEndDate": null }
		this.rmsApiService.pushNewDate(tempObj);
		let dateValidation = this.rmsApiService.getcascaddingitem();
		let tempDateValidation = { "id": this.newGridID, "startdate_min": dateValidation.effectiveStartDate, "startdate_max": dateValidation.effectiveEndDate, "enddate_min": dateValidation.effectiveStartDate, "enddate_max": dateValidation.effectiveEndDate, "is_New": true }
		this.rmsApiService.addNewDateValidation(tempDateValidation);
		let pushDates = [];
		pushDates.push(this.updates);
		if (this.rowData.length <= 10) {
			$('.ag-paging-panel').hide();
		} else {
			$('.ag-paging-panel').show();
		}
		this.gridApi.startEditingCell({
			rowIndex: this.updates.add[0].rowIndex,
			colKey: 'date',
		});

	};

	saveDate() {
		let newDates = this.rmsApiService.getNewDatesData()
		let addedDates = newDates.filter(ele => ele.is_temp).map(function (item) {
			return { "itemLocationId": item.itemLocationId, "effectiveStartDate": item.effectiveStartDate, "effectiveEndDate": item.effectiveEndDate }
		});
		if (addedDates.filter(ele => (ele.effectiveStartDate == null || ele.effectiveEndDate == null)).length > 0) {
			this.toasterComponent.dateValidationError();
			return;
		}
		let updatedDates = newDates.filter(ele => !("is_temp" in ele)).map(function (item) {
			return { "itemLocationEffectiveDateId": item.id, "itemLocationId": item.itemLocationId, "effectiveStartDate": item.effectiveStartDate, "effectiveEndDate": item.effectiveEndDate }
		});
		let finalArray = []
		updatedDates.forEach(ele => {
			finalArray.push(ele);
		});
		addedDates.forEach(ele => {
			finalArray.push(ele);
		});
		this.rmsApiService.showLoader(true)
		this.couponBookService.saveDate(finalArray).subscribe((data: any) => {
			this.rmsApiService.showLoader(false);
			this.dialogRef.close();
			this.toasterComponent.onSucess();

			this.emitterService.collateralDates.emit(true);
		},
			error => {
				this.toasterComponent.onError(error);
				this.rmsApiService.showLoader(false)
			}
		)
	};

	close() {
		this.dialogRef.close();
	}

	ngOnDestroy() {
		if (this.getNamesSubscription) {
			this.getNamesSubscription.unsubscribe();
		}
		if (this.getGridSubscription) {
			this.getGridSubscription.unsubscribe();
		}
		if (this.saveDatesSubscription) {
			this.saveDatesSubscription.unsubscribe();
		}
	}
}