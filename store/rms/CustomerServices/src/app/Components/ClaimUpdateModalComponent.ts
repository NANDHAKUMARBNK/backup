import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { SharedDataService } from 'common/services/SharedDataService';
import { EmitterService } from 'common/services/emitterService';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CustomerService } from '../Service/CustomerServices';
import { ToasterComponent } from 'common/components/ToasterComponent';

@Component({
	selector: 'app-claimupdatemodal',
	templateUrl: '../../../../../../Views/CustomerServices/ClaimUpdateModal.html',
	styleUrls: ['../../../../../common/styles/AgGrid.scss']
})

export class ClaimUpdateModalComponent {

	ClaimUpdateForm: FormGroup;
	updateType: any;
	updateAction: any;
	updateNextType: any;
	hideInfoAmount: any;
	hideLabels: boolean = false;
	Claimid: any;
	addClaimIds: any;
	claimUpdateId: any;
	claimUpdateForm: any;
	claimeditUpdateForm: any;
	moneyRegx = '[0-9]*(\.[0-9][0-9]?)?'

	constructor(private _fb: FormBuilder, private dialog: MatDialog, private route: ActivatedRoute, private dialogRef: MatDialogRef<ClaimUpdateModalComponent>, @Inject(MAT_DIALOG_DATA) data,
		private router: Router, private service: CustomerService, private toasterComponent: ToasterComponent,
		private sharedDataService: SharedDataService, private emitterService: EmitterService) {
		this.addClaimIds = data.addCalimIds;
		this.claimUpdateId = data.claimUpdateId,
		this.Claimid=data.Claimid;
		
		
	};

	ngOnInit() {

		this.getUpdateType();
		this.getUpdateNextActionType();
		this.getUpdateActionType();


		this.ClaimUpdateForm = this._fb.group({
			Type: ['', Validators.required],
			With: ['', Validators.required],
			NextAction: ['', Validators.required],
			Amount: ['',[ Validators.pattern(this.moneyRegx)]],
			Info: [''],
			Description: ['', Validators.required],
			SpecialInstructions: [''],
		});
		

		this.editGetForm();
		this.setUpdateValidators();
	};
	
