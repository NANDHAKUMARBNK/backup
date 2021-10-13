import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { SharedDataService } from 'common/services/SharedDataService';
import { EmitterService } from 'common/services/emitterService';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MessageService } from 'primeng/api';
import { CouponBookService } from '../../Service/CouponBookService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { RMSApiService } from 'common/services/RMSApiService';

@Component({
	selector: 'app-upload',
	templateUrl: '../../../../../../../Views/CouponBook/Upload.html',
	styleUrls: ['../../../../../../common/styles/Modal.scss'],

})
export class UplaodComponent {
	appName = 'UploadBudget';
	upload: File;
	Claimid: any;
	filename: any;
	cacheId: any;
	ClaimDocumentForm: FormGroup;
	section: string;
	uploadedFiles: any;
	name: any;
	uploadfileshow: boolean = false;
	budgetProfileData: any;

	constructor(private router: Router, private dialog: MatDialog, private toasterComponent: ToasterComponent, private rMSApiService:RMSApiService,
		private sharedDataService: SharedDataService, private activeroute: ActivatedRoute, private couponBookService: CouponBookService,
		private fb: FormBuilder, private emitterService: EmitterService, private messageService: MessageService) {

		this.Claimid = this.activeroute.snapshot.queryParamMap.get('Claimid')
	}
	ngOnInit() {
		this.ClaimDocumentForm = this.fb.group({
			profile: ['', Validators.required]
		});
		this.getBudgetProfile();

	};

	getBudgetProfile() {
		this.couponBookService.getBudgetProfile().subscribe((data: any) => {
			this.budgetProfileData = data;
		})
	}


	/* === click on browse get the fileName=========*/
	browse(event) {
		for (let file of event.files) {
			this.upload = file;
			this.filename = file.name
		}
		this.uploadedFiles = event.files;
		this.uploadfileshow = true;
	}

	/* === click on upload call the API=========*/
	onUpload(formData: any, formDirective: FormGroupDirective): void {
		if (this.ClaimDocumentForm.invalid) {
			return;
		} else if (this.upload == undefined) {
			this.toasterComponent.notUploadFile();
			return;
		}

		let profileId = this.ClaimDocumentForm.get('profile').value;
		this.rMSApiService.showLoader(true);
		this.couponBookService.uploadBudgetExcel(this.upload, profileId).subscribe(
			(data: any) => {
				let message = data;
				this.upload = null;
				formDirective.resetForm();
				this.ClaimDocumentForm.reset();
				//this.toasterComponent.onSucess();
				this.rMSApiService.showLoader(false);
				this.toasterComponent.excelFormatSucess(message);
				this.uploadfileshow = false;
			},
			error => {
				this.rMSApiService.showLoader(false);
				if (error.status >= 500 || error.status < 600) {
					this.toasterComponent.excelFormatError(error)
				}
			}
		)
	}
}