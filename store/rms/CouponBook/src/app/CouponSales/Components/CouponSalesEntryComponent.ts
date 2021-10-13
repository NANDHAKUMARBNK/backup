import { Component, OnDestroy, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { error } from 'selenium-webdriver';
import { EmitterService } from 'common/services/emitterService';
import { CouponBookService } from '../../Service/CouponBookService';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
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
	selector: 'app-addsales',
	templateUrl: '../../../../../../../Views/CouponBook/CouponSalesEntry.html',
	styles: [],
	providers: [
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },CustomValidatorService
	]
})
export class CouponSalesEntryComponent {
	appName = 'couponBook';

	salesEntryform: FormGroup;
	entryData: any;
	Data: any;
	//public allowedRegex = '^[a-zA-Z0-9_ ]*$';
	allowWholeMnumbers = '^\d+$'
	beginDate = new FormControl(moment());
	minDate: any;

	constructor(private dialogRef: MatDialogRef<CouponSalesEntryComponent>, @Inject(MAT_DIALOG_DATA) data, private router: Router, private couponBookService: CouponBookService,
		private rMSApiService: RMSApiService,private customValidatorService:CustomValidatorService, private toasterComponent: ToasterComponent,
		private sharedDataService: SharedDataService, private activeroute: ActivatedRoute, private fb: FormBuilder, private emitterService: EmitterService) {

		this.Data = data;
	
	};

	ngOnInit() {
		this.formControlsSet();
		this.getEntryById();
	}

	formControlsSet() {
		this.salesEntryform = this.fb.group({
			psgSales: ['',],
			giveAway: ['',],
			sales: ['',],
			beginDate: [''],
			payment: ['',]
		})
	};

	hasError(controlName: string, errorName: string) {
		return this.salesEntryform.controls[controlName].hasError(errorName);
	}

	getEntryById() {
		let voyageStartDate = moment(this.Data.voyageStartDate).format('YYYY-MM-DD');
		let voyageEndDate = moment(this.Data.voyageEndDate).format('YYYY-MM-DD');

		let salesId = this.Data.id;

		if (salesId == null) {
			salesId = '';
		} else {
			salesId = this.Data.id;
		}
		this.couponBookService.getEntryById(salesId, this.Data.cruiseLineId, this.Data.shipId, voyageStartDate, voyageEndDate).subscribe((data: any) => {
			this.entryData = data;
			this.minDate = moment(this.entryData.debarkDateTime).add(1, 'days').format();
			this.salesEntryform.patchValue({
				psgSales: this.entryData.sales_PSG,
				giveAway: this.entryData.giveAway,
				sales: this.entryData.sales,
				beginDate: this.entryData.settlementDate,
				payment: this.entryData.settlementPaymentNum,
			})
		})
	};
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	saveEntry() {
		const reqData = {
			entityId: this.Data.entityId,
			itemLocationId: this.Data.itemLocationId,
			sales_PSG: this.salesEntryform.get('psgSales').value,
			giveAway: this.salesEntryform.get('giveAway').value,
			sales: this.salesEntryform.get('sales').value,
			settlementDate: this.salesEntryform.get('beginDate').value,
			settlementPaymentNum: this.salesEntryform.get('payment').value,
		}
		
		this.rMSApiService.showLoader(true);
		let sId = this.Data.id;
		if (sId == null) {
			sId = '';
		} else {
			sId = this.Data.id;
		}
		this.couponBookService.saveEntry(sId, reqData).subscribe((data: any) => {
			this.rMSApiService.showLoader(false);
			this.emitterService.refreshSalesEntry.emit(true);
			this.dialogRef.close()
		},
			error => {
				this.rMSApiService.showLoader(false)
				this.toasterComponent.onError(error)
			}
		)

	}
	isNumber(evt) {
		var iKeyCode = (evt.which) ? evt.which : evt.keyCode
		if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
			return false;

		return true;
	}

	close() {
		this.dialogRef.close()
	}
	// hasError(controlName: string, errorName: string) {
	// 	return this.shipProfileForm.controls[controlName].hasError(errorName);
	// }
	validatedate(event) {

		this.customValidatorService.isDateMaxlengthForamt(event)

	}

}