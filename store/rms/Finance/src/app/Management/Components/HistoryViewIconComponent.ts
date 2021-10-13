import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ManagementService } from '../service/ManagementService';
import { ToasterComponent } from 'common/components/ToasterComponent';



@Component({
	selector: 'app-historyviewicon',
	templateUrl: "../../../../../../../Views/Finance/Management/HistoryViewIcon.html",

})
export class HistoryViewIconComponent {
	data: any;
	config = new MatDialogConfig();
	items: any;

	constructor(private dialog: MatDialog, @Inject(DOCUMENT) private document: Document, private managementService: ManagementService, private toasterComponent: ToasterComponent) {

	}
	ngOnInit() {

	}
	agInit(params) {
		this.data = params.data;

	};

	viewIcon() {
		if (this.data.typeCode == null)
			this.data.typeCode = "";
		this.document.location.href = `api/finance/history/invoice_report/${this.data.id}?typeCode=${this.data.typeCode}`
		//window.location.href = `api/finance/history/invoice_report?invoiceId=${this.data.invoiceId}`;
	}

}