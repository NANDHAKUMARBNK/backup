import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RMSApiService } from "common/services/RMSApiService";
@Component({
	selector: 'app-shipprofile',
	templateUrl: '../../../../../../../Views/CruiseLines/ShipProfile.html',
	styles: []
})
export class ShipProfileComponent {
	CShip: string = "CRUISELINE_SHIP"
	ShipId: any;
	cruiseId: string;
	constructor(private router: Router, private route: ActivatedRoute, private rmsapiservice: RMSApiService,
	) {
		this.ShipId = this.route.snapshot.paramMap.get('id');
		this.cruiseId = this.route.snapshot.paramMap.get('cruiseLineId');
	
	}
	ngOnInIt() { }

	backpage() {
		this.router.navigateByUrl('/Ship');
	};

	clickVoyages() {
		this.router.navigate(['/Voyage', { ShipId: this.ShipId, CruiseId: this.cruiseId }])
	
	}
	viewShoppingExpert() {
	
		let shipId = this.route.snapshot.paramMap.get('id');
	
		localStorage.setItem('shipId', shipId);
		let cruiseLineId = this.route.snapshot.paramMap.get('cruiseLineId');
	
		localStorage.setItem('cruiseLineId', cruiseLineId);
		let rmmName = this.route.snapshot.paramMap.get('rmmName');
		localStorage.setItem('rmmName', rmmName);
		window.location.href = "/Operations#/PSG";
	}
}


