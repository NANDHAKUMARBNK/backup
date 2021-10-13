import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RMSApiService } from 'common/services/RMSApiService';
@Component({
	selector: 'app-cruiselineprofile',
	templateUrl: '../../../../../../../Views/CruiseLines/CruiseLineProfile.html',
	styleUrls: ['../../../styles/cruiseLine.scss']
})
export class CruiseLineProfileComponent {
	// title = 'CruiseLines';
	cruiseLine="CRUISELINE"
	cruiseLineId:any;
	constructor(private router: Router, private route: ActivatedRoute,private rMSApiService:RMSApiService) {
		this.route.params.subscribe(params => {
			this.cruiseLineId = params['id'];
		});
	}

	ngOnInIt() { }

	ViewShips() {
		this.rMSApiService.setcascaddingitem(this.cruiseLineId);
		this.router.navigate(['/Ship',{
			id: this.cruiseLineId
		}])
		
	};
	ViewVoyages() {
		this.rMSApiService.setcascaddingitem(this.cruiseLineId);
		this.router.navigate(['/Voyage',{
			CruiseId: this.cruiseLineId
		}])
	}
	backpage() {
		this.router.navigateByUrl('/CruiseLine')
	}
}