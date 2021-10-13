import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ItineraryHistoryComponent } from './ItineraryHistoryComponent';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { HistoryIconComponent } from './HistoryIconComponent';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { NumericEditorComponent } from 'common/components/NumericEditorComponent'
import { RMSApiService } from 'common/services/RMSApiService';
import { IntineraryEditorComponent } from './intineraryinputComponent';
declare var $: any;

@Component({
	selector: 'app-itinerarywages',
	templateUrl: '../../../../../../../Views/CruiseLines/ItineraryWages.html',
	styleUrls: ['../../../styles/cruiseLine.scss', '../../../../../../common/styles/AgGrid.scss']
})
export class ItineraryWagesComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	ItineraryListForm: FormGroup;
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

	singleClickEdit: any;
	brand: string;
	gridId: any;
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	status: any;
	statusId: any;
	isactive: any;
	venderid: number;
	config = new MatDialogConfig();
	vendorId: any;
	statusSubscription: Subscription;
	CruiseLineSubscription: Subscription;
	ShipSubscription: Subscription;
	RmmSubscription: Subscription;
	isactiveL: any;
	shipsName: any;
	roleManagerName: any;
	selectedName: any;
	name: any;
	statusName: any;
	CuriseLine: any;
	multiSortKey: any;
	cruiseLineData: any;
	cruiseLineId: any;
	wagesId: any;
	domLayout: string;
	paginationPageSize: any;

	constructor(private http: HttpClient, private route: ActivatedRoute,
		private fb: FormBuilder, private router: Router, private dialog: MatDialog,
		private cruiseLineService: CruiseLineService, private rmsApiService: RMSApiService,
		private sharedDataService: SharedDataService,
		private toasterComponent: ToasterComponent,
		private emitterService: EmitterService, ) {

		this.columnDefs = [
			{
				headerName: 'Cruise Line',
				field: "cruiseLineName",
				//sort: "desc",
				minWidth: 200,
				autoHeight: true,
				sortable: true,
				suppressHorizontalScroll: false,
			},
			{
				headerName: 'Itinerary',
				field: "name",
				//sort: "desc",
				minWidth: 200,
				autoHeight: true,
				sortable: true,
				suppressHorizontalScroll: false,
			},
			{
				headerName: 'Daily Wages',
				field: "dailyRate",
				//sort: "aesc",
				autoHeight: true,
				minWidth: 200,
				type: 'number',
			
				editable: true,
				sortable: true,
				cellEditorFramework: IntineraryEditorComponent,
				suppressHorizontalScroll: false,
				
			},
			{
				headerName: 'History',
				field: "isHistoryExist",
				minWidth: 200,
				cellRendererFramework: HistoryIconComponent,
				autoHeight: true,
				sortable: true,
				suppressHorizontalScroll: false,
			},
		]
		this.defaultColDef = {
			//editable: true,
			resizable: true,
			sortable: true,

		};
		//this.domLayout = "autoHeight";

		// Row HEIGHT
		this.getRowHeight = function (params) {
			if (params.node.level === 0) {
				return 28;
			} else {
				return 25;
			}
		};
		this.multiSortKey = "ctrl";
		this.overlayLoadingTemplate =
			'<span class="ag-overlay-loading-center nodata" >Searching...please wait</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';
	}
	ngOnInit() {
		this.formcontrolsSet();
		this.getCruiseLine();
		this.emitterService.refreshHistoryEdit.subscribe(d => {
			this.rowData = [];
			this.getWagesGridList();
		})

	};

	//FormControls
	formcontrolsSet() {
		this.ItineraryListForm = this.fb.group({
			cruiseLine: [''],
			wages: [true]
		});
	};
	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	}
	/*============= onGridReady ag grid ngonit =============*/
	onGridReady(params) {
		this.getWagesGridList();
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.rowSelection = "multiple";
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		}
		// this.gridApi.sizeColumnsToFit();
		console.log(this.gridApi.sizeColumnsToFit());


		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");

		//  minRowHeight = 30;
		// currentRowHeight = minRowHeight;
		// params.api.sizeColumnsToFit();
	};

	/*============= getCruiseLine  call API =============*/
	getCruiseLine() {
		this.sharedDataService.getCuriselineList().subscribe(
			(data: any) => {
				this.cruiseLineData = data;
				this.cruiseLineData.forEach(item => {
					if (item.isDefault == true) {
						this.ItineraryListForm.patchValue({
							cruiseLine: item.id
						});
					}
				});

				let cruiseLine = parseInt(localStorage.getItem('wages'));

				if(cruiseLine){
					this.ItineraryListForm.patchValue({
						cruiseLine: cruiseLine
					});
				}
			},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	};

	/*============= getWagesGridList  both page load data and search click also same API  =============*/
	getWagesGridList() {

		this.cruiseLineId = this.ItineraryListForm.get('cruiseLine').value;
		this.wagesId = this.ItineraryListForm.get('wages').value;
		if (this.cruiseLineId == null) {
			this.cruiseLineId = '';
		} else {
			this.cruiseLineId = this.ItineraryListForm.get('cruiseLine').value;
		}
		if (this.wagesId == null) {
			this.wagesId = '';
		} else {
			this.wagesId = this.ItineraryListForm.get('wages').value;
		};
		this.rmsApiService.showLoader(true);
		this.cruiseLineService.getWagesGridList(this.cruiseLineId, this.wagesId).subscribe((data) => {
			this.rowData = data;
			this.rmsApiService.showLoader(false);
			// if(this.rowData.length <= 10){
			// 	$('.ag-paging-panel').hide();
			// }else{
			// 	$('.ag-paging-panel').show();
			// }
		},
			error => {
				this.rmsApiService.setData(error);
				this.rmsApiService.showLoader(false);
				this.router.navigate(['/Error'])
			}
		)
	};

	/*============= inline Edit Service  call API =============*/
	onCellValueChanged(e) {
		this.updatedId = e.data.id
		this.onColumnResized();
	
		let obj = e.data.dailyRate;
		this.cruiseLineService.updateData(this.updatedId, obj).subscribe((data) => {
			this.emitterService.refreshHistoryEdit.emit(true);
		},
			error => {
				this.toasterComponent.onError(error);
			}
		);
	}

	///  On Page size change//
	onPageSizeChanged() {
		var value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");

	}

	/*============= onQuickFilterChanged filter =============*/
	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	};

	/*============= itineraryHistory click on grid open popup =============*/
	itineraryHistory(e) {
		this.config.data = {
			id: e.data.id
		}
		let dialogRef = this.dialog.open(ItineraryHistoryComponent, this.config);
	};

	/*=============Clear click =============*/
	clear() {
		this.ItineraryListForm.reset();
		// this.formcontrolsSet();
		// this.getWagesGridList();
		this.ItineraryListForm = this.fb.group({
			cruiseLine: [''],
			wages: []
		});
		this.rowData = []
	};

	ngOnDestroy(){
		localStorage.removeItem('wages');
	}
}

var minRowHeight = 30;
var currentRowHeight = minRowHeight;

