import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { RMSApiService } from 'common/services/RMSApiService';

@Component({
	selector: 'app-cruiseline',
	templateUrl: '../../../../../../../Views/CruiseLines/CruiseLine.html',
	styleUrls: ['../../../styles/cruiseLine.scss']
})
export class CruiseLineComponent {
	curiseLineData: any;
	// title = 'CruiseLines';

	constructor(private router: Router, private cruiseLineService: CruiseLineService, private rMSApiService: RMSApiService) {

	}
	ngOnInit() {
		this.getCruiseLineList();
	}
	//============== getCruiseLineList ===============
	getCruiseLineList() {
		this.rMSApiService.showLoader(true);
		this.cruiseLineService.getCruiseLineList().subscribe((data: any) => {
			this.curiseLineData = data;
			if (this.curiseLineData.length == 1) {
				this.router.navigate(['/CruiseLine/Profile', {
					//id: item.id
					id: this.curiseLineData[0].id
				}]);
				this.rMSApiService.setData(this.curiseLineData.name);
			}
			this.rMSApiService.showLoader(false);
		},
			error => {
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);
				this.router.navigate(['/Error']);
			}
		);
	}
	rowclick(item) {
		this.rMSApiService.setGlobalVariable(item.id)
		this.rMSApiService.setData(item.name)
		this.router.navigate(['/CruiseLine/Profile', {
			id: item.id
		}]);
	}
}