	hasError (controlName: string, errorName: string) {
		return this.ClaimUpdateForm.controls[controlName].hasError(errorName);
	  }
	//get call Api Type
	getUpdateType() {
		this.sharedDataService.getUpdateType().subscribe((data: any) => {
			this.updateType = data.items
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};
	//get call Api With
	getUpdateActionType() {
		this.sharedDataService.getUpdateActionType().subscribe((data: any) => {
			this.updateAction = data.items
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};
	//get call Api  NextActionType
	getUpdateNextActionType() {
		this.sharedDataService.getUpdateNextActionType().subscribe((data: any) => {
			this.updateNextType = data.items
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};
	//Edit form display the existing record using patch value
	//checking conditon ADD AND EDIT
	editGetForm() {
		if (this.Claimid) {
			this.service.geteditUpdate(this.Claimid, this.claimUpdateId).subscribe((data: any) => {
				this.claimeditUpdateForm = data;
				this.ClaimUpdateForm.patchValue({
					Type: this.claimeditUpdateForm.typeId,
					With: this.claimeditUpdateForm.actionTypeId,
					NextAction: this.claimeditUpdateForm.nextActionTypeId,
					Amount: this.claimeditUpdateForm.typeId,
					Info: this.claimeditUpdateForm.additionalInfo,
					Description: this.claimeditUpdateForm.description,
					SpecialInstructions: this.claimeditUpdateForm.specialInstructions,
				})
			})
		} else {
			this.service.geteditUpdate(this.addClaimIds, this.claimUpdateId).subscribe((data: any) => {
				this.claimeditUpdateForm = data;
				this.ClaimUpdateForm.patchValue({
					Type: this.claimeditUpdateForm.typeId,
					With: this.claimeditUpdateForm.actionTypeId,
					NextAction: this.claimeditUpdateForm.nextActionTypeId,
					Amount: this.claimeditUpdateForm.updateAmt,
					Info: this.claimeditUpdateForm.additionalInfo,
					Description: this.claimeditUpdateForm.description,
					SpecialInstructions: this.claimeditUpdateForm.specialInstructions,

				})
			})
		}

	}
	setUpdateValidators() {
		const amountControl = this.ClaimUpdateForm.get('Amount');
		//const infoControl = this.ClaimUpdateForm.get('Info');

		this.ClaimUpdateForm.get('Type').valueChanges.subscribe((data: any) => {
		
			if (data == 509) {
				amountControl.setValidators(null);
				this.hideLabels = true;
			} else {
				this.hideLabels = false;
				amountControl.setValidators([Validators.required]);
			}
		})
	}

	//Save History
	saveUpdateDetils() {
		if (this.ClaimUpdateForm.invalid) {
			return;
		}
		if (this.Claimid) {
			const UpdateDetails = {
				typeId: this.ClaimUpdateForm.get('Type').value,
				actionTypeId: this.ClaimUpdateForm.get('With').value,
				nextActionTypeId: this.ClaimUpdateForm.get('NextAction').value,
				updateAmt: this.ClaimUpdateForm.get('Amount').value,
				additionalInfo: this.ClaimUpdateForm.get('Info').value,
				description: this.ClaimUpdateForm.get('Description').value,
				specialInstructions: this.ClaimUpdateForm.get('SpecialInstructions').value,

			};
			this.service.saveclaimUpdate(this.Claimid, UpdateDetails).subscribe((data: any) => {
				this.emitterService.refreshClaimupdatepopup.emit(true)

				this.dialogRef.close();
			},
				error => {
					this.toasterComponent.onError(error);
				}
			);
		} else {
			const UpdateDetailsadd = {
				typeId: this.ClaimUpdateForm.get('Type').value,
				actionTypeId: this.ClaimUpdateForm.get('With').value,
				nextActionTypeId: this.ClaimUpdateForm.get('NextAction').value,
				updateAmt: this.ClaimUpdateForm.get('Amount').value,
				additionalInfo: this.ClaimUpdateForm.get('Info').value,
				description: this.ClaimUpdateForm.get('Description').value,
				specialInstructions: this.ClaimUpdateForm.get('SpecialInstructions').value,
			};
			this.service.saveclaimUpdate(this.addClaimIds, UpdateDetailsadd).subscribe((data: any) => {
				this.emitterService.refreshClaimupdatepopup.emit(true)
				this.dialogRef.close();
			},
				error => {
					this.toasterComponent.onError(error);
				}
			)
		}
	};
	//Update History
	UpdateDetils() {
		if (this.ClaimUpdateForm.invalid) {
			return;
		}
		if (this.Claimid) {
			const UpdateDetails = {
				typeId: this.ClaimUpdateForm.get('Type').value,
				actionTypeId: this.ClaimUpdateForm.get('With').value,
				nextActionTypeId: this.ClaimUpdateForm.get('NextAction').value,
				updateAmt: this.ClaimUpdateForm.get('Amount').value,
				additionalInfo: this.ClaimUpdateForm.get('Info').value,
				description: this.ClaimUpdateForm.get('Description').value,
				specialInstructions: this.ClaimUpdateForm.get('SpecialInstructions').value,
			};
			this.service.updateclaimUpdate(this.Claimid, this.claimUpdateId, UpdateDetails).subscribe((data: any) => {
				this.emitterService.refreshClaimupdatepopup.emit(true)

				this.dialogRef.close();
			},
				error => {
					this.toasterComponent.onError(error);
				}
			)

		} else {
			const UpdateDetails = {
				typeId: this.ClaimUpdateForm.get('Type').value,
				actionTypeId: this.ClaimUpdateForm.get('With').value,
				nextActionTypeId: this.ClaimUpdateForm.get('NextAction').value,
				updateAmt: this.ClaimUpdateForm.get('Amount').value,
				additionalInfo: this.ClaimUpdateForm.get('Info').value,
				description: this.ClaimUpdateForm.get('Description').value,
				specialInstructions: this.ClaimUpdateForm.get('SpecialInstructions').value,
				Claimid: this.addClaimIds
			};
			this.service.updateclaimUpdate(this.addClaimIds, this.claimUpdateId, UpdateDetails).subscribe((data: any) => {
				this.emitterService.refreshClaimupdatepopup.emit(true)
				this.dialogRef.close();
			},
				error => {
					this.toasterComponent.onError(error);
				}
			)
		}
	};
	//close icon
	close() {
		this.dialogRef.close();
	}
	validateAmount(event){
		const amountRegx = /^([0-9]*(\.[0-9]?)?)$/
		if(!amountRegx.test(event.target.value)){
			event.preventDefault()

		}
	}
	isNumber(evt) {
	    var iKeyCode = (evt.which) ? evt.which : evt.keyCode
	    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
	        return false;

	    return true;
	}
}