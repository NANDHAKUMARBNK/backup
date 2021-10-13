import { Component } from '@angular/core';
import { EmitterService } from 'common/services/emitterService';
import { MatDialogConfig, MatDialog, } from "@angular/material";
import { FormControl } from '@angular/forms';
import { RMSApiService } from 'common/services/RMSApiService';



//import { Location } from '@angular/common';

@Component({
	selector: 'app-ratesgridcheck',
	templateUrl: '../../../../../../../Views/Finance/RatesGridcheck.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss']
})
export class RatesGridCheckboxComponent {
	gridApi: any;
	gridColumnApi: any;
	params: any;
	data: any;
	locationCheck = new FormControl(false);

	constructor(
		private emitterService: EmitterService,  private rMSApiService: RMSApiService
	) {}
	agInit(params) {
		this.data = params.data;
	};

	ratesGridChecked(obj, event) {
		let checkedData = this.rMSApiService.getRatesGridCheck()
		let findChecked = checkedData.find(item => item.entityId == obj.entityId);
		findChecked.isAvailable = event.target.checked;
	}
}