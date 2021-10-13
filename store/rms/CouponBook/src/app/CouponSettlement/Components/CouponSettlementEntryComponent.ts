import { Component, OnDestroy, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { error } from 'selenium-webdriver';
import { EmitterService } from 'common/services/emitterService';
import { CouponBookService } from '../../Service/CouponBookService';
import { DatePipe } from '@angular/common';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
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
	selector: 'app-couponsettlemententry',
	templateUrl: '../../../../../../../Views/CouponBook/CouponSettlementEntry.html',
	styles: [],
	providers: [DatePipe, 
		{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
	
		{provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},CustomValidatorService
	]
})
export class CouponSettelmentEntryComponent {
	appName = 'couponBook';
	settlementEntry: FormGroup;
	Data: any;
	entryData: any;
	checkedData: any;
	checkId: any;
	tempCheckId: any = [];
	itemlocationId: any;
	entityId: any;
	objectCode: any;
    sid: any;
    locationId: any;
    objectcode: any;
	entityid: any;
	debarkDateTime: any;
	public allowedRegex = '^[a-zA-Z0-9_ ]*$';
	emptySpaceRegex = '^[a-zA-Z0-9_@./#&+%]*$';
	startDate = new FormControl(moment());
	minDate: any;
	

	constructor(private dialogRef: MatDialogRef<CouponSettelmentEntryComponent>, @Inject(MAT_DIALOG_DATA) data, private router: Router, private couponBookService: CouponBookService,
		private datepipe: DatePipe, private rMSApiService: RMSApiService, private toasterComponent: ToasterComponent,
		private sharedDataService: SharedDataService,private customValidatorService:CustomValidatorService, private activeroute: ActivatedRoute, private fb: FormBuilder, private emitterService: EmitterService) {
		this.Data = data;
	};


	ngOnInit() {
		this.settlementEntry = this.fb.group({
			startDate: [''],
			payment: ['',[Validators.pattern(this.emptySpaceRegex)]]
		})

		

		this.checkedData = this.rMSApiService.getCheckedDataSettlement();
	
		let max_date = null;
		this.checkId = this.checkedData[0].map(ele => ele);
		if (this.checkId.length > 1)
			this.checkId.sort((a, b) => (a.debarkDateTime < b.debarkDateTime) ? 1 : ((b.debarkDateTime < a.debarkDateTime) ? -1 : 0))
		if (this.checkId.length > 0)
			this.minDate = moment(this.checkId[0].debarkDateTime).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss')
	
		this.debarkDateTime = this.checkedData.map(ele => ele.debarkDateTime);
		this.entityId = this.checkedData.map(ele => ele.entityId);
		this.objectCode = this.checkedData.map(ele => ele.objectCode);
		//this.getEnteyById();
	};


hasError (controlName: string, errorName: string) {
	return this.settlementEntry.controls[controlName].hasError(errorName);
  }

	getEnteyById() {
		this.couponBookService.getSettlementById(this.Data.id).subscribe((data: any) => {
			this.entryData = data;
			this.settlementEntry.patchValue({
				startDate: this.entryData.settlementDate,
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
		
		let startDate = this.settlementEntry.get('startDate').value;
		let Date = this.datepipe.transform(startDate, 'MM/dd/yy')
		let payment = this.settlementEntry.get('payment').value;
		 if(Date==null && payment==""){
			this.toasterComponent.emptyFieldValidate()
			return;
		 }
		this.checkId.forEach(item => {
			let tempObj = { "id": item.id, "itemLocationId": item.itemLocationId, "objectCode": item.objectCode, "entityId": item.entityId };
			this.tempCheckId.push(tempObj);
		});
		const reqData = {
			settlementEntry: this.tempCheckId,
			settlementDate: Date,
			settlementPaymentNum: payment
		}
		this.rMSApiService.showLoader(true);
		this.couponBookService.saveSettlementEntry(reqData).subscribe((data: any) => {
			this.rMSApiService.showLoader(false);
			this.emitterService.refreshupdateSettlement.emit(true);
			this.dialogRef.close();
		},
			error => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)
	}
	close() {
		this.dialogRef.close();
		//this.emitterService.refreshupdateSettlement.emit(true);
	}
	validatedate(event){

		this.customValidatorService.isDateMaxlengthForamt(event)

	}
	
	
}
