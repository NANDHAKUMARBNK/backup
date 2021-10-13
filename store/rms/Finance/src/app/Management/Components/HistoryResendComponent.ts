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
    selector: 'app-historyresend',
    templateUrl: "../../../../../../../Views/Finance/Management/HistoryResend.html",

})

export class HistoryResendComponent {
    hidenote: boolean = false;
    hideButton: boolean = false;
    radio = new FormControl(true);
    //note = new FormControl('', [Validators.required]);
    emailnote = new FormControl('');
    getErrorMessage() {
        return this.emailnote.hasError('required') ? 'Note Required' : '';
    }
    data: any;
    config = new MatDialogConfig();
    updateDataHistoryResend: any;

    constructor(@Inject(MAT_DIALOG_DATA) public configData: any, private toastercomponent: ToasterComponent,
     private managementService: ManagementService, private http: HttpClient,private emitterService:EmitterService,
      private route: ActivatedRoute, private rmsApiService: RMSApiService, private dialogRef: MatDialogRef<HistoryResendComponent>) {

    }
    agInit(params) {
        this.data = params.data;
    };

    ngOnInit() {
        this.getHistoryResendDialog();
        this.radioTriggers();
       
    }
    radioTriggers() {
        this.radio.valueChanges.subscribe((data) => {
            if (data == false) {
                this.hidenote = true;
                this.emailnote.setValidators(Validators.required)
            }
            else {
                //this.emailnote.reset();
                this.emailnote = new FormControl('');
                this.hidenote = false;
            }
        })
    }


    close() {
        this.dialogRef.close();
    }

    Dialogitems: any;
    getHistoryResendDialog() {
        let invoiceId = this.configData.id;
     
        this.managementService.getHistoryResendInvoice(invoiceId).subscribe((response: any) => {
       
            this.Dialogitems = response;
        },
            error => {
                this.toastercomponent.onError(error)
            })
    }

    updateResendHistory() {
      
        if (this.emailnote.invalid && this.radio.value == false) {
            return;
        }
        let invoiceId = this.configData.id;
        let gridRowData = this.configData;
       
        let tempArray = [];
        let temobj = { "customerId": this.configData.customerID }
        tempArray.push(temobj);
     
        const req = {
            emailNote: this.emailnote.value,
            emailTemplateCode: this.configData.emailAddress,
            invoiceRequest: tempArray
        }
        this.rmsApiService.showLoader(true);
        this.managementService.updateHistoryResend(req, invoiceId).subscribe((response: any) => {
            this.updateDataHistoryResend = response;
            this.rmsApiService.showLoader(false);
            if(this.updateDataHistoryResend<0){
              this.toastercomponent.contractValidation(this.updateDataHistoryResend);
              this.dialogRef.close();
            }else{
                this.dialogRef.close();
                this.toastercomponent.onSucess();
                this.emitterService.refreshHistory.emit(true);
            }
        }),
            error => {
                this.rmsApiService.showLoader(false);
                this.toastercomponent.onError(error);
            }

    }

}