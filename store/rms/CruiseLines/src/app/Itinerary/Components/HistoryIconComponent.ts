import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { ItineraryHistoryComponent } from './ItineraryHistoryComponent';

@Component({
	selector: 'app-historyicon',
	templateUrl: '../../../../../../../Views/CruiseLines/ItineraryHistoryIcon.html',
	//styleUrls: ['../../../styles/PsgList.scss', '../../../../../../common/styles/AgGrid.scss']
})
export class HistoryIconComponent {
	data: any;
	config = new MatDialogConfig();

	constructor(private dialog: MatDialog) {

	}

	agInit(params) {

		this.data = params.data;
		
	};

	/*============= itineraryHistory click on grid open popup =============*/
	itineraryHistory() {
		this.config.data = {
			id: this.data.id
		}
		let dialogRef = this.dialog.open(ItineraryHistoryComponent, this.config);
	};


}