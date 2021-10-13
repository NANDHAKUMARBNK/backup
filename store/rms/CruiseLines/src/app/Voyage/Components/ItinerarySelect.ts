import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { CruiseLineService } from '../../Service/CruiseLineService';


@Component({
	selector: 'app-historyicon',
	templateUrl: '../../../../../../../Views/CruiseLines/ItinerarySelect.html',
	//styleUrls: ['../../../styles/PsgList.scss', '../../../../../../common/styles/AgGrid.scss']
})
export class ItinerarySelectComponent {
	data: any;
	locationData: any;
	PortName: any;
	locationId = new FormControl('');
	loading:boolean=true;
	location:any

	constructor(private cruiseLineService: CruiseLineService, private emitterService: EmitterService, private rMSApiService: RMSApiService) {

	}


	agInit(params) {
		this.data = params.data;
	};


	ngOnInit() {
		// this.emitterService.refreshvoyagesSelect.subscribe(data=>{
		// 	this.loading=false;
		// 	this.locationData=data;

		// });
		// this.location=this.locationData;
		this.locationData=this.rMSApiService.getIntiSelect();
		// if(this.location){
		// 	this.loading=false;
		//  }
		this.PortName = this.data.portName;
		this.PortName=this.data.name;
		this.locationId.patchValue(this.data.portId);
	

		this.rMSApiService.buttonClickEventTrack.subscribe(event => {
			if (event === this.data.id) {
				this.data.isShowText = false;
			}
		})
	}


	// getLocation() {
	// 	this.cruiseLineService.getLocation().subscribe((data: any) => {
	// 		this.locationData = data;
	// 	})
	// };

	changeSlection() {
		this.locationId.value;
		this.data.portId=this.locationId.value;
		this.rMSApiService.setitinerarySelect(this.locationId.value)
		
	}
}