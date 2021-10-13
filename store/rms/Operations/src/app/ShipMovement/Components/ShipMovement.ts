import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmitterService } from 'common/services/emitterService';
import { SharedDataService } from 'common/services/SharedDataService';
import { PsgService } from '../../Service/PsgService';
import { DatePipe } from '@angular/common';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { Subscription } from 'rxjs';
declare var $: any;


@Component({
	selector: 'app-shipmovement',
	templateUrl: '../../../../../../../Views/Operations/ShipMovement.html',
	styleUrls: ['../../../styles/PsgList.scss', '../../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe]

})
export class ShipMovementComponent {
	@ViewChild('pageSize') pageSize: ElementRef;
	shipMovementListForm: FormGroup;
	private rowSelection;
	display: boolean = false;
	gridApi: any;
	gridColumnApi: any;
	// addNewReportForm: FormGroup;

	columnDefs: any;
	defaultColDef: any;
	rowData: any;
	deleteid: [];
	searchValue: string;
	updatedId: any;
	getRowHeight: any;

	private getRowNodeId;
	dataId: any;
	emitterSubscribe: any;


	singleClickEdit: any
	brand: string;
	id: any
	overlayLoadingTemplate;
	overlayNoRowsTemplate;

	CuriseLine: any
	cruiseLineId: any;
	shipsData: any;
	staffData: any;
	shipId: any;
	staffTypeId: any;
	gridId: any;
	defaultSelect: any;
	currentDate
	shipSubscription: Subscription;
	domLayout: any;
	paginationPageSize: any;

	constructor(private http: HttpClient, private route: ActivatedRoute,
		private fb: FormBuilder, private sharedDataService: SharedDataService,
		private emitterService: EmitterService, private router: Router,
		private psgService: PsgService, private datePipe: DatePipe,
		private rMSApiService: RMSApiService,
		private toasterComponent: ToasterComponent,

	) {
		this.columnDefs = [
			{
				headerName: 'Ship',
				field: "shipName",
				sortable: true,
				width: 130
			},
			{
				headerName: 'Name',
				field: "name",
				sortable: true,
				autoHeight: true,
				width: 130
			},
			{
				headerName: 'Role',
				field: "roleTypeName",
				sortable: true,
				autoHeight: true,
				width: 130

			},
			{
				headerName: 'Voyage Start',
				field: "effectiveBeginDate",
				sortable: true,
				autoHeight: true,
				width: 100,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy')
				}
			},
			{
				headerName: 'Embark',
				field: "embarkPortName",
				sortable: true,
				autoHeight: true,
				width: 130
				// cellRenderer: (params) => {
				// 	return this.datePipe.transform(params.value, 'MM/dd/yy')
				// }

			},
			{
				headerName: 'Debark',
				field: "disembarkPortName",
				sortable: true,
				width: 130
				// cellRenderer: (params) => {
				// 	return this.datePipe.transform(params.value, 'MM/dd/yy')
				// }
			},
			{
				headerName: 'Voyage End',
				field: "effectiveEndDate",
				sortable: true,
				autoHeight: true,
				width: 100,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy')
				}
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
			'<span class="ag-overlay-loading-center nodata" >Searching...please wait</span>';
		this.overlayNoRowsTemplate =
			'<span class="ag-overlay-loading-center nodata">No data to display</span>';
	}

	ngOnInit() {
		this.formcontrolsSet();
		this.getCuriseLine();
		this.GetShips();
		this.getStaffType();
		this.searchList();
	};

	formcontrolsSet() {
		this.shipMovementListForm = this.fb.group({
			CruiseLineId: [''],
			ShipId: [''],
			staffTypeId: [''],
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
		console.log(this.gridApi.sizeColumnsToFit())
		this.paginationPageSize = 100;
		this.gridApi.setDomLayout("autoHeight");
	}


	getCuriseLine() {
		this.sharedDataService.getCuriselineList().subscribe((data: any) => {
			this.CuriseLine = data
			this.CuriseLine.forEach(item => {
				if (item.isDefault == true) {
					this.shipMovementListForm.patchValue({
						CruiseLineId: item.id
					});
				}
			})
			this.GetShips()
		},

			error => {
				this.toasterComponent.onError(error);
			}
		);
	};


	GetShips() {

		this.cruiseLineId = this.shipMovementListForm.get('CruiseLineId').value;
		this.shipSubscription = this.sharedDataService.getShipList(this.cruiseLineId).subscribe((data: any) => {
			this.shipsData = data;
			//this.shipMovementListForm.controls['ShipId'].enable({ onlySelf: true, emitEvent: false });

			//this.shipMovementListForm.reset();

		},
			error => {
				this.toasterComponent.onError(error);
			}
		);

	};
	getStaffType() {
		this.sharedDataService.getStaffType().subscribe((data: any) => {
			this.staffData = data.items;
		},
			error => {
				this.toasterComponent.onError(error);
			}
		)
	};
	//Page Size Change
	onPageSizeChanged(newPageSize) {
		var value = this.pageSize.nativeElement.value;

		this.gridApi.paginationSetPageSize(Number(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");
	}

	//<======== searchList ===========>
	searchList() {

		this.cruiseLineId = this.shipMovementListForm.get('CruiseLineId').value;
		this.shipId = this.shipMovementListForm.get('ShipId').value;
		this.staffTypeId = this.shipMovementListForm.get('staffTypeId').value;
		this.rMSApiService.showLoader(true);

		this.psgService.searchList(this.cruiseLineId, this.shipId, this.staffTypeId).subscribe(
			(data: any) => {
				this.rowData = data.items;
				this.rMSApiService.showLoader(false);
				// if(this.rowData.length <= 10){
				// 	$('.ag-paging-panel').hide();
				// }else{
				// 	$('.ag-paging-panel').show();
				// }
			},
			error => {
				this.rMSApiService.setData(error);
				this.rMSApiService.showLoader(false);
				this.router.navigateByUrl('/Error')

			}
		)
		this.ngOnDestroy()
	};

	//<==========navigate to add shipmovement=============>
	addShipMovement() {
		this.router.navigateByUrl('/ShipMovement/Assignment')
	}

	//<==========Rowclick navigate to profile Page and Pass Params To URL==========>
	onRowClicked(e: any) {
		this.gridId = e.data
		this.router.navigate(['/ShipMovement/Assignment', {
			vendorAssignmentId: this.gridId.vendorAssignmentId, cruiseLineId: this.cruiseLineId, shipId: this.shipId, rmmManagerId: this.staffTypeId, cruiseLineID: this.gridId.cruiseLineID, effectiveBeginDate: this.gridId.effectiveBeginDate, shipID: this.gridId.shipID, effectiveEndDate: this.gridId.effectiveEndDate, embarkdate: this.gridId.embarkDateTime, disembark: this.gridId.disembarkDateTime, embarkId: this.gridId.embarkItinerarySequenceID, disembarId: this.gridId.disembarkItinerarySequenceID
		}]);
	};

	onQuickFilterChanged(e) {
		this.gridApi.setQuickFilter(this.searchValue)
	}

	removesearch() {
		this.searchValue = null
		this.gridApi.setQuickFilter(this.searchValue)
	};

	clear() {
		this.shipMovementListForm.reset();
		this.formcontrolsSet();
		this.searchList();
	};

	ngOnDestroy() {
		if (this.shipSubscription) {
			this.shipSubscription.unsubscribe();
		}

	}

}

var minRowHeight = 30;
var currentRowHeight = minRowHeight;
