import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatDialogConfig, MatDialog, DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
//import moment from 'moment';
import * as _moment from 'moment';

import { default as _rollupMoment } from 'moment';
import { ContractService } from '../Service/ContractService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { RMSApiService } from 'common/services/RMSApiService';
import { DatePipe } from '@angular/common';
import { OnDestroy } from "@angular/core";
import { CustomValidatorService } from 'common/CustomValidation/CustomValidatorService';
import { RMSMomentDateAdapter } from 'common/adapter/RMSMomentDateAdapter';
declare var $: any;
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
export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		return !!(control && control.invalid && (control.dirty || control.touched));
	}
}
@Component({
	selector: 'app-retailerlist',
	templateUrl: '../../../../../../../Views/Finance/RetailerList.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss'],
	// providers: [DatePipe, CustomValidatorService,

	// ]
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, CustomValidatorService]
})
export class RetailerListComponent implements OnDestroy {
	@ViewChild('pageSize') pageSize: ElementRef;
	appName = 'retailerlist';
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
	contractListForm: FormGroup
	levelId: any;
	portId: any;
	dataTypeId: any;
	activeId: any;
	levelData: any;
	portData: any;
	dataTypeData: any;
	hidePorts: boolean = true;
	mindatePlus: any;
	todaydate: any;
	currentDate = moment().format("YYYY-MM-DD");
	required: boolean = false;
	hasErrorr: boolean = false;
	portnameId: number;

	domLayout: any;
	paginationPageSize: any;
	errorMessage: string;
	requiredEnd: boolean;
	errorMessageEnd: string;
	matcher= new MyErrorStateMatcher();


