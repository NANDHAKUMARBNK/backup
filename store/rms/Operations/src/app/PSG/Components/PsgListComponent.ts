import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { PsgService } from '../../Service/PsgService'
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { error } from 'selenium-webdriver';
import { ToasterComponent } from 'common/components/ToasterComponent';
declare var $: any;


@Component({
	selector: 'app-psglist',
	templateUrl: '../../../../../../../Views/Operations/PsgList.html',
	styleUrls: ['../../../styles/PsgList.scss', '../../../../../../common/styles/AgGrid.scss']
})
export class PsgListComponent {

	@ViewChild('pageSize') pageSize: ElementRef;
	PsgListForm: FormGroup;
	private rowSelection;
	display: boolean = false;
	private gridApi;
	private gridColumnApi;
	// addNewReportForm: FormGroup;

	columnDefs: any
	defaultColDef: any
	rowData: any;
	deleteid: [];
	searchValue: string;
	updatedId: any;
	getRowHeight;
	private getRowNodeId;
	dataId: any;
	emitterSubscribe: any;
	singleClickEdit: any
	brand: string;
	gridId: any;
	CuriseLine: any;
	RmmManager: any;
	shipsData: any;
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	status: any;
	statusId: any;
	isactive: any;
	venderid: number;
	vendorId: any;
	statusSubscription: Subscription;
	CruiseLineSubscription: Subscription;
	ShipSubscription: Subscription;
	RmmSubscription: Subscription;
	cruiseLineId: any;
	shipId: any;
	rmmManagerId: any;
	statusid: any;
	statusL: any;
	cruiseL: any;
	shipIdL: any;
	rmmManagerL: any;
	isactiveL: any;
	shipsName: any;
	roleManagerName: any;
	selectedName: any;
	name: any;
	statusName: any;
	findManger: any;
	domLayout: any;
	paginationPageSize: any;

