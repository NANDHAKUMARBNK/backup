import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AddTargetModalComponent } from './AddTargetModalComponent';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { CouponBookService } from '../../Service/CouponBookService';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
declare var $: any;
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { RMSApiService } from 'common/services/RMSApiService';
import { NumericEditorComponent } from 'common/components/NumericEditorComponent'
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
	selector: 'app-coupontarget',
	templateUrl: '../../../../../../../Views/CouponBook/TargetList.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, CustomValidatorService]
})
export class TargetListComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	appName = 'TargetList';

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
	TargetListForm: FormGroup
	CuriseLine: any;
	cruiseLineId: any;
	shipsData: any;
	budgetProfileData: object[] = [];
	shipId: any;
	budgetId: any;
	exitId: any;
	dateId: any;
	voyageEnd: any;
	dateval: any;
	minDate: any;
	searchRan: boolean;
	VoyagesStartTo = new FormControl(moment());
	VoyagesStartEnd = new FormControl(moment());
	embarkDateTime: string;
	debarkDateTime: string;
	domLayout: any;
	paginationPageSize: any;
	// debarkDateTime: any;
	// embarkTime: any;
	editType: any;

	constructor(private http: HttpClient, private dialog: MatDialog, private rMSApiService: RMSApiService,
		private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe, private customValidatorService: CustomValidatorService,
		private emitterService: EmitterService, private toasterComponent: ToasterComponent, private sharedDataService: SharedDataService, private couponBookService: CouponBookService
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
				autoHeight: true,
				sortable: true,
				minWidth: 250

			},
			{
				headerName: 'T1 ($1.00)',
				field: "target_t1",
				autoHeight: true,
				sortable: true,
				editable: true,
				minWidth: 75,
				cellEditorFramework: NumericEditorComponent
			},
			{
				headerName: 'T2 ($3.50)',
				field: "target_t2",
				autoHeight: true,
				sortable: true,
				minWidth: 75,
				editable: true,
				cellEditorFramework: NumericEditorComponent
			},
			{
				headerName: 'T3 ($7.00)',
				field: "target_t3",
				autoHeight: true,
				sortable: true,
				editable: true,
				minWidth: 75,
				cellEditorFramework: NumericEditorComponent
			},
			{
				headerName: 'T4 ($9.00)',
				field: "target_t4",
				autoHeight: true,
				sortable: true,
				editable: true,
				minWidth: 75,
				cellEditorFramework: NumericEditorComponent
			}

		];
		this.defaultColDef = {
			//editable: true,
			resizable: true,
			//  width: 100
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
			'<span class="ag-overlay-loading-center nodata" >Searching...please wait</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';

	}

	ngOnInit() {
		this.formcontrolsSet();
		this.getBudgetProfile();
		this.getCuriseLine();
		this.GetShips();

		this.emitterService.refreshtargetProfile.subscribe(d => {
			this.budgetProfileData = [];
			this.getBudgetProfile();
		});



	};

	downloadReport() {
		this.cruiseLineId = this.TargetListForm.get('cruiseLineId').value;
		this.shipId = this.TargetListForm.get('shipId').value;
		this.budgetId = this.TargetListForm.get('targetProfile').value;
		var sDate = this.dateId ? this.datePipe.transform(this.dateId, 'yyyy-MM-dd') : "";
		var eDate = this.voyageEnd ? this.datePipe.transform(this.voyageEnd, 'yyyy-MM-dd') : "";
		window.location.href = `api/coupons/collateralTarget/download?cruiseLineId=${this.cruiseLineId}&shipId=${this.shipId}&beginDate=${sDate}&endDate=${eDate}&profileId=${this.budgetId}`;
	};

	downloadSmapleFile() {
		window.location.href = `/api/coupons/collateralTarget/sample`;
	};

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
	dateChange() {
		if (moment(this.TargetListForm.get('VoyagesStartTo').value.isValid())) {
			this.minDate = moment(this.TargetListForm.get('VoyagesStartTo').value).add(1, 'days');
		}
	}
	hasError(controlName: string, errorName: string) {
		return this.TargetListForm.controls[controlName].hasError(errorName);
	}

	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	}
	// inline Edit Service

	rowValueChanged(e) {
		this.updatedId = e.data.id;
		if (this.updatedId == null) {
			this.updatedId = '';

		} else {
			this.updatedId = e.data.id
		}
		let profileId = e.data.profileId;
		let objectId = e.data.objectId;
		let entityId = e.data.entityId;
		let shipId = e.data.shipId
		this.onColumnResized();
		let obj = e.data
		const reqData = {
			t1: e.data.target_t1,
			t2: e.data.target_t2,
			t3: e.data.target_t3,
			t4: e.data.target_t4
		}
		if (reqData.t1 && reqData.t2 && reqData.t3 && reqData.t4) {
			this.couponBookService.putTargetList(this.updatedId, profileId, entityId, shipId, reqData).subscribe((data: any) => {
				this.search();
			},
				error => {
					this.toasterComponent.onError(error)
				}
			)
		}

	}



	addClick() {
		this.display = true;
	}
	onRowClicked(e) {
	}

	plusIcon() {
		this.config.data = {

		}
		let dialogRef = this.dialog.open(AddTargetModalComponent, this.config);
		//dialogRef.componentInstance.View = "Add"

	}
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

	};

	formcontrolsSet() {
		this.TargetListForm = this.fb.group({
			cruiseLineId: [''],
			shipId: [''],
			VoyagesStartTo: [''],
			VoyagesStartEnd: [''],
			targetProfile: [''],
			exit: [true],
		});



	
	};



	//Get CuriseLine
	getCuriseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.CuriseLine = data
			
			let routeParamsCruiselineId = parseInt(sessionStorage.getItem('cruiseid'));
			this.embarkDateTime = sessionStorage.getItem('embarkDateTime');
			let embarkS = moment(this.embarkDateTime).format();
			this.debarkDateTime = sessionStorage.getItem('debarkDateTime');
			let dembarkS = moment(this.debarkDateTime).format();
			let routeParamsShipId = parseInt(sessionStorage.getItem('shipid'));
			this.CuriseLine.forEach(item => {
				if (item.isDefault == true) {
					this.TargetListForm.patchValue({
						cruiseLineId: item.id
					});
				}
			})
			if (routeParamsCruiselineId) {
				this.TargetListForm.patchValue({
					cruiseLineId: routeParamsCruiselineId,
					shipId: routeParamsShipId,
					VoyagesStartTo: embarkS,
					VoyagesStartEnd: dembarkS
				})
				this.minDate = moment(this.embarkDateTime).add(1, 'days').format();
			};
			let cascaddingitem = this.rMSApiService.getcascaddingitem();
			if (cascaddingitem) {
				this.TargetListForm.patchValue({
					cruiseLineId: cascaddingitem.cruiseLineId
				});
				//this.search();
			};
			let patchValue = this.TargetListForm.value;


			if (patchValue.cruiseLineId || patchValue.shipId || patchValue.VoyagesStartTo || patchValue.VoyagesStartEnd) {
			this.sharedDataService.getShipList(patchValue.cruiseLineId).subscribe((data: any) => {
				this.shipsData = data;
				this.TargetListForm.patchValue({
					shipId: routeParamsShipId,
				})
			},
				error => {
					this.toasterComponent.onError(error);
				}
			);
				this.search();
			} else {
				//this.GetShips();
			}
		},
			error => {
				this.toasterComponent.onError(error);
			}




		);


	};
	//Get Ships
	GetShips() {
		this.TargetListForm.controls['shipId'].reset('', { onlySelf: true, emitEvent: false });
		this.cruiseLineId = this.TargetListForm.get('cruiseLineId').value,
			this.sharedDataService.getShipList(this.cruiseLineId).subscribe((data: any) => {
				this.shipsData = data;
			},
				error => {
					this.toasterComponent.onError(error);
				}
			);
	};

	getBudgetProfile() {
		this.couponBookService.getTargetProfile().subscribe((data: any) => {
			this.budgetProfileData = data;
		})
	}

	/*===========Serach click pass values and both click and page laod same api ======*/
	search() {
		this.cruiseLineId = this.TargetListForm.get('cruiseLineId').value;
		this.shipId = this.TargetListForm.get('shipId').value;
		this.budgetId = this.TargetListForm.get('targetProfile').value;
		this.exitId = this.TargetListForm.get('exit').value;
		this.dateId = this.TargetListForm.get('VoyagesStartTo').value;
		let start = this.datePipe.transform(this.dateId, 'yyyy-MM-dd');

		if (this.cruiseLineId == null) {
			this.cruiseLineId = ''
		} else {
			this.cruiseLineId = this.TargetListForm.get('cruiseLineId').value;
		}
		if (this.shipId == null) {
			this.shipId = ''
		} else {
			this.shipId = this.TargetListForm.get('shipId').value;
		}
		if (this.budgetId == null) {
			this.budgetId = ''
		} else {
			this.budgetId = this.TargetListForm.get('targetProfile').value;
		}
		if (this.exitId == null) {
			this.exitId = ''
		} else {
			this.exitId = this.TargetListForm.get('exit').value;
		}

		if (start == null) {
			start = '';
		} else {
			start = this.datePipe.transform(this.dateId, 'yyyy-MM-dd');
		}

		this.voyageEnd = this.TargetListForm.get('VoyagesStartEnd').value;
		let end = this.datePipe.transform(this.voyageEnd, 'yyyy-MM-dd');
		if (end == null) {
			end = '';
		} else {
			end = this.datePipe.transform(this.voyageEnd, 'yyyy-MM-dd');
		};
		this.rMSApiService.showLoader(true);
		this.couponBookService.getTargetListGrid(this.cruiseLineId, this.shipId, start, end, this.budgetId, this.exitId).subscribe((data: any) => {
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



	// upload html 
	// check conditon
	uploadTarget(e) {
		if (e == 'upload') {
			this.showView = false;
			this.showUplaod = true;
		} else {
			this.showUplaod = false;
			this.showView = true;
		}

	};
	cancel() {
		this.TargetListForm.reset();
		// this.formcontrolsSet();
		// this.search();
		this.TargetListForm = this.fb.group({
			cruiseLineId: [''],
			shipId: [''],
			VoyagesStartTo: [''],
			VoyagesStartEnd: [''],
			targetProfile: [''],
			exit: [],
		});
		this.GetShips();
		this.rowData = [];
	};

	// dateChange(event) {
	// 	this.minDate = moment(event.value).add(1, 'days').format('MM/DD/YY');
	// };

	ngOnDestroy() {
		sessionStorage.removeItem('cruiseid');
		sessionStorage.removeItem('shipid');
		sessionStorage.removeItem('embarkDateTime');
		sessionStorage.removeItem('debarkDateTime');
		localStorage.removeItem('cruiseid');
		localStorage.removeItem('shipid');



	}
}
