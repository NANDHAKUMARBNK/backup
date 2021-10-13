import { Component, OnChanges, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import moment from 'moment';
import { Subscription } from 'rxjs';



@Component({
	selector: 'app-historyicon',
	templateUrl: '../../../../../../../Views/CruiseLines/ItineraryDepature.html',
	//styleUrls: ['../../../styles/PsgList.scss', '../../../../../../common/styles/AgGrid.scss']
})
export class ItineraryDepatureComponent  {
	data: any;
	depatureTime = new FormControl('');
	selectable: any;
	showText: boolean = true;
	unsubscribe: Subscription;
	constructor(private rMSApiService: RMSApiService) {

	
	}

	agInit(params) {
		let now = moment();
		this.data = params.data;
	
		if (this.data.departureTime) {
			let time = this.data.departureTime
			this.depatureTime.patchValue(time)
		}
	
	};


	ngOnInit() {
		this.rMSApiService.buttonClickEventTrack.subscribe(event => {
			if (event === this.data.id) {
				this.data.isShowText = false;
			}
		});
		this.onchange()
	
	};


	// ngOnChanges() {
	
	// 	this.selectable = this.rMSApiService.getGlobalVariable();
	// 	this.rMSApiService.buttonClickEventTrack.subscribe(event => {
		
	// 	})
	
	// 	if (this.selectable == false) {
	// 		this.showText = false;
	// 	}
	// }



	onSelect(e) {
		this.data.departureTime=e.target.value;
		this.rMSApiService.setitineraryDepatur(e.target.value);
	};

	onchange(){
		this.depatureTime.valueChanges.subscribe(data=>{
			this.data.departureTime=data;
		})
	}



	keyhandler(e) {
		//this.data.departureTime=e.target.value;
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
		

	};


	timeControl(evet) {
	
		var reg = /[0-9]/;
		var iKeyCode = (evet.which) ? evet.which : evet.keyCode
		if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
			return false;
		if (evet.target.value.length == 2 && reg.test(evet.target.value)) {
			evet.target.value = evet.target.value + ":";
		};
		if (evet.target.value.length > 4) {
			evet.target.value = evet.target.value.substr(0, evet.target.value.length - 1)
		}
	
		return true;

		
	};
	keypress(e){

		//this.data.departureTime=e.target.value;
		}

}