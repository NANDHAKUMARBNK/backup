import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { RMSApiService } from 'common/services/RMSApiService';
import { MessageService } from 'primeng/api';
import { ToasterComponent } from 'common/components/ToasterComponent';
declare var $: any;

@Component({
	selector: 'app-shiplist',
	templateUrl: '../../../../../../../Views/CruiseLines/ShipList.html',
	styleUrls: ['../../../styles/cruiseLine.scss', '../../../../../../common/styles/AgGrid.scss']
})
export class ShipListComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	shipListForm: FormGroup;
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
	cruiseLineId: any;
	shipId: any;
	shipsName: any;
	name: any;
	statusName: any;
	CuriseLine: any;
	cId: any;
	status: any;
	statusId: any;
	giftData: any;
	domLayout: any;
	paginationPageSize: any;
	cassdingCruisline: any;

	constructor(private http: HttpClient, private route: ActivatedRoute,
		private fb: FormBuilder, private router: Router, private cruiseLineService: CruiseLineService,
		private sharedDataService: SharedDataService, private rmsapiservice: RMSApiService,
		private emitterService: EmitterService, private messageService: MessageService, private toasterComponent: ToasterComponent

	) {
		this.route.params.subscribe(params => {
			this.cassdingCruisline = params['id'];
		});

		this.columnDefs = [
			{
				headerName: 'Cruise Line',
				field: "cruiseLineName",
				sortable: true,
				autoHeight: true,
				width: 200
			},
			{
				headerName: 'Ship Name',
				field: "shortName",
				sortable: true,
				autoHeight: true,
				width: 200
			},
			{
				headerName: 'OBM Code',
				field: "obmShipCode",
				sortable: true,
				autoHeight: true,
				width: 125
			},
			{
				headerName: 'CL Code',
				field: "cruiseLineShipCode",
				sortable: true,
				autoHeight: true,
				width: 100
			},
			{
				headerName: 'GP Item',
				field: "gpItemNumber",
				autoHeight: true,
				sortable: true,
				width: 125
			},
			{
				headerName: 'Shopping Expert',
				field: "primaryPSGName",
				autoHeight: true,
				sortable: true,
				width: 200
			},

			{
				headerName: 'Manager',
				field: "rmmName",
				autoHeight: true,
				sortable: true,
				width: 200
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

		this.shipListForm = this.fb.group({
			statusId: [''],
			cruiseLineId: [''],
		});
		this.getStatus();
		this.getCuriseLine();
		//this.getGrid();

		this.emitterService.refreshPsgtList.subscribe(d => {
		})
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
		};
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");

	};

	//Change Page Size
	onPageSizeChanged() {
		var value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");


	}

	//Get Status
	getStatus() {
		this.sharedDataService.getShipStatus().subscribe((data: any) => {
			this.status = data;
		},
			error => {
				this.toasterComponent.onError(error);
				//this.rmsapiservice.setData(error);



			}
		);
	};
	//Get CuriseLine
	getCuriseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.CuriseLine = data;
			//this.CuriseLine[0].isDefault=true;
			this.CuriseLine.forEach(item => {
				if (item.isDefault == true) {
					this.shipListForm.patchValue({
						cruiseLineId: item.id
					});
				}
			})
			//this.cassdingCruisline = this.rmsapiservice.getcascaddingitem();
			if (this.cassdingCruisline) {
				this.shipListForm.patchValue({
					cruiseLineId: parseInt(this.cassdingCruisline)
				});
			}
			let patchValue = this.shipListForm.value;
	
			if (patchValue.cruiseLineId) {
				this.getGrid();
			} else {
				this.getGrid();
			}
			//this.getGrid();
		},
			error => {
				this.toasterComponent.onError(error);
			}

		);
	};

	//getGrid
	getGrid() {
		//this.setFormControls();
		this.cassdingCruisline = this.shipListForm.get('cruiseLineId').value;
		if (this.cassdingCruisline == undefined) { // checking condition basically im using patch values .patching from cruiseline list when page loading cruiseline undefind is coming
			this.cassdingCruisline = '';
		} else {
			this.cassdingCruisline = this.shipListForm.get('cruiseLineId').value;
		}
		if (this.statusId == null) { // checking condition basically im using patch values .patching from this.statusId  list when page loading this.statusId  undefind is coming
			this.statusId = '';
		} else {
			this.statusId = this.shipListForm.get('statusId').value;
		}
		this.statusId = this.shipListForm.get('statusId').value;
		this.rmsapiservice.showLoader(true);
		this.cruiseLineService.getShipGridList(this.statusId == null ? '' : this.statusId, this.cassdingCruisline).subscribe((data: any) => {
			this.rowData = data;
			this.rmsapiservice.showLoader(false)
			// if (this.rowData.length <= 10) {
			// 	$('.ag-paging-panel').hide();
			// } else {
			// 	$('.ag-paging-panel').show();
			// }
		},
			error => {
				this.rmsapiservice.setData(error);
				this.rmsapiservice.showLoader(false)
				this.router.navigate(['/Error'])
			}
		)
	};

	onRowClicked(e) {
	
		this.gridId = e.data.id;
		let cruiseLineId = e.data.cruiseLineId;
	
		this.router.navigate(['/Ship/Profile', { id: this.gridId, cruiseLineId: cruiseLineId }])
	}

	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	}

	removesearch() {
		this.searchValue = null
		this.gridApi.setQuickFilter(this.searchValue)
	};

	clear() {
		this.shipListForm.reset();
		// this.shipListForm = this.fb.group({
		// 	statusId: [''],
		// 	cruiseLineId: [''],
		// });
		//this.getGrid();
		this.rowData = [];
	}
	ngOnDestory() {
		this.rmsapiservice.removecascaddingitem();
	}


}
var minRowHeight = 30;
var currentRowHeight = minRowHeight;

