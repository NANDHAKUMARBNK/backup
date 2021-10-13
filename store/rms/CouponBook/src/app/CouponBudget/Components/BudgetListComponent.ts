import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AddBudgetModalComponent } from './AddBudgetModalComponent';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { CouponBookService } from '../../Service/CouponBookService';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NumericEditorComponent } from 'common/components/NumericEditorComponent'

import * as _moment from 'moment';
declare var $: any;
import { default as _rollupMoment } from 'moment';
import { RMSApiService } from 'common/services/RMSApiService';
import { template } from '@angular/core/src/render3';
import { ValueParserParams } from 'ag-grid-community';
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
	selector: 'app-couponbudget',
	templateUrl: '../../../../../../../Views/CouponBook/BudgetList.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },CustomValidatorService]
})
export class BudgetListComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	appName = 'BudgetList';
	private rowSelection;
	display: boolean = false;
	gridApi: any;
	gridColumnApi: any;
	columnDefs: any;
	defaultColDef: any;
	rowData: any=[];
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
	showUplaod: boolean = false;
	showView: boolean = true;
	budgetListForm: FormGroup;
	CuriseLine: any;
	cruiseLineId: any;
	shipsData: any;
	budgetProfileData: object[] = [];
	shipId: any;
	budgetId: any;
	exitId: any;
	dateId: any;
	voyageEnd: any;
	minDate: any;
	dateval: any;
	searchRan: boolean;
	VoyagesStartTo = new FormControl(moment());
	VoyagesStartEnd = new FormControl(moment());
	editType: any;
	domLayout: any;
	paginationPageSize: any;
	constructor(private http: HttpClient, private dialog: MatDialog, private rMSApiService: RMSApiService,
		private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
		private emitterService: EmitterService, private datePipe: DatePipe,
		private customValidatorService:CustomValidatorService,
		private sharedDataService: SharedDataService, private toasterComponent: ToasterComponent, private couponBookService: CouponBookService
	) {
		this.id = this.route.snapshot.paramMap.get('id')
		this.columnDefs = [
			{
				headerName: 'Ship',
				field: "shipName",
				sortable: true,
				autoHeight: true,
				minWidth: 175
			},
			{
				headerName: 'Profile',
				field: "profileName",
				autoHeight: true,
				sortable: true,
				minWidth: 150
			},
			{
				headerName: 'Itinerary',
				field: "itineraryName",
				sortable: true,
				autoHeight: true,
				minWidth: 250

			},
			{
				headerName: 'Avg',
				field: "avgSales",
				autoHeight: true,
				sortable: true,
				minWidth: 75,
				cellRenderer: (params) => {
					// if (params.value == 0) {
					// 	return;
					// } else {
					// 	return '$' + params.value.toFixed(2);
					// }
					if (params.value == null) {
						return;
					}
					let avgSalesValue = params.value;
					let integerAmount = parseInt(avgSalesValue);
					let amount = integerAmount.toFixed(2);
					return '$' + amount;
				}
			},
			{
				headerName: 'Budget',
				field: "budget",
				autoHeight: true,
				sortable: true,
				minWidth: 75,
				editable: true,
				cellEditorFramework: NumericEditorComponent,
				//valueSetter: this.valueSetter
			},
			{
				headerName: 'R1',
				field: "budget_r1",
				autoHeight: true,
				sortable: true,
				editable: true,
				minWidth: 75,
				cellEditorFramework: NumericEditorComponent

			},
			{
				headerName: 'R2',
				field: "budget_r2",
				autoHeight: true,
				sortable: true,
				editable: true,
				minWidth: 75,
				suppressNavigable: true,
				cellEditorFramework: NumericEditorComponent
			}

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
		this.editType = "fullRow";

	

		this.overlayLoadingTemplate =
			'<span class="ag-overlay-loading-center nodata" >No data to display</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';
		
	}

	ngOnInit() {
		this.formcontrolsSet();
		this.getCuriseLine();
		this.getBudgetProfile();
		//this.search();

		this.emitterService.refreshbudgetProfile.subscribe(d => {
			this.budgetProfileData = [];
			this.getBudgetProfile();
		});
		

	}
	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	}
	formcontrolsSet() {
		this.budgetListForm = this.fb.group({
			cruiseLineId: [''],
			shipId: [''],
			VoyagesStartTo: [''],
			VoyagesStartEnd: [''],
			budgetProfile: [''],
			exit: [true],
		});
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

	private valueSetter(params: ValueParserParams) {
		// Value is legit - set it and signal the value has been changed/set
	
		if (params.newValue > 0) {
		
			params.data[params.colDef.field] = params.newValue;
			return true;
		}
		// Illegal value - signal no change
		return false;
	}


	downloadReport() {
		this.shipId = this.budgetListForm.get('shipId').value;
		this.cruiseLineId = this.budgetListForm.get('cruiseLineId').value;
		this.budgetId = this.budgetListForm.get('budgetProfile').value;
		var sDate = this.dateId ? this.datePipe.transform(this.dateId, 'yyyy-MM-dd') : "";
		var eDate = this.voyageEnd ? this.datePipe.transform(this.voyageEnd, 'yyyy-MM-dd') : "";
		window.location.href = `api/coupons/collateralBudget/download?cruiseLineId=${this.cruiseLineId}&shipId=${this.shipId}&beginDate=${sDate}&endDate=${eDate}&profileId=${this.budgetId}`;
	};

	downloadSmapleFile() {
		window.location.href = `/api/coupons/collateralBudget/sample`
	};
	//Get CuriseLine
	getCuriseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.CuriseLine = data;
			//this.CuriseLine[0].isDefault=true;
			let findDefaultCruiseline = this.CuriseLine.filter(element => element.isDefault == true);


			this.CuriseLine.forEach(item => {
				if (item.isDefault == true) {
					this.budgetListForm.patchValue({
						cruiseLineId: item.id
					});
				}
			})
			let cascaddingitem = this.rMSApiService.getcascaddingitem();
			if (cascaddingitem) {
				this.budgetListForm.patchValue({
					cruiseLineId: cascaddingitem.cruiseLineId
				})
				//this.search();
			};
			this.GetShips()
			let patchValue = this.budgetListForm.value;

			if (patchValue.cruiseLineId || patchValue.shipId || patchValue.VoyagesStartTo || patchValue.VoyagesStartEnd) {
				this.search();
			} else {
				this.GetShips();
			}

		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	};
	//Get Ships
	GetShips() {
		this.budgetListForm.controls['shipId'].reset('', { onlySelf: true, emitEvent: false });
		this.cruiseLineId = this.budgetListForm.get('cruiseLineId').value,
			this.sharedDataService.getShipList(this.cruiseLineId).subscribe((data: any) => {
				this.shipsData = data
			},
				error => {
					this.toasterComponent.onError(error);
				}
			);
	};

	getBudgetProfile() {
		this.couponBookService.getBudgetProfile().subscribe((data: any) => {
			this.budgetProfileData = data;
		})
	}

	/*===========Serach click pass values and both click and page laod same api ======*/
	search() {
	
		this.cruiseLineId = this.budgetListForm.get('cruiseLineId').value;
		this.shipId = this.budgetListForm.get('shipId').value;
		this.budgetId = this.budgetListForm.get('budgetProfile').value;
		this.exitId = this.budgetListForm.get('exit').value;
		this.dateId = this.budgetListForm.get('VoyagesStartTo').value;
		let start = this.datePipe.transform(this.dateId, 'yyyy-MM-dd');

		if (start == null) {
			start = '';
		} else {
			start = this.datePipe.transform(this.dateId, 'yyyy-MM-dd');
		};
		if (this.cruiseLineId == null) {
			this.cruiseLineId = '';
		} else {
			this.cruiseLineId = this.budgetListForm.get('cruiseLineId').value;
		};
		if (this.shipId == null) {
			this.shipId = '';
		} else {
			this.shipId = this.budgetListForm.get('shipId').value;
		};
		if (this.budgetId == null) {
			this.budgetId = '';
		} else {
			this.budgetId = this.budgetListForm.get('budgetProfile').value;
		};
		if (this.exitId == null) {
			this.exitId = ''
		} else {
			this.exitId = this.budgetListForm.get('exit').value;
		}

		this.voyageEnd = this.budgetListForm.get('VoyagesStartEnd').value;
		let end = this.datePipe.transform(this.voyageEnd, 'yyyy-MM-dd');
		if (end == null) {
			end = '';
		} else {
			end = this.datePipe.transform(this.voyageEnd, 'yyyy-MM-dd');
		}
		this.couponBookService.getbudgetListGrid(this.cruiseLineId, this.shipId, start, end, this.budgetId, this.exitId).subscribe((data: any) => {
			this.rowData = data;
			this.rMSApiService.showLoader(false);
			this.searchRan = true;
			// if (this.rowData.length <= 10) {
			// 	$('.ag-paging-panel').hide();
			// } else {
			// 	$('.ag-paging-panel').show();
			// }
		},
			error => {
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error'])
			}
		);
	}


	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	}

	addCoupon() {
		this.router.navigate(['/CouponBook/Profile',])
	}
	addClick() {
		this.display = true;
	}
	onRowClicked(e) {
	}

	plusIcon() {
		this.config.data = {

		}
		let dialogRef = this.dialog.open(AddBudgetModalComponent, this.config);
	}
	//showView
	viewClick(e) {
		this.showView = true;
		if (e == 'view') {
			this.showView = true;
			this.showUplaod = false;

		} else {
			this.showView = false;
			this.showUplaod = true;
		}
	}

	/*================= Page Size change==============*/

	onPageSizeChanged() {
		var value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");


	};




	/*============= inline Edit Service  call API =============*/
	rowValueChanged(e) {
	
		let findGridObj = this.rowData.find(item => item.id == e.data.id)
		this.updatedId = e.data.id
		if (this.updatedId == null) {
			this.updatedId = '';
		} else {
			this.updatedId = e.data.id
		}
		//this.onColumnResized();
		let profileId = e.data.profileId;
		let objectId = e.data.objectId;
		let entityId = e.data.entityId;
		let shipId = e.data.shipId;
		const reqData = {
			budget: e.data.budget,
			r1: e.data.budget_r1,
			r2: e.data.budget_r2
		};
		if (reqData.budget && reqData.r1 && reqData.r2) {
			this.couponBookService.putBidgetList(this.updatedId, profileId, entityId, shipId, reqData).subscribe((data) => {
				//this.emitterService.refreshHistoryEdit.emit(true);
				this.search();
			},
				error => {
					this.toasterComponent.onError(error);
				}
			);
		}



	}




	// upload html 
	// check conditon
	upload(e) {
		if (e == 'upload') {
			this.showView = false;
			this.showUplaod = true;
		} else {
			this.showUplaod = false;
			this.showView = true;
		}
	}
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	//Remove text from search
	removesearch() {
		this.searchValue = null
		this.gridApi.setQuickFilter(this.searchValue);
	};
	hasError(controlName: string, errorName: string) {
		return this.budgetListForm.controls[controlName].hasError(errorName);
	}
	dateChange() {
		if (moment(this.budgetListForm.get('VoyagesStartTo').value.isValid())) {
			this.minDate = moment(this.budgetListForm.get('VoyagesStartTo').value).add(1, 'days');
		}
	}

	cancel() {
		this.budgetListForm.reset();
		//this.formcontrolsSet();
		//this.search();

		this.budgetListForm = this.fb.group({
			cruiseLineId: [''],
			shipId: [''],
			VoyagesStartTo: [''],
			VoyagesStartEnd: [''],
			budgetProfile: [''],
			exit: [],
		});
		this.GetShips();
		this.rowData = [];
	}
	// dateChange(event) {
	// 	this.minDate = moment(event).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
	// }
	validatedate(event) {

		this.customValidatorService.isDateMaxlengthForamt(event)
	}
}
var minRowHeight = 30;
var currentRowHeight = minRowHeight;
