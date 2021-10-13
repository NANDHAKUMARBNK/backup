import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AffidavitDetailComponent } from './AffidavitDetailComponent';
import { AffidavitSendComponent } from './AffidavitSendComponent';


@Component({
    selector: 'app-emailicon',
    templateUrl: "../../../../../../../Views/Finance/Management/AffidavitViewIcon.html",

})
export class AffidavitViewIconComponent {
    data: any;
    config = new MatDialogConfig();

    constructor(private dialog: MatDialog) {

    }
    agInit(params) {

        this.data = params.data;
      
    };
    // /*============= itineraryHistory click on grid open popup =============*/
    affidavitIcon() {
        this.config.data = {
            id: this.data.id
        }
        let dialogRef = this.dialog.open(AffidavitSendComponent, this.config);
    };


}