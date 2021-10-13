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
	selector: 'app-uploadtarget',
	templateUrl: '../../../../../../../Views/CouponBook/UploadTarget.html',
	styleUrls: ['../../../../../../common/styles/Modal.scss']
})
export class UplaodTargetComponent {
	appName = 'UploadTarget';
	upload: File;
	Claimid: any;
	filename: any;
	cacheId: any;
	ClaimTragetUploadForm: FormGroup;
	uploadedFiles: any;
	section: string;
	name: any;
	uploadfileshow: boolean = false;
	ProfileData: any;

	constructor(private router: Router, private dialog: MatDialog, private rMSApiService: RMSApiService,
		private couponBookService: CouponBookService, private toasterComponent: ToasterComponent,
		private sharedDataService: SharedDataService, private activeroute: ActivatedRoute,
		private fb: FormBuilder, private emitterService: EmitterService, private messageService: MessageService) {
		this.Claimid = this.activeroute.snapshot.queryParamMap.get('Claimid')
	}

	ngOnInit() {
		this.ClaimTragetUploadForm = this.fb.group({
			profile: ['', Validators.required]
			//name: ['', Validators.required],
		});
		this.getTargetProfile();
	};

	getTargetProfile() {
		this.couponBookService.getTargetProfile().subscribe((data: any) => {
			this.ProfileData = data;
		})
	}

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
		if (this.ClaimTragetUploadForm.invalid) {
			return;
		} else if (this.upload == undefined) {
			this.toasterComponent.notUploadFile();
			return;
		}
		let profileId = this.ClaimTragetUploadForm.get('profile').value;
		this.rMSApiService.showLoader(true);
		this.couponBookService.uploadTargetExcel(this.upload, profileId).subscribe(
			(data: any) => {
				//this.toasterComponent.onSucess();
				this.upload = null;
				formDirective.resetForm();
				this.ClaimTragetUploadForm.reset();
				this.rMSApiService.showLoader(false);
				this.toasterComponent.excelFormatSucess(data);
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