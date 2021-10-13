import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { ManagementService } from '../service/ManagementService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SharedDataService } from 'common/services/SharedDataService';
import { RMSApiService } from 'common/services/RMSApiService';
@Component({
	selector: 'app-salescomment',
	templateUrl: '../../../../../../../Views/Finance/Management/SalesComment.html'


})
export class SalesCommentComponent {
	commentsales = new FormControl('', [Validators.required]);
	commentSection = "FINANCE_SALES";
	Data: any;
	editCommentData: any;
	notesForm: FormGroup;
	comment: any;

	constructor(private dialogRef: MatDialogRef<SalesCommentComponent>, @Inject(MAT_DIALOG_DATA) data, private rMSApiService: RMSApiService,
		private sharedDataService: SharedDataService, private toasterComponent: ToasterComponent, private fb: FormBuilder,
		private toastercomponent: ToasterComponent, private managementService: ManagementService, private route: ActivatedRoute) {
		this.Data = data
	
	}

	ngOnInit() {
		//this.editComment();
		this.notesForm = this.fb.group({
			commentsales: ['', Validators.required],
		})
	
	};

	editComment() {
		this.sharedDataService.getEditNotes(this.Data.commentId, this.commentSection, this.Data.id).subscribe((data: any) => {
			this.editCommentData = data;
			this.commentsales.patchValue(this.editCommentData.name)
		},
			error => {
				this.toasterComponent.onError(error);

			}
		)
	};
	saveComment() {
		if (this.notesForm.invalid) {
			return
		}
		this.comment = this.notesForm.get('commentsales').value;
		this.rMSApiService.showLoader(true)
		this.sharedDataService.saveNotes(this.commentSection, this.Data.id, this.comment).subscribe((data: any) => {
			this.rMSApiService.showLoader(false);
			
			this.dialogRef.close();
			this.toasterComponent.onSucess();

		},
			error => {
				this.toasterComponent.onError(error);
				this.rMSApiService.showLoader(false);

			}
		)
	};


	updateComment() {
		this.rMSApiService.showLoader(true);
		this.sharedDataService.updateNotes(this.Data.commentId, this.commentSection, this.Data.id, this.commentsales.value).subscribe((data: any) => {
			this.rMSApiService.showLoader(false);
		}, error => {
			this.toasterComponent.onError(error);
			this.rMSApiService.showLoader(false);

		}
		)
	};

	close() {
		this.dialogRef.close();
	}

}