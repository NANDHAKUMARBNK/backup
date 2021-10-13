import { Component, ViewChild } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedDataService } from 'common/services/SharedDataService';
import { MatDatepickerInputEvent, MatDatepicker, ErrorStateMatcher } from '@angular/material';
import { PsgService } from '../../Service/PsgService';
import { NativeDateAdapter, DateAdapter } from '@angular/material';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';

const moment = _rollupMoment || _moment;

export class CustomDateAdapter extends NativeDateAdapter {
	format(date: Date, displayFormat: Object): string {
		var formatString = 'MMMM YYYY';
		return moment(date).format(formatString);
	}
};
export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
	  return !!(control && control.invalid && (control.dirty || control.touched));
	}
  }

@Component({
	selector: 'app-shipmovement',
	templateUrl: '../../../../../../../Views/Operations/ShipMovementAssignment.html',
	styles: ['../../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe, {
		provide: DateAdapter, useClass: CustomDateAdapter
	}]
})
export class ShipMovementAissgnmentComponent {
	@ViewChild(MatDatepicker) picker;

	@ViewChild(MatDatepicker) startDate;
	@ViewChild(MatDatepicker) endDate;

	startDates = new FormControl();
	endDates = new FormControl();

	shipMovementName = "PSG_SHIPMOVEMENT";
	shipMovementAssignementForm: FormGroup;
	cruiseLineId: any;
	shipId: any;
	startDateId: any;
	startDateVar: any;
	endDateId: any;
	endDateVar: any;
	roleData: any;
	shipsData: any;
	curiseLineData: any;
	nameData: any;
	embarkData: any;
	disEmbarkData: any;
	vendorAssignmentId: any;
	shipMovementEdit: any;
	cruiseLineID: string;
	effectiveBeginDate: string;
	shipIds: string;
	effectiveEndDate: string;
	startDateEdit: string;
	cruiseLineEdit: string;
	shipEdit: string;
	endDateEdit: string;
	currentDate: any;
	embarkOBJ: any;
	disembarkOBJ: any;
	embarkDateListroute: any;
	disembarkDateListroute: any;
	embarkDateListrouteId: any;
	disembarkDateListrouteId: any;
	embarkDateList: any;
	embarDateListId: any;
	disembarkDateList: any;
	disembarkDateId: any;
	currentDateTime = new Date(); 
	matcher = new MyErrorStateMatcher();


	constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private location: Location, private toasterComponent: ToasterComponent,
		public datepipe: DatePipe, private rmsApiService: RMSApiService,
		private messageService: MessageService, private sharedDataService: SharedDataService, private psgService: PsgService) {
		this.vendorAssignmentId = this.route.snapshot.paramMap.get('vendorAssignmentId');
		this.cruiseLineID = this.route.snapshot.paramMap.get('cruiseLineID');
		this.effectiveBeginDate = this.route.snapshot.paramMap.get('effectiveBeginDate');
		this.shipIds = this.route.snapshot.paramMap.get('shipID');
		this.effectiveEndDate = this.route.snapshot.paramMap.get('effectiveEndDate');
		this.embarkDateListroute = this.route.snapshot.paramMap.get('embarkdate');
		this.disembarkDateListroute = this.route.snapshot.paramMap.get('disembark');
		this.embarkDateListrouteId = this.route.snapshot.paramMap.get('embarkId');
		this.disembarkDateListrouteId = this.route.snapshot.paramMap.get('disembarId');
	}

	ngOnInit() {
		//this.currentDate  =moment(new Date()).add(2, 'hours').format('YYYY-MM-DD hh:mm:ss');
		let date = new Date()
		this.currentDate = new Date(date.getFullYear(), date.getMonth(), 1)
		this.shipMovementAssignementForm = this.fb.group({
			vendorId: ['', Validators.required],
			cruiseLineId: ['', Validators.required],
			shipId: ['', Validators.required],
			roleTypeCode: ['', Validators.required],
			effectivestartDate: ['', Validators.required],
			effectiveEndDate: ['', Validators.required],
			embarkDate: ['', Validators.required],
			disembarkDate: ['', Validators.required]
		});
	
		this.getRole();
		this.getName();
		this.getCuriseLine();
		
	

		if (this.vendorAssignmentId) {
			this.GetShips();
			this.startDateEdit = this.datepipe.transform(this.effectiveBeginDate, 'yyyy-MM-dd');;
			this.cruiseLineEdit = this.cruiseLineID;
			this.shipEdit = this.shipIds
			this.endDateEdit = this.effectiveEndDate
			this.sharedDataService.getembarkdateShipMovement(this.shipEdit, this.cruiseLineEdit, this.startDateEdit).subscribe((data: any) => {
				this.embarkData = data;
			});

			this.sharedDataService.getdisEmbarkShipMovement(this.shipEdit, this.cruiseLineEdit, this.endDateEdit).subscribe((data: any) => {
				data.forEach(element => {
					element['should_dis'] = false;
				});
				this.disEmbarkData = data;
			});
			this.getShipMovementId();
			

		}else{
			this.GetShips();
		}

		


	};


	hasError(controlName: string, errorName: string) {
		return this.shipMovementAssignementForm.controls[controlName].hasError(errorName);
	};


	getShipMovementId() {
		this.rmsApiService.showLoader(true);
		this.psgService.getShipMovementId(this.vendorAssignmentId).subscribe((data: any) => {
			this.shipMovementEdit = data;
			this.sDate=this.shipMovementEdit.effectiveBeginDate;
			this.shipMovementAssignementForm.patchValue({
				vendorId: this.shipMovementEdit.vendorID,
				cruiseLineId: this.shipMovementEdit.cruiseLineID,
				shipId: this.shipMovementEdit.shipID,
				effectivestartDate: new Date(this.shipMovementEdit.effectiveBeginDate),
				effectiveEndDate:  new Date(this.shipMovementEdit.effectiveEndDate),
				embarkDate: this.shipMovementEdit.embarkItinerarySequenceID,
				disembarkDate: this.shipMovementEdit.disembarkItinerarySequenceID,
				roleTypeCode: this.shipMovementEdit.roleTypeID,
			})
			this.rmsApiService.showLoader(false);
			if(this.disEmbarkData){
				this.disEmbarkData.forEach(element => {
					if (this.shipMovementEdit.effectiveBeginDate >= element.arrivalDateTime)
						element['should_dis'] = true;
						//this.emitterService.refreshdebarkData.emit(true)
				});
			}
			
		},
		error=>{
			this.rmsApiService.showLoader(false);
			this.router.navigateByUrl('/Error')
		}
		)
	};
	sDate: any;
	monthSelected(params, datepicker) {

		this.shipMovementAssignementForm.controls['effectivestartDate'].setValue(params)

		datepicker.close();

		

		this.sDate = this.shipMovementAssignementForm.get('effectivestartDate').value;
		this.startDateVar = this.datepipe.transform(this.sDate, 'yyyy-MM-dd');
		this.cruiseLineId = this.shipMovementAssignementForm.get('cruiseLineId').value;
		this.shipId = this.shipMovementAssignementForm.get('shipId').value;
		if(this.shipMovementAssignementForm.get('cruiseLineId').invalid ||this.shipMovementAssignementForm.get('shipId').invalid ){
			this.shipMovementAssignementForm.get('cruiseLineId').markAsUntouched();
			this.shipMovementAssignementForm.get('cruiseLineId').markAsDirty();
			this.shipMovementAssignementForm.get('shipId').markAsUntouched();
			this.shipMovementAssignementForm.get('shipId').markAsDirty();
			return
		};
		this.sharedDataService.getembarkdateShipMovement(this.shipId, this.cruiseLineId, this.startDateVar).subscribe((data: any) => {
			this.embarkData = data;
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);

	};
	monthSelectedlast(e, datepicker) {
	
		this.shipMovementAssignementForm.controls['effectiveEndDate'].setValue(e);
		datepicker.close();


		var eDate = this.shipMovementAssignementForm.get('effectiveEndDate').value;
		this.endDateVar = this.datepipe.transform(eDate, 'yyyy-MM-dd');
		this.cruiseLineId = this.shipMovementAssignementForm.get('cruiseLineId').value;
		this.shipId = this.shipMovementAssignementForm.get('shipId').value;
		if(this.shipMovementAssignementForm.get('cruiseLineId').invalid ||this.shipMovementAssignementForm.get('shipId').invalid ){
			this.shipMovementAssignementForm.get('cruiseLineId').markAsUntouched();
			this.shipMovementAssignementForm.get('cruiseLineId').markAsDirty();
			this.shipMovementAssignementForm.get('shipId').markAsUntouched();
			this.shipMovementAssignementForm.get('shipId').markAsDirty();
			return
		};
	
		this.sharedDataService.getdisEmbarkShipMovement(this.shipId, this.cruiseLineId, this.endDateVar).subscribe((data: any) => {
			data.forEach(element => {
				element['should_dis'] = false;
			});

			this.disEmbarkData = data;
			if(this.shipMovementAssignementForm.get('embarkDate').value){
				let embarkdatedcass=this.shipMovementAssignementForm.get('embarkDate').value;
				let embarkOBJ = this.embarkData.find(data => data.id == embarkdatedcass);
				if(embarkOBJ){
					this.disEmbarkData.forEach(element => {
						if (embarkOBJ.arrivalDateTime >= element.arrivalDateTime)
							element['should_dis'] = true;
							else
							element['should_dis'] = false;
							//this.emitterService.refreshdebarkData.emit(true)
					});
				 }
			}
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	};


	shipclcik(){
		if(this.shipMovementAssignementForm.get('effectiveEndDate').value){
          this.getDembarkEnd();
		}
		if(this.shipMovementAssignementForm.get('effectivestartDate').value){
          this.getEmbarkStart();
		}
	};

	getEmbarkStart(){
		this.sDate = this.shipMovementAssignementForm.get('effectivestartDate').value;
		this.startDateVar = this.datepipe.transform(this.sDate, 'yyyy-MM-dd');
		this.cruiseLineId = this.shipMovementAssignementForm.get('cruiseLineId').value;
		this.shipId = this.shipMovementAssignementForm.get('shipId').value;
		this.sharedDataService.getembarkdateShipMovement(this.shipId, this.cruiseLineId, this.startDateVar).subscribe((data: any) => {
			this.embarkData = data;
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	};

	getDembarkEnd(){
		var eDate = this.shipMovementAssignementForm.get('effectiveEndDate').value;
		this.endDateVar = this.datepipe.transform(eDate, 'yyyy-MM-dd');
		this.cruiseLineId = this.shipMovementAssignementForm.get('cruiseLineId').value;
		this.shipId = this.shipMovementAssignementForm.get('shipId').value;

		this.sharedDataService.getdisEmbarkShipMovement(this.shipId, this.cruiseLineId, this.endDateVar).subscribe((data: any) => {
			data.forEach(element => {
				element['should_dis'] = false;
			});

			this.disEmbarkData = data;
			if(this.shipMovementAssignementForm.get('embarkDate').value){
				let embarkdatedcass=this.shipMovementAssignementForm.get('embarkDate').value;
				let embarkOBJ = this.embarkData.find(data => data.id == embarkdatedcass);
				if(embarkOBJ){
					this.disEmbarkData.forEach(element => {
						if (embarkOBJ.arrivalDateTime >= element.arrivalDateTime)
							element['should_dis'] = true;
							else
							element['should_dis'] = false;
							//this.emitterService.refreshdebarkData.emit(true)
					});
				 }
			}
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	}


	monthSelectedpicker(params) {
		//this.date.setValue(params);
		this.picker.close();
	}

	embarkdates(e) {
		this.embarkOBJ = this.embarkData.find(data => data.id == e.value);
		this.disEmbarkData.forEach(element => {
			if (this.embarkOBJ.arrivalDateTime >= element.arrivalDateTime)
				element['should_dis'] = true;
				else
				element['should_dis'] = false;
				//this.emitterService.refreshdebarkData.emit(true)
				
		});



	};
	disembarkdates(e) {
		this.disembarkOBJ = this.disEmbarkData.find(data => data.id == e.value);

	}

	getName() {
		this.sharedDataService.getName().subscribe((data: any) => {
			this.nameData = data.items
		},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	}
	getCuriseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.curiseLineData = data;
			this.curiseLineData.forEach(item => {
				if (item.isDefault == true) {
					this.shipMovementAssignementForm.patchValue({
						CruiseLineId: item.id
					});
				}
			});
			this.GetShips()
		},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	};

	GetShips() {
		this.cruiseLineId = this.shipMovementAssignementForm.get('cruiseLineId').value,
		this.sharedDataService.getShipList(this.cruiseLineId).subscribe((data: any) => {
				this.shipsData = data
			},
				error => {
					this.toasterComponent.onError(error);
				}
			)
	};

	//Get Role
	getRole() {
		this.sharedDataService.getShipMovementRole().subscribe((data: any) => {
			this.roleData = data.items
		},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	}



	saveShipMovement() {
		if (this.shipMovementAssignementForm.invalid) {
			this.shipMovementAssignementForm.get('cruiseLineId').markAsUntouched();
			this.shipMovementAssignementForm.get('cruiseLineId').markAsDirty();
			this.shipMovementAssignementForm.get('shipId').markAsUntouched();
			this.shipMovementAssignementForm.get('shipId').markAsDirty();
			return;
		}
		const reqData = {
			vendorId: this.shipMovementAssignementForm.get('vendorId').value,
			cruiseLineId: this.cruiseLineId,
			shipId: this.shipId,
			//effectiveBeginDate: this.startDateVar,
			//effectiveEndDate: this.endDateVar,
			effectiveBeginDate: this.embarkOBJ.arrivalDateTime,
			effectiveEndDate: this.disembarkOBJ.departureDateTime,
			embarkItinerarySequenceId: this.embarkOBJ.id,
			disembarkItinerarySequenceId: this.disembarkOBJ.id,
			roleTypeId: this.shipMovementAssignementForm.get('roleTypeCode').value,
		};
		this.rmsApiService.showLoader(true);

		this.psgService.saveAddShipMovement(this.shipId, reqData).subscribe(
			(data: any) => {
				this.toasterComponent.onSucess();
				this.router.navigateByUrl('/ShipMovement')
			},
			error => {
				this.rmsApiService.setData(error);
				this.rmsApiService.showLoader(false);
				this.router.navigateByUrl('/Error')

			}
		)
	};

	updateShipMovement() {
		if (this.shipMovementAssignementForm.invalid) {
			this.shipMovementAssignementForm.get('cruiseLineId').markAsUntouched();
			this.shipMovementAssignementForm.get('cruiseLineId').markAsDirty();
			this.shipMovementAssignementForm.get('shipId').markAsUntouched();
			this.shipMovementAssignementForm.get('shipId').markAsDirty();
			return;
		}
		var sDate = this.shipMovementAssignementForm.get('effectivestartDate').value;
		var finalSDate = this.datepipe.transform(sDate, 'yyyy-MM-dd');

		var eDate = this.shipMovementAssignementForm.get('effectiveEndDate').value;
		var finalEDate = this.datepipe.transform(eDate, 'yyyy-MM-dd');
		var sId = this.shipMovementAssignementForm.get('shipId').value;

		if (this.embarkOBJ == undefined) {
			this.embarkDateList = this.embarkDateListroute;
			this.embarDateListId = this.embarkDateListrouteId;
		} else {
			this.embarkDateList = this.embarkOBJ.arrivalDateTime;
			this.embarDateListId = this.embarkOBJ.id
		}

		if (this.disembarkOBJ == undefined) {
			this.disembarkDateList = this.disembarkDateListroute;
			this.disembarkDateId = this.disembarkDateListrouteId
		} else {
			this.disembarkDateList = this.disembarkOBJ.departureDateTime;
			this.disembarkDateId = this.disembarkOBJ.id
		}

		const reqData = {
			vendorId: this.shipMovementAssignementForm.get('vendorId').value,
			cruiseLineId: this.shipMovementAssignementForm.get('cruiseLineId').value,
			shipId: this.shipMovementAssignementForm.get('shipId').value,
			effectiveBeginDate: this.embarkDateList,
			effectiveEndDate: this.disembarkDateList,
			embarkItinerarySequenceId: this.embarDateListId,
			disembarkItinerarySequenceId: this.disembarkDateId,
			roleTypeId: this.shipMovementAssignementForm.get('roleTypeCode').value,
		};
		this.rmsApiService.showLoader(true);
		this.psgService.UpdateShipMovement(this.vendorAssignmentId, sId, reqData).subscribe((data: any) => {
			this.toasterComponent.onSucess();
			this.router.navigateByUrl('/ShipMovement')
		},
			error => {
				this.rmsApiService.setData(error);
				this.rmsApiService.showLoader(false);
				this.router.navigateByUrl('/Error')

			}
		)
	}

	backpage() {
		this.router.navigateByUrl('/ShipMovement')
	};

	startDateEvent(event){
  this.sDate=event.value;
	}
}