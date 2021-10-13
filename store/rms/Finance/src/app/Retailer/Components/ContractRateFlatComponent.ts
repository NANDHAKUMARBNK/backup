import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
//import { PsgService } from '../../Service/PsgService'
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog, } from "@angular/material";
import { ContractService } from '../Service/ContractService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { RMSApiService } from 'common/services/RMSApiService';
import { RatesGridCheckboxComponent } from './RatesGridCheckboxComponent';
import { CustomNumericComponent } from 'common/components/CustomNumeric';
declare var $: any;

//import { Location } from '@angular/common';

@Component({
	selector: 'app-contractrateflat',
	templateUrl: '../../../../../../../Views/Finance/ContractRateFlat.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss', '../../../../../../common/styles/Modal.scss']
})
export class ContractRateFlatComponent implements OnDestroy {
	@ViewChild('pageSize') pageSize: ElementRef;
	ratesForm: FormGroup;
	rowSelection: any;
	display: boolean = false;
	private gridApi;
	private gridColumnApi;
	// addNewReportForm: FormGroup;
	columnDefs: any
	defaultColDef: any
	rowData: any;
	deleteid: [];
	searchValue: string;
	updatedId: any;
	getRowHeight;
	private getRowNodeId;
	dataId: any;
	emitterSubscribe: any;
	singleClickEdit: any
	brand: string;
	gridId: any;
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	categoryId: any;
	commissionTypeData: any;
	editRates: any;
	FLTFEE: boolean = false;
	PCTMIN: boolean = false;
	INCRMI: boolean = false;
	INCRMP: boolean = false;
	showGridRates: boolean = false;
	showDocument: boolean = false;
	incrementalSaveHide: boolean = false;
	incrementalVoyages: boolean = false;
	flatfreeRequired: boolean = false;
	summaryRequired: boolean = false;
	minfeeRequired: boolean = false;
	amountRequired: boolean = false;
	rateSummary: boolean = false;
	basedonRequired: boolean = false;
	rateSummaryRequired: boolean = false;
	levelOneminRequired: boolean = false;
	levelOnemaxRequired: boolean = false;
	levelOnepercentageRequired: boolean = false;

	levelTwominRequired: boolean = false;
	levelTwomaxRequired: boolean = false;
	levelTwopercentageRequired: boolean = false;

	levelThreeminRequired: boolean = false;
	levelThreemaxRequired: boolean = false;
	levelThreepercentageRequired: boolean = false;

	levelFourminRequired: boolean = false;
	levelFourmaxRequired: boolean = false;
	levelFourpercentageRequired: boolean = false;
	ratesummaryIncRequired: boolean = false;


	basedData: any;
	contractId: any;
	contractRateId: any;
	moneyRegx = '/^\d+\.\d{0,2}$/;'
	findValueCommision: any;
	basedFindValue: any;



	flatfreeValue = new FormControl('');
	summary = new FormControl('');
	ratesChecked: any = [];
	upload: any;
	filename: any;
	uploadedFiles: any;
	uploadfileshow: boolean;
	commissionTypeCode: any;
	uploadDataId: any;
	calculationTypeCode: string;
	disabled: boolean = false;
	customerName: string;
	portName: string;
	RatesGridtempArray: any;
	paginationPageSize: any;
	domLayout: any;
	levelOneChange: boolean = false;
	levelTwoChange: boolean = false;
	levelThreeChange: boolean = false;
	levelonemaxSave: boolean = false;
	levelTwoMaxSave: boolean = false;
	levelThreeMaxSave: boolean = false;
	levelFourMaxSave: boolean = false;

