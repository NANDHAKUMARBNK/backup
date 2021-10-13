import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import * as _moment from 'moment';
import moment from 'moment';


@Component({
	selector: 'app-historyicon',
	templateUrl: '../../../../../../../Views/CruiseLines/ItineraryArrival.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss']
})
export class ItineraryArrivalComponent {
	data: any;
	timeRegex = "^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$"
	arrivalTime = new FormControl('');

	constructor(private rMSApiService: RMSApiService) {

	}


	agInit(params) {
		let now = moment();
		this.data = params.data;
		if (this.data.arrivalTime) {
			let time = this.data.arrivalTime;
			this.arrivalTime.patchValue(time)
		}
	};

	ngOnInit() {
		this.rMSApiService.buttonClickEventTrack.subscribe(event => {
			if (event === this.data.id) {
				this.data.isShowText = false;
			}
		});
		this.onChange();
	};

	onSelect(e) {
		this.data.arrivalTime=e.target.value;
		this.rMSApiService.setitineraryarrival(e.target.value);
	};
	onChange(){
this.arrivalTime.valueChanges.subscribe(data=>{
	this.data.arrivalTime=data;
})
	}



	keyhandler(e) {
	
		let value = e.target.value;
		if ((e.keyCode != 8) && ! /[0-9:]/.test(e.key))
			return false
		value = value + e.key;
		switch (value.length) {
			case 1: if (!/[0-2]/.test(value))
				return false;
				break;
			case 2: if (!/(2[0-3]|[01][0-9])/.test(value))
				return false;
				break;
			case 3: if (!/(2[0-3]|[01][0-9]):/.test(value))
				return false;
				break;
			case 4: if (!/(2[0-3]|[01][0-9]):[0-5]/.test(value))
				return false;
				break;
			case 4: if (!/(2[0-3]|[01][0-9]):[0-5][0-9]/.test(value))
				return false;
				break;
		}

		return true;

	}


	timeControl(evet) {
		var reg = /[0-9]/;
		if (evet.target.value.length == 2 && reg.test(evet.target.value)) {
			evet.target.value = evet.target.value + ":";
		};
		if (evet.target.value.length > 5) {
			evet.target.value = evet.target.value.substr(0, evet.target.value.length - 1)
		}
		
	}
}