	constructor(private http: HttpClient, private dialog: MatDialog,
		private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe,
		private emitterService: EmitterService, private contractService: ContractService, private sharedDataService: SharedDataService, private toasterComponent: ToasterComponent,
		private rMSApiService: RMSApiService, private customValidatorService: CustomValidatorService
	) {

		this.id = this.route.snapshot.paramMap.get('id')
		this.columnDefs = [
			{
				headerName: 'Class',
				field: "customerClass",
				sortable: true,
				width: 150

			},
			{
				headerName: 'Customer ID',
				field: "gpCustomerId",
				sortable: true,
				autoHeight: true,
				width: 150
			},
			{
				headerName: 'Customer Name',
				field: "name",
				sortable: true,
				autoHeight: true,
				width: 200
			},
			{
				headerName: 'Port Name',
				field: "portName",
				sortable: true,
				autoHeight: true,
				width: 200
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
		this.overlayLoadingTemplate =
			'<span class="ag-overlay-loading-center nodata" >Searching...please wait</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';
	}

	ngOnInit() {
		this.formControlSet();
		this.getLevel();
		this.getPort();
		this.getDataType();


		this.datesrequired();

	};

	formControlSet() {
		this.contractListForm = this.fb.group({
			level: [''],
			port: [''],
			dataType: [''],
			startDate: [null],
			endDate: [null],
			active: [true],

		});
		let cascaddingport = this.rMSApiService.getPortData();
		this.portnameId = parseInt(localStorage.getItem('portId'));

		if (this.portnameId) {
			this.contractListForm.patchValue({
				port: this.portnameId
			});
			//this.contractListForm.reset();
		}
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


	/*=========getLevel Call Api ===========*/
	getLevel() {
		this.contractService.getLevelRetailer().subscribe((data: any) => {
			this.levelData = data.items;
			this.contractListForm.patchValue({
				level: this.levelData[0].id
			});
			this.searchGrid();
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};


	hidePort(e) {
	
		let levelData = this.levelData.find(data => data.id == e.value);
		if (levelData.code == "PARENT") {
			this.hidePorts = false;
		} else {
			this.hidePorts = true;
		}

	}

	getPort() {
		this.contractService.getPortRetailer().subscribe((data: any) => {
			this.portData = data;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};

	getDataType() {
		this.contractService.getDataTypeRetailer().subscribe((data: any) => {
			this.dataTypeData = data.items
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};

	hasError(controlName: string, errorName: string) {
		return this.contractListForm.controls[controlName].hasError(errorName);
	}
	datesrequired() {
		
		this.contractListForm.get('dataType').valueChanges.subscribe((data: any) => {
		
			if (data) {
				this.required = true;
				this.hasErrorr = true;
				this.requiredEnd = true;
				
				this.contractListForm.get('startDate').markAsUntouched();
				this.contractListForm.get('startDate').markAsDirty();
				this.contractListForm.get('endDate').markAsUntouched();
				this.contractListForm.get('endDate').markAsDirty();
				//this.contractListForm.get('startDate').setValidators([Validators.required])
				//this.contractListForm.get('endDate').setValidators([Validators.required])
			}



		});
	}
	validatedate(event) {


		this.customValidatorService.isDateMaxlengthForamt(event)


	}


	searchGrid() {
		if (this.contractListForm.get('dataType').value) {
			this.required = true;
			if (this.required) {
				this.errorMessage = "StartDate is Required";
			}
		}
		if (this.contractListForm.get('dataType').value) {
			this.requiredEnd = true;
			if (this.requiredEnd) {
				this.errorMessageEnd = "EndDate is Required";
			}
		}
		if (this.contractListForm.get('startDate').invalid) {
			return;
		} if (this.contractListForm.get('endDate').invalid) {
			return;
		}

		if (this.contractListForm.invalid) {
			return;
		}
		//this.datesrequired();
		this.levelId = this.contractListForm.get('level').value;
		this.portId = this.contractListForm.get('port').value;
		this.dataTypeId = this.contractListForm.get('dataType').value;
		let startDate = this.contractListForm.get('startDate').value;
		let end = this.contractListForm.get('endDate').value;
		this.activeId = this.contractListForm.get('active').value;
	

		if (this.portId == null) {
			this.portId = ''
		} else {
			this.portId = this.contractListForm.get('port').value;
		};

		if (this.dataTypeId == null) {
			this.dataTypeId = ''
		} else {
			this.dataTypeId = this.contractListForm.get('dataType').value;
		};

		if (this.levelId == null) {
			this.levelId = ''
		} else {
			this.levelId = this.contractListForm.get('level').value;
		};

		if (this.activeId == null) {
			this.activeId = ''
		} else {
			this.activeId = this.contractListForm.get('active').value;
		};

		let beginDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
		if (beginDate == null) {
			beginDate = ''
		} else {
			beginDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
		};

		let endDate = this.datePipe.transform(end, 'yyyy-MM-dd');
		if (endDate == null) {
			endDate = ''
		} else {
			endDate = this.datePipe.transform(end, 'yyyy-MM-dd');
		};
		this.rMSApiService.showLoader(true);
		this.contractService.getGridRetailerList(this.levelId, this.portId, this.dataTypeId, beginDate, endDate, this.activeId).subscribe((data: any) => {
			this.rowData = data.items;
			// if (this.rowData.length <= 10) {
			// 	$('.ag-paging-panel').hide();
			// } else {
			// 	$('.ag-paging-panel').show();
			// }
			this.rMSApiService.showLoader(false);

		},
			error => {
				this.rMSApiService.setData(error)
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error'])

			}
		)
	}






	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
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


	cancel() {
		//this.contractListForm.reset();
		this.contractListForm = this.fb.group({
			level: [''],
			port: [''],
			dataType: [''],
			startDate: [null],
			endDate: [null],
			active: [''],

		})
		this.datesrequired();
		this.required = false;
		this.requiredEnd = false;
		//this.hasErrorr = false;

		this.rowData = []
		//this.searchGrid();
		localStorage.removeItem('portId');
	}
	addClick() {
		this.display = true;
	}
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	onRowClicked(e) {
		this.gridId = e.data;
		this.router.navigate(['/Retailer/Profile'], { queryParams: { 'customerId': this.gridId.id, 'gpCustomerId': this.gridId.gpCustomerId, 'parentCustomerId': this.gridId.parentGPCustomerId } })

	}
	//Remove text from search
	removesearch() {
		this.searchValue = null
		this.gridApi.setQuickFilter(this.searchValue);
	};


	dateChange(event) {
	
		this.todaydate = moment(event).add(1, 'days').format('YYYY-MM-DD');
		




	};



	ngOnDestroy() {
		this.rMSApiService.removePort();
		localStorage.removeItem('portId')
	}
}
var minRowHeight = 30;
var currentRowHeight = minRowHeight;
