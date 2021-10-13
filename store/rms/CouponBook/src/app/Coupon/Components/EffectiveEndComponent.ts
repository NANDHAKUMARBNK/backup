import { Component } from '@angular/core';
import { EmitterService } from 'common/services/emitterService';
import { MatDialogConfig, MatDialog, } from "@angular/material";
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { RMSApiService } from 'common/services/RMSApiService';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
declare var $: any;

import * as _moment from 'moment';
declare var $: any;
import { default as _rollupMoment } from 'moment';

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
	selector: 'app-effectiveend',
	templateUrl: '../../../../../../../Views/CouponBook/EffectiveEnd.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss'],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	],
})
export class EffectiveEndComponent {
	effectiveDates: FormGroup;
	form: FormGroup;
	gridApi: any;
	gridColumnApi: any;
	params: any;
	data: any;
	date: any;
	config = new MatDialogConfig();
	endObj = [];
	getlocationId: any;
	maxDate: any;
	minDate: any;
	effectiveEndDate = new FormControl(moment());
	constructor(
		private rmsApiService: RMSApiService,
		private fb: FormBuilder

	) {
	}


	agInit(params) {
		this.data = params.data;
		this.getlocationId = this.rmsApiService.getRowDateId();
		this.effectiveDates = this.fb.group({
			dates: this.fb.array([
				this.initDate(),
			]),
		});
		this.rmsApiService.buttonClickEventTrack.subscribe(event => {
			if (event) {
			}

		})
		this.effectiveDates.setControl('dates', this.setcontrolsAdtess(this.data));
	}

	initDate() {
		return this.fb.group({
			effectiveEndDate: ['', Validators.required]
		});
	};
	updateRange(event) {
		let dateValidations = this.rmsApiService.getDateValidation();
		let searchedItem = dateValidations.find(ele => ele.id == event.id);
	
		if (searchedItem.is_New == true) {
			this.minDate = searchedItem.enddate_min;
			this.maxDate = searchedItem.enddate_max;
		} else {
			this.minDate = searchedItem.enddate_max;
		}

	}

	changeDate(event) {
		this.date = this.effectiveDates.controls['dates'].value;
		let isNewitem = this.rmsApiService.getNewDatesData().find(item => (item.id == event.id));
		if (isNewitem == null) {
			let searchedItem = this.rmsApiService.getItemFromExistingDates(event.id)
			this.rmsApiService.pushNewDate(searchedItem)
		}
		this.rmsApiService.updateDatesData(event.id, moment(this.date[0].effectiveEndDate).format("YYYY-MM-DDThh:mm:ss"), "end", this);
		this.date.forEach((item) => {
			this.rmsApiService.setDatesEvent(item);
		});
	};

	validatedate(event) {

		const allowedRegex = /[0-9\/]/g

		if (!event.key.match(allowedRegex)) {
			event.preventDefault()
		}

	}
	setcontrolsAdtess(item) {
		let EndDate = [item]
		const formarray = new FormArray([]);
		EndDate.forEach(d => {
			formarray.push(this.fb.group({
				effectiveEndDate: d.effectiveEndDate,
			}));
		})
		return formarray;
	};
}






