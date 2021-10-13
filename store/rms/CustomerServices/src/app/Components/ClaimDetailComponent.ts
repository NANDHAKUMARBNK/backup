import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, EventEmitter, Output, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { SharedDataService } from 'common/services/SharedDataService';
import { CustomerService } from '../Service/CustomerServices';
import { MatDatepickerInputEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { RMSApiService } from 'common/services/RMSApiService';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
declare var $: any;
import { default as _rollupMoment } from 'moment';
import { CustomValidatorService } from 'common/CustomValidation/CustomValidatorService';
import { RMSMomentDateAdapter } from 'common/adapter/RMSMomentDateAdapter';

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
	selector: 'app-claimdetail',
	templateUrl: '../../../../../../Views/CustomerServices/ClaimDetail.html',
	styleUrls: ['../../styles/Tabs.scss'],
	providers: [DatePipe,
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }, CustomValidatorService
	]

})


export class ClaimDetailComponent implements OnChanges {
	ClaimDetailForm: FormGroup;
	AssignedData: any;
	CruiseLineData: any;
	shipsData: any;
	shipId: any;
	PortData: any;
	portId: any;
	MerchantData: any;
	cruiseLineId: any;
	@Input() addClaimId: any;
	@Input() searchClick: any;

	StatusData: any;
	sourceData: any;
	resolutionData: any;
	requestTypeData: any;
	CreatedId: FormGroup;
	StatusId: any;
	AssignedId: any;
	SourceId: any;
	createDate: any;
	createDateVar: string;
	editForm: any;
	Claimid: any;
	hideSettlement: boolean = false;
	@Output() changeTab = new EventEmitter<string>();
	ClaimDetailId: any;
	//nameRegEx = '^[a-zA-Z0-9_ ]*$'
	moneyRegx = '[0-9]*(\.[0-9][0-9]?)?'
	Created = new FormControl(moment());
	notificationId = new FormControl(moment());
	PurchaseDate = new FormControl(moment());
	ClosedDate = new FormControl(moment());
	userData: any;
	editPortId: any;
	editShipId: any;
	searchchangeId: any;
	PurchaseDateValue: any;



	constructor(private _fb: FormBuilder, private route: ActivatedRoute, private sharedDataService: SharedDataService,
		private router: Router, private toasterComponent: ToasterComponent, private rMSApiService: RMSApiService,
		private service: CustomerService, private customValidatorService: CustomValidatorService, public datepipe: DatePipe, private messageService: MessageService) {
		this.Claimid = this.route.snapshot.queryParamMap.get('Claimid');
	}
	ngOnInit() {
		this.userData = JSON.parse(localStorage.getItem('userInfo'));
		this.ClaimDetailForm = this._fb.group({
			Created: ['', Validators.required],
			Status: ['', Validators.required],
			assignedTo: ['', Validators.required],
			Source: ['', Validators.required],
			notificationId: ['', Validators.required],
			ClaimAccount: ['', [Validators.required, Validators.pattern(this.moneyRegx)]],
			PurchaseDate: ['', Validators.required],
			PurchaseAmount: ['', [Validators.required, Validators.pattern(this.moneyRegx)]],
			CruiseLineId: ['', Validators.required],
			ShipId: ['', Validators.required],
			PortId: [''],
			MerchantId: [''],
			MiscInfo: [''],
			Amount: [''],
			ClosedDate: [''],
			Resolution: [''],
			Type: ['', Validators.required],
			Request: ['', [Validators.required,]],
			ItemInfo: ['', [Validators.required]],
		});

		this.editClaim();
		this.getCuriseLine();
		this.GetShips();
		this.getStatusCustomer();
		this.getResolution();
		this.getSource();
		this.getRequestType();
		this.getAssigned();
		this.setUserCategoryValidators();
	}
	hasError(controlName: string, errorName: string) {
		return this.ClaimDetailForm.controls[controlName].hasError(errorName);
	};

