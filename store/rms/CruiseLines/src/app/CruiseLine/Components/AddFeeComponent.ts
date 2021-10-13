import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { EmitterService } from 'common/services/emitterService';
import { error } from 'util';
import { RMSApiService } from 'common/services/RMSApiService';
import { ErrorModalComponent } from 'common/components/ErrorModalComponent';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomNumericComponent } from '../../../../../../common/components/CustomNumeric';
import * as _moment from 'moment';
declare var $: any;
import { default as _rollupMoment } from 'moment';
import { DatePipe } from '@angular/common';
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
	selector: 'app-addfee',
	templateUrl: '../../../../../../../Views/CruiseLines/AddFee.html',
	styles: ['../../../styles/cruiseLine.scss'],
	providers: [DatePipe,
		// `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
		// application's root module. We provide it at the component level here, due to limitations of
		// our example generation script.
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	],
})
export class AddFeeComponent {
	// title = 'CruiseLines';
	Datadoc: any;
	dateval: any;
	addFeeFormlist: FormGroup
	Data: any;
	upload: File;
	cacheId: any;
	feeTypeData: any;
	DescriptionData: any;
	cruiseLineId: any;
	cruiseLineDataEdit: any;
	updateButton: any;
	showUSD: boolean = false;
	showP: boolean = false;
	cruiseLineName: any;
	todaydate: any;
	endDateVal: any
	currentDate = moment().format("YYYY-MM-DD")
	minDate: any;
	today: any;
	mindatePlus: any;
	invalidDateformat: boolean = false
	public dateFormatRegx = /([1-9]|1[12])[/]([1-9]|[12][0-9]|3[01])[/][0-9]{2}/;
	moneyRegx = '[0-9]*(\.[0-9][0-9]?)?'
	//moneyRegx = /^-?\d+(?:\.\d+)?$/
	beginDate = new FormControl(moment());
	endDate = new FormControl(moment());
	//minDate = new Date(this.date);

	constructor(private dialogRef: MatDialogRef<AddFeeComponent>, @Inject(MAT_DIALOG_DATA) data,
		private cruiseLineService: CruiseLineService, private toasterComponent: ToasterComponent,
		private fb: FormBuilder, private datePipe: DatePipe,
		private dialog: MatDialog,
		private emitterService: EmitterService,
		private sharedDataService: SharedDataService,
		private route: ActivatedRoute,
		private customNumericComponent: CustomNumericComponent,
		private rMSApiService: RMSApiService) {
		this.Data = data;
	
		this.updateButton = data.gridid
		this.route.params.subscribe(params => {
			this.cruiseLineId = params['id'];
		});
	
	}

	ngOnInit() {
		this.formcontrolsSet();
		this.getCruiseLineFeeType();
		this.getCruiseLineDescription();


		if (this.Data.gridid) {
			this.getUpdateId();

		}
		this.changeAmount();
		this.cruiseLineName = this.rMSApiService.getData();// get Name from cruiseline list component through service create a global varibale
	

		//this.mindatePlus = new Date();
		setTimeout(() => {
			if ((<HTMLInputElement>document.getElementById("startDate")).disabled) {
				$('#startDate').closest('.mat-form-field-flex').removeClass('mat-form-field-flex').addClass('flexField');
			}
			if ((<HTMLInputElement>document.getElementById("feeAmt")).readOnly) {
				$('#feeAmt').closest('.mat-form-field-flex').removeClass('mat-form-field-flex').addClass('flexField');
			}
		}, 1000);

	};

	// isNumber(evt) {
	// 	this.customNumericComponent.isNumber(evt)
	// }



	isNumber(evt) {
		var iKeyCode = (evt.which) ? evt.which : evt.keyCode
		if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
			return false;

		return true;
	};




	//Form Controls 
	formcontrolsSet() {
		this.addFeeFormlist = this.fb.group({
			descTypeId: ['', Validators.required],
			feeTypeId: ['', Validators.required],
			feeAmt: ['', [Validators.required, Validators.pattern(this.moneyRegx)]],
			beginDate: ['', [Validators.required]],
			endDate: ['', [Validators.required]],
			// dateJoined: ['', [Validators.required, ]]
		});
		// this.addFeeFormlist.controls.beginDate.disable();
		// this.addFeeFormlist.controls.endDate.disable();

	};
	hasError(controlName: string, errorName: string) {
		return this.addFeeFormlist.controls[controlName].hasError(errorName);
	}


	getCruiseLineFeeType() {
		this.sharedDataService.getCruiseLineFeeType().subscribe(
			(data: any) => {
				this.feeTypeData = data.items;
			},
			error => {
				this.toasterComponent.onError(error);
			}
			
		)
	};

