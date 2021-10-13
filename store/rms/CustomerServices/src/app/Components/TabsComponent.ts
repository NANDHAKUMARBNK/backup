import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SharedDataService } from 'common/services/SharedDataService';
import { EmitterService } from 'common/services/emitterService';
import { MatTabChangeEvent } from '@angular/material';

@Component({
	selector: 'app-tabs',
	templateUrl: '../../../../../../Views/CustomerServices/Tabs.html',
	styleUrls: ['../../styles/Tabs.scss']
})

export class TabsComponent {
	selectedIndex: number = 0;
	Claimid: any;
	addClaimId: any;
	addClaimDetailId: any;
	searchClick:any;
	tab: any;
	constructor(private location: Location, private router: Router, private route: ActivatedRoute, ) {

		this.Claimid = this.route.snapshot.queryParamMap.get('Claimid');
	}

	onLinkClick(event: MatTabChangeEvent) {
	
		if (event.index == 1) {
			this.addClaimId;
			this.selectedIndex = 1;
		} else if (event.index == 0) {
			this.selectedIndex= 0;
		}
	}
	backpage() {
		this.location.back()
	}
	selectedTabChange(e) {
	}

	claimDetil(e) {
		this.selectedIndex = 1;
		this.searchClick=e;
	
	}

	next(e) {
		this.addClaimId = e
		if (this.addClaimId) {
			this.selectedIndex = 1;

		} else if (this.Claimid) {
			this.selectedIndex = 1;
		}
	};
	changeTabUpdate(e) {
		this.addClaimDetailId = e;
		this.selectedIndex = 2;
	}
}