	constructor(private http: HttpClient, private route: ActivatedRoute,
		private fb: FormBuilder, private router: Router,
		private service: PsgService,
		private sharedDataService: SharedDataService,
		private emitterService: EmitterService,
		private rMSApiService: RMSApiService,
		private toasterComponent: ToasterComponent
	) {
		this.columnDefs = [
			{
				headerName: 'Contract',
				field: "currentShip",
				width: 100,
				cellRenderer: params => {
					if (params.value == null) {
						return
					}
					else {
						return `<i class="far fa-check-circle" style="font-size:14px;"></i>`
					}
				},
				sortable: true,
			},
			{
				headerName: 'Vendor ID',
				field: "gpVendorID",
				sortable: true,
				width: 125,
				autoHeight: true,
			},
			{
				headerName: 'Shopping Expert',
				field: "fullName",
				sortable: true,
				autoHeight: true,
				width: 200
			},
			{
				headerName: 'Ship',
				field: "currentShip",
				sortable: true,
				autoHeight: true,
				width: 200

			},
			{
				headerName: 'Status',
				field: "statusName",
				sortable: true,
				autoHeight: true,
				width: 100

			},
			{
				headerName: 'Role',
				field: "roleTypeName",
				sortable: true,
				width: 100
			},
			{
				headerName: 'Manager',
				field: "currentRMM",
				sortable: true,
				width: 200

			},
		];
		this.defaultColDef = {
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
			'<span class="ag-overlay-loading-center nodata" >No data to display</span>';
		// this.overlayLoadingTemplate =
		// 	'<span class="ag-overlay-loading-center nodata" >Searching...please wait</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';
	};

	ngOnInit() {
		//Form controls
		this.formControlsSet();
		this.getStatus();
		this.getCuriseLine();
		this.GetShips();
		this.getManager();
		//alert();

		//this.searchlist();

		if (this.statusL) {
			this.setFormControls();
		}
	};

	//Form Controls
	formControlsSet() {
		this.PsgListForm = this.fb.group({
			status: [''],
			CruiseLineId: [''],
			ShipId: [''],
			RmmManagerId: [''],
			contract: [true],
			//contractno: [false, Validators.required],
		});
	};
	setFormControls() {
		this.route.params.subscribe(params => {
			this.statusL = params['statusId'];
			this.cruiseL = params['cruiseLineId'];
			this.shipIdL = params['shipId'];
			this.rmmManagerL = params['rmmManagerId'];
			this.isactiveL = params['isactive'];
			//this.searchlist();
		});
		this.PsgListForm.patchValue({
			status: parseInt(this.statusL),
		});
		if (this.statusL) {
			setTimeout(() => {    //<<<---    using ()=> syntax
				this.searchlist();
			}, 500);
		};
	}


	//Page Size Change
	onPageSizeChanged(newPageSize) {
		var value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");
	}


	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.rowSelection = "multiple";
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		}
		// this.gridApi.sizeColumnsToFit();
		console.log(this.gridApi.sizeColumnsToFit())
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
		
	}
	//Get Status
	getStatus() {
		this.sharedDataService.getStatusPsg().subscribe((data: any) => {
			this.status = data;
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	};
	//Get CuriseLine
	getCuriseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.CuriseLine = data;
			this.CuriseLine.forEach(item => {
				if (item.isDefault == true) {
					this.PsgListForm.patchValue({
						CruiseLineId: item.id
					});
				}
			});

			let routeParamsCruiselineId = parseInt(localStorage.getItem('cruiseLineId'));
			let routeParamsShipId = parseInt(localStorage.getItem('shipId'));

			if (routeParamsCruiselineId || routeParamsShipId) {
				this.PsgListForm.patchValue({
					CruiseLineId: routeParamsCruiselineId,
					ShipId: routeParamsShipId
				});
				//this.GetShips();
				this.searchlist()

			} else {
				this.searchlist();
				this.GetShips();
			}



		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	};
	//Get Ships
	GetShips() {
		this.PsgListForm.controls['ShipId'].reset('', { onlySelf: true, emitEvent: false });
		this.cruiseLineId = this.PsgListForm.get('CruiseLineId').value,
			this.ShipSubscription = this.sharedDataService.getShipList(this.cruiseLineId).subscribe((data: any) => {
				this.shipsData = data;

			},
				error => {
					this.toasterComponent.onError(error);
				}
			);
	};
	//Get RmmManager
	getManager() {
		this.RmmSubscription = this.sharedDataService.getRmmManagerList().subscribe((data: any) => {
			this.RmmManager = data;
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	};
	//Get Searchlist Grid
	searchlist() {
		this.statusId = this.PsgListForm.get('status').value;
		this.cruiseLineId = this.PsgListForm.get('CruiseLineId').value,
			this.shipId = this.PsgListForm.get('ShipId').value;
		this.rmmManagerId = this.PsgListForm.get('RmmManagerId').value;

		this.isactive = this.PsgListForm.get('contract').value;
		this.rMSApiService.showLoader(true);
		this.service.getpsgListGrid(this.statusId, this.cruiseLineId, this.shipId, this.rmmManagerId, this.isactive).subscribe(
			(data: any) => {
				//this.rowData = this.rowData.concat(data.items);
				this.rowData = data.items;
				//this.router.navigateByUrl('/Error');
				this.rMSApiService.showLoader(false);
				// if (this.rowData.length <= 10) {
				// 	$('.ag-paging-panel').hide();
				// } else {
				// 	$('.ag-paging-panel').show();
				// }
			},
			error => {
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);
				this.router.navigateByUrl('/Error');
			}
		);
	};

	//Rowclick navigate to profile Page and Pass Params To URL
	onRowClicked(e) {
		this.gridId = e.data.id
		this.router.navigate(['/PSG/Profile', {
			id: this.gridId,
			statusId: this.statusId, cruiseLineId: this.cruiseLineId, shipId: this.shipId,
			rmmManagerId: this.rmmManagerId, isactive: this.isactive
		}]);
	};
	//Golbal Search 
	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	}
	//Remove text from search
	removesearch() {
		this.searchValue = null
		this.gridApi.setQuickFilter(this.searchValue);
	};


	//Clear values Api accept the null that's why i put in formcontrols here
	clear() {
		this.PsgListForm.reset();
		this.formControlsSet();
		this.searchlist();
	};


	ngOnDestroy() {
		localStorage.removeItem('cruiseLineId');
		localStorage.removeItem('shipId');
	}
}

var minRowHeight = 30;
var currentRowHeight = minRowHeight;