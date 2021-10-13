import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AffidavitDetailComponent } from './AffidavitDetailComponent';
import { SalesHistoryComponent } from './SalesHistoryComponent';
import { SalesCommentComponent } from './SalesCommentComponent';
import { NotesModalComponent } from 'common/components/NotesModal';


@Component({
	selector: 'app-saleshistoryicon',
	templateUrl: "../../../../../../../Views/Finance/Management/HistoryIcon.html",

})
export class SalesHistoryIconComponent {
	data: any;
	config = new MatDialogConfig();
	showIcon:boolean=false;
  
	constructor(private dialog: MatDialog, private rmsApiService:RMSApiService, private emitterService :EmitterService) {

	}
	
	agInit(params) {
		this.data = params.data;
		if(this.data.statusCode == 'UNRPTD'){
			this.showIcon =false;
		}else{
			this.showIcon=true;
		}

		this.emitterService.refreshNotesSales.subscribe(data=>{
			if(data == this.data.contractSalesId){
				this.data.isComment=true;

			}
		})
	};

	// /*============= itineraryHistory click on grid open popup =============*/
	historyIcon() {
		this.config.data = {
			salesId: this.data.contractSalesId,
			itineraryId: this.data.itinSequenceId,
			contractRateId: this.data.contractRateId
		}
		let dialogRef = this.dialog.open(SalesHistoryComponent, this.config);
	};

		// /*============= SalesComment click on grid open popup =============*/
		// commentIcon() {
		// 	this.config.data = {
		// 		id: this.data.contractSalesId
	
		// 	};
		// 	this.rmsApiService.setData(this.data.contractSalesId)
			
		// 	let dialogRef = this.dialog.open(SalesCommentComponent, this.config);
		// };


		commentIconAdd() {
				this.config.data = {
					salesId: this.data.contractSalesId,
					FINANCE_SALES:"FINANCE_SALES",
					View:"Add",
					title:"Sales"
		
				}
				this.rmsApiService.setData(this.data.contractSalesId)
			
			let dialogRef = this.dialog.open(NotesModalComponent, this.config);
		};
		commentIconEdit(){
		
				this.config.data = {
					salesId: this.data.contractSalesId,
					FINANCE_SALES:"FINANCE_SALES",
					View:"Edit",
					title:"Sales"
		
				};
		
		
			this.rmsApiService.setData(this.data.contractSalesId)
			
			let dialogRef = this.dialog.open(NotesModalComponent, this.config);
		}




}