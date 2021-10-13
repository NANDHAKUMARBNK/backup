import { Component, ViewChild, Directive } from '@angular/core';
// import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SharedDataService } from 'common/services/SharedDataService';
import { RMSApiService } from 'common/services/RMSApiService';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { NativeDateAdapter, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { DatePipe } from '@angular/common';
import { parse } from 'querystring';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { EmitterService } from "common/services/emitterService";
import { RMSMomentDateAdapter } from 'common/adapter/RMSMomentDateAdapter';
import { CustomValidatorService } from 'common/CustomValidation/CustomValidatorService';
import { DatesValidation } from 'common/components/CustomDatesValidation';

const moment = _rollupMoment || _moment;

export const MY_CUSTOM_YEAR = {
	parse: {
		dateInput: 'YYYY',
	},
	display: {
		dateInput: 'YYYY',
		monthYearLabel: 'YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'YYYY',
	},
};

export const MY_FORMATS = {
	parse: {
		dateInput: 'MM/DD/YY',
	},
	display: {
		dateInput: 'MM/DD/YY',
		monthYearLabel: 'MMM YYYY'
	},
};



export class CustomDateAdapter extends NativeDateAdapter {
	format(date: Date, displayFormat: string): string {
	
		return moment(date).format(displayFormat);
	}
}






@Component({
	selector: 'app-profiledetail',
	templateUrl: '../../../../../../../Views/CruiseLines/ProfileDetail.html',
	styleUrls: ['../../../styles/cruiseLine.scss'],
	providers: [DatePipe,
		//{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},


		//{provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
		{ provide: MAT_DATE_FORMATS, useValue: MY_CUSTOM_YEAR },
		{
			provide: DateAdapter, useClass: RMSMomentDateAdapter
		},
		
			CustomValidatorService
		
	]
})


export class ProfileDetailComponent {
	// title = 'CruiseLines';
	shipProfileForm: FormGroup;
	status: any;
	profileData: any;
	ShipId: any;
	emailRegEx = /^.{1,}@.{2,}\..{2,}/
	//public allowedRegex = '^[a-zA-Z0-9_ ]*$';
	datainService = new FormControl(moment());
	yearbuilt = new FormControl(moment());

	@ViewChild(MatDatepicker) yearBuilt;
	startDateVar: any;
	giftData: any;
	year: string;

	constructor(private fb: FormBuilder, private customValidatorService: CustomValidatorService, private sharedDataService: SharedDataService, private datepipe: DatePipe, private emitterService: EmitterService,
		private route: ActivatedRoute, private rmsapiservice: RMSApiService, private router: Router,
		private cruiselineService: CruiseLineService, private toasterComponent: ToasterComponent) {
		//this.ShipId = this.route.snapshot.queryParamMap.get('id');
		this.ShipId = this.route.snapshot.paramMap.get('id');
		this.rmsapiservice.setData(this.ShipId);
	}

	ngOnInit() {
		this.formControlsSet();
	
		this.getProfileDataId();
		this.getStatus();
		this.getShipProfileGift();
	}

	formControlsSet() {
		this.shipProfileForm = this.fb.group({
			name: ['', [Validators.required, Validators.maxLength(50)]],
			shortName: ['', [Validators.required, Validators.maxLength(30)]],
			obmCode: ['', [Validators.required, Validators.maxLength(15)]],
			gpItem: ['', [Validators.required, Validators.maxLength(30)]],
			statusId: ['', [Validators.required]],
			gpAccountSegment: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email, Validators.maxLength(255), Validators.pattern(this.emailRegEx)]],
			doubleOccupancy: [''],
			yearbuilt: [''],
			tonnage: [''],
			datainService: [''],
			registry: ['', [Validators.maxLength(25)]],
			lounge: [''],
			retailPartnerTypeId: [''],
			className: ['', [Validators.maxLength(50)]]
		})
	};
	validatedate(event) {

		this.customValidatorService.isDateMaxlengthForamt(event)


	};

	hasError(controlName: string, errorName: string) {
		return this.shipProfileForm.controls[controlName].hasError(errorName);
	}


	/*=========== getProfile calling api By ID===========*/
	fulldate: any = "";
	getProfileDataId() {
		this.cruiselineService.getShipPorfileId(this.ShipId).subscribe((data: any) => {
		
			this.profileData = data;

			this.emitterService.refreshVoyages.emit(this.profileData.id)
			this.year = this.profileData.yearBuilt + '';
			let dateFormat = moment(this.profileData.yearBuilt, 'YYYY').format('YYYY');
			this.shipProfileForm.patchValue({
				name: this.profileData.name,
				shortName: this.profileData.shortName,
				obmCode: this.profileData.obmShipCode,
				gpItem: this.profileData.gpItemNumber,
				statusId: this.profileData.statusId,
				gpAccountSegment: this.profileData.gpAccountSegment,
				email: this.profileData.email,
				doubleOccupancy: this.profileData.doubleOccupancyCapacity,
				yearbuilt: this.profileData.yearBuilt ? new Date(this.profileData.yearBuilt, 1, 1) : "",
				//yearbuilt: this.fulldate ? new Date(this.fulldate) : "",
				tonnage: this.profileData.tonnage,
				datainService: this.profileData.dateInService,
				registry: this.profileData.registryName,
				lounge: this.profileData.loungeCapacity,
				className: this.profileData.className,
				retailPartnerTypeId: this.profileData.retailPartnerTypeId,
			})
		},
			error => {
				this.router.navigate(['/Error'])
			}

		);
	}

	//==============Get Status ================>
	getStatus() {
		this.sharedDataService.getShipStatus().subscribe((data: any) => {
			this.status = data;
		},
			error => {
				this.toasterComponent.onError(error);
				//this.messageService.add({ key: 'c', sticky: true, severity: 'error', summary: 'Oops! Something went wrong.', detail: 'Please try again or contact administrator.' });
			}

		);
	};

	getShipProfileGift() {
		this.cruiselineService.getShipProfileGift().subscribe((data: any) => {
			this.giftData = data;
		},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	};

	yearSelected(params) {
		this.shipProfileForm.controls['yearbuilt'].setValue(params);

		const ctrlValue = this.shipProfileForm.get('yearbuilt').value;
		//var sDate = this.shipProfileForm.get('effectivestartDate').value;
		this.startDateVar = this.datepipe.transform(ctrlValue, 'yyyy');
	
		//ctrlValue.year(normalizedYear.year());
		//this.startDate.setValue(this.startDateVar);
		this.yearBuilt.close();

	}

	saveShipProfile() {

		if (this.shipProfileForm.invalid) {
			return;
		}
		let Year=this.shipProfileForm.get('yearbuilt').value;

		let finalYear=this.datepipe.transform(Year, 'yyyy');
		let dataService=this.datepipe.transform(this.shipProfileForm.get('datainService').value,'yyyy-MM-dd')
		const reqData = {
			name: this.shipProfileForm.get('name').value,
			shortName: this.shipProfileForm.get('shortName').value,
			obmShipCode: this.shipProfileForm.get('obmCode').value,
			gpItemNumber: this.shipProfileForm.get('gpItem').value,
			statusId: this.shipProfileForm.get('statusId').value,
			gpAccountSegment: this.shipProfileForm.get('gpAccountSegment').value,
			email: this.shipProfileForm.get('email').value,
			doubleOccupancyCapacity: this.shipProfileForm.get('doubleOccupancy').value,
			yearBuilt:finalYear,
			tonnage: this.shipProfileForm.get('tonnage').value,
			dateInService:dataService ,
			registryName: this.shipProfileForm.get('registry').value,
			loungeCapacity: this.shipProfileForm.get('lounge').value,
			cruiseLineId: this.profileData.cruiseLineId,
			cruiseLineShipCode: this.profileData.cruiseLineShipCode,
			className: this.shipProfileForm.get('className').value,
			retailPartnerTypeId: this.shipProfileForm.get('retailPartnerTypeId').value
		}
	
		this.rmsapiservice.showLoader(true);
		this.cruiselineService.saveShipProfile(this.ShipId, reqData).subscribe((res: any) => {
			this.rmsapiservice.showLoader(false);
			this.router.navigate(['/Ship'])
		},
			error => {
				this.rmsapiservice.showLoader(false);
				this.router.navigate(['/Error'])
			}
		);
	};

	cancel() {
		this.router.navigate(['/Ship'])
	};

	isNumber(evt) {
		// const pattern = /[0-9\+\-\ ]/;
		const pattern = /^\d*(?:[.,]\d{1,2})?$/;

		let inputChar = String.fromCharCode(evt.charCode);
		if (evt.keyCode != 8 && !pattern.test(inputChar)) {
			evt.preventDefault();
		}

		var iKeyCode = (evt.which) ? evt.which : evt.keyCode
		if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
			return false;

		return true;
	}
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	


}

@Directive({
	selector: '[dateFormat2]',
	providers: [
		{ provide: MAT_DATE_FORMATS, useValue: MY_CUSTOM_YEAR },
	],
})
export class CustomDateFormat2 {
}

@Directive({
	selector: '[dateFormat1]',
	providers: [
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	],
})
export class CustomDateFormat1 {
}