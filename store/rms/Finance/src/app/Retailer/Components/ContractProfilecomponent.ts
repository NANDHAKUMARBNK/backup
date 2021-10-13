import { Component } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContractService } from '../Service/ContractService';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { SharedDataService } from 'common/services/SharedDataService';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
declare var $: any;
import { default as _rollupMoment } from 'moment';
import { CustomValidatorService } from 'common/CustomValidation/CustomValidatorService';
import { RMSMomentDateAdapter } from 'common/adapter/RMSMomentDateAdapter';
import { EmitterService } from 'common/services/emitterService';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
	parse: {
		dateInput: 'MM/DD/YY',
	},
	display: {
		dateInput: 'MM/DD/YY',
		monthYearLabel: 'MMM YYYY'
	},
};

@Component({
	selector: 'app-contractprofile',
	templateUrl: '../../../../../../../Views/Finance/ContractProfile.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss'],
	providers: [
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, CustomValidatorService
	],
})
export class ContractProfileComponent {

	RetailerContractListForm: FormGroup;
	cruiseLineData: any;
	categoryData: any;
	contractId: any;
	contractType: any;
	editProfileData: any;
	nameRegExwithspace = '^[a-zA-Z0-9_ ]*$';
	gpCustomerID: any;
	contractValidationData: any;
	sucessValidation: boolean = true;
	customerId: any;
	errormessage: any;
	customerName: string;
	portName: string;
	minDate: any;
	maxDate: any;



	constructor(private router: Router, private contractService: ContractService, private fb: FormBuilder, private route: ActivatedRoute,
		private location: Location, private customValidatorService: CustomValidatorService,private emitterService:EmitterService,
		private rMSApiService: RMSApiService, private toasterComponent: ToasterComponent, private sharedDataService: SharedDataService
	) {
		this.contractId = this.route.snapshot.queryParamMap.get('contractId');
		this.gpCustomerID = this.route.snapshot.queryParamMap.get('gpcustomerId');
		this.customerId = this.route.snapshot.queryParamMap.get('customerId');
		var data = this.rMSApiService.getData();
		if (data) {
			this.customerName = data.name;
			this.portName = data.portName;
		}

	};

	ngOnInit() {
		//  this.router.events.subscribe((evt) => {
		//     if (!(evt instanceof NavigationEnd)) {
		//         return;
		//     }
		//     window.scrollTo(0, 0)
		// });
	
		
		this.getCategory();
		this.getCruiseLine();
		if (this.contractId) {
			this.getEditApi();
			this.formControlsSetEdit();
		}else{
			this.formControlsSet();
		}


	};


	/* ========== inti formControlsSet =========*/
	formControlsSet() {
		this.RetailerContractListForm = this.fb.group({
			cruisLineId: ['', Validators.required],
			categoryId: ['', Validators.required],
			contractTypeId: ['', Validators.required],
			contract: ['', [Validators.required, Validators.maxLength(6), Validators.pattern(this.nameRegExwithspace)]],
			Start: ['', Validators.required],
			endDate: ['', Validators.required],
			summary: ['', [Validators.maxLength(100),]]
		})



	};

	formControlsSetEdit() {
		this.RetailerContractListForm = this.fb.group({
			cruisLineId: ['', Validators.required],
			categoryId: ['', Validators.required],
			contractTypeId: ['', Validators.required],
			contract: ['', [Validators.required]],
			Start: ['', Validators.required],
			endDate: ['', Validators.required],
			summary: ['', [Validators.maxLength(100),]]
		})



	};