	constructor(private http: HttpClient, private route: ActivatedRoute, private customNumericComponent: CustomNumericComponent,
		private fb: FormBuilder, private router: Router, private dialog: MatDialog,
		private sharedDataService: SharedDataService, private location: Location, private rMSApiService: RMSApiService,
		private emitterService: EmitterService, private contractService: ContractService, private toasterComponent: ToasterComponent
	) {
		this.categoryId = this.route.snapshot.queryParamMap.get('categoryId');
		this.contractId = this.route.snapshot.queryParamMap.get('contractId');
		this.contractRateId = this.route.snapshot.queryParamMap.get('contractRateId');
		this.commissionTypeCode = this.route.snapshot.queryParamMap.get('commissionTypeCode');
		this.calculationTypeCode = this.route.snapshot.queryParamMap.get('calculationTypeCode');
		var data = this.rMSApiService.getData();
		if (data) {
			this.customerName = data.name;
			this.portName = data.portName;
		}
		this.columnDefs = [
			{
				// headerName: '',
				// field: "isAvailable",
				// sortable: true,
				// autoHeight: true,
				// width: 70,
				// cellRendererFramework: RatesGridCheckboxComponent
				headerName: '',
				field: "Date",
				sortable: true,
				autoHeight: true,
				minWidth: 60,
				headerCheckboxSelection: true,
				headerCheckboxSelectionFilteredOnly: true,
				checkboxSelection: params => params.data.isAvailable
				//checkboxSelection: true,
				//cellRenderer: params => {
				//	if (params.value == true) {
				//		return `<input type="checkbox" class="text_align" checked/>`
				//	} else {
				//		return `<input type="checkbox" class="text_align" />`
				//	}
				//},
			},
			{
				headerName: 'Cruise Line',
				field: "cruiseLineName",
				sortable: true,
				autoHeight: true,
				editable: true,
				width: 200
			},
			{
				headerName: 'Ship',
				field: "shipName",
				sortable: true,
				autoHeight: true,
				width: 200
			},
		];

		this.defaultColDef = {
			//editable: true,
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
			'<span class="ag-overlay-loading-center nodata" style=\"margin-top:-137px; border-radius:5px; font-size:15px;">No Record(s) Found.</span>';
		this.overlayNoRowsTemplate =
			"<span class='ag-overlay-loading-center nodata'>No record(s) found.</span>";

	}

	ngOnInit() {
		window.scrollTo(0, 0)
		// this.router.events.subscribe((evt) => {
		//     if (!(evt instanceof NavigationEnd)) {
		//         return;
		//     }
		//     window.scrollTo(0, 0)
		// });

		this.ratesForm = this.fb.group({
			commissionTypeId: ['', Validators.required],
			basedOnId: ['',],
			flatfree: [''],
			summary: [''],
			minfee: [''],
			amount: [''],
			rateSummary: [''],
			levelOneCheck: [''],
			levelOnemin: [''],
			levelOnemax: [''],
			levelOnepercentage: [''],
			levelTwoCheck: [''],
			levelTwomin: [''],
			levelTwomax: [''],
			levelTwopercentage: [''],
			levelThreeCheck: [''],
			levelThreemin: [''],
			levelThreemax: [''],
			levelThreepercentage: [''],
			levelFourCheck: [''],
			levelFourmin: [''],
			levelFourmax: [''],
			levelFourpercentage: [''],
			adminFee: [''],
			taxRate: [''],
			ratesummaryInc: [''],

			incrementalList: this.fb.array([
				this.incremental(),
			]),
			//incrementalListP: this.fb.array([
			//	this.incrementalP(),
			//]),
		});

		if (this.contractRateId) {
			this.getEditRates();
			this.editModeChange();

			setTimeout(() => {
				if ((<HTMLInputElement>document.getElementById("FlatFree")).readOnly) {
					$('#FlatFree').closest('.mat-form-field-flex').removeClass('mat-form-field-flex').addClass('flexField');
				}
				if ((<HTMLInputElement>document.getElementById("Summery")).readOnly) {
					$('#Summery').closest('.mat-form-field-flex').removeClass('mat-form-field-flex').addClass('flexField');
				}
				if ((<HTMLInputElement>document.getElementById("minFee")).readOnly) {
					$('#minFee').closest('.mat-form-field-flex').removeClass('mat-form-field-flex').addClass('flexField');
				}
				if ((<HTMLInputElement>document.getElementById("amount")).readOnly) {
					$('#amount').closest('.mat-form-field-flex').removeClass('mat-form-field-flex').addClass('flexField');
				}
				if ((<HTMLInputElement>document.getElementById("summery")).readOnly) {
					$('#summery').closest('.mat-form-field-flex').removeClass('mat-form-field-flex').addClass('flexField');
				}
			}, 1000);

		};


		this.getcommissionType();
		this.basedOn();

		//this.changeType();
	};

	/**
* Select the first row as default...
*/


	onRowDataChanged(): void {
		//this.rowData.forEach(item => {
		//		this.gridApi.forEachNode(function (node) {
		//			if (item.isAvailable ==true) {
		//		node.setSelected(true);
		//	}
		//})
		//})

		this.gridApi.forEachNode(function (node) {
			if (node.data.contractRateId) {
				node.setSelected(true);
			} else if (node.data.contractRateId == null) {
				node.setSelected(false);
			}
		})

	}
	onPageSizeChanged() {
		var value = this.pageSize.nativeElement.value;

		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");


	};

	incremental() {
		return this.fb.group({
			levelCheck: [''],
			levelmin: [''],
			levelmax: [''],
			levelpercentage: [''],
		});
	};

	incrementalP() {
		return this.fb.group({
			levelTwoCheck: [''],
			levelTwomin: [''],
			levelTwomax: [''],
			levelTwopercentage: [''],
		});
	}



	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.rowSelection = "multiple";
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		}

