import { Component, OnDestroy, OnInit, ViewEncapsulation, Input, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { PsgService } from '../../Service/PsgService';
import { SharedDataService } from 'common/services/SharedDataService';
import { MatDialog, MatDialogConfig, MatDatepickerInputEvent, ErrorStateMatcher } from '@angular/material';
import { ConfirmStatusComponent } from 'common/components/ConfirmStatusComponent';
import { NativeDateAdapter, DateAdapter, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { filter } from 'rxjs/operators';
import { EmitterService } from 'common/services/emitterService';

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
	selector: 'app-shipassignment',
	templateUrl: '../../../../../../../Views/Operations/ShipAssignment.html',
	styleUrls: ['../../../styles/PsgList.scss'],
	providers: [DatePipe, {
		provide: DateAdapter, useClass: CustomDateAdapter
	}]
})
export class ShipAssignmentComponent {
	@ViewChild(MatDatepicker) startDate;
	@ViewChild(MatDatepicker) endDate;

	id: any;
	config = new MatDialogConfig();
	shipAssignementForm: FormGroup;
	CuriseLine: any;
	cruiseLineId: any;
	shipsData: any;
	vendorId: string;
	shipAssignement: any;
	section: string;
	role: any;
	ship: string = "PSG_SHIP"
	embarkDate: any;
	disembarkDate: any;
	myDate: Date;
	embarkData: any;
	disembarkData: any;
	roleTypeCode: any;
	shipID: string;
	someDateVar: string;
	startDateVar: any;
	endDateVar: any;
	embark: any;
	disembark: any;
	diffInHours: any;
	addDateAndTotalContract: any;
	shipName: string;
	cruiseLineID: any;
	effectiveBeginDate: any;
	startDateEdit: any;
	shipIds: any;
	cruiseLineEdit: any;
	shipEdit: any;
	effectiveEndDate: string;
	endDateEdit: string;
	currentDate: any;
	minEndMonth: any;
	startMonthSelect: any;
	endMonthSelect: any;
	embarkOBJ: any;
	disembarkOBJ: any;
	embarkDateList: any;
	disembarkDateList: any;
	embarkDateListroute: any;
	disembarkDateListroute: any;
	embarkDateListrouteId: string;
	disembarkDateListrouteId: string;
	embarDateListId: string;
	disembarkDateId: string;
	submitted = false;
	checkShip:boolean=false;
	errorMessage: boolean=false;
	matcher = new MyErrorStateMatcher();
	CruiseLineerrorMessage:boolean=false;




	constructor(private router: Router, private fb: FormBuilder,
		private dialog: MatDialog,
		private emitterService: EmitterService,
		private location: Location, private messageService: MessageService,
		private service: PsgService,
		private sharedDataService: SharedDataService,
		public datepipe: DatePipe,
		private rMSApiService: RMSApiService,
		private toasterComponent: ToasterComponent,
		private route: ActivatedRoute) {
		this.id = this.route.snapshot.paramMap.get('vendorAssignmentId')
		this.vendorId = this.route.snapshot.paramMap.get('vendorId');
		this.cruiseLineID = this.route.snapshot.paramMap.get('cruiseLineID');
		this.effectiveBeginDate = this.route.snapshot.paramMap.get('effectiveBeginDate');
		this.shipIds = this.route.snapshot.paramMap.get('shipId');
		this.effectiveEndDate = this.route.snapshot.paramMap.get('effectiveEndDate');
		this.embarkDateListroute = this.route.snapshot.paramMap.get('embarkdate');
		this.disembarkDateListroute = this.route.snapshot.paramMap.get('disembark');
		this.embarkDateListrouteId = this.route.snapshot.paramMap.get('embarkId');
		this.disembarkDateListrouteId = this.route.snapshot.paramMap.get('disembarId');


	}

