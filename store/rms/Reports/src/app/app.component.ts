import { Component, ElementRef } from '@angular/core';
import { RMSApiService } from 'common/services/RMSApiService';

@Component({
	selector: 'app-root',
	templateUrl: '../../../../../Views/Reports/App.Component.html',
	styleUrls: ['../../../../common/styles/commonApp.scss']

})
export class AppComponent {
	appName = "Reports";
	reporting_base_url: any;

	constructor(private elementRef: ElementRef, private rMSApiService: RMSApiService) {
		this.reporting_base_url = this.elementRef.nativeElement.getAttribute('reporting-base-url');
		this.rMSApiService.SetReportUrl(this.reporting_base_url);
	}


}
