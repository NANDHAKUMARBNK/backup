import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material";
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { CouponBookService } from '../../Service/CouponBookService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { RMSApiService } from 'common/services/RMSApiService';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { RMSMomentDateAdapter } from 'common/adapter/RMSMomentDateAdapter';
import { CustomValidatorService } from 'common/CustomValidation/CustomValidatorService';

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
	selector: 'app-addtransfer',
	templateUrl: '../../../../../../../Views/CouponBook/InventoryTransfer.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss'],
	providers: [
		{ provide: DateAdapter, useClass: RMSMomentDateAdapter, deps: [MAT_DATE_LOCALE] },

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },CustomValidatorService
	],
})
export class InventoryTransferComponent {
	// title = 'CruiseLines';
	@ViewChild('maxZero') maxZero: ElementRef;
	Datadoc: any;
	tranferFormlist: FormGroup
	Data: any;
	upload: File;
	cacheId: any;
	feeTypeData: any;
	DescriptionData: any;
	cruiseLineId: any;
	cruiseLineDataEdit: any;
	updateButton: any;
	inventoryItem: any;
	inventoryType: any;
	inventoryForm: any;
	inventoryTo: any;
	transferEditData: any;
	showErrorMessage: boolean = false;
	minDate: any;
	maxDate: any;
	RE = /^(?!^0*$)(?!^0*\.0*$)^\d{1,2}(\.\d{1,2})?$/;
	wholenumberwithoZero = /^[1-9](?:\d{0,2}(?:,\d{3})+|\d*)$/;
	DatesVliadation: any;
	constructor(private dialogRef: MatDialogRef<InventoryTransferComponent>, @Inject(MAT_DIALOG_DATA) data, private fb: FormBuilder,

		private couponBookService: CouponBookService,private customValidatorService:CustomValidatorService, private toasterComponent: ToasterComponent, private rMSApiService: RMSApiService,
		private emitterService: EmitterService, private sharedDataService: SharedDataService, private route: ActivatedRoute) {
		this.Data = data;
		this.updateButton = data.gridid
		this.cruiseLineId = this.route.snapshot.paramMap.get('id')
	}

	ngOnInit() {
		this.setFormControlsSet();
		this.getInventoryItem();
		this.getInventoryType();
		//this.getInventoryForm();
		//this.getInventoryTo();
		//this.checkVaildationsFormId();
		let dateValidation = this.rMSApiService.getcascaddingitem();
		//this.minDate = dateValidation.effectiveStartDate;
		//this.maxDate = dateValidation.effectiveEndDate;
	};

	setFormControlsSet() {
		this.tranferFormlist = this.fb.group({
			itemId: ['', Validators.required],
			typeId: ['', Validators.required],
			Date: ['', Validators.required],
			quantity: ['', [Validators.required, Validators.pattern(this.wholenumberwithoZero)]],
			fromId: ['', Validators.required],
			toId: ['', Validators.required],
			comment: ['']
		});
	}

	hasError(controlName: string, errorName: string) {
		return this.tranferFormlist.controls[controlName].hasError(errorName);
	};

	checkVaildationsFormId() {
		this.tranferFormlist.get('fromId').valueChanges.subscribe((data: any) => {
			if (this.tranferFormlist.get('fromId').value == this.tranferFormlist.get('toId').value) {
				this.toasterComponent.inventryTransferError();

			}
		})
	}
	getErrorMessage(pickerInput: string): string {
		if (!pickerInput || pickerInput === '') {
			return;
		}
		return this.customValidatorService.isMyDateFormat(pickerInput);
	}
	checkformVaildation() {
		if (this.tranferFormlist.get('fromId').value == this.tranferFormlist.get('toId').value) {
			this.toasterComponent.inventryTransferError();

		}
	};