		console.log(this.gridApi.sizeColumnsToFit())
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
	}



	getEditRates() {
		this.rMSApiService.showLoader(true);
		this.contractService.getRatedById(this.contractRateId).subscribe((data: any) => {
			this.editRates = data;
			this.disabled = true;

			if (this.editRates.incremental.levels) {
				this.editRates.incremental.levels.forEach((item => {

					if (item.level == 1) {
						this.levelOnemaxRequired=true;
						this.ratesForm.patchValue({
							levelOneCheck: item.level,
							levelOnemin: item.minAmount.toFixed(2),
							levelOnemax: item.maxAmount.toFixed(2),
							levelOnepercentage: item.percentage,
						})
					} else if (item.level == 2) {
						this.levelTwomaxRequired=true;
						this.ratesForm.patchValue({
							levelTwoCheck: item.level,
							levelTwomin: item.minAmount.toFixed(2),
							levelTwomax: item.maxAmount.toFixed(2),
							levelTwopercentage: item.percentage,
						});
					} else if (item.level == 3) {
						this.levelThreemaxRequired=true;
						this.ratesForm.patchValue({
							levelThreeCheck: item.level,
							levelThreemin: item.minAmount.toFixed(2),
							levelThreemax: item.maxAmount.toFixed(2),
							levelThreepercentage: item.percentage,
						});
					} else if (item.level == 4) {
						this.levelFourmaxRequired=true;
						this.ratesForm.patchValue({
							levelFourCheck: item.level,
							levelFourmin: item.minAmount.toFixed(2),
							levelFourmax: item.maxAmount.toFixed(2),
							levelFourpercentage: item.percentage,
						});
					}
				}))

			};
			if (this.editRates.incremental.taxRate) {
				this.ratesForm.patchValue({
					taxRate: this.editRates.incremental.taxRate.taxRateAmount
				})
			}



			this.rMSApiService.showLoader(false);
			this.ratesForm.patchValue({
				commissionTypeId: this.editRates.commissionTypeId,
				basedOnId: this.editRates.calculationTypeId,
				flatfree: this.editRates.flatFee.feeAmount.toFixed(2),
				summary: this.editRates.summary,
				minfee: this.editRates.percentage.minAmount,
				amount: this.editRates.percentage.feeAmount,
				rateSummary: this.editRates.summary,




				adminFee: this.editRates.incremental.adminFee,

				ratesummaryInc: this.editRates.incremental.summary
			});
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)

	};

	setcontrolsLevels(levels) {

	}

	getcommissionType() {
		this.contractService.getRatesCommisionType(this.categoryId).subscribe((data: any) => {

			this.commissionTypeData = data.items;
			if (this.commissionTypeData.length == 1) {
				this.ratesForm.patchValue({
					type: this.commissionTypeData[0].id
				});
			}
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	}

	hasError(controlName: string, errorName: string) {
		return this.ratesForm.controls[controlName].hasError(errorName);
	};





	editModeChange() {
		if (this.commissionTypeCode == "INCRMI" && this.calculationTypeCode == "VOYAGE") {
			this.showDocument = true;
			this.incrementalVoyages = true;
			this.incrementalSaveHide = false;
			this.showGridRates = false;
			this.INCRMI = true;
		} else if (this.commissionTypeCode == 'FLTFEE') {
			this.FLTFEE = true;
			this.INCRMI = false;
			this.PCTMIN = false;
			this.INCRMP = false;
			this.incrementalVoyages = false;
			this.incrementalSaveHide = false;
			this.showGridRates = true;
			//this.ratesForm.patchValue({
			//	flatfree: this.editRates.flatFee.feeAmount,
			//	summary: this.editRates.summary,
			//})

			this.getRatedAssignmentGrid();
		} else if (this.commissionTypeCode == 'PCTMIN') {
			this.PCTMIN = true;
			this.FLTFEE = false;
			this.INCRMI = false;
			this.INCRMP = false;
			this.incrementalVoyages = false
			this.showGridRates = true;
			this.incrementalSaveHide = false;


			this.getRatedAssignmentGrid();
		} else if (this.commissionTypeCode == 'INCRMI') {
			this.INCRMI = true;
			this.FLTFEE = false;
			this.PCTMIN = false;
			this.INCRMP = false;
			this.showGridRates = true;
			this.incrementalSaveHide = true;
			this.getRatedAssignmentGrid();
		} else if (this.commissionTypeCode == 'INCRMP') {
			this.INCRMP = true;
			this.FLTFEE = false;
			this.PCTMIN = false;
			this.INCRMI = false;
			this.showGridRates = true;
			this.incrementalVoyages = false;
			this.incrementalSaveHide = false;
			this.showDocument = false;
			this.getRatedAssignmentGrid();
		}
	}




	/* ==== commision select box based on data change the design here ============*/
	changeType(event) {

		this.findValueCommision = this.commissionTypeData.find(item => item.id == event.value);

		if (this.findValueCommision.code == 'FLTFEE') {
			this.FLTFEE = true;
			this.INCRMI = false;
			this.PCTMIN = false;
			this.INCRMP = false;
			this.incrementalVoyages = false;
			this.incrementalSaveHide = false;
			this.showGridRates = true;
			this.getRatedAssignmentGrid();

		} else if (this.findValueCommision.code == 'PCTMIN') {
			this.PCTMIN = true;
			this.FLTFEE = false;
			this.INCRMI = false;
			this.INCRMP = false;
			this.incrementalVoyages = false
			this.showGridRates = true;
			this.incrementalSaveHide = false;
			this.getRatedAssignmentGrid();

		} else if (this.findValueCommision.code == 'INCRMI') {
			this.INCRMI = true;
			this.FLTFEE = false;
			this.PCTMIN = false;
			this.INCRMP = false;
			this.showGridRates = true;
			this.incrementalSaveHide = true;
			this.getRatedAssignmentGrid();

			//const control = <FormArray>this.ratesForm.controls['incrementalList'];
			//for (let i = 0; i <= 4; i++) {
			//	control.push(this.incremental());

			//	if (control.length == 4) {
			//		control.removeAt(i)

			//	}
			//	i++

			//}

		} else if (this.findValueCommision.code == 'INCRMP') {
			this.INCRMP = true;
			this.FLTFEE = false;
			this.PCTMIN = false;
			this.INCRMI = false;
			this.showGridRates = true;
			this.incrementalVoyages = false;
			this.incrementalSaveHide = false;
			this.showDocument = false;
			this.getRatedAssignmentGrid();
			//const control = <FormArray>this.ratesForm.controls['incrementalListP'];
			//for (let i = 0; i <= 4;) {
			//	control.push(this.incrementalP());
			//	i++
			//}
		} else if (this.basedFindValue.code == "VOYAGE" && this.findValueCommision.code == "INCRMI") {
			this.showGridRates = false;
			this.incrementalVoyages = true;
			this.incrementalSaveHide = false;
			this.showDocument = false;
		}
	};

	basedOn() {
		this.contractService.getRatesBasedType().subscribe((data: any) => {
			this.basedData = data.items;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};

	basedOnChange(event) {

		this.basedFindValue = this.basedData.find(item => item.id == event.value);

		if (this.basedFindValue.code == "CALL" && this.findValueCommision.code == "INCRMI") {
			this.showGridRates = true;
			this.incrementalVoyages = false;
			this.incrementalSaveHide = true;
			this.showDocument = false;
		} else if (this.basedFindValue.code == "VOYAGE" && this.findValueCommision.code == "INCRMI") {
			this.showDocument = true;
			this.incrementalVoyages = true;
			this.incrementalSaveHide = false;
			this.showGridRates = false;
		}
	};

	/* ========== Rate grid ===========*/
	getRatedAssignmentGrid() {
		if (this.contractRateId == null)
			this.contractRateId = "";
			if(this.contractId == null)
			 this.contractId = "";
		this.rMSApiService.showLoader(true);
		this.contractService.getRatedAssignmentGrid(this.contractRateId, this.contractId).subscribe((data: any) => {
			this.rowData = data.items;
			this.rMSApiService.setRatesGridCheck(this.rowData)
			this.rMSApiService.showLoader(false);
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)
	};


	/*====== change event flatfree bind the data in summary =======*/
	flatfree(event) {
		if (event.target.value) {
			this.ratesForm.patchValue({
				summary: event.target.value + " " + 'Flat Fee'
			})
		}
	};

	amountChange(event) {
		if (event.target.value) {
			this.ratesForm.patchValue({
				rateSummary: event.target.value + " " + 'Percentage'
			})
		};
	};


	focusTwoFunction(evt) {

		let maxValue = this.ratesForm.get('levelOnemax').value;
		if (maxValue) {
			let value = +maxValue + +.01;

			this.ratesForm.patchValue({
				levelTwomin: value.toFixed(2)
			});
		}

	};

	focusThreeFunction() {
		let maxValue = this.ratesForm.get('levelTwomax').value;
		if (maxValue) {
			let value = +maxValue + +.01;

			this.ratesForm.patchValue({
				levelThreemin: value.toFixed(2)
			});
		};
	};

	focusFourFunction() {
		let maxValue = this.ratesForm.get('levelThreemax').value;
		if (maxValue) {
			let value = +maxValue + +.01;

			this.ratesForm.patchValue({
				levelFourmin: value.toFixed(2)
			})
		}
	};


	persentagechange(event) {
		if (event.target.value) {
			this.ratesForm.patchValue({
				ratesummaryInc: event.target.value + " " + "Level 1" + ' amount' + " " + 'Incremental'
			})
		};
	}

	// validateInputDecimal(keyCode, val){
	// 	if (keyCode != 46 && keyCode > 31 && (keyCode < 48 || keyCode > 57))
	// 		return false;

	// 	var succ = 
	// 		val.match(/^([0-9]*)$/) != null ||
	// 		val.match(/^([0-9]*\.)[0-9]{0,1}$/) != null;
	// 	return succ;
	// }

	isNumberValidate(evt) {
		return this.customNumericComponent.validateInputDecimal((evt.which) ? evt.which : evt.keyCode, evt.target.value)
		//return this.validateInputDecimal((evt.which) ? evt.which : evt.keyCode, evt.target.value);	
	};

	isNumberValidatePercentage(evt) {
		var iskeyCode = evt.keyCode;
		var val = evt.target.value;
		if (iskeyCode != 46 && iskeyCode > 31 && (iskeyCode < 48 || iskeyCode > 57))
			return false;

		var succ =
			val.match(/^([0-9]*)$/) != null ||
			val.match(/^([0-9]*\.)[0-9]{0,9999999}$/) != null;
		return succ;
	}

	// isNumberPerstage(evt){
	// 	var valp = evt.target.value
	// 	var succp = valp.match(/^(\d*)$/ig) != null || valp.match(/^(\d*\.)\d{0,9999}$/ig) != null;;

	// 	return succp;
	// }



	// var iKeyCode = (evt.which) ? evt.which : evt.keyCode
	// if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
	// 	return false;

	// return true;

	levelOne() {
		this.levelOneChange = true;
	};
	levelTwo() {
		this.levelTwoChange = true;
	};
	levelThree() {
		this.levelThreeChange = true;
	}




	levelOneCheckChange(event) {

		if (event.target.checked == true) {
			this.ratesForm.get('levelOnemin').setValidators([Validators.required]);
			this.ratesForm.get('levelOnemax').setValidators([Validators.required]);
			this.ratesForm.get('levelOnepercentage').setValidators([Validators.required]);
			this.levelOnemaxRequired = true;
			this.levelOneminRequired = true;
			this.levelOnepercentageRequired = true;
		} else {
			this.ratesForm.get('levelOnemin').setValidators(null);
			this.ratesForm.get('levelOnemax').setValidators(null);
			this.ratesForm.get('levelOnepercentage').setValidators(null);
			this.levelOnemaxRequired = false;
			this.levelOneminRequired = false;
			this.levelOnepercentageRequired = false;
			this.levelonemaxSave=false;
		}
	};

	levelTwoCheckChange(event) {

		if (event.target.checked == true) {
			this.ratesForm.get('levelTwomin').setValidators([Validators.required]);
			this.ratesForm.get('levelTwomax').setValidators([Validators.required]);
			this.ratesForm.get('levelTwopercentage').setValidators([Validators.required]);
			this.levelTwomaxRequired = true;
			this.levelTwominRequired = true;
			this.levelTwopercentageRequired = true;

			let maxValue = this.ratesForm.get('levelOnemax').value;
			if (maxValue) {
				let value = +maxValue + +.01;

				this.ratesForm.patchValue({
					levelTwomin: value
				});
			};

		} else {
			this.ratesForm.get('levelTwomin').setValidators(null);
			this.ratesForm.get('levelTwomax').setValidators(null);
			this.ratesForm.get('levelTwopercentage').setValidators(null);
			this.levelTwomaxRequired = false;
			this.levelTwominRequired = false;
			this.levelTwopercentageRequired = false;
			this.levelTwoMaxSave=false;

			let checkfalse = this.ratesForm.get('levelTwomin').value;
			this.ratesForm.patchValue({
				levelTwomin: checkfalse
			});


		}
	};
	levelThreeCheckChange(event) {
		if (event.target.checked == true) {
			this.ratesForm.get('levelThreemin').setValidators([Validators.required,]);
			this.ratesForm.get('levelThreemax').setValidators([Validators.required]);
			this.ratesForm.get('levelThreepercentage').setValidators([Validators.required]);
			this.levelThreemaxRequired = true;
			this.levelThreeminRequired = true;
			this.levelThreepercentageRequired = true;
			let maxValue = this.ratesForm.get('levelTwomax').value;
			if (maxValue) {
				let value = +maxValue + +.01;

				this.ratesForm.patchValue({
					levelThreemin: value
				});
			};

		} else {
			this.ratesForm.get('levelThreemin').setValidators(null);
			this.ratesForm.get('levelThreemax').setValidators(null);
			this.ratesForm.get('levelThreepercentage').setValidators(null);
			this.levelThreemaxRequired = false;
			this.levelThreeminRequired = false;
			this.levelThreepercentageRequired = false;
			this.levelThreeMaxSave=false;

			let checkfalse = this.ratesForm.get('levelThreemin').value;
			this.ratesForm.patchValue({
				levelThreemin: checkfalse
			});

		}
	};
	levelFourCheckChange(event) {
		if (event.target.checked == true) {
			this.ratesForm.get('levelFourmin').setValidators([Validators.required]);
			this.ratesForm.get('levelFourmax').setValidators([Validators.required]);
			this.ratesForm.get('levelFourpercentage').setValidators([Validators.required]);
			this.levelFourmaxRequired = true;
			this.levelFourminRequired = true;
			this.levelFourpercentageRequired = true;
			let maxValue = this.ratesForm.get('levelThreemax').value;
			if (maxValue) {
				let value = +maxValue + +.01;

				this.ratesForm.patchValue({
					levelFourmin: value
				})
			}

		} else {
			this.ratesForm.get('levelFourmin').setValidators(null);
			this.ratesForm.get('levelFourmax').setValidators(null);
			this.ratesForm.get('levelFourpercentage').setValidators(null);
			this.levelFourmaxRequired = false;
			this.levelFourminRequired = false;
			this.levelFourpercentageRequired = false;
			this.levelFourMaxSave = false;


			let checkfalse = this.ratesForm.get('levelFourmin').value;
			this.ratesForm.patchValue({
				levelFourmin: checkfalse
			});


		}
	};


	saveFlat() {
		this.ratesForm.get('flatfree').setValidators([Validators.required]);
		this.ratesForm.get('summary').setValidators(Validators.required);
		this.flatfreeRequired = true;
		this.summaryRequired = true;




		if (this.ratesForm.get('flatfree').value == "" && this.ratesForm.get('summary').value == "") {
			return;
		};
		let flatObj = { "feeAmount": this.ratesForm.get('flatfree').value };
		const flatData = {
			commissionTypeId: this.ratesForm.get('commissionTypeId').value,
			FlatFee: flatObj,
			shipAssignment: this.RatesGridtempArray,
			summary: this.ratesForm.get('summary').value,
			contractId: this.contractId
		};
		if (this.contractRateId) {
			this.rMSApiService.showLoader(true);
			this.contractService.updateflat(this.contractRateId, flatData).subscribe((data: any) => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onSucess();
				this.location.back();


			},
				error => {
					this.rMSApiService.showLoader(false);
					this.toasterComponent.onError(error)
				}
			)
		} else {
			this.rMSApiService.showLoader(true);
			this.contractService.saveflat(flatData).subscribe((data: any) => {
				this.toasterComponent.onSucess();
				this.location.back();
				this.minfeeRequired = false;
				this.amountRequired = false;
				this.summaryRequired = false;
				this.rMSApiService.showLoader(false);

			},
				error => {
					this.rMSApiService.showLoader(false);
					this.toasterComponent.onError(error)
				}
			)
		}

	};


	saveIncremental() {
		if (this.ratesForm.invalid) {
			return;
		};
		this.basedonRequired = true;
		this.ratesummaryIncRequired = true;
		this.ratesForm.get('basedOnId').setValidators(Validators.required);
		this.ratesForm.get('ratesummaryInc').setValidators(Validators.required)
		if (this.ratesForm.invalid || !this.ratesForm.get('basedOnId').value || (!this.ratesForm.get('ratesummaryInc').value || this.ratesForm.get('ratesummaryInc').value == "" || this.ratesForm.get('ratesummaryInc').value.length == 0)) {
			return;
		};
		let temarray = [];
		let level = {}
		let feeAmt;
		let maxAmt;
		let minAmt


		if (this.ratesForm.get('levelOnemin').value || this.ratesForm.get('levelOnemax').value || this.ratesForm.get('levelOnepercentage').value) {
			if (this.levelOnemaxRequired) {
				this.levelonemaxSave = false;
				minAmt = this.ratesForm.get('levelOnemin').value,
					maxAmt = this.ratesForm.get('levelOnemax').value,
					feeAmt = this.ratesForm.get('levelOnepercentage').value,
					level = { "level": 1, "maxAmount": maxAmt, "feeAmt": feeAmt, "minAmount": minAmt, "percentage": feeAmt };
				temarray.push(level);

			} else {
				this.levelonemaxSave = true;
			}
		}else{
			this.levelonemaxSave = false;
		}

		if (this.ratesForm.get('levelTwomin').value || this.ratesForm.get('levelTwomax').value || this.ratesForm.get('levelTwopercentage').value) {
			if (this.levelTwomaxRequired) {
				this.levelTwoMaxSave = false;
				level = {
					level: 2,
					minAmount: this.ratesForm.get('levelTwomin').value,
					maxAmount: this.ratesForm.get('levelTwomax').value,
					percentage: this.ratesForm.get('levelTwopercentage').value,
				};
				temarray.push(level);
			} else {
				this.levelTwoMaxSave = true;
			}
		}else{
			this.levelTwoMaxSave = false;
		}

		if (this.ratesForm.get('levelThreemin').value || this.ratesForm.get('levelThreemax').value || this.ratesForm.get('levelThreepercentage').value) {
			if (this.levelThreemaxRequired) {
				this.levelThreeMaxSave = false;
				level = {
					level: 3,
					minAmount: this.ratesForm.get('levelThreemin').value,
					maxAmount: this.ratesForm.get('levelThreemax').value,
					percentage: this.ratesForm.get('levelThreepercentage').value,
				};
				temarray.push(level);
			} else {
				this.levelThreeMaxSave = true;
			}
		}else{
			this.levelThreeMaxSave = false;
		}



		if (this.ratesForm.get('levelFourmin').value || this.ratesForm.get('levelFourmax').value || this.ratesForm.get('levelFourpercentage').value) {

			if (this.levelFourmaxRequired) {
				this.levelFourMaxSave = false;
				level = {
					level: 4,
					minAmount: this.ratesForm.get('levelFourmin').value,
					maxAmount: this.ratesForm.get('levelFourmax').value,
					percentage: this.ratesForm.get('levelFourpercentage').value,

				};
				temarray.push(level);
			} else {
				this.levelFourMaxSave = true;
			}

		}else{
			this.levelFourMaxSave = false;
		}


	
            if(this.contractRateId){

			}else{
				if(this.levelonemaxSave || this.levelTwoMaxSave || this.levelThreeMaxSave || this.levelFourMaxSave){
					this.toasterComponent.contractRateFlatError();
					return;
				 }
			}
          








		// if (this.ratesForm.get('levelOneCheck').value == true) {
		// 	minAmt = this.ratesForm.get('levelOnemin').value,
		// 		maxAmt = this.ratesForm.get('levelOnemax').value,
		// 		feeAmt = this.ratesForm.get('levelOnepercentage').value,
		// 		level = { "level": 1, "maxAmount": maxAmt, "feeAmt": feeAmt, "minAmount": minAmt, "percentage": feeAmt };
		// 	temarray.push(level);
		// } if (this.ratesForm.get('levelTwoCheck').value == true) {
		// 	level = {
		// 		level: 2,
		// 		minAmount: this.ratesForm.get('levelTwomin').value,
		// 		maxAmount: this.ratesForm.get('levelTwomax').value,
		// 		percentage: this.ratesForm.get('levelTwopercentage').value,
		// 	};
		// 	temarray.push(level);
		// } if (this.ratesForm.get('levelThreeCheck').value == true) {
		// 	level = {
		// 		level: 3,
		// 		minAmount: this.ratesForm.get('levelThreemin').value,
		// 		maxAmount: this.ratesForm.get('levelThreemax').value,
		// 		percentage: this.ratesForm.get('levelThreepercentage').value,
		// 	};
		// 	temarray.push(level);
		// } if (this.ratesForm.get('levelFourCheck').value == true) {
		// 	level = {
		// 		level: 4,
		// 		minAmount: this.ratesForm.get('levelFourmin').value,
		// 		maxAmount: this.ratesForm.get('levelFourmax').value,
		// 		percentage: this.ratesForm.get('levelFourpercentage').value,

		// 	};
		// 	temarray.push(level);
		// };




		let tax = { "taxRateAmount": +this.ratesForm.get('taxRate').value }
		let incremental = {
			Levels: temarray,
			adminFee: this.ratesForm.get('adminFee').value,
			taxRate: tax,
			summary: this.ratesForm.get('ratesummaryInc').value,
		}
		const incrementalData = {
			commissionTypeId: this.ratesForm.get('commissionTypeId').value,
			incremental: incremental,
			shipAssignment: this.RatesGridtempArray,
			contractId: this.contractId,
			summary: this.ratesForm.get('ratesummaryInc').value,
			calculationTypeId: this.ratesForm.get('basedOnId').value,
		};
		if (this.contractRateId) {
			this.rMSApiService.showLoader(true);
			this.contractService.updateIncremental(this.contractRateId, incrementalData).subscribe((data: any) => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onSucess();
				this.location.back();

			},
				error => {
					this.rMSApiService.showLoader(false);
					this.toasterComponent.onError(error)
				}
			)
		}
		else {
			this.rMSApiService.showLoader(true);
			this.contractService.saveIncremental(incrementalData).subscribe((data: any) => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onSucess();
				this.location.back();
			},
				error => {
					this.rMSApiService.showLoader(false);
					this.toasterComponent.onError(error)
				}
			)
		}
	};

	savePercentage() {
		this.ratesForm.get('minfee').setValidators([Validators.required]);
		this.ratesForm.get('amount').setValidators(Validators.required);
		this.ratesForm.get('rateSummary').setValidators([Validators.required, Validators.maxLength(150)]);
		this.minfeeRequired = true;
		this.amountRequired = true;
		this.rateSummaryRequired = true;

		if (this.ratesForm.get('minfee').value == "" && this.ratesForm.get('amount').value == "" && this.ratesForm.get('rateSummary').value == "") {
			return;
		};

		let percentageobj = { "minAmount": this.ratesForm.get('minfee').value, "feeAmount": this.ratesForm.get('amount').value }
		const percentageData = {
			commissionTypeId: this.ratesForm.get('commissionTypeId').value,
			Percentage: percentageobj,
			shipAssignment: this.RatesGridtempArray,
			summary: this.ratesForm.get('rateSummary').value,
			contractId: this.contractId,

		};
		if (this.contractRateId) {
			this.rMSApiService.showLoader(true);
			this.contractService.updatePercentage(this.contractRateId, percentageData).subscribe((data: any) => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onSucess();
				this.location.back();
			},
				error => {
					this.rMSApiService.showLoader(false);
					this.toasterComponent.onError(error)
				}

			)
		} else {
			this.rMSApiService.showLoader(true);
			this.contractService.savePercentage(percentageData).subscribe((data: any) => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onSucess();
				this.location.back();
			},
				error => {
					this.rMSApiService.showLoader(false);
					this.toasterComponent.onError(error)
				}
			)
		}
	};



	saveIncrementalPoromo() {

		this.ratesummaryIncRequired = true;
		this.basedonRequired = false;
		this.ratesForm.get('ratesummaryInc').setValidators(Validators.required)
		if (this.ratesForm.get('ratesummaryInc').value == '') {
			return;
		};
		let temarray = [];
		let level = {}
		let feeAmt;
		let maxAmt;
		let minAmt;


		if (this.ratesForm.get('levelOnemin').value || this.ratesForm.get('levelOnemax').value || this.ratesForm.get('levelOnepercentage').value) {
			if (this.levelOnemaxRequired) {
				this.levelonemaxSave = false;
				minAmt = this.ratesForm.get('levelOnemin').value,
					maxAmt = this.ratesForm.get('levelOnemax').value,
					feeAmt = this.ratesForm.get('levelOnepercentage').value,
					level = { "level": 1, "maxAmount": maxAmt, "feeAmt": feeAmt, "minAmount": minAmt, "percentage": feeAmt };
				temarray.push(level);

			} else {
				this.levelonemaxSave = true;
			}
		}else{
			this.levelonemaxSave = false;
		}

		if (this.ratesForm.get('levelTwomin').value || this.ratesForm.get('levelTwomax').value || this.ratesForm.get('levelTwopercentage').value) {
			if (this.levelTwomaxRequired) {
				this.levelTwoMaxSave = false;
				level = {
					level: 2,
					minAmount: this.ratesForm.get('levelTwomin').value,
					maxAmount: this.ratesForm.get('levelTwomax').value,
					percentage: this.ratesForm.get('levelTwopercentage').value,
				};
				temarray.push(level);
			} else {
				this.levelTwoMaxSave = true;
			}
		}else{
			this.levelTwoMaxSave = false;
		}

		if (this.ratesForm.get('levelThreemin').value || this.ratesForm.get('levelThreemax').value || this.ratesForm.get('levelThreepercentage').value) {
			if (this.levelThreemaxRequired) {
				this.levelThreeMaxSave = false;
				level = {
					level: 3,
					minAmount: this.ratesForm.get('levelThreemin').value,
					maxAmount: this.ratesForm.get('levelThreemax').value,
					percentage: this.ratesForm.get('levelThreepercentage').value,
				};
				temarray.push(level);
			} else {
				this.levelThreeMaxSave = true;
			}
		}else{
			this.levelThreeMaxSave = false;
		}



		if (this.ratesForm.get('levelFourmin').value || this.ratesForm.get('levelFourmax').value || this.ratesForm.get('levelFourpercentage').value) {

			if (this.levelFourmaxRequired) {
				this.levelFourMaxSave = false;
				level = {
					level: 4,
					minAmount: this.ratesForm.get('levelFourmin').value,
					maxAmount: this.ratesForm.get('levelFourmax').value,
					percentage: this.ratesForm.get('levelFourpercentage').value,

				};
				temarray.push(level);
			} else {
				this.levelFourMaxSave = true;
			}

		}else{
			this.levelFourMaxSave = false;
		}


	
            if(this.contractRateId){

			}else{
				if(this.levelonemaxSave || this.levelTwoMaxSave || this.levelThreeMaxSave || this.levelFourMaxSave){
					this.toasterComponent.contractRateFlatError();
					return;
				 }
			}



		// if (this.ratesForm.get('levelOneCheck').value == true) {
		// 	minAmt = this.ratesForm.get('levelOnemin').value,
		// 		maxAmt = this.ratesForm.get('levelOnemax').value,
		// 		feeAmt = this.ratesForm.get('levelOnepercentage').value,
		// 		level = {
		// 			"level": 1, "maxAmount": maxAmt, "minAmount": minAmt, "percentage": feeAmt,
		// 		};
		// 	temarray.push(level);
		// } if (this.ratesForm.get('levelTwoCheck').value == true) {
		// 	level = {
		// 		level: 2,
		// 		minAmount: this.ratesForm.get('levelTwomin').value,
		// 		maxAmount: this.ratesForm.get('levelTwomax').value,
		// 		percentage: this.ratesForm.get('levelTwopercentage').value,
		// 	};
		// 	temarray.push(level);
		// } if (this.ratesForm.get('levelThreeCheck').value == true) {
		// 	level = {
		// 		level: 3,
		// 		minAmount: this.ratesForm.get('levelThreemin').value,
		// 		maxAmount: this.ratesForm.get('levelThreemax').value,
		// 		percentage: this.ratesForm.get('levelThreepercentage').value,

		// 	};
		// 	temarray.push(level);
		// } if (this.ratesForm.get('levelFourCheck').value == true) {
		// 	level = {
		// 		level: 4,
		// 		minAmount: this.ratesForm.get('levelFourmin').value,
		// 		maxAmount: this.ratesForm.get('levelFourmax').value,
		// 		percentage: this.ratesForm.get('levelFourpercentage').value,

		// 	};
		// 	temarray.push(level);
		// };

		let tax = { "taxRateAmount": this.ratesForm.get('taxRate').value }
		let incremental = {
			Levels: temarray,
			summary: this.ratesForm.get('ratesummaryInc').value,
		}

		const incrementalPromo = {
			commissionTypeId: this.ratesForm.get('commissionTypeId').value,
			incremental: incremental,
			shipAssignment: this.RatesGridtempArray,
			contractId: this.contractId,
			summary: this.ratesForm.get('ratesummaryInc').value,
		};
		if (this.contractRateId) {
			this.rMSApiService.showLoader(true);
			this.contractService.updatePromoIncremental(this.contractRateId, incrementalPromo).subscribe((data: any) => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onSucess();
				this.location.back();
			},
				error => {
					this.rMSApiService.showLoader(false);
					this.toasterComponent.onError(error)
				}
			)
		} else {
			this.rMSApiService.showLoader(true);
			this.contractService.savePromoIncremental(incrementalPromo).subscribe((data: any) => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onSucess();
				this.location.back();
			},
				error => {
					this.rMSApiService.showLoader(false);
					this.toasterComponent.onError(error)
				}
			)
		}

	};

	onRowClicked(e) {
	};

	selectionChanged(params) {

		let tempArray = [];
		let data = this.gridApi.getSelectedRows();
		let tempChecked;
		this.gridApi.forEachNode(function (node) {
			if (node.isSelected()) {
				tempChecked = { "shipId": node.data.entityId, "isSelected": true }
				tempArray.push(tempChecked);
			} else {
				tempChecked = { "shipId": node.data.entityId, "isSelected": false }
				tempArray.push(tempChecked);
			}
		});

		this.RatesGridtempArray = tempArray;
	}

	backpage() {
		//this.router.navigateByUrl('/Contract')
		this.location.back();
	};


	downloadExisting() {
		window.location.href = `api/retailer/contract/Rate/existing/${this.contractRateId}`;
	};

	downloadMissing() {
		window.location.href = `api/retailer/contract/Rate/missing/${this.contractRateId}`;
	}



	browse(event) {
		for (let file of event.files) {
			this.upload = file;
			this.filename = file.name
		}
		this.uploadedFiles = event.files;
		this.uploadfileshow = true;
	}


	/* === click on upload call the API=========*/
	onUpload(): void {
		if (this.upload == undefined) {
			this.toasterComponent.notUploadFile();
			return;
		}
		this.rMSApiService.showLoader(true);
		this.contractService.uploadContractExcel(this.upload).subscribe(
			(data: any) => {
				this.uploadDataId = data;
				//	this.toasterComponent.onSucess();
				this.upload = null;
				this.rMSApiService.showLoader(false);
				this.toasterComponent.excelFormatSucess(data);
				this.uploadfileshow = false;
			},
			error => {
				this.rMSApiService.showLoader(false);
				if (error.status >= 500 || error.status < 600) {
					this.toasterComponent.excelFormatError(error)
				}
			}
		)
	}

	ngOnDestroy() {

	}


}
var minRowHeight = 30;
var currentRowHeight = minRowHeight;


