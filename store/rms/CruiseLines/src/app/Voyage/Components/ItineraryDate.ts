import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';

import {default as _rollupMoment} from 'moment';

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
	selector: 'app-historyicon',
	templateUrl: '../../../../../../../Views/CruiseLines/ItineraryDate.html',
	//styleUrls: ['../../../styles/PsgList.scss', '../../../../../../common/styles/AgGrid.scss']
	providers: [
		{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
	
		{provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},]
})
export class ItineraryDateComponent {
	data: any;
	itineraryDate = new FormControl('');
	//itineraryDate = new FormControl(moment());

	constructor(private rMSApiService: RMSApiService) {

	}

	agInit(params) {
		this.data = params.data;
		this.itineraryDate.patchValue(this.data.date)
	};

	ngOnInit() {
	 this.rMSApiService.buttonClickEventTrack.subscribe(event => {
			if (event === this.data.id) {
				this.data.isShowText = false;
			}
		})
	};

	dateChange(e) {
		this.data.date=this.itineraryDate.value;
		 let date=moment(this.itineraryDate.value).format("MM-DD-YYYY");
		
		this.rMSApiService.setitineraryDate(date)
	}
	//validatedate(event){

	//	const allowedRegex = /[0-9\/]/g

	//	if(!event.key.match(allowedRegex)){
	//		event.preventDefault()
	//	}

	//}
}