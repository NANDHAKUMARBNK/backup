import { Component } from '@angular/core';
import { EmitterService } from 'common/services/emitterService';
import { FormControl, Validators } from '@angular/forms';
import { CouponBookService } from '../../Service/CouponBookService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { ActivatedRoute } from '@angular/router';
import { RMSApiService } from 'common/services/RMSApiService';

@Component({
	selector: 'app-effectivestart',
	templateUrl: '../../../../../../../Views/CouponBook/checkbox.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss']
})
export class CheckBoxComponent {
	gridApi: any;
	gridColumnApi: any;
	params: any;
	data: any;
	locationCheck = new FormControl();
	itemId: any;

	constructor(
		private emitterService: EmitterService, private rmsApiService:RMSApiService,  private couponBookService: CouponBookService, private toasterComponent: ToasterComponent,
		private route: ActivatedRoute

	) {
		this.route.params.subscribe(params => {
			this.itemId = params['id'];
		});
	}
	agInit(params) {
          
		this.data = params.data;

	};

	changecheck() {
		let checkId = this.data.id;
		if (checkId == null) {
			checkId = ''
		} else {
			checkId = this.data.id;
		}
		let GPCode='';
		this.couponBookService.saveCheckBox(checkId, this.itemId, this.data.locationId, this.locationCheck.value,GPCode).subscribe((data: any) => {
			this.emitterService.refreshChangeChecked.emit(true);
		}, error => {
			this.toasterComponent.onError(error)
		})
	}

}