import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';
declare var $: any;

@Component({
	selector: 'app-portlist',
	templateUrl: '../../../../../../../Views/CruiseLines/PortList.html',
	styleUrls: ['../../../styles/cruiseLine.scss', '../../../../../../common/styles/AgGrid.scss']
})
export class PortListComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	portListForm: FormGroup;
	private rowSelection;
	display: boolean = false;
	private gridApi;
	private gridColumnApi;
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
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	status: any;
	statusId: any;
	isactive: any;
	statusSubscription: Subscription;
	CruiseLineSubscription: Subscription;
	ShipSubscription: Subscription;
	RmmSubscription: Subscription;
	country: any;
	isactiveL: any;
	selectedName: any;
	name: any;
	statusName: any;
	CuriseLine: any;
	countryId: any;
	activeProgram: any;
	setcountry: any;
	active: any;
	domLayout: any;
	paginationPageSize: any;

	constructor(private route: ActivatedRoute,
		private fb: FormBuilder, private router: Router,
		private sharedDataService: SharedDataService,
		private emitterService: EmitterService,
		private cruiseLineService: CruiseLineService,
		private rmsapiService: RMSApiService,
		private toasterComponent: ToasterComponent,
	) {

		this.columnDefs = [
			{
				headerName: 'Code',
				field: "code",
				sortable: true,
				//sort: "desc",
				autoHeight: true,
				width: 100
			},
			{
				headerName: 'Name',
				field: "name",
				//unSortIcon: true,
				sortable: true,
				autoHeight: true,
				width: 200
			},
			{
				headerName: 'Country',
				field: "countryName",
				sortable: true,
				autoHeight: true,
				width: 200
			},
			{
				headerName: 'Active Itinerary',
				field: "isActiveItinerary",
				autoHeight: true,
				sortable: true,
				cellRenderer: params => {
					if (params.data.isActiveItinerary == true) {
						return `<i class="far fa-check-circle" style="font-size:14px;"></i>`
					}


				},

			},
			{
				headerName: 'Active Program',
				field: "isRevenueProgram",
				cellRenderer: params => {
					if (params.data.isRevenueProgram == true) {
						return `<i class="far fa-check-circle" style="font-size:14px;"></i>`
					}

				},

				sortable: true,
				autoHeight: true,
			},
		]
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
			'<span class="ag-overlay-loading-center nodata" >Searching...please wait</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';
	}
	ngOnInit() {
		this.formcontrols();
		this.getCountry();
		if (!this.setcountry || !this.active) {
		
			this.getGridList();
		};
		this.route.params.subscribe(params => {
			this.setcountry = params['country'];
			this.active = params['active']
		
		});
		if (this.setcountry || this.active) {
			this.setFormControls();
		}
	};

	/*-==============formControls=======*/
	formcontrols() {
		this.portListForm = this.fb.group({
			countryId: [''],
			activeProgram: [true],
		});
	

	};

	setFormControls() {

		this.portListForm.patchValue({
			countryId: parseInt(this.setcountry),
			activeProgram: JSON.parse(this.active)
		});
		if (this.setcountry == '') {
	

			this.countryId = ''

			this.portListForm.patchValue({
				activeProgram: JSON.parse(this.active)

			})
			this.getGridList();
		} else if (this.setcountry || this.active) {
			setTimeout(() => {    
			

				this.getGridList();
			}, 500);
		

		}


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
		console.log(this.gridApi.sizeColumnsToFit())
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
	}


	//Get Country
	getCountry() {
		this.sharedDataService.getCountry().subscribe((data: any) => {
			this.country = data;
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	};

	getGridList() {
	
		this.countryId = this.portListForm.get('countryId').value;
		if (this.countryId == NaN || this.countryId == null) {

			this.countryId = ''


		} else if (this.countryId) {
			this.countryId = this.portListForm.get('countryId').value;

		} else {


			this.countryId = ''
		}

		this.activeProgram = this.portListForm.get('activeProgram').value;
		if (this.activeProgram == null) {
			this.activeProgram = ''
		} else {
			this.activeProgram = this.portListForm.get('activeProgram').value;
		}
		this.rmsapiService.showLoader(true);
		this.cruiseLineService.getPortGridList(this.countryId, this.activeProgram).subscribe((data: any) => {
			this.rowData = data;
			this.rmsapiService.showLoader(false);
			// if (this.rowData.length <= 10) {
			// 	$('.ag-paging-panel').hide();
			// } else {
			// 	$('.ag-paging-panel').show();
			// }
		},
			error => {
				this.rmsapiService.setData(error);
				this.rmsapiService.showLoader(false);
				this.router.navigateByUrl('/Error')

			}
		)
	}

	onRowClicked(e) {
		this.gridId = e.data.id
		this.router.navigate(['/Port/Profile', { id: this.gridId, country: this.countryId, active: this.activeProgram }])
	};

	//Page size changes

	onPageSizeChanged() {
		var value = this.pageSize.nativeElement.value;
	
		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");
	}

	/*================= filter==============*/
	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	}
	removesearch() {
		this.searchValue = null
		this.gridApi.setQuickFilter(this.searchValue)
	};

	/*================= clear button rest form call api==============*/
	clear() {
		this.portListForm.reset();
		// this.formcontrols();
		// this.getGridList();
		this.portListForm = this.fb.group({
			countryId: [''],
			activeProgram: [],
		});
		this.rowData = [];
	}
}

var minRowHeight = 30;
var currentRowHeight = minRowHeight;

