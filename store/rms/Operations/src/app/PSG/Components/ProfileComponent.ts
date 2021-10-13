import { Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { SharedDataService } from 'common/services/SharedDataService';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { error } from 'util';
import { EmitterService } from 'common/services/emitterService';
import { PsgService } from '../../Service/PsgService';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';

@Component({
	selector: 'app-profile',
	templateUrl: '../../../../../../../Views/Operations/Profile.html',
	styleUrls: ['../../../styles/PsgList.scss']
})
export class ProfileComponent {
	submitted = false;

	title = 'Profile';
	id: any;
	psgProfile: any;
	statusSubscription: Subscription;
	status: any;
	PsgProfileForm: FormGroup;
	statusId: any;
	cruiseLineId: any;
	shipId: any;
	rmmManagerId: any;
	isactive: any;
	phoneData: any;
	//status:any

	constructor(private route: ActivatedRoute, private fb: FormBuilder,
		private router: Router, private service: PsgService,
		private messageService: MessageService,
		private emitterService: EmitterService,
		private rMSApiService: RMSApiService,
		private toasterComponent: ToasterComponent,
		private location: Location, private sharedDataService: SharedDataService) {
		this.id = this.route.snapshot.paramMap.get('id')
		this.route.params.subscribe(params => {
			this.statusId = params['statusId'];
			this.cruiseLineId = params['cruiseLineId'];
			this.shipId = params['shipId'];
			this.rmmManagerId = params['rmmManagerId'];
			this.isactive = params['isactive'];
		});
	}
	ngOnInit() {

		this.PsgProfileForm = this.fb.group({
			statusId: ['', Validators.required],
		})

		this.getStatus();
		this.getProfile();
		//this.getPhone();
	}

	get f() { return this.PsgProfileForm.controls; }


	getStatus() {
		this.statusSubscription = this.sharedDataService.getStatusPsg().subscribe((data: any) => {
			this.status = data;
		},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	};
	getPhone() {
		this.service.getPsgProfilePhone(this.id).subscribe((data: any) => {
			this.phoneData = data.items;
		
		})
	}
	getProfile() {
		// this.service.getProfile(this.id).subscribe((res: any) => {
		// 	this.psgProfile = res;
		// 	this.PsgProfileForm.controls['statusId'].setValue(this.psgProfile.statusId);
		// 	this.PsgProfileForm.patchValue({
		// 		statusId: this.psgProfile.statusId

		// 		})
		// })
		this.rMSApiService.showLoader(true);
		this.service.getProfile(this.id).subscribe(
			(res: any) => {
				this.psgProfile = res;
				this.rMSApiService.showLoader(false);

				// this.PsgProfileForm.controls['statusId'].setValue(this.psgProfile.statusId);
				this.PsgProfileForm.patchValue({
					statusId: this.psgProfile.statusId
				});

			},
			error => {
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);
				this.router.navigateByUrl('/Error');

			}
		)
	}
	saveProfile() {
		this.submitted = true;
		this.statusId = this.PsgProfileForm.get('statusId').value

		if (this.PsgProfileForm.valid) {
			this.service.saveProfile(this.id, this.statusId).subscribe(
				res => {
					this.emitterService.refreshPsgtList.emit(true)
					this.toasterComponent.onSucess();
					this.messageService.add({ severity: 'success', summary: 'Sucessfully add profile ' });
					this.location.back();
				},
				error => {
					this.toasterComponent.onError(error);
				}
			)
		}

	}
	backpage() {
		this.router.navigate(['/PSG', {
			statusId: this.statusId, cruiseLineId: this.cruiseLineId, shipId: this.shipId,
			rmmManagerId: this.rmmManagerId, isactive: this.isactive
		}])
		this.emitterService.refreshPsgtList.emit(true)
	}
}