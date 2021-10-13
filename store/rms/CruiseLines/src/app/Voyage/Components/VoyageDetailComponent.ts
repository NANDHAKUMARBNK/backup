import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SharedDataService } from 'common/services/SharedDataService';
import { RMSApiService } from 'common/services/RMSApiService';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { VoyageSequenceComponent } from './VoyageSequenceComponent';
import { NotesModalComponent } from 'common/components/NotesModal';
import { EmitterService } from 'common/services/emitterService';

@Component({
	selector: 'app-voyagedetail',
	templateUrl: '../../../../../../../Views/CruiseLines/VoyageDetail.html',
	styleUrls: ['../../../styles/cruiseLine.scss']
})
export class VoyageDetailComponent {
	VoyagesId: any;
	VoyagesData: any;
	typeData: any;
	regionData: any;
	config = new MatDialogConfig();
	regionId = new FormControl('');
	typeId = new FormControl('');
	cruiseLineId: any;
	shipId: any;
	regionName: any;
	embarkDateTime: any;
	debarkDateTime: any;
	psgFullName: any;
	regionreQuired: boolean;
	typereQuired: boolean;
	cassindingCruiseline: string;
	cassindingShip: string;
	cassindingRegion: string;
	cassindingPort: string;
	cassindingembarkStart: string;
	cassindingembarkEnd: string;
	cassindingdebarkStart: string;
	cassindingdebarkEnd: string;

	constructor(private fb: FormBuilder, private sharedDataService: SharedDataService, private dialog: MatDialog,
		private route: ActivatedRoute, private rmsapiservice: RMSApiService, private router: Router,private emitterService:EmitterService,
		private cruiselineService: CruiseLineService, private toasterComponent: ToasterComponent) {
		//this.ShipId = this.route.snapshot.queryParamMap.get('id');
		this.VoyagesId = this.route.snapshot.paramMap.get('id');
		this.cruiseLineId = this.route.snapshot.paramMap.get('cruiseLineId');
		this.shipId = this.route.snapshot.paramMap.get('shipId');
		this.cassindingCruiseline = this.route.snapshot.paramMap.get('cascadingcruiseLine');
		this.cassindingShip = this.route.snapshot.paramMap.get('cascadingShip');
		this.cassindingRegion = this.route.snapshot.paramMap.get('cascadingRegion');
		this.cassindingPort = this.route.snapshot.paramMap.get('cascadingPort');
		this.cassindingembarkStart = this.route.snapshot.paramMap.get('cascadingembarkStart');
		this.cassindingembarkEnd = this.route.snapshot.paramMap.get('cascadingembarkEnd');
		this.cassindingdebarkStart = this.route.snapshot.paramMap.get('cascadingdebarkStart');
		this.cassindingdebarkEnd = this.route.snapshot.paramMap.get('cascadingdebarkEnd');

	};

	ngOnInit() {
		this.getProfileById();
		this.getType();
		this.getRegion();

		this.emitterService.refreshvoyagesCurd.subscribe((data: any) => {
			console.log("refreshvoyagesCurd")
			if(data){
				this.getProfileById();		
				}
		

		});

		this.emitterService.refreshvoyagespopup.subscribe((data: any) => {
			console.log("refreshvoyagespopup")
		
			this.getProfileById();
		});
	};

	getProfileById() {
		this.rmsapiservice.showLoader(true);
		this.cruiselineService.getVoyagesProfileById(this.VoyagesId).subscribe((data: any) => {
		
			this.VoyagesData = data;
			if(this.VoyagesData.typeId==0)
			this.VoyagesData.typeId=null;
			if(this.VoyagesData.regionId==0)
				this.VoyagesData.regionId=null;
			
			this.VoyagesData.isSalesExist = true;
			this.typeId.patchValue(this.VoyagesData.typeId);
			this.regionId.patchValue(this.VoyagesData.regionId);
			this.rmsapiservice.setVoyagesId(this.VoyagesData);
			this.rmsapiservice.showLoader(false);
		},
			error => {
				this.rmsapiservice.showLoader(false);
				this.router.navigate(['/Error']);
			}
		);
	};

	getType() {
		this.cruiselineService.getVoyageType().subscribe((data: any) => {
			this.typeData = data;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};

	getRegion() {
		this.sharedDataService.getVoyagesRegion().subscribe((data: any) => {
			this.regionData = data;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};


	deleteProfile() {
		this.regionreQuired = false;
		this.typereQuired = false;
		this.typeId.reset();
		this.regionId.reset();
		this.typeId.markAsUntouched();
		this.typeId.markAsPristine();
		this.regionId.markAsUntouched();
		this.regionId.markAsPristine();
		if (this.VoyagesData.isSalesExist == true) {
			this.config.data={
				voyageIdprofile:this.VoyagesId,
				action:"profileDelete"
			}
			let dialogRef = this.dialog.open(VoyageSequenceComponent, this.config);
		} else {
			this.regionreQuired = false;
			this.typereQuired = false;
			this.rmsapiservice.showLoader(true);
			this.cruiselineService.deleteVoyagesProfile(this.VoyagesId).subscribe((data: any) => {
				this.rmsapiservice.showLoader(false);
				this.toasterComponent.onDeteled();
				this.router.navigate(['/Voyage']);
			},
				error => {
					this.rmsapiservice.showLoader(false);
					this.toasterComponent.onError(error)
				}

			)

		}


	};

	saveProfile() {
		this.regionreQuired = true;
		this.typereQuired = true;
		this.regionId.setValidators(Validators.required);
		this.typeId.setValidators(Validators.required)


		let typeId = this.typeId.value;
		let regionId = this.regionId.value;
	

		if (this.VoyagesData.isSalesExist == true) {
			if (typeId && regionId) {
				this.config.data={
					voyageIdprofile:this.VoyagesId,
					action:"profileSave",
					regionId:this.regionId.value,
					typeId:this.typeId.value
				}
				let dialogRef = this.dialog.open(VoyageSequenceComponent, this.config);
			}

		} else {
			
			if (this.typeId.invalid || this.regionId.invalid ||this.regionId.value==null || this.typeId.value==null ) {
				return;
			}
			this.cruiselineService.saveVoyagesProfile(this.VoyagesId, typeId, regionId).subscribe((data: any) => {
				this.config.data = {
					id: this.VoyagesId,
					View: 'Add',
					VOYAGE: "CRUISELINE_VOYAGE",
					back: "Voyage",
					cassindingCruiseline: this.cassindingCruiseline,
					cascadingShip: this.cassindingShip,
					cassindingPort: this.cassindingPort,
					cassindingRegion: this.cassindingRegion,
					cassindingembarkStart: this.cassindingembarkStart,
					cassindingembarkEnd: this.cassindingembarkEnd,
					cassindingdebarkStart: this.cassindingdebarkStart,
					cassindingdebarkEnd: this.cassindingdebarkEnd
				};
				let dialogRef = this.dialog.open(NotesModalComponent, this.config)
			},
				error => {
					this.toasterComponent.onError(error)
				}
			)
		};
	};

	cancel() {
		this.router.navigate(['/Voyage', { cassindingCruiseline: this.cassindingCruiseline, cascadingShip: this.cassindingShip, cassindingPort: this.cassindingPort, cassindingRegion: this.cassindingRegion, cassindingembarkStart: this.cassindingembarkStart, cassindingembarkEnd: this.cassindingembarkEnd, cassindingdebarkStart: this.cassindingdebarkStart, cassindingdebarkEnd: this.cassindingdebarkEnd }]);
	}


}
