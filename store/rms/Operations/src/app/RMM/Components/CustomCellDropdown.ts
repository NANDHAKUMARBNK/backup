import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PsgService } from '../../Service/PsgService';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';

@Component({
	selector: 'app-customcell',
	templateUrl: '../../../../../../../Views/Operations/CustomCell.html',
	styleUrls: ['../../../styles/PsgList.scss','../../../../../../common/styles/AgGrid.scss']
})
export class CustomCellComponent {

	dropdownfrom: FormGroup;
	data: any;
	private gridApi;
	params: any;
	private gridColumnApi;
	deleteid: any;
	rowSelection: string;
	rmmDropdownList: any;
	mangerList: any = [];
	managerId: any;
	selectedRmmList: any;
	constructor(private fb: FormBuilder, private emitterService: EmitterService, private rMSApiService: RMSApiService,

		private service: PsgService, ) {

		
	}
	agInit(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.rowSelection = "multiple";
		this.params = params
		this.data = params.data;
		this.managerId = this.data.rmmId ? this.data.rmmId : ""
		this.getDropdown();

	}

	ngOnInit() {
		this.dropdownfrom = this.fb.group({
			managerId: ['', Validators.required],
		});
		this.getDropdown();
		//this.dropdownfrom.patchValue({
		//	managerId: parseInt(this.data.id)
		//})
	};
	//get Data in selectbox
	getDropdown() {
		
			this.service.getDropdownlistGrid().subscribe((data: any) => {
				this.mangerList =data.items;
				
				
			})

		
		
	}
	//change event save rmmlist
	selectedVal:any;
	saveRmmList() {
		this.managerId = this.dropdownfrom.get('managerId').value;
		this.selectedVal = this.managerId;
		this.rMSApiService.showLoader(true)
		this.service.saveRmmList(this.data.shipId, this.managerId).subscribe((data: any) => {
			this.emitterService.refreshRmmList.emit(true);
			this.rMSApiService.showLoader(false);
			
		})
	}

	compareFn(c1: any, c2: any): boolean {
		return c1 && c2 ? c1 === c2 : c1 === c2;
	}

	countryComparator(c1: any, c2: any): boolean {
		return c1 && c2 ? c1.id === c2.id : false;
	}

}