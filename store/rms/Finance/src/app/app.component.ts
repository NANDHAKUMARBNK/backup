import { Component, ElementRef } from '@angular/core';
import { RMSApiService } from 'common/services/RMSApiService';

@Component({
	selector: 'app-root',
	templateUrl: '../../../../../Views/Finance/App.Component.html',
	styleUrls: ['../../../../common/styles/commonApp.scss']

})
export class AppComponent {
	appName = 'Finance';
	reporting_base_url:any;
	constructor(private rMSApiService:RMSApiService,private elementRef: ElementRef,) {
		this.reporting_base_url = this.elementRef.nativeElement.getAttribute('reporting-base-url');
		this.rMSApiService.SetReportUrl(this.reporting_base_url);
	}
}
