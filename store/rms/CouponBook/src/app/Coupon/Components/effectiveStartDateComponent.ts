import { Component } from '@angular/core';
import { EmitterService } from 'common/services/emitterService';
import { MatDialogConfig, MatDialog, } from "@angular/material";
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
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
	selector: 'app-effectivestart',
	templateUrl: '../../../../../../../Views/CouponBook/EffectiveStart.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss'],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	],
})
export class EffectiveStartComponent {

	effectiveDates: FormGroup;
	gridApi: any;
	gridColumnApi: any;
	params: any;
	data: any = [];
	config = new MatDialogConfig();
	date: any;
	minDate: any;
	dateValidation: any;
	getlocationId: any;
	maxDate: any;
	effectiveStartDate = new FormControl(moment());
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
				this.initDate()
			]),
		});
		this.effectiveDates.setControl('dates', this.setcontrolsAdtess(this.data))
		this.rmsApiService.setData(this.data.effectiveStartDate)

	};

	setcontrolsAdtess(item) {
		let StartDate = [item];
		const formarray = new FormArray([]);
		StartDate.forEach(d => {
			formarray.push(this.fb.group({
				effectiveStartDate: d.effectiveStartDate,
			}));
		})
		return formarray;
	};

	initDate() {
		return this.fb.group({
			effectiveStartDate: ['', Validators.required]
		});
	}

	updateRange(event) {
		let dateValidations = this.rmsApiService.getDateValidation();
		let searchedItem = dateValidations.find(ele => ele.id == event.id)
		this.minDate = searchedItem.startdate_min;
		this.maxDate = searchedItem.startdate_max;
	}


	changeDate(event) {
		this.date = this.effectiveDates.get('dates').value;
		let endDateValidation = moment(this.date[0].effectiveStartDate).add(1, 'days').format("YYYY-MM-DD");
		this.rmsApiService.updateDateValidation(event.id, endDateValidation)
		this.rmsApiService.updateDatesData(event.id, moment(this.date[0].effectiveStartDate).format("YYYY-MM-DDThh:mm:ss"), "start", this);
	};

}