	ngOnChanges() {
		this.rMSApiService.buttonClickEventTrack.subscribe((data: any) => {
			this.Claimid = data.id;
			this.searchchangeId = data.id;
			let changeHistoryEdit = data;
			this.ClaimDetailForm.patchValue({
				Created: changeHistoryEdit.initiatedDate,
				Status: changeHistoryEdit.statusId,
				assignedTo: changeHistoryEdit.assignedUserId,
				Source: changeHistoryEdit.sourceTypeId,
				notificationId: changeHistoryEdit.notificationDate,
				PurchaseDate: changeHistoryEdit.purchaseDate,
				PurchaseAmount: changeHistoryEdit.purchaseAmt,
				CruiseLineId: changeHistoryEdit.cruiseLineId,
				ShipId: changeHistoryEdit.shipId,
				PortId: changeHistoryEdit.portId,
				MerchantId: changeHistoryEdit.customerId,
				MiscInfo: changeHistoryEdit.information,
				Amount: changeHistoryEdit.settledAmt,
				ClosedDate: changeHistoryEdit.closedDate,
				Resolution: changeHistoryEdit.resolutionTypeId,
				Type: changeHistoryEdit.requestTypeId,
				Request: changeHistoryEdit.request,
				ItemInfo: changeHistoryEdit.itemInfo
			});
			
		})
		

	}

	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	//Get Status
	getStatusCustomer() {
		this.sharedDataService.getStatusCustomer().subscribe((data: any) => {
			this.StatusData = data;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	};
	//getAssigned 
	getAssigned() {
		this.sharedDataService.getAssigned().subscribe((data: any) => {
			this.AssignedData = data;
			this.ClaimDetailForm.patchValue({
				assignedTo: parseInt(this.userData.userId)
				//AssignedId: this.AssignedData[0].userId
			})
		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	}
	//Get CuriseLine
	getCuriseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.CruiseLineData = data;

			this.CruiseLineData.forEach(item=>{
				if(item.isDefault ==true){
					this.ClaimDetailForm.patchValue({
						CruiseLineId: item.id
					});
				}
			})
			this.GetShips()

		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	};
	//Get Ships
	GetShips() {
		this.cruiseLineId = this.ClaimDetailForm.get('CruiseLineId').value;
		this.sharedDataService.getShipList(this.cruiseLineId).subscribe((data: any) => {
			this.shipsData = data;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	};
	//getPort
	getPort() {
		this.shipId = this.ClaimDetailForm.get('ShipId').value;
		if (this.shipId == 'null' || this.shipId == 'other' || this.shipId == 'NA') {
			this.shipId = '';
		}
		this.sharedDataService.getPort(this.cruiseLineId, this.shipId).subscribe((data: any) => {
			this.PortData = data;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	};

	//getMerchant
	getMerchant() {
		this.portId = this.ClaimDetailForm.get('PortId').value;
		if (this.shipId == 'null' || this.shipId == 'other' || this.shipId == 'NA') {
			this.shipId = '';
		};
		//=this.ClaimDetailForm.get('PurchaseDate').value;
		let PurchaseDateValue=moment(this.ClaimDetailForm.get('PurchaseDate').value).format("YYYY-MM-DD");

		this.service.getMerchantBasedOnPortIdAndPurchaseDate(this.portId, PurchaseDateValue).subscribe((data: any) => {
			this.MerchantData = data.items;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	};
	dateChange(evt) {
	
		this.PurchaseDateValue = moment(evt.value).format("YYYY-MM-DD");


	}
	//getSource
	getSource() {
		this.sharedDataService.getSource().subscribe((data: any) => {
			this.sourceData = data.items;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	};
	//getResolution
	getResolution() {
		this.sharedDataService.getResolution().subscribe((data: any) => {
			this.resolutionData = data.items;
		});
	};

	//getRequestType
	getRequestType() {
		this.sharedDataService.getRequestType().subscribe((data: any) => {

			this.requestTypeData = data.items;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	}

	getCreatedDate(type: string, event: MatDatepickerInputEvent<Date>) {
		this.createDate = this.ClaimDetailForm.get('startDate').value;
		this.createDateVar = this.datepipe.transform(this.createDate, 'yyyy-MM-dd');
	};
	setUserCategoryValidators() {
		const institutionControl = this.ClaimDetailForm.get('Amount');
		const companyControl = this.ClaimDetailForm.get('ClosedDate');
		const salaryControl = this.ClaimDetailForm.get('Resolution');

		this.ClaimDetailForm.get('Status').valueChanges.subscribe((data: any) => {
		
			if (data == 17) {
				this.hideSettlement = true;
				institutionControl.setValidators([Validators.required, Validators.pattern(this.moneyRegx)]);
				companyControl.setValidators([Validators.required]);
				salaryControl.setValidators([Validators.required]);
			} else if (data == 16) {
				this.hideSettlement = false;
				institutionControl.setValidators(null);
				companyControl.setValidators(null);
				salaryControl.setValidators(null);
			} else {
				institutionControl.setValidators(null);
				companyControl.setValidators(null);
				salaryControl.setValidators(null);
			};
		});
	}
	//Save call Apis
	saveDetails() {
		if (this.ClaimDetailForm.invalid) {
			return;
		}
		if (this.addClaimId) {
			const details = {

				initiatedDate: moment(this.ClaimDetailForm.get('Created').value).format('YYYY-MM-DD'),
				statusId: this.ClaimDetailForm.get('Status').value,
				assignedUserId: this.ClaimDetailForm.get('assignedTo').value,
				sourceTypeId: this.ClaimDetailForm.get('Source').value,
				notificationDate: moment(this.ClaimDetailForm.get('notificationId').value).format('YYYY-MM-DD'),
				claimAmt: this.ClaimDetailForm.get('ClaimAccount').value,
				purchaseDate: moment(this.ClaimDetailForm.get('PurchaseDate').value).format('YYYY-MM-DD'),
				purchaseAmt: this.ClaimDetailForm.get('PurchaseAmount').value,
				CruiseLineId: this.ClaimDetailForm.get('CruiseLineId').value,
				shipId: this.ClaimDetailForm.get('ShipId').value == 'null' || this.ClaimDetailForm.get('ShipId').value == 'other' || this.ClaimDetailForm.get('ShipId').value == 'NA' ? '' : this.ClaimDetailForm.get('ShipId').value,
				portId: this.ClaimDetailForm.get('PortId').value,
				customerId: this.ClaimDetailForm.get('MerchantId').value,
				information: this.ClaimDetailForm.get('MiscInfo').value,
				settledAmt: this.ClaimDetailForm.get('Amount').value,
				resolutionTypeId: this.ClaimDetailForm.get('Resolution').value,
				requestTypeId: this.ClaimDetailForm.get('Type').value,
				request: this.ClaimDetailForm.get('Request').value,
				itemInfo: this.ClaimDetailForm.get('ItemInfo').value,
			};



			if (this.ClaimDetailForm.get('ClosedDate').value) {
				details["closedDate"] = moment(this.ClaimDetailForm.get('ClosedDate').value).format('YYYY-MM-DD')
			}

			this.rMSApiService.showLoader(true);
			this.service.saveClaimDetails(this.addClaimId, details).subscribe(
				(data: any) => {
					this.ClaimDetailId = data;
					this.rMSApiService.showLoader(false);
					this.changeTab.emit(this.ClaimDetailId);
					this.toasterComponent.onSucess();
				},
				error => {
					this.rMSApiService.setData(error);
					this.rMSApiService.showLoader(false);
					this.router.navigate(['/Error'])
				}
			)

		} else if (this.Claimid) {
			const details = {
				initiatedDate: moment(this.ClaimDetailForm.get('Created').value).format('YYYY-MM-DD'),
				statusId: this.ClaimDetailForm.get('Status').value,
				assignedUserId: this.ClaimDetailForm.get('assignedTo').value,
				sourceTypeId: this.ClaimDetailForm.get('Source').value,
				notificationDate: moment(this.ClaimDetailForm.get('notificationId').value).format('YYYY-MM-DD'),
				claimAmt: this.ClaimDetailForm.get('ClaimAccount').value,
				purchaseDate: moment(this.ClaimDetailForm.get('PurchaseDate').value).format('YYYY-MM-DD'),
				purchaseAmt: this.ClaimDetailForm.get('PurchaseAmount').value,
				CruiseLineId: this.ClaimDetailForm.get('CruiseLineId').value,
				shipId: this.ClaimDetailForm.get('ShipId').value == 'null' || this.ClaimDetailForm.get('ShipId').value == 'other' || this.ClaimDetailForm.get('ShipId').value == 'NA' ? '' : this.ClaimDetailForm.get('ShipId').value,
				portId: this.ClaimDetailForm.get('PortId').value,
				customerId: this.ClaimDetailForm.get('MerchantId').value,
				information: this.ClaimDetailForm.get('MiscInfo').value,
				settledAmt: this.ClaimDetailForm.get('Amount').value,
				resolutionTypeId: this.ClaimDetailForm.get('Resolution').value,
				requestTypeId: this.ClaimDetailForm.get('Type').value,
				request: this.ClaimDetailForm.get('Request').value,
				itemInfo: this.ClaimDetailForm.get('ItemInfo').value,
			};

		
			if (this.ClaimDetailForm.get('ClosedDate').value) {
				details["closedDate"] = moment(this.ClaimDetailForm.get('ClosedDate').value).format('YYYY-MM-DD')
			}

			this.rMSApiService.showLoader(true);
			this.service.saveClaimDetails(this.Claimid, details).subscribe(
				(data: any) => {
					this.ClaimDetailId = data;
					this.rMSApiService.showLoader(false);
					this.changeTab.emit(this.ClaimDetailId);
					this.toasterComponent.onSucess();
				},
				error => {
					this.rMSApiService.setData(error)
					this.rMSApiService.showLoader(false);

					this.router.navigate(['/Error'])
				}
			)
		}
	}
	editClaim() {

		this.service.editClaim(this.Claimid).subscribe((data: any) => {
			this.editForm = data;
			this.editShipId = this.editForm.shipId;
			if (this.editShipId == null) {
				this.editShipId = ''
			} else {
				this.editShipId = this.editForm.shipId;
			}

			this.getShipEdit(this.editForm.cruiseLineId);
			this.getPortEdit(this.editForm.cruiseLineId, this.editShipId);
			this.editPortId = this.editForm.portId;
			let purchaseDate = moment(this.editForm.purchaseDate).format("YYYY-MM-DD");
			if (this.editPortId == null) {
				this.editPortId = '';
			} else {
				this.editPortId = this.editForm.portId;
			};
			console.log(purchaseDate,'purchaseDate')
			this.getMerchantEdit(this.editPortId, purchaseDate)
			this.ClaimDetailForm.patchValue({
				Created: moment(this.editForm.initiatedDate),
				Status: this.editForm.statusId,
				assignedTo: this.editForm.assignedUserId,
				Source: this.editForm.sourceTypeId,
				notificationId: moment(this.editForm.notificationDate),
				ClaimAccount: this.editForm.claimAmt,
				PurchaseDate: moment(this.editForm.purchaseDate),
				PurchaseAmount: this.editForm.purchaseAmt,
				CruiseLineId: this.editForm.cruiseLineId,
				ShipId: this.editForm.shipId,
				PortId: this.editForm.portId,
				MerchantId: this.editForm.customerId,
				MiscInfo: this.editForm.information,
				Amount: this.editForm.settledAmt,
				ClosedDate: this.editForm.closedDate ? moment(this.editForm.closedDate) : null,
				Resolution: this.editForm.resolutionTypeId,
				Type: this.editForm.requestTypeId,
				Request: this.editForm.request,
				ItemInfo: this.editForm.itemInfo
			});
		})
	};

	getShipEdit(id) {
		this.sharedDataService.getShipList(id).subscribe((data: any) => {
			this.shipsData = data;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	};

	getPortEdit(Cid, Sid) {

		this.sharedDataService.getPort(Cid, Sid).subscribe((data: any) => {
			this.PortData = data;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	};


	getMerchantEdit(Pid, purchaseDate) {
		
		this.service.getMerchantBasedOnPortIdAndPurchaseDate(Pid, purchaseDate).subscribe((data: any) => {

			this.MerchantData = data.items;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		);
	}

	validateAmount(event) {
		const amountRegx = /^([0-9]*(\.[0-9]?)?)$/
		if (!amountRegx.test(event.target.value)) {
			event.preventDefault()

		}
	}
	isNumber(evt) {
		var iKeyCode = (evt.which) ? evt.which : evt.keyCode
		if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
			return false;

		return true;
	}

	validatedate(event) {

		this.customValidatorService.isDateMaxlengthForamt(event)


	}


}