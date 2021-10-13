import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { SharedDataService } from 'common/services/SharedDataService';
import { EmitterService } from 'common/services/emitterService';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MessageService } from 'primeng/api';
import { CustomerService } from '../Service/CustomerServices';
import { ConfirmationModalComponent } from 'common/components/ConfirmationModal';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { RMSApiService } from 'common/services/RMSApiService';
declare var $: any;

@Component({
	selector: 'app-claimdocument',
	templateUrl: '../../../../../../Views/CustomerServices/ClaimDocument.html',
	styleUrls: ['../../../../../common/styles/Modal.scss']
})

export class ClaimDocumentComponent {

	upload: File;
	Claimid: any;
	filename: any;
	cacheId: any;
	ClaimDocumentForm: FormGroup;
	@Input() addClaimDetailId: any;
	@Input() searchClick:any;
	section: string;
	name: any;
	Documents: object[] = [];
	Documentsedit: object[] = [];
	successLabel: boolean = false;
	errorLabel: boolean = false;
	config = new MatDialogConfig();
	download: any;
	uploadedFiles: any;
	filenameshow: boolean = false;
//.nameRegEx = '^[a-zA-Z0-9_ ]*$'
	//pattern="^[^-\s][a-zA-Z0-9_ ]+$"


	constructor(private router: Router, private dialog: MatDialog, private rMSApiService: RMSApiService,
		private sharedDataService: SharedDataService, private activeroute: ActivatedRoute, private toasterComponent: ToasterComponent,
		private fb: FormBuilder, private emitterService: EmitterService, private messageService: MessageService, private customerService: CustomerService) {

		this.Claimid = this.activeroute.snapshot.queryParamMap.get('Claimid')
	}

	ngOnInit() {
		this.setFormControls();

		this.getmediaDocuments();

		this.emitterService.refreshClaimDocument.subscribe(d => {
			this.Documents = [];
			this.getmediaDocuments();
		});

	

	};

	setFormControls(){
	
		this.ClaimDocumentForm = this.fb.group({
			name: ['', [Validators.required]],
		});
	};

	hasError(controlName: string, errorName: string) {
		return this.ClaimDocumentForm.controls[controlName].hasError(errorName);
	};

	ngOnChanges(){
	
		this.rMSApiService.buttonClickEventTrack.subscribe((data: any) => {
			this.Claimid = data.id;
			this.section = "CUSTSVC";
			this.sharedDataService.getmediaDocuments(this.Claimid, this.section).subscribe((data: any) => {
				this.Documents = data.items;
				//this.Documents = data.items;
			},
				error => {
					this.toasterComponent.onError(error);
				}
			)
		})

	}

	getmediaDocuments() {
		this.section = "CUSTSVC";
		if (this.addClaimDetailId) {
			this.sharedDataService.getmediaDocuments(this.addClaimDetailId, this.section).subscribe((data: any) => {
				this.Documents = this.Documents.concat(data.items);
				//this.Documents = data.items;
			},
				error => {
					this.toasterComponent.onError(error);
				}
			)
		} else if (this.Claimid) {
			this.sharedDataService.getmediaDocuments(this.Claimid, this.section).subscribe((data: any) => {
				this.Documents = this.Documents.concat(data.items);
				//this.Documents = data.items;
			},
				error => {
					this.toasterComponent.onError(error);
				}
			)

		}
	}


	//Upload call Api

	onUpload(event) {
		for (let file of event.files) {
			this.upload = file;
			this.filename = file.name
		}

		this.filenameshow = true;
		this.uploadedFiles = event.files;
	
		

		this.sharedDataService.uploadfile(this.upload).subscribe(
			(data: any) => {
				this.cacheId = data;
				//this.successLabel = true;
				//this.toasterComponent.onUpload();
				//this.emitterService.refreshClaimDocument.emit(true)
				var elm = document.getElementById("imgDisplayUpload");
				elm.setAttribute("p", `/api/media/cached-content/${this.cacheId}/document`);
			},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	}
	//Save Document Call Api 
	// checking two conditions EDIT AND ADD CLAIM 
	isTrue:boolean = true;
	nameval: string;
	saveDocument(formData: any, formDirective: FormGroupDirective): void {
		this.section = "CUSTSVC";
		this.name = this.ClaimDocumentForm.get('name').value;
		if (this.ClaimDocumentForm.invalid) {
            return;
        } else if (!this.filename || this.filename.length == 0) {
			this.toasterComponent.notUploadFile();
			return;
		}

		if (this.Claimid) {
			this.customerService.saveDocument(this.section, this.Claimid, this.cacheId, this.filename, this.name).subscribe((data: any) => {
				this.toasterComponent.onSucess();
				formDirective.resetForm();
				this.ClaimDocumentForm.reset();
				this.filename = null;
				this.filenameshow = false;
				//this.ClaimDocumentForm.markAsPristine();
				this.emitterService.refreshClaimDocument.emit(true);
		
				this.uploadedFiles = [];
				
				// (<HTMLInputElement>document.getElementById("reqCheck")).required = false
				this.isTrue = false;


			},
				error => {
					this.toasterComponent.onError(error);
				}
			)
		} else if (this.addClaimDetailId) {
			this.customerService.saveDocument(this.section, this.addClaimDetailId, this.cacheId, this.filename, this.name).subscribe((data: any) => {
				this.toasterComponent.onSucess();
				formDirective.resetForm();
				this.ClaimDocumentForm.reset();
				this.emitterService.refreshClaimDocument.emit(true);
				this.filename = null
				this.filenameshow = false;
				this.uploadedFiles = [];
				// (<HTMLInputElement>document.getElementById("reqCheck")).required = false
				this.isTrue = false;
			},
				error => {
					this.toasterComponent.onError(error);
				}
			)
		}
	};


	downloadFile(Docname) {
		this.download = true;
		window.location.href = `api/media/content?key=${Docname.downloadKey}&download=${this.download}`;
	}

	//Delete Document 
	deletedocument(Docname) {
		this.config.data = {
		};

		let dialogRef = this.dialog.open(ConfirmationModalComponent, {
			disableClose: false,
			width: '400px',
		});
		dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete this document?"

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				// do confirmation actions
				this.sharedDataService.deleteDocument(Docname.id).subscribe(data => {
					this.emitterService.refreshClaimDocument.emit(true);
				},
					error => {
						this.toasterComponent.onError(error);
					}
				)
			}
		});
	};

    clearFields(formDirective: FormGroupDirective) {
        this.upload = null;
        this.filename = null;
        this.filenameshow = false;
        formDirective.resetForm();
    }
}