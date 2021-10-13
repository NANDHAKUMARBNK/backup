import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ClaimUpdateModalComponent } from './ClaimUpdateModalComponent';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../Service/CustomerServices';
import { SharedDataService } from 'common/services/SharedDataService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { RMSApiService } from 'common/services/RMSApiService';
declare var $: any;

@Component({
	selector: 'app-claimupdate',
	templateUrl: '../../../../../../Views/CustomerServices/ClaimUpdate.html',
	styleUrls: ['../../styles/Tabs.scss']
})

export class ClaimUpdateComponent {
	show: boolean = false;
	@Input() addClaimDetailId: any;
	@Input() searchClick: any;
	Claimid: any;
	claimUpdate: object[] = [];

	config = new MatDialogConfig();

	constructor(private dialog: MatDialog, private _fb: FormBuilder, private route: ActivatedRoute, private toasterComponent: ToasterComponent,
		private router: Router, private service: CustomerService, private rMSApiService: RMSApiService,
		private sharedDataService: SharedDataService, private emitterService: EmitterService) {
		this.Claimid = this.route.snapshot.queryParamMap.get('Claimid');
	};

	ngOnInit() {
		this.getClaimUpdate();

		this.emitterService.refreshClaimupdatepopup.subscribe(d => {
			this.claimUpdate = [];
			this.getClaimUpdate();
		})
	};

	ngOnChanges() {
	
		this.rMSApiService.buttonClickEventTrack.subscribe((data: any) => {
			this.Claimid = data.id;
			this.service.getclaimUpdate(this.Claimid).subscribe((data: any) => {
				this.claimUpdate = data.items;
			},
				error => {
					this.toasterComponent.onError(error);
				}
			);
		});

	}


	//getclaimupdate list
	getClaimUpdate() {
		if (this.Claimid) {
			this.service.getclaimUpdate(this.Claimid).subscribe((data: any) => {
				this.claimUpdate = data.items;
			},
				error => {
					this.toasterComponent.onError(error);
				}
			);
		} else if (this.addClaimDetailId) {
			this.service.getclaimUpdate(this.addClaimDetailId).subscribe((data: any) => {
				this.claimUpdate = data.items;
			},
				error => {
					this.toasterComponent.onError(error);
				}
			)
		}

	};

	//click on add history open popup 
	addHistory() {
		this.config.data = {
			addCalimIds: this.addClaimDetailId,
			Claimid: this.Claimid
		};
		let dialogRef = this.dialog.open(ClaimUpdateModalComponent, this.config);
	};

	//click on add edit icon open popup 
	addUpdateHistory(e) {
		this.config.data = {
			addCalimIds: this.addClaimDetailId,
			claimUpdateId: e,
			Claimid: this.Claimid
		};
		let dialogRef = this.dialog.open(ClaimUpdateModalComponent, this.config);
	}

	showmore(i) {
		this.claimUpdate[i]['show'] = !this.claimUpdate[i]['show']

	}

}