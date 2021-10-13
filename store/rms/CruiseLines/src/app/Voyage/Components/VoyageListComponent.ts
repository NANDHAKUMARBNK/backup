import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
//import { PsgService } from '../../Service/PsgService'
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { DatePipe } from '@angular/common';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';
//import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, ErrorStateMatcher } from '@angular/material/core';
import { DatesValidation } from '../../../../../../common/components/CustomDatesValidation'

import * as _moment from 'moment';

import { default as _rollupMoment } from 'moment';
import { OnDestroy } from "@angular/core";
import { GridPagination } from 'common/components/GridPagination';
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

// export class MyErrorStateMatcher implements ErrorStateMatcher {
// 	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
// 		return !!(control && control.invalid && (control.dirty || control.touched));
// 	}
// }


@Component({
	selector: 'app-voyagelist',
	templateUrl: '../../../../../../../Views/CruiseLines/VoyageList.html',
	styleUrls: ['../../../styles/cruiseLine.scss', '../../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class VoyageListComponent implements OnDestroy {
	@ViewChild('pageSize') pageSize: ElementRef;
	voyagesListForm: FormGroup;
	private rowSelection;
	display: boolean = false;
	private gridApi;
	private gridColumnApi;
	// addNewReportForm: FormGroup;
	columnDefs: any
	defaultColDef: any
	rowData: any;
	searchValue: string;
	updatedId: any;
	getRowHeight;
	private getRowNodeId;
	dataId: any;
	emitterSubscribe: any;
	gridId: any;
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	CuriseLineData: any;
	shipData: any;
	cruiseLineId: any;
	regionData: any;
	portData: any;
	shipId: any;
	regionId: any;
	portId: any;
	embarkStartDataId: any;
	embarkEndDateId: any;
	dembarkSDate: any;
	dembarEDate: any;
	cId: any;
	pId: any;
	sId: any;
	embarkstartDateCapture: any;
	debarkstartDateCapture: any;
	minDebarkEndDate: any;
	minEmbarkEndDate: any
	//embarkStartDate = new FormControl(moment());
	embarkEndDate = new FormControl(moment());
	DebarkStartDate = new FormControl(moment());
	DebarkEndDate = new FormControl(moment());
	subscriptionSip: Subscription;
	shipIdFromShip: any;
	paramsCruiseLineId: any;
	paramsShipId: any;
	cruiseId: any;
	paramsPsgFullName: any;
	debarkDate: any;
	paramsRegionName: any;
	embarkDate: any;
	domLayout: any;
	paginationPageSize: any;
	cruiseLine: any;
	currentParams: any;
	routeParams: any;
	cruiseIdFromShip: any;
	todayDate: any;
	required: boolean = false;
	requiredDebark: boolean = false;
	hasAnErrorDebark: boolean = false;
	hasAnError: boolean = false;
	errorMessage: any;
	errorMessageDebark: any;
	debarkTodayDate: any;
	//matcher = new MyErrorStateMatcher();

	constructor(private http: HttpClient, private route: ActivatedRoute, private gridPagination: GridPagination,
		private fb: FormBuilder, private router: Router, private cruiseLineService: CruiseLineService,
		private sharedDataService: SharedDataService, private rmsApiService: RMSApiService, private toasterComponent: ToasterComponent,
		private emitterService: EmitterService,
		private datePipe: DatePipe,
	) {
		this.shipIdFromShip = parseInt(this.route.snapshot.paramMap.get('ShipId'));
		this.cruiseIdFromShip = parseInt(this.route.snapshot.paramMap.get('CruiseId'))
		// this.route.params.subscribe(params => {
		// 	this.cruiseIdFromShip = parseInt(params['id']);
		// });
		this.columnDefs = [
			{
				headerName: 'Ship Name',
				field: "shipName",
				sortable: true,
				autoHeight: true,
				minWidth: 140
			},
			{
				headerName: 'Start',
				field: "embarkDateTime",
				sortable: true,
				autoHeight: true,
				minWidth: 80,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy');
				}
			},
			{
				headerName: 'Embark',
				field: "embarkPortName",
				sortable: true,
				autoHeight: true,
				minWidth: 100,
			},
			{
				headerName: 'End',
				field: "debarkDateTime",
				autoHeight: true,
				sortable: true,
				minWidth: 80,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy');
				}
			},
			{
				headerName: 'Debark',
				field: "debarkPortName",
				sortable: true,
				autoHeight: true,
				minWidth: 100,
			},
			{
				headerName: 'SE',
				field: "shopping",
				sortable: true,
				autoHeight: true,
				minWidth: 50,
				//checkboxSelection: true,
				cellRenderer: params => {
					if (params.data.psgFullName == null) {
						return
					}
					else {
						return `<i class="far fa-check-circle" style="font-size:14px;"></i>`
					}
				},
			},
			{
				headerName: 'Voyage #',
				field: "obmVoyageId",
				sortable: true,
				autoHeight: true,
				minWidth: 100
			},
			{
				headerName: 'Voyage Type',
				field: "typeName",
				sortable: true,
				autoHeight: true,
				minWidth: 120
			},
			{
				headerName: 'Itinerary Type',
				field: "clDescription",
				sortable: true,
				autoHeight: true,
				minWidth: 140
			},
			{
				headerName: 'Comment',
				field: "",
				sortable: true,
				autoHeight: true,
				minWidth: 120,
				cellRenderer: params => {
					if (params.data.commentCount > 1) {
						return `<i class="far fa-check-circle" style="font-size:14px;"></i>`
					}
					else {
						return
					}
				},
			},

		];

		this.defaultColDef = {
			editable: true,
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


		// Select search parameters for results
		this.overlayLoadingTemplate =
			'<span class="ag-overlay-loading-center nodata" >Select search parameters for results</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';

	}
	
	ngOnInit() {
		this.formcontrolsSet();
		this.getCuriseLine();
		this.getVoyagesRegion();
		this.getIncludesPortVoyages();
		this.todayDate = moment().subtract(180, 'days').format();
		this.voyagesListForm.patchValue({
			embarkStartDate: this.todayDate
		})
		this.minEmbarkEndDate = this.todayDate;
		let embarkEndDate = moment().add(180, 'days').format();
		this.voyagesListForm.patchValue({
			embarkEndDate: embarkEndDate
		})
		//this.minDebarkEndDate = this.debarkTodayDate;
		// if (this.todayDate) {
		// 	this.required = true;

		// 	//this.voyagesListForm.get('embarkEndDate').markAsUntouched();
		// 	//	this.voyagesListForm.get('embarkEndDate').markAsDirty();
		// }



	};

	//Form controls
	formcontrolsSet() {

		this.voyagesListForm = this.fb.group({
			cruiseLine: [''],
			ship: [''],
			region: [''],
			port: [''],
			embarkStartDate: [''],
			// , CustomValidatorService.dateValidator
			embarkEndDate: [''],
			DebarkStartDate: [''],
			DebarkEndDate: [''],
		}, {
			//validator: DatesValidation('embarkStartDate', 'embarkEndDate')
		});
		this.setFormControls();
	};

	setFormControls() {
		let cascadingShip = this.rmsApiService.getGlobalVariable();
		let portDataGet = this.rmsApiService.getPortData();
		this.subscriptionSip = cascadingShip
		this.emitterService.refreshVoyages.subscribe(data => {
		});


		if (portDataGet) {
			this.voyagesListForm.patchValue({
				port: portDataGet,
			})
			this.searchList()
		};



	};
	// onModelUpdated(evt) {

	// 	if (this.gridApi && this.gridApi.rowModel.rowsToDisplay.length == 0) {
	// 		this.gridApi.showNoRowsOverlay();
	// 	}
	// 	if (this.gridApi && this.gridApi.rowModel.rowsToDisplay.length > 0) {
	// 		this.gridApi.hideOverlay();
	// 	}
	// }

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
		};
		console.log(this.gridApi.sizeColumnsToFit())
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");

	}

	getCuriseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.CuriseLineData = data;
			let findDefaultCruiseline = this.CuriseLineData.filter(element => element.isDefault == true)
			this.CuriseLineData.forEach(item => {
				if (item.isDefault == true) {
					this.voyagesListForm.patchValue({
						cruiseLine: item.id
					});
				}
			})
			if (this.shipIdFromShip || this.cruiseIdFromShip) {
				this.voyagesListForm.patchValue({
					cruiseLine: this.cruiseIdFromShip,
					ship: this.shipIdFromShip
				});
			}
			this.route.params.subscribe((params: any) => {
				this.routeParams = params;
				if (params.cassindingCruiseline || params.cascadingShip || params.cassindingRegion || params.cassindingPort || params.cassindingembarkStart || params.cassindingembarkEnd || params.cassindingdebarkStart || params.cassindingdebarkEnd) {
					this.voyagesListForm.patchValue({
						cruiseLine: parseInt(params.cassindingCruiseline),
						ship: parseInt(params.cascadingShip),
						region: parseInt(params.cassindingRegion),
						port: parseInt(params.cassindingPort),
						embarkEndDate: params.cassindingembarkEnd,
						embarkStartDate: params.cassindingembarkStart,
						DebarkStartDate: params.cassindingdebarkStart,
						DebarkEndDate: params.cassindingdebarkEnd,
					})
					//this.searchList();
				};

			});

			let patchValues = this.voyagesListForm.value;
			if (patchValues.cruiseLine || patchValues.ship || patchValues.region || patchValues.port || patchValues.embarkEndDate || patchValues.embarkStartDate || patchValues.DebarkStartDate || patchValues.DebarkEndDate) {
				this.getVoyagesShip();
				this.searchList();
			} else {
				this.getVoyagesShip();
			}

			//this.getVoyagesShip()


		},
			error => {
				this.toasterComponent.onError(error)

			}
		)
	}

	getVoyagesShip() {

		if (this.cruiseLineId == null) {
			this.cruiseLineId = '';
		} else {
			this.cruiseLineId = this.voyagesListForm.get('cruiseLine').value
		}
		this.cruiseLineService.getVoyagesShip(this.cruiseLineId).subscribe((data: any) => {


			this.shipData = data;

		},
			error => {
				this.toasterComponent.onError(error)

			}
		)
	};



	getVoyagesRegion() {
		this.sharedDataService.getVoyagesRegion().subscribe((data: any) => {
			this.regionData = data
		},
			error => {
				this.toasterComponent.onError(error)

			}
		)
	};
	getIncludesPortVoyages() {
		let shipId = this.voyagesListForm.get('ship').value;
		this.cruiseLineService.getVoyagesPorts(shipId).subscribe((data: any) => {
			this.portData = data
		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	}
	// datesrequired() {
	// 	this.voyagesListForm.get('embarkStartDate').valueChanges.subscribe((data: any) => {
	// 		if (data) {
	// 			this.required = true;
	// 			this.hasAnError = true;
	// 			this.voyagesListForm.get('embarkEndDate').setValidators([Validators.required])
	// 		}
	// 	});
	// };
	// datesRequired() {
	// 	this.voyagesListForm.get('DebarkStartDate').valueChanges.subscribe((data: any) => {
	// 		if (data) {
	// 			this.requiredDebark = true;
	// 			this.hasAnErrorDebark = true;
	// 			this.voyagesListForm.get('DebarkEndDate').setValidators([Validators.required])
	// 		}
	// 	});

	// }

	searchList() {

		// if (this.voyagesListForm.get('embarkStartDate').value) {
		// 	this.required = true;
		// 	if (this.required) {
		// 		//this.voyagesListForm.get('embarkEndDate').setValidators([Validators.required]);
		// 		this.errorMessage = "EmbarkEnd is Required";
		// 	}
		// }
		// //this.voyagesListForm.get('embarkEndDate').setValidators([Validators.required]);
		// if (this.voyagesListForm.get('DebarkStartDate').value) {
		// 	this.requiredDebark = true;
		// 	if (this.requiredDebark) {
		// 		this.errorMessageDebark = "DebarkEndDate is Required";
		// 	}
		// }
		// if (this.voyagesListForm.get('embarkEndDate').invalid) {
		// 	return;
		// } if (this.voyagesListForm.get('DebarkEndDate').invalid) {
		// 	return;
		// }
		// //this.voyagesListForm.get('embarkStartDate').markAsUntouched()
		// if (this.voyagesListForm.invalid) {
		// 	return;
		// }
		this.cruiseLine = this.voyagesListForm.get('cruiseLine').value;
		this.shipId = this.voyagesListForm.get('ship').value;
		this.regionId = this.voyagesListForm.get('region').value;

		this.portId = this.voyagesListForm.get('port').value;
		let embarkStartsData = this.voyagesListForm.get('embarkStartDate').value;
		this.embarkStartDataId = this.datePipe.transform(embarkStartsData, 'yyyy-MM-dd');

		let embarkEndData = this.voyagesListForm.get('embarkEndDate').value;
		this.embarkEndDateId = this.datePipe.transform(embarkEndData, 'yyyy-MM-dd');

		let dembarkStartsdData = this.voyagesListForm.get('DebarkStartDate').value;
		this.dembarkSDate = this.datePipe.transform(dembarkStartsdData, 'yyyy-MM-dd');

		let dembarkenddData = this.voyagesListForm.get('DebarkEndDate').value;
		this.dembarEDate = this.datePipe.transform(dembarkenddData, 'yyyy-MM-dd');

		if (this.regionId) { // checking condition basically im using patch values .patching from cruiseline list when page loading cruiseline undefind is coming
			this.regionId = this.voyagesListForm.get('region').value;
		} else {
			this.regionId = '';
		}
		if (this.cruiseLine) { // checking condition basically im using patch values .patching from cruiseline list when page loading cruiseline undefind is coming

			this.cruiseLine = this.voyagesListForm.get('cruiseLine').value;
		} else {
			this.cruiseLine = '';
		}

		if (this.embarkStartDataId == null) {
			this.embarkStartDataId = '';
		} else {
			this.embarkStartDataId = this.datePipe.transform(this.embarkStartDataId, 'yyyy-MM-dd');
		}
		if (this.embarkEndDateId == null) {
			this.embarkEndDateId = '';
		} else {
			this.embarkEndDateId = this.datePipe.transform(this.embarkEndDateId, 'yyyy-MM-dd');
		}
		if (this.dembarkSDate == null) {
			this.dembarkSDate = '';
		} else {
			this.dembarkSDate = this.datePipe.transform(this.dembarkSDate, 'yyyy-MM-dd');
		}
		if (this.dembarEDate == null) {
			this.dembarEDate = '';
		} else {
			this.dembarEDate = this.datePipe.transform(this.dembarEDate, 'yyyy-MM-dd');
		}
		if (this.shipId) { // checking condition basically im using patch values .patching from cruiseline list when page loading cruiseline undefind is coming

			this.shipId = this.voyagesListForm.get('ship').value;
		} else {
			this.shipId = '';
		};


		if (this.portId) {
			this.portId = this.voyagesListForm.get('port').value;
		} else {
			this.portId = '';
		}

		this.rmsApiService.showLoader(true);
		this.cruiseLineService.getVoyagesGrid(this.cruiseLine, this.shipId, this.regionId, this.portId, this.embarkStartDataId, this.embarkEndDateId, this.dembarkSDate, this.dembarEDate).subscribe((data: any) => {
			this.rowData = data;

			this.rmsApiService.showLoader(false);
		},
			error => {
				this.rmsApiService.setData(error);
				this.rmsApiService.showLoader(false);
				this.router.navigate(['/Error'])
			}
		)

	}
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.isMyDateFormat(pickerInput);
	}
	isMyDateFormat(date: string): string {
		if (date.length > 0 && date.indexOf("/") !== -1) {
		
			const da = date.split('/');
		
			if (da.length == 3) {
				if (da[2].length !== 2) {
					return 'Invalid Date Format';
				}
			} else {
				return 'Invalid Date Format';
			}
		}
		return '';
	}
	// isMyDateFormat(date: string): string {
	// 	if (date.length !== 10) {
	// 		return 'Invalid input: Please input a string in the form of YYYY-MM-DD';
	// 	} else {
	// 		const da = date.split('-');
	// 		if (da.length !== 3 || da[0].length !== 4 || da[1].length !== 2 || da[2].length !== 2) {
	// 			return 'Invalid input: Please input a string in the form of YYYY-MM-DD';
	// 		} else if (moment(date).isValid()) {
	// 			return 'Invalid date: Please input a date no later than today';
	// 		} else if (!moment(date).isValid()) {
	// 			return 'Invalid date: Please input a date with a valid month and date.';
	// 		}
	// 	}
	// 	return 'Unknown error.';
	// }
	//Page size changes
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

		this.gridId = e.data;
		this.router.navigate(['/Voyage/Profile', { id: this.gridId.id, cruiseLineId: this.gridId.cruiseLineId, shipId: this.gridId.shipId, embarkDateTime: this.gridId.embarkDateTime, itineraryID: this.gridId.itineraryId, debarkDateTime: this.gridId.debarkDateTime, cascadingcruiseLine: this.cruiseLine, cascadingShip: this.shipId, cascadingRegion: this.regionId, cascadingPort: this.portId, cascadingembarkStart: this.embarkStartDataId, cascadingembarkEnd: this.embarkEndDateId, cascadingdebarkStart: this.dembarkSDate, cascadingdebarkEnd: this.dembarEDate }])
	}
	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	}

	removesearch() {
		this.searchValue = null
		this.gridApi.setQuickFilter(this.searchValue)
	};
	hasError(controlName: string, errorName: string) {
		return this.voyagesListForm.controls[controlName].hasError(errorName);
	}


	clear() {
		//this.searchList();
		//this.setFormControls();

		//this.voyagesListForm.reset();
		this.voyagesListForm = this.fb.group({
			// level: [''],
			// port: [''],
			// dataType: [''],
			// startDate: [null],
			// endDate: [null],
			// active: [''],
			cruiseLine: [''],
			ship: [''],
			region: [''],
			port: [''],
			embarkStartDate: [''],
			embarkEndDate: [''],
			DebarkStartDate: [''],
			DebarkEndDate: ['']

		})
		this.cruiseLineId = null
		this.rowData = [];
		this.getVoyagesShip();
		// this.datesrequired();
		// this.required = false;
		// this.requiredDebark = false;

	}
	findEmbarkStartDate(e) {
		this.minEmbarkEndDate = moment(e.value).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
	}
	findDebarkStartDate(e) {
		this.minDebarkEndDate = moment(e.value).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
	}
	validatedate(event) {
		const allowedRegex = /[0-9\/]/g

		if (!event.key.match(allowedRegex)) {
			event.preventDefault()
		};
		if (event.target.value.length >= 8) {
			event.preventDefault()
		}

		//this.customValidatorService.isDateMaxlengthForamt(event)


	};

	dateChange() {
		// if (this.voyagesListForm.get('embarkStartDate').value) {
		// 	this.required = true;
		// 	this.errorMessage = "EmbarkEnd is Required";
		// 	this.voyagesListForm.get('embarkEndDate').markAsUntouched();
		// 	this.voyagesListForm.get('embarkEndDate').markAsDirty();
		// }
		if (moment(this.voyagesListForm.get('embarkStartDate').value.isValid())) {
			this.minEmbarkEndDate = moment(this.voyagesListForm.get('embarkStartDate').value).add(1, 'days');
		}
	}
	dateChangeDebarkStartDate() {
		// if (this.voyagesListForm.get('DebarkStartDate').value) {
		// 	this.requiredDebark = true;
		// 	this.errorMessageDebark = "DebarkEndDate is Required";
		// 	this.voyagesListForm.get('DebarkEndDate').markAsUntouched();
		// 	this.voyagesListForm.get('DebarkEndDate').markAsDirty();
		// }
		if (moment(this.voyagesListForm.get('DebarkStartDate').value.isValid())) {
			this.minDebarkEndDate = moment(this.voyagesListForm.get('DebarkStartDate').value).add(1, 'days');
		}
	}

	ngOnDestroy() {

		this.rmsApiService.removeGlobalVariable();
		this.rmsApiService.removePort();

	}
}
var minRowHeight = 30;
var currentRowHeight = minRowHeight;

