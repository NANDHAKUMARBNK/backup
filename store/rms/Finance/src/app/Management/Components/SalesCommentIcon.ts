import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { SalesCommentComponent } from './SalesCommentComponent';



@Component({
	selector: 'app-commenticon',
	templateUrl:  "../../../../../../../Views/Finance/Management/SalesCommentIcon.html",
	
})
export class SalesCommentIconComponent {
     data: any;
	config = new MatDialogConfig();

	constructor(private dialog: MatDialog, private rMSApiService: RMSApiService) {

	}

	agInit(params) {
		this.data = params.data;
	};

	// /*============= SalesComment click on grid open popup =============*/
	commentIcon() {
		this.config.data = {
			id: this.data.contractSalesId

		};
		this.rMSApiService.setData(this.data.contractSalesId)
		
		let dialogRef = this.dialog.open(SalesCommentComponent, this.config);
	};


}