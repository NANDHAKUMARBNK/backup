import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PsgService } from 'apps/Operations/src/app/Service/PsgService';
import { SharedDataService } from 'common/services/SharedDataService';
import { EmitterService } from 'common/services/emitterService';
import { CustomerService } from '../Service/CustomerServices';
import { CustomLoadingCellRenderer } from './CustomLoaderAgGrid';
import { RMSApiService } from 'common/services/RMSApiService';
import { DatePipe } from '@angular/common';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { takeWhile } from 'rxjs/operators';
declare var $: any;

@Component({
	selector: 'app-claimlist',
	templateUrl: '../../../../../../Views/CustomerServices/ClaimList.html',
	styleUrls: ['../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe]

})
export class ClaimListComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	isAlive = false;
	ClaimListForm: FormGroup;
	private rowSelection;
	display: boolean = false;
	private gridApi;
	private gridColumnApi;
	// addNewReportForm: FormGroup;
	multiSortKey: any;
	columnDefs: any
	defaultColDef: any
	rowData: any;
	deleteid: [];
	searchValue: string;
	getRowHeight;
	private getRowNodeId;
	dataId: any;
	emitterSubscribe: any;
	singleClickEdit: any
	gridId: any;

	shipsData: any;
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;


	ReminderData: any;
	flagData: any;
	StatusData: any;
	cruiseLineId: any;
	AssignedData: any;
	CruiseLineData: any;
	PortData: any;
	MerchantData: any;
	shipId: any;
	portId: any;
	reminderId: any;
	flagId: any;
	statusId: any;
	assignedId: any;
	merchantId: any;
	statusL: any;
	cruiseL: any;
	shipIdL: any;
	ReminderId: string;
	selectedStatus: any;
	loadingCellRenderer: any;
	loadingCellRendererParams: any;
	frameworkComponents: any;
	loading: boolean = false;
	defaultSelect: any;
	defaultReminderSelect: any;
	userData: any;
	AllMerchantData: any;
	domLayout: any;
	paginationPageSize: any;



	constructor(private http: HttpClient, private route: ActivatedRoute,
		private fb: FormBuilder, private router: Router,
		private service: CustomerService,
		private sharedDataService: SharedDataService,
		private emitterService: EmitterService,
		private rMSApiService: RMSApiService,
		private datePipe: DatePipe,
		private toasterComponent: ToasterComponent
	) {

		//this.statusL = this.route.snapshot.queryParamMap.get('status');

		this.columnDefs = [
			{
				headerName: 'Status',
                field: "statusName",
                width: 80,
				sortable: true,

			},
			{
				headerName: 'Created',
				field: "initiatedDate",
				sortable: true,
				//unSortIcon: true,
                autoHeight: true,
                width: 100,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy')
				}
			},
			{
				headerName: 'Closed',
				field: "closedDate",
				autoHeight: true,
				sortable: true,
				width: 100,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy')
				}
			},
			{
				headerName: 'Guest',
				field: "personFullName",
                autoHeight: true,
                width: 200,
				sortable: true,
			},
			{
				headerName: 'Phone',
				field: "claimPrimaryPhoneNum",
				sortable: true,
				autoHeight: true,
				width: 120,

			},
			{
				headerName: 'Retailer',
				field: "customerName",
				sortable: true,
				width: 120,
			},
			{
				headerName: 'Ship',
				field: "shipName",
				sortable: true,
				width: 140,
			},
			{
				headerName: 'Assigned To',
				field: "assignedFullName",
				sortable: true,
				width: 120,
			},
			{
				headerName: 'Last Update',
				field: "lastUpdateDateTime",
                sortable: true,
                width: 120,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy')
				}

			}
		];

		this.defaultColDef = {
			resizable: true,
			sortable: true,
			//enableColResize=true,
		};

		this.frameworkComponents = { customLoadingCellRenderer: CustomLoadingCellRenderer };
		this.loadingCellRenderer = "customLoadingCellRenderer";
		this.loadingCellRendererParams = { loadingMessage: "One moment please..." };

		this.multiSortKey = "ctrl";

		// Row HEIGHT
		this.getRowHeight = function (params) {
			if (params.node.level === 0) {
				return 28;
			} else {
				return 25;
			}
		};

		this.overlayLoadingTemplate =
			'<span class="ag-overlay-loading-center nodata" >Searching...please wait</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';
	};

	ngOnInit() {
		this.userData = JSON.parse(localStorage.getItem('userInfo'));
		this.formControlsSet();
		this.getStatusCustomer();
		this.getReminder();
		this.getflag();
	
		this.getAssigned();
		this.getCuriseLine();
		this.GetShips();
		this.getPort();
	

			//this.getMerchant();
		

	};
	formControlsSet() {
		//Form controls
		this.ClaimListForm = this.fb.group({
			ReminderId: [''],
			flagId: [''],
			StatusId: [''],
			AssignedId: [''],
			CruiseLineId: [''],
			ShipId: [''],
			PortId: [''],
			MerchantId: [''],
		});
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
		//console.log(this.gridApi.sizeColumnsToFit());
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
	}

	setvalues() {
		this.statusL = this.route.snapshot.queryParamMap.get('status');
		setTimeout(() => {
			if (this.statusL) {
				this.ClaimListForm.patchValue({
					StatusId: this.statusL
				});
			}
		}, 1000);
	};

	//Get getReminder
	getReminder() {
		this.sharedDataService.getReminder().subscribe((data: any) => {
			this.ReminderData = data.items;
			this.defaultReminderSelect = this.ReminderData[1].id
			this.ClaimListForm.patchValue({
				ReminderId: this.ReminderData[1].id
			});
		
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	};

	//getflag
	getflag() {
		this.sharedDataService.getflag().subscribe((data: any) => {
			this.flagData = data.items;
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	}

	/*================= Page Size change==============*/

	onPageSizeChanged() {
		var value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");
		// if(value == 10){
		// 	element.classList.add("gridHeight10");
		// 	element.classList.remove("gridHeight50");
		// 	element.classList.remove("gridHeight100");
		// }else if(value == 50){
		// 	element.classList.add("gridHeight50");
		// 	element.classList.remove("gridHeight10");
		// 	element.classList.remove("gridHeight100");
		// }else if(value == 100){
		// 	element.classList.remove("gridHeight10");
		// 	element.classList.remove("gridHeight50");
		// 	element.classList.add("gridHeight100");
		// }
	}

	//Get Status
	getStatusCustomer() {
		this.sharedDataService.getStatusCustomer().subscribe((data: any) => {
			this.StatusData = data;
			if (this.StatusData && this.StatusData.length > 0) {
				var filterData = this.StatusData.filter(element => (element.code == "OPEN" || element.code == "open"))
				if (filterData && filterData.length > 0) {
					this.ClaimListForm.patchValue({
						StatusId: filterData[0].id
					})
				}
			}
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	};
	//getAssigned
	getAssigned() {
		this.sharedDataService.getAssigned().subscribe((data: any) => {
			this.AssignedData = data
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	}
	//Get CuriseLine
	getCuriseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.CruiseLineData = data
			let findDefaultCruiseline = this.CruiseLineData.filter(element => element.isDefault == true)
			this.CruiseLineData.forEach(item => {
				if (item.isDefault == true) {
					this.ClaimListForm.patchValue({
						CruiseLineId: item.id
					});
				}
			})
			this.searchlist();
			this.GetShips()
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	};
	//Get Ships
	GetShips() {
		this.cruiseLineId = this.ClaimListForm.get('CruiseLineId').value;
		this.sharedDataService.getShipList(this.cruiseLineId).subscribe((data: any) => {
			this.shipsData = data
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	};
	//getPort
	getPort() {
		this.shipId = this.ClaimListForm.get('ShipId').value;
		if (this.shipId == 'null' || this.shipId == 'other' || this.shipId == 'NA') {
			this.shipId = '';
		}
		this.sharedDataService.getPort(this.cruiseLineId, this.shipId).subscribe((data: any) => {
			this.PortData = data;
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);

	};

	//getMerchant
	getMerchant() {
		this.portId = this.ClaimListForm.get('PortId').value;
	
		if (this.shipId == 'null' || this.shipId == 'other' || this.shipId == 'NA') {
			this.shipId = '';
		}
		this.sharedDataService.getMerchant(this.portId).subscribe((data: any) => {
			this.MerchantData = data.items;
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	}

	
	//Get Searchlist Grid
	searchlist() {
		this.reminderId = this.ClaimListForm.get('ReminderId').value;
		this.flagId = this.ClaimListForm.get('flagId').value;
		this.statusId = this.ClaimListForm.get('StatusId').value;
		this.assignedId = this.ClaimListForm.get('AssignedId').value;
		this.cruiseLineId = this.ClaimListForm.get('CruiseLineId').value;
		this.shipId = this.ClaimListForm.get('ShipId').value;
		if (this.shipId == 'null' || this.shipId == 'other' || this.shipId == 'NA') {
			this.shipId = '';
		}
		this.portId = this.ClaimListForm.get('PortId').value;
	
		this.merchantId = this.ClaimListForm.get('MerchantId').value;
		this.rMSApiService.showLoader(true);
		this.service.getClaimList(this.reminderId, this.flagId, this.statusId, this.assignedId, this.cruiseLineId, this.shipId, this.portId, this.merchantId)
			.subscribe((data: any) => {
				this.rowData = data.items;
			this.rMSApiService.showLoader(false);
			
		},
				error => {
					this.rMSApiService.setData(error);
					this.rMSApiService.showLoader(false);
					this.router.navigate(['/Error']);
				}
			);
	};

	clear() {
		this.ClaimListForm.reset();
		this.formControlsSet();
		this.MerchantData = []
		//this.searchlist();
	}
	//ADD Claim
	addClaim() {
		this.router.navigate(['/Claim'])
	}
	//Rowclick navigate to profile Page and Pass Params To URL
	onRowClicked(e) {
		this.gridId = e.data.id
		this.router.navigate(['/Claim'], { queryParams: { 'Claimid': this.gridId, 'personId': e.data.personId, 'status': this.statusId, ReminderId: this.reminderId, flagId: this.flagId, cruiseLineId: this.cruiseLineId } })
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
}

var minRowHeight = 30;
var currentRowHeight = minRowHeight;