	ngOnInit() {
		let date = new Date()
		this.currentDate = new Date(date.getFullYear(), date.getMonth(), 1)
		this.shipAssignementForm = this.fb.group({
			CruiseLineId: ['', Validators.required],
			ship: ['', Validators.required],
			effectivestartDate: ['', Validators.required],
			effectiveEndDate: ['', Validators.required],
			embarkDate: ['', Validators.required],
			disembarkDate: ['', Validators.required],
			Role: ['', Validators.required],
		})
		this.getCuriseLine();
		this.GetShips();
		this.getRole();
		if (this.id) {
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
				this.disembarkData = data;
			});

		}





		this.myDate = new Date();

		this.getShipAssignmentId();

	}
	hasError(controlName: string, errorName: string) {
		return this.shipAssignementForm.controls[controlName].hasError(errorName);
	};


	editselectedDebark() {

	}
	//Pervious Page
	backpage() {
		this.location.back()
	}
	//Get ShipAssignmentId
	getShipAssignmentId() {
		if (this.id) {
			this.rMSApiService.showLoader(true);
			this.service.getShipAssignmentId(this.vendorId, this.id).subscribe((data: any) => {
				this.shipAssignement = data;
				//let dt1 = moment(this.shipAssignement.effectiveBeginDate).format('MMMM YYYY')
				var Day = 24 * 60 * 60 * 1000;
				let diffIn: any = Date.parse(this.shipAssignement.embarkDateTime) - Date.parse(this.shipAssignement.disembarkDateTime);
				this.diffInHours = Math.round(Math.abs((diffIn) / (Day)));

				if (this.diffInHours) {
					this.addDateAndTotalContract = this.diffInHours + this.shipAssignement.totalContractDays;
				}
				if (this.disembarkData) {
					this.disembarkData.forEach(element => {
						if (this.shipAssignement.embarkDateTime >= element.arrivalDateTime)
							element['should_dis'] = true;
					});
				}

				this.shipAssignementForm.patchValue({
					CruiseLineId: this.shipAssignement.cruiseLineID,
					ship: this.shipAssignement.shipID,
					effectivestartDate: new Date(this.shipAssignement.effectiveBeginDate),
					effectiveEndDate: new Date(this.shipAssignement.effectiveEndDate),
					embarkDate: this.shipAssignement.embarkItinerarySequenceID,
					disembarkDate: this.shipAssignement.disembarkItinerarySequenceID,
					Role: this.shipAssignement.roleTypeID,
				});
				this.rMSApiService.showLoader(false);
				this.shipName = this.shipAssignement.shipID;
			},
				error => {
					this.rMSApiService.showLoader(false);
					this.router.navigateByUrl('/Error');
				}
			)
		}
	};
	//GetCuriseLine
	getCuriseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.CuriseLine = data;

			this.CuriseLine.forEach(item=>{
				if(item.isDefault ==true){
					this.shipAssignementForm.patchValue({
						CruiseLineId: item.id
					});
				}
			})

			this.GetShips()
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};

	//GetShips
	GetShips() {
		this.cruiseLineId = this.shipAssignementForm.get('CruiseLineId').value,
			this.service.getShipsMovement(this.cruiseLineId).subscribe((data: any) => {
				this.shipsData = data
			},
				error => {
					this.toasterComponent.onError(error)
				}
			);
	};

	shipError(){
		this.errorMessage=false;
		if(this.shipAssignementForm.get('effectivestartDate').value){
         this.getEmbarkStart();
		};
		if(this.shipAssignementForm.get('effectiveEndDate').value){
			this.getDebarkEnd();
		}

	};


	getEmbarkStart(){
		var sDate = this.shipAssignementForm.get('effectivestartDate').value;
		this.startDateVar = this.datepipe.transform(sDate, 'yyyy-MM-dd');
		this.cruiseLineId = this.shipAssignementForm.get('CruiseLineId').value;
		this.shipID = this.shipAssignementForm.get('ship').value;
		this.sharedDataService.getembarkdateShipMovement(this.shipID, this.cruiseLineId, this.startDateVar).subscribe((data: any) => {
			this.embarkData = data;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	};

	getDebarkEnd(){
		var eDate = this.shipAssignementForm.get('effectiveEndDate').value;
		this.endDateVar = this.datepipe.transform(eDate, 'yyyy-MM-dd');
		this.cruiseLineId = this.shipAssignementForm.get('CruiseLineId').value;
		this.shipID = this.shipAssignementForm.get('ship').value;

		this.sharedDataService.getdisEmbarkShipMovement(this.shipID, this.cruiseLineId, this.endDateVar).subscribe((data: any) => {
			data.forEach(element => {
				element['should_dis'] = false;
			});

			this.disembarkData = data;
			if (this.shipAssignementForm.get('embarkDate').value) {
				let embarkdatedcass = this.shipAssignementForm.get('embarkDate').value;
				let embarkOBJ = this.embarkData.find(data => data.id == embarkdatedcass);
				if (embarkOBJ) {
					this.disembarkData.forEach(element => {
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
				this.toasterComponent.onError(error)
			}
		);
	}


	monthSelected(params, datepicker) {
		this.checkShip=true;
		this.shipAssignementForm.controls['effectivestartDate'].setValue(params);
		datepicker.close();
		var sDate = this.shipAssignementForm.get('effectivestartDate').value;
		this.startDateVar = this.datepipe.transform(sDate, 'yyyy-MM-dd');
		this.cruiseLineId = this.shipAssignementForm.get('CruiseLineId').value;
		this.shipID = this.shipAssignementForm.get('ship').value;
	
			if(this.shipAssignementForm.get('CruiseLineId').invalid || this.shipAssignementForm.get('ship').invalid){
				this.CruiseLineerrorMessage=true;
				this.shipAssignementForm.get('CruiseLineId').markAsUntouched();
				this.shipAssignementForm.get('CruiseLineId').markAsDirty();
				this.shipAssignementForm.get('ship').markAsUntouched();
				this.shipAssignementForm.get('ship').markAsDirty();
				return
			};
			// if(this.shipAssignementForm.get('ship').invalid ){
			// 	this.errorMessage=true;
			// 	this.shipAssignementForm.get('ship').markAsUntouched();
			// 	this.shipAssignementForm.get('ship').markAsDirty();
			// 	return
			// };
			this.errorMessage=false;
			this.CruiseLineerrorMessage=false;
			this.sharedDataService.getembarkdateShipMovement(this.shipID, this.cruiseLineId, this.startDateVar).subscribe((data: any) => {
				this.embarkData = data;
			},
				error => {
					this.toasterComponent.onError(error)
				}
			);
		//}

	};

	monthSelectedlast(params, datepicker) {
		this.shipAssignementForm.controls['effectiveEndDate'].setValue(params);
		datepicker.close();
		var eDate = this.shipAssignementForm.get('effectiveEndDate').value;
		this.endDateVar = this.datepipe.transform(eDate, 'yyyy-MM-dd');
		this.cruiseLineId = this.shipAssignementForm.get('CruiseLineId').value;
		this.shipID = this.shipAssignementForm.get('ship').value;
	
		if(this.shipAssignementForm.get('CruiseLineId').invalid || this.shipAssignementForm.get('ship').invalid){
			this.CruiseLineerrorMessage=true;
			this.shipAssignementForm.get('CruiseLineId').markAsUntouched();
			this.shipAssignementForm.get('CruiseLineId').markAsDirty();
			this.shipAssignementForm.get('ship').markAsUntouched();
			this.shipAssignementForm.get('ship').markAsDirty();
			return
		};
		// if(this.shipAssignementForm.get('ship').invalid ){
		// 	this.errorMessage=true;
		// 	this.shipAssignementForm.get('ship').markAsUntouched();
		// 	this.shipAssignementForm.get('ship').markAsDirty();
		// 	return
		// };
		this.errorMessage=false;
		this.CruiseLineerrorMessage=false;
			this.sharedDataService.getdisEmbarkShipMovement(this.shipID, this.cruiseLineId, this.endDateVar).subscribe((data: any) => {
				data.forEach(element => {
					element['should_dis'] = false;
				});

				this.disembarkData = data;
				if (this.shipAssignementForm.get('embarkDate').value) {
					let embarkdatedcass = this.shipAssignementForm.get('embarkDate').value;
					let embarkOBJ = this.embarkData.find(data => data.id == embarkdatedcass);
					if (embarkOBJ) {
						this.disembarkData.forEach(element => {
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
				this.toasterComponent.onError(error)
			}
		);
	};

// convenience getter for easy access to form fields
get f() { return this.shipAssignementForm.controls; }



	compareDates(e) {
		this.disembarkOBJ = this.disembarkData.find(data => data.id == e.value);
		this.embark = this.shipAssignementForm.get('embarkDate').value;
		let slectedObj = this.embarkData.find(item => item.id == this.embark);
		let Edate;
		if (slectedObj) {
			Edate = slectedObj.arrivalDateTime;
		}
		this.disembark = this.shipAssignementForm.get('disembarkDate');
		let Ddate;
		if (this.disembarkOBJ) {
			Ddate = this.disembarkOBJ.departureDateTime;
		};

		var oneDay = 24 * 60 * 60 * 1000;
		let diffInMs: any = Date.parse(Edate) - Date.parse(Ddate);
		let diffInHours: any = diffInMs / 24 / 60 / 60 / 1000
		var diffDays = Math.round(Math.abs((Edate - Ddate) / (oneDay))); 0;
		this.diffInHours = Math.round(Math.abs((diffInMs) / (oneDay)));

		if (this.shipAssignement) {
			this.addDateAndTotalContract = this.diffInHours + this.shipAssignement.totalContractDays;
		}


	}
	//Get Role
	getRole() {
		this.section = "PSG"
		this.sharedDataService.getRole().subscribe((data: any) => {
			this.role = data.items
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};



	dates(e) {
		this.embarkOBJ = this.embarkData.find(data => data.id == e.value);
		this.embark = this.shipAssignementForm.get('embarkDate');
		let Edate
		if (this.embarkOBJ) {
			Edate = this.embarkOBJ.arrivalDateTime;
		}

		this.disembark = this.shipAssignementForm.get('disembarkDate').value;
		let disemBarkObj = this.disembarkData.find(item => item.id == this.disembark)
		let Ddate;
		if (disemBarkObj) {
			Ddate = disemBarkObj.departureDateTime;
		}

		var oneDay = 24 * 60 * 60 * 1000;

		let diffInMs: any = Date.parse(Edate) - Date.parse(Ddate);
		let diffInHours: any = diffInMs / 24 / 60 / 60 / 1000
		var diffDays = Math.round(Math.abs((Edate - Ddate) / (oneDay))); 0;
		this.diffInHours = Math.round(Math.abs((diffInMs) / (oneDay)));
		this.disembarkData.forEach(element => {
			if (Edate >= element.arrivalDateTime)
				element['should_dis'] = true;
			else
				element['should_dis'] = false;
			//this.emitterService.refreshdebarkData.emit(true)
		});
		if (this.shipAssignement) {
			this.addDateAndTotalContract = this.diffInHours + this.shipAssignement.totalContractDays;
		}
	}

	//Cancel click navigate to PSGList
	cancel() {
		this.location.back()
		//this.router.navigateByUrl('/PSG')
	}

	//Update Click pass model shipID,venderShipmentId,vendorId,roleTypeCode,effectiveBeginDate,effectiveEndDate
	//Check conditon response is true open Popup
	updateClick() {
		this.errorMessage = false;
		this.CruiseLineerrorMessage=false;

		if (this.shipAssignementForm.invalid) {
			this.shipAssignementForm.get('CruiseLineId').markAsUntouched();
			this.shipAssignementForm.get('CruiseLineId').markAsDirty();
			this.shipAssignementForm.get('ship').markAsUntouched();
			this.shipAssignementForm.get('ship').markAsDirty();
			return;
		
		}

		this.rMSApiService.showLoader(true);
		var sDate = this.shipAssignementForm.get('effectivestartDate').value;
		var finalSDate = this.datepipe.transform(sDate, 'yyyy-MM-dd');

		var eDate = this.shipAssignementForm.get('effectiveEndDate').value;
		var finalEDate = this.datepipe.transform(eDate, 'yyyy-MM-dd');
		let ShipID = this.shipAssignementForm.get('ship').value;
		let EMdate = this.shipAssignementForm.get('embarkDate').value;
		let Ddates = this.shipAssignementForm.get('disembarkDate').value;


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
			vendorId: this.vendorId,
			cruiseLineId: this.shipAssignementForm.get('CruiseLineId').value,
			shipId: this.shipAssignementForm.get('ship').value,
			//effectiveBeginDate: finalSDate,
			//effectiveEndDate: finalEDate,
			//embarkItinerarySequenceId: EmbarkDates.id,
			effectiveBeginDate: this.embarkDateList,

			//disembarkItinerarySequenceId: Debark.id,
			effectiveEndDate: this.disembarkDateList
			//roleTypeId: this.shipAssignementForm.get('Role').value,

		};

		const secondReqData = {
			vendorId: this.vendorId,
			cruiseLineId: this.cruiseLineId,
			shipId: this.shipAssignementForm.get('ship').value,
			effectiveBeginDate: moment(this.embarkDateList).format('YYYY-MM-DD'),
			effectiveEndDate: this.disembarkDateList,
			embarkItinerarySequenceId: this.embarDateListId,
			disembarkItinerarySequenceId: this.disembarkDateId,
			roleTypeId: this.shipAssignementForm.get('Role').value,
		}
		this.errorMessage=false;
		this.service.updateShipAssignment(this.id, ShipID, secondReqData).subscribe(
			(data: any) => {
				this.rMSApiService.showLoader(false);
				//this.service.updateShipAssignment(this.id, ShipID, reqData).subscribe((result) => {
				//this.rMSApiService.showLoader(false);

				//})
				if (data == true) {
					this.config.data = {
						statusId: this.shipAssignement.statusID,
						StatusName: this.shipAssignement.statusName,
						vendorID: this.shipAssignement.vendorID
					}

					let dialogRef = this.dialog.open(ConfirmStatusComponent, this.config);
				} else {
					this.location.back()

				}
			},
			error => {
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);
				this.router.navigateByUrl('/Error');
			}

		);

	}
	//Submit Click pass model shipID,vendorId,roleTypeCode,effectiveBeginDate,effectiveEndDate
	submitClick() {
		this.errorMessage = false;
		this.CruiseLineerrorMessage=false;
		if (this.shipAssignementForm.invalid) {
			this.shipAssignementForm.get('ship').markAsUntouched();
			this.shipAssignementForm.get('ship').markAsDirty();
			this.shipAssignementForm.get('CruiseLineId').markAsUntouched();
			this.shipAssignementForm.get('CruiseLineId').markAsDirty();
			return;
		}
		let ShipID = this.shipAssignementForm.get('ship').value;
		this.rMSApiService.showLoader(true);
		const reqData = {
			vendorId: this.vendorId,
			shipId: this.shipAssignementForm.get('ship').value,
			effectiveBeginDate: this.embarkOBJ.arrivalDateTime,
			effectiveEndDate: this.disembarkOBJ.departureDateTime
		};

		const secondReqData = {
			vendorId: this.vendorId,
			cruiseLineId: this.cruiseLineId,
			shipId: this.shipAssignementForm.get('ship').value,
			effectiveBeginDate: this.embarkOBJ.arrivalDateTime,
			effectiveEndDate: this.disembarkOBJ.departureDateTime,
			embarkItinerarySequenceId: this.embarkOBJ.id,
			disembarkItinerarySequenceId: this.disembarkOBJ.id,
			roleTypeId: this.shipAssignementForm.get('Role').value,
		}
		this.errorMessage=false;
		this.service.saveShipAssignment(this.shipID, secondReqData).subscribe(
			(data: any) => {
				this.rMSApiService.showLoader(false);
				this.location.back()
			},
			error => {
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);
				this.router.navigateByUrl('/Error');
			}
		)

	}

	findStartMonth(date) {
		this.minEndMonth = date;
	}
}