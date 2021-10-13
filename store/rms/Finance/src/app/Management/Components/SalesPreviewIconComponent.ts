import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AffidavitDetailComponent } from './AffidavitDetailComponent';
import { SalesHistoryComponent } from './SalesHistoryComponent';
import { ManagementService } from '../service/ManagementService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { DOCUMENT } from '@angular/common';

@Component({
	selector: 'app-salespreviewicon',
	templateUrl: "../../../../../../../Views/Finance/Management/SalesPreviewIcon.html",

})
export class SalesPreviewIconComponent {
	data: any;
	responseData: any;
	config = new MatDialogConfig();

	constructor(private dialog: MatDialog, @Inject(DOCUMENT) private document: Document, private toasterComponent: ToasterComponent, private rMSApiService: RMSApiService, private managementService: ManagementService) {

	}

	agInit(params) {

		this.data = params.data;

	};
	iconPreviewForSales() {
		let customerId = this.data.customerID;
	
		this.document.location.href = `api/finance/invoice/report/${customerId}?typeCode=${this.data.invoiceTypeCode}&gpDocumentNumber=${this.data.gpDocumentNumber}`
	}
}