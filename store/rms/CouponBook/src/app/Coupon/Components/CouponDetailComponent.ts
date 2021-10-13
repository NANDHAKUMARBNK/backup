import { Component, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CouponBookService } from '../../Service/CouponBookService';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CouponGridComponent } from './CouponGridComponent';
import { SharedDataService } from 'common/services/SharedDataService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { RMSApiService } from 'common/services/RMSApiService';
import { CheckBoxComponent } from './checkbox';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
declare var $: any;

import * as _moment from 'moment';
declare var $: any;
import { default as _rollupMoment } from 'moment';
import { EmitterService } from 'common/services/emitterService';
import { RMSMomentDateAdapter } from 'common/adapter/RMSMomentDateAdapter';
import { CustomValidatorService } from 'common/CustomValidation/CustomValidatorService';
import { CouponDetailInputEditorComponent } from '../couponbookinputComponent';

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
	selector: 'app-coupondetail',
	templateUrl: '../../../../../../../Views/CouponBook/CouponDetail.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss'],
	providers: [
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, CustomValidatorService
	],
})
export class CouponDetailComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	couponListProfile: FormGroup;
	ListId: any;
	profileData: any;
	columnDefs: any
	defaultColDef: any
	rowData: any;
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	getRowHeight: any;
	gridApi: any;
	gridColumnApi: any;
	config = new MatDialogConfig();
	statusData: any;
	cruiseLine: any;
	dateval: any;
	minDate: any;
	moneyRegx = '[0-9]*(\.[0-9][0-9]?)?'
	cruiseLineId: any;
	effectiveStart = new FormControl(moment());
	effectiveEnd = new FormControl(moment());
	cruiseLineIdSelect: any;
	selesDate: any;
	paginationPageSize: number;
	singleClickEdit: any;


	constructor(private location: Location, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private rMSApiService: RMSApiService,
		private couponBookService: CouponBookService, private dialog: MatDialog, private toasterComponent: ToasterComponent,
		private emitterService: EmitterService, private customValidatorService: CustomValidatorService,
		private sharedDataService: SharedDataService) {
		this.route.params.subscribe(params => {
			this.ListId = params['id'];
		});
		if (this.ListId == undefined) {
			this.ListId = ''
		} else {
			this.route.params.subscribe(params => {
				this.ListId = params['id'];
			});
		}
		this.columnDefs = [
			{
				headerName: '',
				field: "",
				width: 50,
				cellRendererFramework: CheckBoxComponent
			},
			{
				headerName: '',
				field: "Date",
				width: 50,
				cellRendererFramework: CouponGridComponent
			},
			{
				headerName: 'Location',
				field: "locationName",
				sortable: true,
				width: 200,
			},
			{
				headerName: 'GP Code',
				field: "gpCode",
				sortable: true,
				editable: true,
				cellEditorFramework: CouponDetailInputEditorComponent,
				// editor: {
				// 	//allowBlank: false,
				// 	maxLength: 2
				// },
				width: 200,
			},
			{
				headerName: 'Qty on Hand',
				field: "inventoryQty",
				sortable: true,
				width: 200,
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
			"<span style=\"padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;\">Data not loaded yet.</span>";
	}

	ngOnInit() {
		this.formControlsSet();
		this.getCruiseLine();
		this.getStatus();
		this.emitterService.refreshChangeChecked.subscribe(data => {
			this.rowData = [];
			this.getLocationGrid();
		})
		this.emitterService.collateralDates.subscribe(data => {
			this.rowData = [];
			this.getLocationGrid();
		});
		if (this.ListId) {
			this.getListProfileById();
			setTimeout(() => {
				this.getLocationGrid();
			}, 400)

		}
		setTimeout(() => {
			if ((<HTMLInputElement>document.getElementById("startDate")).disabled) {
				$('#startDate').closest('.mat-form-field-flex').removeClass('mat-form-field-flex').addClass('flexField');
			}

		}, 1000);


	};


	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	}


	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		}
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");

	}
	onPageSizeChanged() {
		let value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");
	}
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}

	/* =========== init formcontrols here call to ngOnInit() =========*/
	formControlsSet() {
		this.couponListProfile = this.fb.group({
			cruiseLineId: ['', Validators.required],
			gpItem: ['', [Validators.required, Validators.maxLength(50)]],
			description: ['', [Validators.required, Validators.maxLength(100)]],
			shortName: ['', [Validators.maxLength(15)]],
			status: ['', Validators.required],
			listPrice: ['', [Validators.required, Validators.pattern(this.moneyRegx)]],
			productionCost: ['', [Validators.required, Validators.pattern(this.moneyRegx)]],
			miscCost: ['', [Validators.pattern(this.moneyRegx)]],
			effectiveStart: [''],
			effectiveEnd: ['']
		});
	};
	hasError(controlName: string, errorName: string) {
		return this.couponListProfile.controls[controlName].hasError(errorName);
	}

	/* ===========GetStatus call from Service =========*/
	getStatus() {
		this.couponBookService.getStatusCollateral().subscribe((data: any) => {
			this.statusData = data;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	};

	/* ===========getCruiseLine call from Service =========*/
	getCruiseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.cruiseLine = data;
			this.cruiseLine.forEach(item=>{
				if(item.isDefault==true){
					this.couponListProfile.patchValue({
						cruiseLineId: item.id
					});
				}

			})
			
			// let findDefaultCruiseline = this.cruiseLine.filter(element => element.isDefault == true)
			// let findDefaultCruiselineId = findDefaultCruiseline[0].id;
			// if (findDefaultCruiselineId) {
			// 	this.couponListProfile.patchValue({
			// 		cruiseLineId: findDefaultCruiselineId
			// 	});
			// }
			let patchValue = this.couponListProfile.value;
			// if(this.ListId){
			// 	this.setFormControls();
			// }

		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	}
	/*================= Page Size change==============*/

	// onPageSizeChanged() {
	// 	var value = this.pageSize.nativeElement.value;
	// 	this.gridApi.paginationSetPageSize(Number(value));
	// 	let element = document.getElementById("myGrid");
	// 	if (value == 10) {
	// 		element.classList.add("gridHeight10");
	// 		element.classList.remove("gridHeight50");
	// 		element.classList.remove("gridHeight100");
	// 	} else if (value == 50) {
	// 		element.classList.add("gridHeight50");
	// 		element.classList.remove("gridHeight10");
	// 		element.classList.remove("gridHeight100");
	// 	} else if (value == 100) {
	// 		element.classList.remove("gridHeight10");
	// 		element.classList.remove("gridHeight50");
	// 		element.classList.add("gridHeight100");
	// 	}

	// };



	setFormControls() {
		this.couponListProfile.patchValue({
			cruiseLineId: this.profileData.cruiseLineId,
			gpItem: this.profileData.itemNumber,
			description: this.profileData.description,
			shortName: this.profileData.shortName,
			status: this.profileData.statusId,
			listPrice: this.profileData.listPrice,
			productionCost: this.profileData.productionCost,
			miscCost: this.profileData.miscCost,
			effectiveStart: new Date(this.profileData.effectiveStartDate),
			effectiveEnd: new Date(this.profileData.effectiveEndDate),

		})
	}

	/* =========== getListProfileById geting data form response and patch the values  =========*/
	getListProfileById() {
		this.rMSApiService.showLoader(true);
		this.couponBookService.getListProfileById(this.ListId).subscribe((data: any) => {
			this.profileData = data;
			this.rMSApiService.setcascaddingitem(this.profileData)
			this.selesDate = this.profileData.maxSalesDate
			this.rMSApiService.showLoader(false);
			this.setFormControls();
			if (moment(this.profileData.effectiveStartDate) < moment(this.selesDate)) {
				this.minDate = moment(this.selesDate).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
			} else {
				this.minDate = moment(this.profileData.effectiveStartDate).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
			}
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error'])

			}
		);
	};

	/* =========== Save Profile pass reqData to Backend =========*/
	saveProfile() {
		if (this.couponListProfile.invalid) {
			return
		}
		this.rMSApiService.showLoader(true);
		const reqData = {
			cruiseLineId: this.couponListProfile.get('cruiseLineId').value,
			itemNumber: this.couponListProfile.get('gpItem').value,
			description: this.couponListProfile.get('description').value,
			shortName: this.couponListProfile.get('shortName').value,
			statusId: this.couponListProfile.get('status').value,
			listPrice: this.couponListProfile.get('listPrice').value,
			productionCost: this.couponListProfile.get('productionCost').value,
			miscCost: this.couponListProfile.get('miscCost').value,
			effectiveStartDate: this.couponListProfile.get('effectiveStart').value,
			effectiveEndDate: this.couponListProfile.get('effectiveEnd').value
		};
		this.couponBookService.saveListProfile(reqData).subscribe((data: any) => {
			this.rMSApiService.showLoader(false);
			this.router.navigate(['/CouponBooks'])

		},
			error => {
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error'])

			}
		)
	};

	/* =========== UpdateProfile pass reqData to Backend =========*/
	UpdateProfile() {
		if (this.couponListProfile.invalid) {
			return
		}
		this.rMSApiService.showLoader(true);
		const reqData = {
			cruiseLineId: this.couponListProfile.get('cruiseLineId').value,
			itemNumber: this.couponListProfile.get('gpItem').value,
			description: this.couponListProfile.get('description').value,
			shortName: this.couponListProfile.get('shortName').value,
			statusId: this.couponListProfile.get('status').value,
			listPrice: this.couponListProfile.get('listPrice').value,
			productionCost: this.couponListProfile.get('productionCost').value,
			miscCost: this.couponListProfile.get('miscCost').value,
			effectiveStartDate: this.couponListProfile.get('effectiveStart').value,
			effectiveEndDate: this.couponListProfile.get('effectiveEnd').value,
		};
		this.couponBookService.putListProfile(this.ListId, reqData).subscribe((data: any) => {
			this.rMSApiService.showLoader(false);
			this.router.navigate(['/CouponBooks']);

		},
			error => {
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error'])

			}
		)
	};
	crusileSelect() {
		this.getLocationGrid();
	}

	/*=============GetLocation grid and pass itemID, CruiseLineID ===========*/
	getLocationGrid() {
		this.rMSApiService.showLoader(true);
		let cruiselindId = this.couponListProfile.get('cruiseLineId').value;

		this.couponBookService.getProfileLoactionGrid(this.ListId, cruiselindId).subscribe((data: any) => {
			this.rowData = data;
			this.rMSApiService.showLoader(false);

		},
			error => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)
	};

	onCellValueChanged(evt) {
		
		let updatedGpCode = evt.value;
		this.couponBookService.saveCheckBox(evt.data.id, this.ListId, evt.data.locationId, evt.data.isActive, evt.data.gpCode).subscribe((data) => {
			this.getLocationGrid();
			//this.emitterService.refreshHistoryEdit.emit(true);
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	}
	onRowClicked(e) {
		if (e.colDef.field == 'Date' || e.colDef.field == "" || e.colDef.field == "gpCode") {
		} else {
			this.router.navigate(['/CouponInventory', {
				id: e.data.id,
				locationId: e.data.locationId,
				locationName: e.data.locationName
			}])

		}


	}
	// hasError(controlName: string, errorName: string) {
	// 	return this.shipProfileForm.controls[controlName].hasError(errorName);
	// }


	cancel() {
		this.router.navigate(['/CouponBooks']);
	};
	dateChange() {
		if (moment(this.couponListProfile.get('effectiveStart').value.isValid())) {
			this.minDate = moment(this.couponListProfile.get('effectiveStart').value).add(1, 'days');
		}
	}

	//Begin Date Change event capture
	// dateChange(event) {
	// 	this.minDate = event;
	// 	this.minDate = moment(event).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
	// }

	isNumber(evt) {
		var iKeyCode = (evt.which) ? evt.which : evt.keyCode
		if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
			return false;

		return true;
	}
	validatedate(event) {

		this.customValidatorService.isDateMaxlengthForamt(event)

	}
}
var minRowHeight = 30;
var currentRowHeight = minRowHeight;