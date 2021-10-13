import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AddFeeComponent } from './AddFeeComponent';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';

@Component({
	selector: 'app-profile',
	templateUrl: '../../../../../../../Views/CruiseLines/Profile.html',
	styleUrls: ['../../../styles/cruiseLine.scss','../../../../../../common/styles/AgGrid.scss']
})
export class ProfileComponent {
	cruiseLineId: any;
	cruiseLineProfileData: any;
	config = new MatDialogConfig();
	constructor(private http: HttpClient, private route: ActivatedRoute,
		private fb: FormBuilder, private router: Router,
		private sharedDataService: SharedDataService,
		private emitterService: EmitterService,
		private cruiseLineService: CruiseLineService,
		private rMSApiService: RMSApiService,
		private toasterComponent: ToasterComponent
	) {

	}
	ngOnInit() {
		this.route.params.subscribe(params => {
			this.cruiseLineId = params['id'];
		});
		this.getCruiseLineProfile();
	};

	getCruiseLineProfile() {
		this.rMSApiService.showLoader(true);
		this.cruiseLineService.getCruiseLineProfile(this.cruiseLineId).subscribe((data: any) => {
			this.cruiseLineProfileData = data;
			this.rMSApiService.showLoader(false);
		},
			error => {
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);
				this.router.navigateByUrl('/Error')

			}

		)
	};
    
}

