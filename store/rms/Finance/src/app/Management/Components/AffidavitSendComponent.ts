import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig } from "@angular/material";
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { EmitterService } from 'common/services/emitterService';
import { error } from 'util';
import { RMSApiService } from 'common/services/RMSApiService';
import { ErrorModalComponent } from 'common/components/ErrorModalComponent';
import { ToasterComponent } from 'common/components/ToasterComponent';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { ManagementService } from '../service/ManagementService';
import { FormControl, Validators } from '@angular/forms';
@Component({
    selector: 'app-affidavitdetail',
    templateUrl: "../../../../../../../Views/Finance/Management/AffidavitSend.html",

})

export class AffidavitSendComponent {
    data: any;
    config = new MatDialogConfig();
    hidenote: boolean = false;
    hideButton: boolean = false;
    radio = new FormControl(true);
    emailnote = new FormControl('');
    checkData: any;
    chekedLength: any;
    items: any;
    responseData: any;
    getErrorMessage() {
        return this.emailnote.hasError('required') ? 'Note Required' : '';
    }
    constructor(@Inject(MAT_DIALOG_DATA) public configData: any, private emitterService: EmitterService,
        private toasterComponent: ToasterComponent, private managementService: ManagementService, private http: HttpClient, private route: ActivatedRoute, private dialogRef: MatDialogRef<AffidavitSendComponent>, private rmsApiService: RMSApiService) {

    }
    ngOnInit() {
        this.checkData = this.rmsApiService.getCheckedDataSettlement();
        this.chekedLength = this.checkData.length;
        this.radioTriggers();
      
    }
    close() {
        this.dialogRef.close();
    }
    saveDoc() {
        this.dialogRef.close();
    }
    radioTriggers() {
        this.radio.valueChanges.subscribe((data) => {
            if (data == false) {
                this.hidenote = true;
                this.emailnote.setValidators(Validators.required)
            }
            else {
              
                this.hidenote = false;
            }
        })
    }

    save() {
        if (this.emailnote.invalid && this.radio.value == false) {
            return;
        }
        let tempArray = [];
        this.checkData.forEach(element => {
            let temobj = { "contractId": element.contractID }
            tempArray.push(temobj);
        });

        const req = {
            emailTemplateCode: this.configData.email_uniqueId,
            EmailNote: this.emailnote.value,
            affidavitRequest: tempArray
        };
        
        this.rmsApiService.showLoader(true);
        this.managementService.saveAffidavit(req).subscribe((response: any) => {
            this.responseData = response;
            this.rmsApiService.showLoader(false);
            if (this.responseData.retID > 0) {
                this.dialogRef.close();
                this.toasterComponent.dynamicMessage(this.responseData);
                this.emitterService.refreshsaveAffidavit.emit(true);
                this.rmsApiService.removeCheckedDataSettlement();
            } else {
                this.toasterComponent.contractValidation(this.responseData);
                this.rmsApiService.removeCheckedDataSettlement();
            }
        },
            error => {
                this.rmsApiService.showLoader(false);
                this.toasterComponent.onError(error);
            }
        )
    }

}