import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { ApplyChildrenModalComponent } from './ApplyChildrenModalComponent';
import { ContractService } from '../Service/ContractService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { Location, DatePipe } from '@angular/common';
import { EmitterService } from 'common/services/emitterService';
@Component({
	selector: 'app-retailercontract',
	templateUrl: '../../../../../../../Views/Finance/RetailerContract.html',
	styles: []
})
export class RetailerContractComponent {
	config = new MatDialogConfig();
	RetailerContract: string = "RETAILER_CONTRACT";
	contractId: any;
	historyData: any;
	hideActions: boolean = false;
	categoryCode: any;
	actionData: any;
	parentCustomerId: any;
	gpCustomerId: any;
	categoryId: any;
	typeId: any;
	cruiseLineId: any;

	constructor(private router: Router, private dialog: MatDialog, private toasterComponent: ToasterComponent, private location: Location,
		private route: ActivatedRoute, private contractService: ContractService,private emitterService:EmitterService,	) {
		this.contractId = this.route.snapshot.queryParamMap.get('contractId');
		this.categoryCode = this.route.snapshot.queryParamMap.get('categoryCode');
		this.parentCustomerId = this.route.snapshot.queryParamMap.get('parentCustomerId');
		this.gpCustomerId = this.route.snapshot.queryParamMap.get('gpcustomerId');
		this.cruiseLineId = this.route.snapshot.queryParamMap.get('cruiseLineId');
		this.categoryId = this.route.snapshot.queryParamMap.get('categoryId');
		this.typeId = this.route.snapshot.queryParamMap.get('typeId');

	}
	ngOnInit() {
	
		 window.scrollTo(0, 0)
		//  this.router.events.subscribe((evt) => {
        //     if (!(evt instanceof NavigationEnd)) {
        //         return;
        //     }
        //     window.scrollTo(0, 0)
        // });
		if (this.contractId) {
			this.emitterService.refreshContractProfile.subscribe((data:any)=>{
				this.historyData=data;
				console.log(this.historyData)
				})
			//this.getHistory();
			this.getContractActions();
		}
		
	};

	getHistory() {
		this.contractService.getContractHistory(this.contractId).subscribe((data: any) => {
			this.historyData = data.items[0];
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};

	getContractActions() {
		this.contractService.getContractActions(this.gpCustomerId).subscribe((data: any) => {
			this.actionData = data;
			let actionhasChildren = this.actionData ? this.actionData.hasChildren : '';
		
			if (this.contractId && this.categoryCode == "MEDIA") {
				this.hideActions = false;
			} else if (this.contractId && actionhasChildren == 1) { //&& actionhasChildren==1
				this.hideActions = true;
			} 
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	}



	backpage() {
		//this.router.navigateByUrl('/Retailer/profile')
		this.location.back();
	};


	applyChildren() {
		this.config.data = {
			parentCustomerId: this.parentCustomerId,
			contractId: this.contractId,
			cruiseLineId: this.cruiseLineId,
			categoryId: this.categoryId,
			typeId: this.typeId
		}
		
		let dialogRef = this.dialog.open(ApplyChildrenModalComponent, this.config);
	}
}
