import { Component } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RMSApiService } from 'common/services/RMSApiService';
import { Observable } from 'rxjs';
@Component({
	selector: 'app-affidavittab',
	templateUrl: '../../../../../../../Views/Finance/Management/AffidavitTab.html',

})
export class AffidavitTabComponent {
	currentUser: any;
	userInfo: any;
	AffidavitTab: boolean = false;
	salesTab: boolean = false;
	invoiceTab: boolean = false;
	historyTab: boolean = false;

	constructor(
		private router: Router, private rmsApiService: RMSApiService) {

	}

	ngOnInit() {
		this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
		console.log(this.userInfo, 'userInfo')
		let roleGA = this.userInfo.roles.find(item => item == 'Global Admin');
		let roleFinSAdmin = this.userInfo.roles.find(item => item == 'Finance Sales Admin');
		let roleFinOps = this.userInfo.roles.find(item => item == 'Finance Operations');

		if (roleGA) {
			this.salesTab = true;
			this.AffidavitTab = true;
			this.invoiceTab = true;
			this.historyTab = true;
		}
		if (roleFinOps && roleFinSAdmin) {
			this.AffidavitTab = true;
			this.invoiceTab = true;
			this.historyTab = true;
			this.salesTab = true;
		}else if (roleFinOps) {
			this.AffidavitTab = true;
			this.invoiceTab = true;
			this.historyTab = true;
			this.salesTab = false;
		} else if (roleFinSAdmin) {
			this.router.navigate(['/Management/sales']);
			this.salesTab = true;
			this.AffidavitTab = false;
			this.invoiceTab = false;
			this.historyTab = false;
		}
	}
}
