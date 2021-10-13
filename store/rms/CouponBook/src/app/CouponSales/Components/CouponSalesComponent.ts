import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CouponSalesEntryComponent } from './CouponSalesEntryComponent';
import { CouponBookService } from '../../Service/CouponBookService';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SharedDataService } from 'common/services/SharedDataService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { RMSApiService } from 'common/services/RMSApiService';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
declare var $: any;
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { EmitterService } from 'common/services/emitterService';
import { RMSMomentDateAdapter } from 'common/adapter/RMSMomentDateAdapter';
import { CustomValidatorService } from 'common/CustomValidation/CustomValidatorService';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
	parse: {
		dateInput: 'MM/DD/YY',
	},
	display: {
		dateInput: 'MM/DD/YY',
		monthYearLabel: 'MMM YYYY'
	},
};


@Component({
	selector: 'app-couponsales',
	templateUrl: '../../../../../../../Views/CouponBook/CouponSales.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },CustomValidatorService
	]
})
export class CouponSalesComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	appName = 'Couponsales';
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
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	salesListForm: FormGroup;
	CuriseLine: any;
	cruiseLineId: any;
	shipsData: any;
	showData: any;
	beginDate = new FormControl(moment());
	endDate = new FormControl(moment());
	domLayout: any;
	paginationPageSize: any;

	constructor(private http: HttpClient, private dialog: MatDialog, private emitterService: EmitterService,
		private router: Router, private route: ActivatedRoute,private customValidatorService:CustomValidatorService, private fb: FormBuilder, private couponBookService: CouponBookService, private datepipe: DatePipe,
		private sharedDataService: SharedDataService, private toasterComponent: ToasterComponent, private rMSApiService: RMSApiService

	) {

		this.columnDefs = [
			{
				headerName: 'Item Desc',
				field: "itemShortName",
				sortable: true,
				autoHeight: true,
				minWidth: 150
			},
			{
				headerName: 'Voyage ID',
				field: "clVoyageID",
				sortable: true,
				autoHeight: true,
				minWidth: 130,
				editable: true,
			},
			{
				headerName: 'Ship',
				field: "shipName",
				sortable: true,
				autoHeight: true,
				minWidth: 170
			},
			{
				headerName: 'Start',
				field: "embarkDateTime",
				autoHeight: true,
				sortable: true,
				minWidth: 100,
				cellRenderer: (params) => {
					return this.datepipe.transform(params.value, 'MM/dd/yy')
				}

			},
			{
				headerName: 'End',
				field: "debarkDateTime",
				autoHeight: true,
				sortable: true,
				minWidth: 100,
				cellRenderer: (params) => {
					return this.datepipe.transform(params.value, 'MM/dd/yy')
				}

			},
			{
				headerName: 'SE Sales',
				field: "sales_PSG",
				autoHeight: true,
				sortable: true,
				minWidth: 100

			},
			{
				headerName: 'Give Away',
				field: "giveAway",
				autoHeight: true,
				sortable: true,
				minWidth: 100

			},
			{
				headerName: 'Sales',
				field: "sales",
				autoHeight: true,
				sortable: true,
				minWidth: 100

			},

		];

		this.defaultColDef = {
			editable: true,
			resizable: true,
			//  width: 100
		}
		this.rowData = [
			{ Date: '12/8/19', region: 'Star', embark: '00000007', debark: 35000, units: 578587, onhand: 6876, shop: 345, give: 876, sales: 567 },
			{ Date: '22/8/19', region: 'Star', embark: '00000007', debark: 35000, units: 578587, onhand: 6876, shop: 345, give: 876, sales: 567 },
			{ Date: '26/8/19', region: 'Star', embark: '00000007', debark: 35000, units: 578587, onhand: 6876, shop: 345, give: 876, sales: 567 },
			{ Date: '29/8/19', region: 'Star', embark: '00000007', debark: 35000, units: 578587, onhand: 6876, shop: 345, give: 876, sales: 567 },

		];

		this.overlayLoadingTemplate =
			'<span class="ag-overlay-loading-center nodata" >Searching...please wait</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';
	}
	ngOnInit() {
		this.formControlSet();
		this.getCuriseLine();
		this.GetShips();
		this.getShowResults();
		this.SearchList();
		this.emitterService.refreshSalesEntry.subscribe(data => {
			this.rowData = [];
			this.SearchList();
		})
	};

	formControlSet() {
		this.salesListForm = this.fb.group({
			cruiseLineId: [''],
			shipId: [''],
			beginDate: [''],
			endDate: [''],
			voyageNumber: [''],
			show: ['UNSTLD']
		});

		let cascaddingitem = this.rMSApiService.getcascaddingitem();
		if (cascaddingitem) {
			this.salesListForm.patchValue({
				cruiseLineId: cascaddingitem.cruiseLineId
			})
			//this.SearchList();
		};
	}
	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	}
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
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

	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	}
	// inline Edit Service
	onCellValueChanged(e) {
		this.updatedId = e.data.id
		this.onColumnResized();
		let obj = e.data
		obj.name = e.data.employee_name
	};

	//Get CuriseLine
	getCuriseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.CuriseLine = data
			let findDefaultCruiseline = this.CuriseLine.filter(element => element.isDefault == true)
			let findDefaultCruiselineId = findDefaultCruiseline[0].id;
			this.salesListForm.patchValue({
				cruiseLineId: findDefaultCruiselineId
			});
			this.GetShips()
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	};
	//Get Ships
	GetShips() {
		this.salesListForm.controls['shipId'].reset('', { onlySelf: true, emitEvent: false });
		this.cruiseLineId = this.salesListForm.get('cruiseLineId').value,
			this.couponBookService.getShipsSales(this.cruiseLineId).subscribe((data: any) => {
				this.shipsData = data
			},
				error => {
					this.toasterComponent.onError(error);
				}
			);
	};
	getShowResults() {
		this.couponBookService.getShowResults().subscribe((data: any) => {
			this.showData = data.items;
		})
	}

	SearchList() {
		this.rMSApiService.showLoader(true);
		let cId = this.salesListForm.get('cruiseLineId').value;
		let sId = this.salesListForm.get('shipId').value;
		let voyageNumber = this.salesListForm.get('voyageNumber').value;
		let show = this.salesListForm.get('show').value;

		let beginDate = this.salesListForm.get('beginDate').value;
		let startDate = this.datepipe.transform(beginDate, 'yyyy-MM-dd');
		let endDate = this.salesListForm.get('endDate').value;
		let eDate = this.datepipe.transform(endDate, 'yyyy-MM-dd');

		if (cId == null) {
			cId = '';
		} else {
			cId = this.salesListForm.get('cruiseLineId').value;
		}
		if (sId == null) {
			sId = '';
		} else {
			sId = this.salesListForm.get('shipId').value;
		}
		if (voyageNumber == null) {
			voyageNumber = '';
		} else {
			voyageNumber = this.salesListForm.get('voyageNumber').value;
		}
		if (show == null) {
			show = '';
		} else {
			show = this.salesListForm.get('show').value;
		}


		if (startDate == null) {
			startDate = '';
		} else {
			startDate = this.datepipe.transform(beginDate, 'yyyy-MM-dd');
		}

		if (eDate == null) {
			eDate = ''
		} else {
			eDate = this.datepipe.transform(endDate, 'yyyy-MM-dd');
		}


		this.couponBookService.getSalesList(cId, sId, startDate, eDate, voyageNumber, show).subscribe((data: any) => {
			this.rowData = data;
			this.rMSApiService.showLoader(false);
			// if(this.rowData.length <= 10){
			// 	$('.ag-paging-panel').hide();
			// }else{
			// 	$('.ag-paging-panel').show();
			// }

		},
			error => {
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error'])

			}
		)
	};


	/*================= Page Size change==============*/

	onPageSizeChanged() {
		var value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");
		// if (value == 10) {
		// 	element.classList.add("gridHeight10");
		// 	element.classList.remove("gridHeight50");
		// 	element.classList.remove("gridHeight100");
		// } else if (value == 50) {
		// 	element.classList.add("gridHeight50");
		// 	element.classList.remove("gridHeight10");
		// 	element.classList.remove("gridHeight100");
		// } else if (value == 100) {
		// 	element.classList.remove("gridHeight10");
		// 	element.classList.remove("gridHeight50");
		// 	element.classList.add("gridHeight100");
		// }
	}

	addClick() {
		this.display = true;
	}

	removesearch() {
		this.searchValue = null
		this.gridApi.setQuickFilter(this.searchValue);
	};

	onRowClicked(e) {
		this.config.data = {
			id: e.data.id,
			entityId: e.data.entityId,
			itemLocationId: e.data.itemLocationId,
			cruiseLineId: e.data.cruiseLineId,
			shipId: e.data.shipId,
			voyageStartDate: e.data.embarkDateTime,
			voyageEndDate: e.data.debarkDateTime
		}
		let dialogRef = this.dialog.open(CouponSalesEntryComponent, this.config);
	};

	cancel() {
		this.salesListForm.reset();
		// this.formControlSet();
		// this.SearchList();
		this.salesListForm = this.fb.group({
			cruiseLineId: [''],
			shipId: [''],
			beginDate: [''],
			endDate: [''],
			voyageNumber: [''],
			show: ['']
		});
		this.GetShips();
		this.rowData = [];
	}

	startDateVal: any;
	StartDate: any;
	findStartDate(event) {
		this.StartDate = moment(event).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');

	}
	dateChange() {
		if (moment(this.salesListForm.get('beginDate').value.isValid())) {
			this.StartDate = moment(this.salesListForm.get('beginDate').value).add(1, 'days');
		}
	}
	hasError(controlName: string, errorName: string) {
		return this.salesListForm.controls[controlName].hasError(errorName);
	}
	validatedate(event) {

		this.customValidatorService.isDateMaxlengthForamt(event)
	}


}
var minRowHeight = 30;
var currentRowHeight = minRowHeight;