	hasError(controlName: string, errorName: string) {
		return this.RetailerContractListForm.controls[controlName].hasError(errorName);

	}

	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	getEditApi() {
		this.rMSApiService.showLoader(true);
		this.contractService.getupdateContract(this.contractId).subscribe((data: any) => {
			this.editProfileData = data;
			this.emitterService.refreshContractProfile.emit(this.editProfileData)
			
        //   if(this.editProfileData.contractPrefix)
        //       this.editProfileData.contractPrefix=this.editProfileData.contractPrefix
		//   else
		// 	this.editProfileData.contractPrefix=" ";

			this.setFormControls();

			var endDateMin1 = this.editProfileData.isSalesExist == true ? this.editProfileData.lastSalesDate : null;
			var endDateMin2 = this.editProfileData.effectiveStartDate;
			var endDateMin, endDateMax = null;

			if (endDateMin1 == null)
				endDateMin = moment(endDateMin2).add(1, 'days')
			else if (endDateMin1 > endDateMin2)
				endDateMin = moment(endDateMin1).add(1, 'days');
			else
				endDateMin = moment(endDateMin2).add(1, 'days')

			endDateMax = this.editProfileData.currentPeriodEnd;

			if (endDateMin > endDateMax) {
				// TODO: Disable control. Dunno what to do.
			}
			else {
				this.minDate = endDateMin;
				this.maxDate = endDateMax;
			}

			this.rMSApiService.showLoader(false);

		},
			error => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error);
			}
		)
	};
	validatedate(event) {
		this.customValidatorService.isDateMaxlengthForamt(event)
		// const allowedRegex = /[0-9\/]/g

		// if (!event.key.match(allowedRegex)) {
		// 	event.preventDefault()
		// };
		// if (event.target.value.length >= 8) {
		// 	event.preventDefault()
		// }
		

	}
	setFormControls() {
		this.RetailerContractListForm.patchValue({
			cruisLineId: this.editProfileData.cruiseLineId,
			categoryId: this.editProfileData.categoryId,
			contractTypeId: this.editProfileData.typeId,
			contract: this.editProfileData.contractNumber,
			Start: this.editProfileData.effectiveStartDate,
			endDate: this.editProfileData.effectiveEndDate,
			summary: this.editProfileData.summary,

		})
	}

	getCruiseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.cruiseLineData = data;
			this.cruiseLineData.forEach(item => {
				if (item.isDefault == true) {
					this.RetailerContractListForm.patchValue({
						cruisLineId: item.id
					});
				}

			})
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};

	getCategory() {
		this.contractService.getCategorycontract().subscribe((data: any) => {
			this.categoryData = data.items;
		  if(this.contractId){
			this.getContractType();
		  }else{
			this.categoryData.forEach(item => {
				if (item.categoryCode == "PROMO") {
					this.RetailerContractListForm.patchValue({
						categoryId: item.id
					})
				}
			});
			console.log("else condition")
			this.getContractType();
		  }
			
			
			//this.getContractType()
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)

	};

	categoryIdVal: any;
	getContractType() {
		this.categoryIdVal = this.RetailerContractListForm.get('categoryId').value,
		this.contractService.getContractType(this.categoryIdVal).subscribe((data: any) => {
			this.contractType = data.items;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};

	contractValidation() {
		const reqData = {
			cruiseLineId: this.RetailerContractListForm.get('cruisLineId').value,
			contractTypeId: this.RetailerContractListForm.get('contractTypeId').value,
			contractPrefix: this.RetailerContractListForm.get('contract').value,
			startDate: this.RetailerContractListForm.get('Start').value,
			endDate: this.RetailerContractListForm.get('endDate').value,

		}
		this.rMSApiService.showLoader(true);
		this.contractService.contractValidation(reqData).subscribe((data: any) => {
			this.contractValidationData = data.item;
			if (this.contractValidationData.retValue == 1) {
				this.sucessValidation = true;
			} else {
				let errormessage = data.item;
			}

			this.rMSApiService.showLoader(false);

		},
			error => {
				this.toasterComponent.contractValidation(error)
				this.sucessValidation = false;
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)
	}


	saveContract() {

		if (this.RetailerContractListForm.invalid) {
			return;
		}
		const ValidationData = {
			cruiseLineId: this.RetailerContractListForm.get('cruisLineId').value,
			contractTypeId: this.RetailerContractListForm.get('contractTypeId').value,
			contractPrefix: this.RetailerContractListForm.get('contract').value,
			startDate: moment(this.RetailerContractListForm.get('Start').value).format("YYYY-MM-DD"),
			endDate: moment(this.RetailerContractListForm.get('endDate').value).format("YYYY-MM-DD"),

		}
		this.rMSApiService.showLoader(true);
		this.contractService.contractValidation(ValidationData).subscribe((data: any) => {
			this.contractValidationData = data.item;
			if (this.contractValidationData.retValue == 1) {
				this.sucessValidation = true;
				this.saveClick();
			} else {
				this.errormessage = data.item;
			}

			this.rMSApiService.showLoader(false);

		},
			error => {

				this.sucessValidation = false;
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)





	};



	saveClick() {
		if (this.RetailerContractListForm.invalid) {
			return;
		}
		const reqData = {
			cruiseLineId: this.RetailerContractListForm.get('cruisLineId').value,
			categoryId: this.RetailerContractListForm.get('categoryId').value,
			typeId: this.RetailerContractListForm.get('contractTypeId').value,
			contractPrefix: this.RetailerContractListForm.get('contract').value,
			effectiveStartDate: moment(this.RetailerContractListForm.get('Start').value).format("YYYY-MM-DD"),
			effeciveEndDate: moment(this.RetailerContractListForm.get('endDate').value).format("YYYY-MM-DD"),
			summary: this.RetailerContractListForm.get('summary').value,
			customerId: this.customerId
		};

		this.contractService.saveContract(reqData).subscribe((data: any) => {
			this.location.back();
		},
			error => {
				this.toasterComponent.onError(error)
			}

		);

	}

	updateContract() {
		if (this.RetailerContractListForm.invalid) {
			return;
		}
		const reqData = {
			cruiseLineId: this.RetailerContractListForm.get('cruisLineId').value,
			categoryId: this.RetailerContractListForm.get('categoryId').value,
			typeId: this.RetailerContractListForm.get('contractTypeId').value,
			contractPrefix: this.RetailerContractListForm.get('contract').value,
			effectiveStartDate: moment(this.RetailerContractListForm.get('Start').value).format("YYYY-MM-DD"),
			effeciveEndDate: moment(this.RetailerContractListForm.get('endDate').value).format("YYYY-MM-DD"),
			summary: this.RetailerContractListForm.get('summary').value,
			customerId: this.customerId
		};

		this.contractService.updateContract(this.contractId, reqData).subscribe((data: any) => {
			//this.router.navigateByUrl('Retailer/Profile')
			this.location.back();
		},
			error => {
				this.toasterComponent.onError(error)
			}

		);
	};


	contractStartDate(event) {
		let startdate = _moment(event.value).add(1, 'days').format();
		this.minDate = startdate;

	}

	backpage() {
		this.location.back();
	}



}