	getInventoryItem() {
		this.couponBookService.getInventoryItem().subscribe((data: any) => {
			this.inventoryItem = data;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};
	getInventoryType() {
		this.couponBookService.getInventoryType().subscribe((data: any) => {
			this.inventoryType = data.items;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};


	getInventoryForm() {
		let itemId = this.tranferFormlist.get('itemId').value;

		this.couponBookService.getInventoryForm(itemId).subscribe((data: any) => {
			this.inventoryForm = data;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};




	getInventeryDatesValidation() {
		let itemId = this.tranferFormlist.get('itemId').value;

		this.couponBookService.getInventeryDatesValidation(itemId).subscribe((data: any) => {
			this.DatesVliadation = data;
			this.minDate = this.DatesVliadation.effectiveStartDate;
			this.maxDate = this.DatesVliadation.effectiveEndDate;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	}
	getInventoryTo() {
		let itemId = this.tranferFormlist.get('itemId').value;
		this.couponBookService.getInventoryTo(itemId).subscribe((data: any) => {
			this.inventoryTo = data;

		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};

	/* =========== Edit form and patching values =========*/
	geteditData() {
		this.couponBookService.getinventoryById(this.Data.id).subscribe((data: any) => {
			this.transferEditData = data;
			this.tranferFormlist.patchValue({
				itemId: this.transferEditData.itemId,
				typeId: this.transferEditData.typeId,
				Date: this.transferEditData.itemId,
				quantity: this.transferEditData.itemId,
				fromId: this.transferEditData.itemId,
				toId: this.transferEditData.itemId,

			})
		},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	};

	valueChangesFrom() {

	}


	/* ========= Save click pass values to backend ==========*/
	saveTransfer() {
		//this.rMSApiService.showLoader(true);

		let fromId = this.tranferFormlist.get('fromId').value;
	
		let toId = this.tranferFormlist.get('toId').value;
		let findFromId = this.inventoryForm.find(item => item.locationName == fromId);
	
		let findToId = this.inventoryTo.find(item => item.locationName == toId);
		if (this.tranferFormlist.invalid) {
			return;
		} else if (this.tranferFormlist.get('fromId').value == this.tranferFormlist.get('toId').value) {
			this.toasterComponent.inventryTransferError();
			//alert("hi")
			return
		};

		const reqData = {
			itemId: this.tranferFormlist.get('itemId').value,
			typeId: this.tranferFormlist.get('typeId').value,
			transactionDate: this.tranferFormlist.get('Date').value,
			unitQty: +this.tranferFormlist.get('quantity').value,
			itemLocationFromId: findFromId.id,
			itemLocationToId: findToId.id,
			comment: this.tranferFormlist.get('comment').value
		}
		this.couponBookService.SaveTranfer(reqData).subscribe((data: any) => {
			this.dialogRef.close();
			this.toasterComponent.onSucess();
			this.emitterService.refreshTransferGrid.next(true);
		},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	};

	validatedate(e) {
		this.customValidatorService.isDateMaxlengthForamt(event)
	
		// let stBill: any;
		// stBill = Math.round(e.target.value * 100) / 100;
		// //var stBill = Math.round(document.getElementById("myTextField").value * 100) / 100;
		// var RE = /^(?!^0*$)(?!^0*\.0*$)^\d{1,2}(\.\d{1,2})?$/;
		// if (RE.test(stBill)) {
		// 	this.showErrorMessage = true;
		// } else {
		// 	this.showErrorMessage = false;
		// }
	}

	updateTransfer() {
		const reqData = {
			itemId: this.tranferFormlist.get('itemId').value,
			typeId: this.tranferFormlist.get('typeId').value,
			date: this.tranferFormlist.get('Date').value,
			quantity: this.tranferFormlist.get('quantity').value,
			fromId: this.tranferFormlist.get('fromId').value,
			toId: this.tranferFormlist.get('toId').value,
		}
		this.couponBookService.updateTransfer(this.Data.id, reqData).subscribe((data: any) => {

		},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	}


	close() {
		this.dialogRef.close();
	};



}
