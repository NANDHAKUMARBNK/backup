import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { SharedDataService } from 'common/services/SharedDataService';
import { Router, ActivatedRoute } from '@angular/router';
import { error } from '@angular/compiler/src/util';
import { RMSApiService } from 'common/services/RMSApiService';
import { MatDialog } from '@angular/material';
import { ErrorModalComponent } from 'common/components/ErrorModalComponent';
import { ToasterComponent } from 'common/components/ToasterComponent';


@Component({
	selector: 'app-pprofile',
	templateUrl: '../../../../../../../Views/CruiseLines/PortDetail.html',
	styleUrls: ['../../../styles/cruiseLine.scss', '../../../../../../common/styles/AgGrid.scss']
})
export class ProfileComponent {
	// title = 'CruiseLines';
	portDetailForm: FormGroup;
	portMapingPort: any;
	timeZoneData: any;
	countryData: any;
	portId: any;
	showport: boolean = true;
	portData: any;
	//hideGrid: any;
	@Output() hideGrid = new EventEmitter<string>();
	countryId: any;
	active: any;
	noSpace: " /^\S*$/";
	isChecked: boolean;
	//public allowedRegex = '^[a-zA-Z0-9_ ]*$';

	constructor(private fb: FormBuilder, private router: Router,
		//private service: PsgService,
		private sharedDataService: SharedDataService,
		private route: ActivatedRoute,
		private rmsApiService: RMSApiService,
		private cruiseLineService: CruiseLineService,
		private dialog: MatDialog,
		private toasterComponent: ToasterComponent,
	) {

		this.portId = this.route.snapshot.paramMap.get('id') // read params from URL portId
		this.countryId = this.route.snapshot.paramMap.get('country');
		this.active = this.route.snapshot.paramMap.get('active')
		this.rmsApiService.setData(this.portId);
	}

	ngOnInit() {
		this.FormControlsInit();
		this.getPortProfileId();
		this.getPortMaping();
		this.getTimeZone();
		this.getCountry();
		this.checkbox();
	};

	// <=============== Formconrols set here==============>
	FormControlsInit() {
		this.portDetailForm = this.fb.group({
			name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(this.noSpace)]],
			obmCode: ['', [Validators.required, Validators.maxLength(15)]],
			masterPort: [''],
			portMaping: [null],
			country: [null],
			timeZone: [null],
			isrevenuProgram: [''],
		})
	};
	hasError(controlName: string, errorName: string) {
		return this.portDetailForm.controls[controlName].hasError(errorName);
	}

	//
	getPortProfileId() {
		this.rmsApiService.showLoader(true);
		this.cruiseLineService.getPortProfileId(this.portId).subscribe(
			(data: any) => {
				this.portData = data;
				localStorage.setItem('portId', this.portData.id);
				this.rmsApiService.setPortData(this.portData.id)
				this.rmsApiService.showLoader(false);
				this.portDetailForm.patchValue({
					name: this.portData.name,
					obmCode: this.portData.code,
					masterPort: this.portData.isMaster,
					portMaping: this.portData.parentPortId,
					country: this.portData.countryId,
					timeZone: this.portData.timeZoneID,
					isrevenuProgram: this.portData.isRevenueProgram
				})
			},
			error => {
				this.rmsApiService.setData(error);
				this.rmsApiService.showLoader(false);
				this.router.navigateByUrl('/Error')
			}
		)
	};

	// <================ Get Port Maping calling from sharedDataService ============>
	getPortMaping() {
		this.sharedDataService.getCruiseLinePortMaping().subscribe(
			(data: any) => {
				this.portMapingPort = data;
			},
			error => {
				this.toasterComponent.onError(error);
			}
			//error => {
			//	let dialogRef = this.dialog.open(ErrorModalComponent);
			//	dialogRef.componentInstance.statusCode = error.error.status;
			//	dialogRef.componentInstance.traceId = error.error.traceId;
			//	dialogRef.componentInstance.message = error.error.traceId;
			//}
		);
	};

	// <================ Get TimeZone calling from sharedDataService ============>
	getTimeZone() {
		this.sharedDataService.getCruiseLineTimeZone().subscribe((data: any) => {
			this.timeZoneData = data;
		},
			error => {
				this.toasterComponent.onError(error);
			}
			//error => {
			//	let dialogRef = this.dialog.open(ErrorModalComponent);
			//	dialogRef.componentInstance.statusCode = error.error.status;
			//	dialogRef.componentInstance.traceId = error.error.traceId;
			//	dialogRef.componentInstance.message = error.error.traceId;
			//}
		);
	};

	// <================ Get Country calling from sharedDataService ============>
	getCountry() {
		this.sharedDataService.getCountry().subscribe((data: any) => {
			this.countryData = data;
		},
			error => {
				this.toasterComponent.onError(error);
			}
			//error => {
			//	let dialogRef = this.dialog.open(ErrorModalComponent);
			//	dialogRef.componentInstance.statusCode = error.error.status;
			//	dialogRef.componentInstance.traceId = error.error.traceId;
			//	dialogRef.componentInstance.message = error.error.traceId;
			//}

		);
	};

	/*=======================*/
	checkbox() {
		this.portDetailForm.controls['masterPort'].valueChanges.subscribe((data: any) => {
		
			this.isChecked = data;

			//this.hideGrid = e.checked;
			this.hideGrid.emit(data);
			this.rmsApiService.setData(this.hideGrid);
		
			if (data == false) {
				this.showport = true;
			} else {
				this.showport = false;

			}
		})
	};

	// <================ save port Details calling from cruiseLineService ============>
	savePortDetails() {
	

		if (this.portDetailForm.invalid) {
			return;
		};

		let timezone = this.portDetailForm.get('timeZone').value;
		if (timezone == 0) {
			timezone = null;
		};
		let country = this.portDetailForm.get('country').value;
		if (country == 0) {
			country = null;
		};
		let portmapping = this.portDetailForm.get('portMaping').value;
		if (portmapping == 0) {
			portmapping = null;
		};
		const reqData = {
			code: this.portDetailForm.get('obmCode').value,
			name: this.portDetailForm.get('name').value,
			countryId: country,
			isMaster: this.portDetailForm.get('masterPort').value,
			timeZoneId: timezone,
			portMappingId: portmapping,
			isRevenueProgram: this.portDetailForm.get('isrevenuProgram').value,
		};


		this.rmsApiService.showLoader(true);
		this.cruiseLineService.savePortDetail(this.portId, reqData).subscribe(
			(data: any) => {
				this.rmsApiService.showLoader(false);
				this.router.navigate(['/Port', { country: this.countryId, active: this.active }]);
			},
			error => {
				this.rmsApiService.setData(error);
				this.rmsApiService.showLoader(false);
				this.router.navigateByUrl('/Error');
			}
		)
	};




	cancel() {
		this.router.navigate(['/Port', { country: this.countryId, active: this.active }]);

	}
	isNumber(evt) {
		var iKeyCode = (evt.which) ? evt.which : evt.keyCode
		if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
			return false;

		return true;
	}

}