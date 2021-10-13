import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { RMSApiService } from 'common/services/RMSApiService';
import { ContractService } from '../Service/ContractService';
import { ToasterComponent } from 'common/components/ToasterComponent';

//import { Location } from '@angular/common';

@Component({
	selector: 'app-contractrate-root',
	templateUrl: '../../../../../../../Views/Finance/ContractRateRoot.html',
	styleUrls: ['../../../../../../common/styles/AgGrid.scss', '../../../../../../common/styles/Modal.scss']
})

export class ContractRateRootComponent {

	commissionTypeId = new FormControl('');
	basedOnId = new FormControl('');

	private rowSelection;
	display: boolean = false;
	private gridApi;
	private gridColumnApi;
	columnDefs: any
	defaultColDef: any
	rowData: any;
    getRowHeight: (params: any) => 28 | 25;
    overlayNoRowsTemplate: string;
    overlayLoadingTemplate: string;
    contractRateId: any;
	commissionTypeData: any;
	categoryId: any;
	contractId: any;
	findValueCommision: any;
	basedData: any;
	faltfreePage: boolean = false;
	percentagePage: boolean = false;
	incrementalPage: boolean = false;
	findcommissionId: any;
	output: any;


	constructor(private rMSApiService: RMSApiService, private route: ActivatedRoute,
		 private router: Router,
		private contractService: ContractService, private toasterComponent: ToasterComponent) {
		this.categoryId = this.route.snapshot.queryParamMap.get('categoryId');
		this.contractId = this.route.snapshot.queryParamMap.get('contractId');
		this.contractRateId = this.route.snapshot.queryParamMap.get('contractRateId');

		this.columnDefs = [
			{
				headerName: '',
				field: "Date",
				sortable: true,
				autoHeight: true,
				minWidth: 60,
				headerCheckboxSelection: true,
				headerCheckboxSelectionFilteredOnly: true,
				checkboxSelection: true,
				// cellRenderer: params => {
				// 	return `<input type="checkbox" class="text_align" unchecked/>`

				// },
			},
			{
				headerName: 'Cruise Line',
				field: "cruiseLineName",
				sortable: true,
				autoHeight: true,
				editable: true,
				width: 200
			},
			{
				headerName: 'Ship',
				field: "shipName",
				sortable: true,
				autoHeight: true,
				width: 200
			},
		];

		this.defaultColDef = {
			editable: true,
			resizable: true,
		}

		// Row HEIGHT
		this.getRowHeight = function (params) {
			if (params.node.level === 0) {
				return 28;
			} else {
				return 25;
			}
		};

		this.overlayLoadingTemplate =
			'<span class="ag-overlay-loading-center nodata" style=\"margin-top:-137px; border-radius:5px; font-size:15px;">No Record(s) Found.</span>';
		this.overlayNoRowsTemplate =
			"<span class='ag-overlay-loading-center nodata'>No record(s) found.</span>";

	}

	ngOnInit() {
		window.scrollTo(0, 0)
		//  this.router.events.subscribe((evt) => {
        //     if (!(evt instanceof NavigationEnd)) {
        //         return;
        //     }
        //     window.scrollTo(0, 0)
        // });
		this.getcommissionType();
		this.basedOn();
		//this.valuesChanges();
	};



	valuesChanges() {
		this.commissionTypeId.valueChanges.subscribe((data) => {
		
			if (data) {
				this.findcommissionId = data;
			
			}
		})
	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.rowSelection = "multiple";
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		}
	
	}


	/* ========== Rate grid ===========*/
	getRatedAssignmentGrid() {
		if (this.contractRateId == null)
			this.contractRateId = "";
			if(this.contractId == null)
			this.contractId = "";
		this.rMSApiService.showLoader(true);
		this.contractService.getRatedAssignmentGrid(this.contractRateId,this.contractId).subscribe((data: any) => {
			this.rowData = data.items;
			this.rMSApiService.showLoader(false);

		},
			error => {
				this.rMSApiService.showLoader(false);
				this.toasterComponent.onError(error)
			}
		)
	};


	getcommissionType() {
		this.contractService.getRatesCommisionType(this.categoryId).subscribe((data: any) => {
			this.commissionTypeData = data.items;
			if (this.commissionTypeData.length == 1) {
				//this.ratesForm.patchValue({
				//	type: this.commissionTypeData[0].id
				//});
			}
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};

	basedOn() {
		this.contractService.getRatesBasedType().subscribe((data: any) => {
			this.basedData = data.items;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	};


	changeType(event) {
		this.findValueCommision = this.commissionTypeData.find(item => item.id == event.value);
		this.findcommissionId = this.findValueCommision;
		this.rMSApiService.buttonClickEventTrack.next(this.findValueCommision);
		if (this.findValueCommision.code == 'FLTFEE') {
			this.faltfreePage = true;
			this.percentagePage = false;
			this.incrementalPage = false;
		} else if (this.findValueCommision.code == 'PCTMIN') {
			this.faltfreePage = false;
			this.percentagePage = true;
			this.incrementalPage = false
		} else if (this.findValueCommision.code == 'INCRMI') {
			this.faltfreePage = false;
			this.percentagePage = false;
			this.incrementalPage = true
		}
	}

	messageToEmit($event) {
	
		this.output = event;

	}
	saveFlat() {
		
	}
}