	getCruiseLineDescription() {
		this.sharedDataService.getCruiseLineDescription().subscribe(
			(data: any) => {
				this.DescriptionData = data.items;
			},
			error => {
				this.toasterComponent.onError(error);
			}
			
		);
	};

	// calling grid id populate values and patching values using patchValue
	getUpdateId() {
		this.cruiseLineService.getUpdateId(this.Data.gridid).subscribe((data: any) => {
			this.cruiseLineDataEdit = data;
			this.addFeeFormlist.patchValue({
				descTypeId: this.cruiseLineDataEdit.descTypeId,
				feeTypeId: this.cruiseLineDataEdit.feeTypeId,
				feeAmt: this.cruiseLineDataEdit.feeAmt,
				beginDate: new Date(this.cruiseLineDataEdit.beginDate),
				endDate: new Date(this.cruiseLineDataEdit.endDate),
			})
			this.minDate = moment(this.cruiseLineDataEdit.beginDate).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
		},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	};

	/* ============checking condition show and hide % and Usd Labels =========*/
	changeAmount() {
		this.addFeeFormlist.get('feeTypeId').valueChanges.subscribe((data: any) => {
		
			if (data == 526) {
				this.showP = true;
				this.showUSD = false;
			} else if (data == 525) {
				this.showP = false;
				this.showUSD = true;
			}
		});
	}
	// hasError(controlName: string, errorName: string) {
	// 	return this.addFeeFormlist.controls[controlName].hasError(errorName);
	// }

	/*=============saving data and pass values ============*/
	saveDoc() {
		if (this.addFeeFormlist.invalid) {
			return;
		};
		let beginDateDF = this.addFeeFormlist.get('beginDate').value;
		let endDateDF = this.addFeeFormlist.get('endDate').value;
		const reqdata = {
			cruiseLineId: this.Data.id,
			descTypeId: this.addFeeFormlist.get('descTypeId').value,
			feeTypeId: this.addFeeFormlist.get('feeTypeId').value,
			feeAmt: this.addFeeFormlist.get('feeAmt').value,
			beginDate: this.datePipe.transform(beginDateDF, 'yyyy-MM-dd'),
			endDate: this.datePipe.transform(endDateDF, 'yyyy-MM-dd'),
		}
		this.rMSApiService.showLoader(true);

		this.cruiseLineService.checkOverlapDate(this.Data.id, reqdata.descTypeId, reqdata.beginDate, reqdata.endDate).subscribe((data: any) => {
			this.rMSApiService.showLoader(false);
			if (data == true) {
				this.cruiseLineService.saveAddFee(reqdata).subscribe(
					(data: any) => {

						this.emitterService.refreshAddFee.emit(true);
						this.dialogRef.close();

					},
					error => { //if any error open pop up from ErrorModalComponent pass status etc...
						this.rMSApiService.showLoader(false);
						this.toasterComponent.onError(error)
					}
				)
			} else if (data == false) {
				this.toasterComponent.addFeeUpoloadFailed()

			}
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.claenderValidation();
			}
		)




	};

	/*=============== Edit data pass values through formcontrols===========*/
	updateDoc() {
		if (this.addFeeFormlist.invalid) {
			return;
		}
		let endDateDf = this.addFeeFormlist.get('endDate').value;

		const data = {
			cruiseLineId: this.Data.id,
			descTypeId: this.addFeeFormlist.get('descTypeId').value,
			feeTypeId: this.addFeeFormlist.get('feeTypeId').value,
			feeAmt: this.addFeeFormlist.get('feeAmt').value,
			beginDate: this.addFeeFormlist.get('beginDate').value,
			endDate: this.datePipe.transform(endDateDf, 'MM/dd/yy'),



		}
		this.rMSApiService.showLoader(true);
		this.cruiseLineService.updateAddFee(this.Data.gridid, data).subscribe(
			(data: any) => {
				this.rMSApiService.showLoader(false);
				this.emitterService.refreshAddFee.emit(true);
				this.toasterComponent.onSucess();
				this.dialogRef.close();
			},
			error => {//if any error open pop up from ErrorModalComponent pass status etc...
				this.toasterComponent.onError(error);
			}
		)
	};

	/*=====================close clicl============*/
	close() {
		this.dialogRef.close();
	};


	validatedate(event) {
		const allowedRegex = /[0-9\/]/g

		if (!event.key.match(allowedRegex)) {
			event.preventDefault()
		};
		if (event.target.value.length >= 8) {
			event.preventDefault()
		}


		//this.customValidatorService.isDateMaxlengthForamt(event)

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


	dateChange() {
		if (moment(this.addFeeFormlist.get('beginDate').value.isValid())) {
			this.minDate = moment(this.addFeeFormlist.get('beginDate').value).add(1, 'days');
		}
	}
}