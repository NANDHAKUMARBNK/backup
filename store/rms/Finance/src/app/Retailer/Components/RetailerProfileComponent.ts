import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { ContractService } from '../Service/ContractService';
import { SharedDataService } from 'common/services/SharedDataService';
import { ToasterComponent } from 'common/components/ToasterComponent';
@Component({
	selector: 'app-retailerprofile',
	templateUrl: '../../../../../../../Views/Finance/RetailerProfile.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss']
})
export class RetailerProfileComponent {
	RetailerProfile = "Profile";
	customerId: any;
	profileData: any;
	gpCustomerId: any;
	parentGPCustomerId: any;
	constructor(private router: Router, private route: ActivatedRoute,
		private emitterService: EmitterService, private contractService: ContractService, private sharedDataService: SharedDataService, private toasterComponent: ToasterComponent,
		private rMSApiService: RMSApiService
	) {
		this.customerId = this.route.snapshot.queryParamMap.get('customerId');
		this.gpCustomerId = this.route.snapshot.queryParamMap.get('gpCustomerId');
		this.parentGPCustomerId = this.route.snapshot.queryParamMap.get('parentGPCustomerId');
	};

	ngOnInit() {
		window.scrollTo(0, 0)
		//  this.router.events.subscribe((evt) => {
		//     if (!(evt instanceof NavigationEnd)) {
		//         return;
		//     }
		//     window.scrollTo(0, 0)
		// });
		this.getProfileRetailer();
	};


	getProfileRetailer() {
		this.rMSApiService.showLoader(true);
		this.contractService.getProfileRetailer(this.customerId).subscribe((data: any) => {
			this.profileData = data;
			this.rMSApiService.showLoader(false);
			this.rMSApiService.setData(data);
		},
		error=>{
			this.rMSApiService.showLoader(false);
			this.router.navigate(['/Error'])
		}
		)
	};
	backpage() {

		this.router.navigateByUrl('/Retailer')

	}
}