import { Component } from '@angular/core';
import { EmitterService } from 'common/services/emitterService';
import { MatDialogConfig, MatDialog, } from "@angular/material";
import { CouponDatesComponent } from './CouponDatesComponent';
import { ToasterComponent } from 'common/components/ToasterComponent';

@Component({
	selector: 'app-coupongrid',
	templateUrl: '../../../../../../../Views/CouponBook/CouponGrid.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss']
})
export class CouponGridComponent {
	gridApi: any;
	gridColumnApi: any;
	params: any;
	data: any;
	config = new MatDialogConfig();

	constructor(
		private dialog: MatDialog,
		private toasterComponent: ToasterComponent

	) { };

	agInit(params) {
		this.data = params.data;
	};
	couponDates() {
		this.config.data = {
			id: this.data.id
		};
		if (this.data.isActive == false) {
			this.toasterComponent.claenderValidation();
		} else {
			let dialogRef = this.dialog.open(CouponDatesComponent, this.config);
		}
	}
}



