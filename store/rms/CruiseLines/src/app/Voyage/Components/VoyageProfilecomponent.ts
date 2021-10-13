import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RMSApiService } from 'common/services/RMSApiService';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import moment from 'moment';
import { VoyageHistoryComponent } from './VoyageHistoryComponent';
import { MatDialog, MatDialogConfig } from '@angular/material';


@Component({
	selector: 'app-voyageprofile',
	templateUrl: '../../../../../../../Views/CruiseLines/VoyageProfile.html',
	styleUrls: ['../../../styles/cruiseLine.scss', '../../../../../../common/styles/AgGrid.scss']
})
export class VoyageProfileComponent {
	CRUISELINE_VOYAGE: string = "CRUISELINE_VOYAGE";
	cruiseLineId: any;
	shipId: any;
	embarkDateTime: any;
	shopongData: any;
	voyagesIds: any;
	cruiseLineIds: any;
	cassindingCruiseline: string;
	cassindingShip: string;
	cassindingRegion: string;
	cassindingPort: string;
	cassindingembarkStart: string;
	cassindingembarkEnd: string;
	cassindingdebarkStart: string;
	cassindingdebarkEnd: string;
	config = new MatDialogConfig();
	VoyagesId:any;


	constructor(private route: ActivatedRoute, private rmsapiservice: RMSApiService, private router: Router,
		private cruiselineService: CruiseLineService, private toasterComponent: ToasterComponent,private dialog: MatDialog,) {
		this.cruiseLineId = this.route.snapshot.paramMap.get('cruiseLineId');
		this.shipId = this.route.snapshot.paramMap.get('shipId');
		this.embarkDateTime = this.route.snapshot.paramMap.get('embarkDateTime');
		moment(this.embarkDateTime).format("YYYY-MM-DD");
		this.VoyagesId = this.route.snapshot.paramMap.get('id');


		this.cassindingCruiseline=this.route.snapshot.paramMap.get('cascadingcruiseLine');
		this.cassindingShip=this.route.snapshot.paramMap.get('cascadingShip');
		this.cassindingRegion=this.route.snapshot.paramMap.get('cascadingRegion');
		this.cassindingPort=this.route.snapshot.paramMap.get('cascadingPort');
		this.cassindingembarkStart=this.route.snapshot.paramMap.get('cascadingembarkStart');
		this.cassindingembarkEnd=this.route.snapshot.paramMap.get('cascadingembarkEnd');
		this.cassindingdebarkStart=this.route.snapshot.paramMap.get('cascadingdebarkStart');
		this.cassindingdebarkEnd=this.route.snapshot.paramMap.get('cascadingdebarkEnd');
	};


	ngOnInit() {
		this.voyagesIds = this.rmsapiservice.getVoyagesId();
		this.shopingExpert();
		
	}

	sendingCruiseLineAndShipIds() {
		let cruiseid = this.route.snapshot.paramMap.get('cruiseLineId');
		let shipid = this.route.snapshot.paramMap.get('shipId');
		let embarkDateTime = this.route.snapshot.paramMap.get('embarkDateTime');
		//let embarkDateTime = moment(voyage_embarkDateTime).format("YYYY-MM-DD");
		let debarkDateTime = this.route.snapshot.paramMap.get('debarkDateTime');
		//let debarkDateTime = moment(voyage_debarkDateTime).format('YYYY-MM-DD');
		sessionStorage.setItem('cruiseid', cruiseid);
		sessionStorage.setItem('shipid', shipid);
		sessionStorage.setItem('embarkDateTime', moment(embarkDateTime).format("MM/DD/YY"));
		sessionStorage.setItem('debarkDateTime',moment(debarkDateTime).format("MM/DD/YY"));
		window.location.href = "/CouponBook#/CouponTarget";
	}
	sendingShipIds() {
		let shipid = this.route.snapshot.paramMap.get('shipId');
		sessionStorage.setItem('salesshipid', shipid);
		let embarkDateTime = this.route.snapshot.paramMap.get('embarkDateTime');
		//let embarkDateTime = moment(voyage_embarkDateTime).format("YYYY-MM-DD");
		let debarkDateTime = this.route.snapshot.paramMap.get('debarkDateTime');
		sessionStorage.setItem('embarkDateTime', moment(embarkDateTime).format("MM/DD/YY"));
		sessionStorage.setItem('debarkDateTime',moment(debarkDateTime).format("MM/DD/YY"));

		window.location.href = "/Finance#/Management/sales";
	}
	shopingExpert() {
		this.cruiselineService.shoppingExpert(this.cruiseLineId, this.shipId, this.embarkDateTime).subscribe((data: any) => {
		
			this.shopongData = data;
		})
	};

	//[routerLink]="['/ItineraryWage']"
	wagesclick(){
	  localStorage.setItem('wages',this.cruiseLineId);
	  this.router.navigate(['/ItineraryWage'])
	  
	}

	backpage() {
		this.router.navigate(['/Voyage', { cassindingCruiseline:this.cassindingCruiseline,cascadingShip:this.cassindingShip,cassindingPort:this.cassindingPort,cassindingRegion:this.cassindingRegion,cassindingembarkStart:this.cassindingembarkStart,cassindingembarkEnd:this.cassindingembarkEnd,cassindingdebarkStart:this.cassindingdebarkStart,cassindingdebarkEnd:this.cassindingdebarkEnd }]);
	};

	voyagehistoy() {
		this.config.data = {
			voyageId:this.VoyagesId

		}
		let dialogRef = this.dialog.open(VoyageHistoryComponent, this.config);
	}
}
