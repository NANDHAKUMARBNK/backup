import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CouponSettelmentEntryComponent } from './CouponSettlementEntryComponent';
import { SharedDataService } from 'common/services/SharedDataService';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CouponBookService } from '../../Service/CouponBookService';
import { DatePipe } from '@angular/common';
import { CheckBoxSettlementComponent } from './checkboxComponent';
import { Subscription } from 'rxjs';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
declare var $: any;

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { CustomValidatorService } from 'common/CustomValidation/CustomValidatorService';
import { RMSMomentDateAdapter } from 'common/adapter/RMSMomentDateAdapter';

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
	selector: 'app-couponsettlement',
	templateUrl: '../../../../../../../Views/CouponBook/CouponSettlement.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, CustomValidatorService
	]
})
export class CouponSettlementComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	appName = 'Couponsettlement';
	rowSelection: any;
	SettlementListForm: FormGroup;
	cruiseLine: any;
	shipsData: any;
	CruiseLineId: any;

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
	cruiseLineId: any;
	showData: any;
	shipSubscription: Subscription;
	cruiseLineSubscription: Subscription
	startDate = new FormControl(moment());
	endDate = new FormControl(moment());
	disabledupdatesettlement: boolean = true;

	domLayout: any;
	paginationPageSize: any;


	constructor(private http: HttpClient, private dialog: MatDialog, private fb: FormBuilder, private datepipe: DatePipe,
		private router: Router, private route: ActivatedRoute, private couponBookService: CouponBookService,
		private sharedDataService: SharedDataService,
		private emitterService: EmitterService,
		private rMSApiService: RMSApiService,
		private toasterComponent: ToasterComponent,
		private customValidatorService: CustomValidatorService
	) {

		this.columnDefs = [
			{
				headerName: '',
				//field: "id",
				minWidth: 60,
				headerCheckboxSelection: true,
				headerCheckboxSelectionFilteredOnly: true,
				checkboxSelection: true,
				//cellRendererFramework: CheckBoxSettlementComponent


			},
			{
				headerName: 'Item Desc',
				field: "itemShortName",
				sortable: true,
				autoHeight: true,
				minWidth: 130,
				editable: false,
			},
			{
				headerName: 'Voyage ID',
				field: "clVoyageID",
				sortable: true,
				autoHeight: true,
				minWidth: 130,
				editable: false,
			},
			{
				headerName: 'Ship',
				field: "shipName",
				sortable: true,
				autoHeight: true,
				minWidth: 200,
				editable: false,
			},
			{
				headerName: 'Start',
				field: "embarkDateTime",
				autoHeight: true,
				minWidth: 130,
				sortable: true,
				editable: false,
				cellRenderer: (params) => {
					return this.datepipe.transform(params.value, 'MM/dd/yy')
				}

			},
			{
				headerName: 'End',
				field: "debarkDateTime",
				autoHeight: true,
				sortable: true,
				minWidth: 130,
				editable: false,
				cellRenderer: (params) => {
					return this.datepipe.transform(params.value, 'MM/dd/yy')
				}

			},
			{
				headerName: 'SE Sales',
				field: "sales_PSG",
				autoHeight: true,
				sortable: true,
				minWidth: 100,
				editable: false,

			},
			{
				headerName: 'Give Away',
				field: "giveAway",
				autoHeight: true,
				sortable: true,
				minWidth: 100,
				editable: false,

			},
			{
				headerName: 'Sales',
				field: "sales",
				autoHeight: true,
				sortable: true,
				minWidth: 100,
				editable: false,

			},

		];

		this.defaultColDef = {
			editable: true,
			resizable: true,
		}

		this.overlayLoadingTemplate =
			'<span class="ag-overlay-loading-center nodata" >Searching...please wait</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';
	}
	ngOnInit() {
		this.formControlsSet();
		this.getCruiseLine();
		this.GetShips();
		this.getShowResultsSettlement();
		this.searchList();

		this.emitterService.refreshupdateSettlement.subscribe(data => {
			this.rowData = [];
			this.searchList();
			this.disabledupdatesettlement = true;
		})


	};

	formControlsSet() {
		this.SettlementListForm = this.fb.group({
			CruiseLineId: [''],
			ShipId: [''],
			startDate: [''],
			endDate: [''],
			show: ['UNSTLD']
		});

		let cascaddingitem = this.rMSApiService.getcascaddingitem();
		if (cascaddingitem) {
			this.SettlementListForm.patchValue({
				CruiseLineId: cascaddingitem.cruiseLineId
			})
			//this.searchList();
		};
	}
	/* ===========getCruiseLine call from Service =========*/
	getCruiseLine() {
		this.cruiseLineSubscription = this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.cruiseLine = data;

			this.cruiseLine.forEach(item=>{
				if(item.isDefault==true){
					this.SettlementListForm.patchValue({
						CruiseLineId: item.id
					});
				}

			})
		},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	}
	GetShips() {
		this.SettlementListForm.controls['ShipId'].reset('', { onlySelf: true, emitEvent: false });
		this.cruiseLineId = this.SettlementListForm.get('CruiseLineId').value,
			this.shipSubscription = this.sharedDataService.getShipList(this.cruiseLineId).subscribe((data: any) => {
				this.shipsData = data;
			},
				error => {
					this.toasterComponent.onError(error);
				}
			)
	};
	getShowResultsSettlement() {
		this.couponBookService.getShowResultsSettlement().subscribe((data: any) => {
			this.showData = data.items;
		},
			error => {
				this.toasterComponent.onError(error);
			}
		)
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
	};

	selectionChanged(params) {
	

		let data = this.gridApi.getSelectedRows();
	
		let tempArray = [];
		if (data.length > 0) {
			this.disabledupdatesettlement = false;
			tempArray.push(data);
		} else if (data.length < 0) {
			tempArray = tempArray.filter(element => element.id != data.id);

		} else if (tempArray.length == 0) {
			this.disabledupdatesettlement = true;
		}
	
		this.rMSApiService.setCheckedDataSettlement(tempArray);
	}
	searchList() {
		let cruiseLineId = this.SettlementListForm.get('CruiseLineId').value;
		let shipId = this.SettlementListForm.get('ShipId').value;
		let show = this.SettlementListForm.get('show').value;

		let startDate = this.SettlementListForm.get('startDate').value;
		let sDate = this.datepipe.transform(startDate, 'yyyy-MM-dd');
		let endDate = this.SettlementListForm.get('endDate').value;
		let eDate = this.datepipe.transform(endDate, 'yyyy-MM-dd');

		if (cruiseLineId == null) {
			cruiseLineId = '';
		} else {
			cruiseLineId = this.SettlementListForm.get('CruiseLineId').value;
		}
		if (shipId == null) {
			shipId = '';
		} else {
			shipId = this.SettlementListForm.get('ShipId').value;
		}
		if (show == null) {
			show = '';
		} else {
			show = this.SettlementListForm.get('show').value;
		}

		if (sDate == null) {
			sDate = '';
		} else {
			sDate = this.datepipe.transform(startDate, 'yyyy-MM-dd');
		}

		if (eDate == null) {
			eDate = ''
		} else {
			eDate = this.datepipe.transform(endDate, 'yyyy-MM-dd');
		}

		this.rMSApiService.showLoader(true);

		this.couponBookService.getSettlementList(cruiseLineId, shipId, sDate, eDate, show).subscribe((data: any) => {
			this.rowData = data;
			this.rMSApiService.showLoader(false)
			// if(this.rowData.length <= 10){
			// 	$('.ag-paging-panel').hide();
			// }else{
			// 	$('.ag-paging-panel').show();
			// }
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.rMSApiService.setData(error);
				this.router.navigate(['/Error'])
			}
		)
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
	}
	addClick() {
		this.display = true;
	}
	removesearch() {
		this.searchValue = null
		this.gridApi.setQuickFilter(this.searchValue);
	};
	dateChange() {
		if (moment(this.SettlementListForm.get('startDate').value.isValid())) {
			this.StartDate = moment(this.SettlementListForm.get('startDate').value).add(1, 'days');
		}
	}
	hasError(controlName: string, errorName: string) {
		return this.SettlementListForm.controls[controlName].hasError(errorName);
	}
	couponSettlementEntry() {
		let gridId = this.rMSApiService.getData()
		this.config.data = {
			id: gridId.id,
			entityId: gridId.entityId,
			itemLocationId: gridId.itemLocationId,
			objectCode: gridId.objectCode,
		}
		let dialogRef = this.dialog.open(CouponSettelmentEntryComponent, this.config);
	}
	onPageSizeChanged() {
		var value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");
		// if(value == 10){
		// 	element.classList.add("gridHeight10");
		// 	element.classList.remove("gridHeight50");
		// 	element.classList.remove("gridHeight100");
		// }else if(value == 50){
		// 	element.classList.add("gridHeight50");
		// 	element.classList.remove("gridHeight10");
		// 	element.classList.remove("gridHeight100");
		// }else if(value == 100){
		// 	element.classList.remove("gridHeight10");
		// 	element.classList.remove("gridHeight50");
		// 	element.classList.add("gridHeight100");
		// }
	};
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	cancel() {
		this.SettlementListForm.reset();
		if (this.cruiseLineSubscription) {
			this.cruiseLineSubscription.unsubscribe();
		}
		if (this.shipSubscription) {
			this.shipSubscription.unsubscribe();
		}
		// this.formControlsSet();
		// this.searchList();
		this.SettlementListForm = this.fb.group({
			CruiseLineId: [''],
			ShipId: [''],
			startDate: [''],
			endDate: [''],
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
	validatedate(event) {

		this.customValidatorService.isDateMaxlengthForamt(event)
	}


}
var minRowHeight = 30;
var currentRowHeight = minRowHeight;

