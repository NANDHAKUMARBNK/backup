import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
//import { PsgService } from '../../Service/PsgService'
import { SharedDataService } from 'common/services/SharedDataService';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmitterService } from 'common/services/emitterService';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog, } from "@angular/material";
import { VoyageSequenceComponent } from './VoyageSequenceComponent';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { VoyageCurdComponent } from './VoyagesGridCurdComponent';
import { DatePipe } from '@angular/common';
import { ItineraryDateComponent } from './ItineraryDate';
import { ItinerarySelectComponent } from './ItinerarySelect';
import { ItineraryArrivalComponent } from './ItineraryArrival';
import { ItineraryDepatureComponent } from './ItineraryDepature';

//import { Location } from '@angular/common';

@Component({
	selector: 'app-voyagegrid',
	templateUrl: '../../../../../../../Views/CruiseLines/VoyageGrid.html',
	styleUrls: ['../../../styles/cruiseLine.scss'],
	providers: [DatePipe]
})
export class VoyageGridComponent {

	@ViewChild('pageSize') pageSize: ElementRef;
	VoyageListForm: FormGroup;
	rowSelection: any;
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
	//CuriseLine: any;
	//RmmManager: any;
	//shipsData: any;
	gridOptions: any;
	overlayLoadingTemplate;
	overlayNoRowsTemplate;
	status: any;
	statusId: any;
	isactive: any;
	venderid: number;
	vendorId: any;
	config = new MatDialogConfig();
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
	VoyagesId: any;
	editType: any;
	locationData: any;
	frameworkComponents: any;
	updates: any;
	itineraryID: any;
	voyageWagesNotSetup: any;
	paginationPageSize: number;
	domLayout: any;



	constructor(private http: HttpClient, private route: ActivatedRoute,
		private fb: FormBuilder, private router: Router, private dialog: MatDialog, private cruiseLineService: CruiseLineService,
		private rMSApiService: RMSApiService, private toasterComponent: ToasterComponent, private datePipe: DatePipe,
		private sharedDataService: SharedDataService,
		private emitterService: EmitterService,
	) {
		this.VoyagesId = this.route.snapshot.paramMap.get('id');
		this.itineraryID = this.route.snapshot.paramMap.get('itineraryID');
		this.getLocation();

		this.columnDefs = [
			{
				headerName: '',
				field: "isSalesExist",
				cellRendererFramework: VoyageCurdComponent,

			},
			{
				headerName: 'Date',
				field: "Date",
				sortable: true,
				autoHeight: true,
				//editable: true,
				cellEditor: "date",
				cellRenderer: "date",
				editable: true,
			},
			{
				headerName: 'Location',
				field: 'name',
				sortable: true,
				autoHeight: true,
				cellEditor: "select",
				cellRenderer: "select",
				editable: true,
			},
			{
				headerName: 'Arrival',
				field: "arrivalDateTime",
				//editable: true,
				sortable: true,
				cellEditor: "arrival",
				cellRenderer: "arrival",
				editable: true,
				//cellRenderer: (params) => {
				//	return this.datePipe.transform(params.value, 'MM/dd/yy');
				//}

			},
			{
				headerName: 'Departure',
				field: "departureDateTime",
				//editable: true,
				sortable: true,
				cellEditor: "Depature",
				cellRenderer: "Depature",
				editable: true,

				//cellRenderer: (params) => {
				//	return this.datePipe.transform(params.value, 'MM/dd/yy');
				//}
			},
		];

		this.defaultColDef = {
			//editable: true,
			resizable: true,
		}

		this.frameworkComponents = {
			date: ItineraryDateComponent,
			select: ItinerarySelectComponent,
			arrival: ItineraryArrivalComponent,
			Depature: ItineraryDepatureComponent


		}
		// Row HEIGHT
		this.getRowHeight = function (params) {
			if (params.node.level === 0) {
				return 28;
			} else {
				return 25;
			}
		};
		this.editType = "fullRow";
		this.overlayLoadingTemplate =
			'<span class="ag-overlay-loading-center nodata" style=\"margin-top:-137px; border-radius:5px; font-size:15px;">Data not loaded yet.</span>';
		this.overlayNoRowsTemplate =
			"<span class='ag-overlay-loading-center nodata'>No record(s) found.</span>";
		this.rMSApiService.setData(this.columnDefs);
	}

	ngOnInit() {
		this.getVoyagesProfileGrid();
		this.getVoyagesSetUp();


		this.emitterService.refreshvoyagesCurd.subscribe((data: any) => {
			console.log("refreshvoyagesCurd")
			if(data){
				this.getVoyagesProfileGrid();
			}
		

		});

		this.emitterService.refreshvoyagespopup.subscribe((data: any) => {
			console.log("refreshvoyagespopup")
			this.rowData = [];
			this.getVoyagesProfileGrid();

		});


		this.rMSApiService.buttonClickEventTrack.subscribe(event => {
			let selectedRow = this.rowData.find(row => row.id === event);
		
		})

	};
	
	getLocation() {
		this.cruiseLineService.getLocation().subscribe((data: any) => {
			this.locationData = data;
			this.emitterService.refreshvoyagesSelect.emit(this.locationData);
			this.rMSApiService.setintiSelect(this.locationData)
		})
	};

	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	};

	ngOnChanges() {
	
		let selectable = this.rMSApiService.getGlobalVariable();
	

	}

	onGridReady(params) {
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
	onPageSizeChanged() {
		//var value=100;
		let value = this.pageSize.nativeElement.value;
		this.gridApi.paginationSetPageSize(Number(value));
		//this.gridApi.setRowData(this.searchList(value));
		let element = document.getElementById("myGrid");
		this.gridApi.setDomLayout("autoHeight");
		//document.getElementById("#myGrid").style.height = "";
		//this.gridPagination.onPageSized(value, element);

	}

	getVoyagesSetUp() {
		this.cruiseLineService.getVoyageWagesNotSetup(this.itineraryID).subscribe((data: any) => {
			this.voyageWagesNotSetup = data;
			//this.voyageWagesNotSetup.dailyRate=255;
		},
			error => {
				this.toasterComponent.onError(error)
			}
		)
	}

	getVoyagesProfileGrid() {
		this.rMSApiService.showLoader(true);
		this.cruiseLineService.getVoyageProfileGrid(this.VoyagesId).subscribe((data: any) => {
			this.rowData = data;
			this.rMSApiService.showLoader(false);
			this.rowData.map(row => row.isShowText = true);
			this.rowData.forEach(item=>{
				item.customdepature=item.departureTime
				item.customarrival=item.arrivalTime
				item.customdate=item.date
				item.customPort=item.portId
				item.popupclosd=false;
			})
			//this.rowData[1].isSalesExist=true;
			//this.rowData.map(row=>row.isSalesExist=true);
		},
			error => {
				this.rMSApiService.showLoader(false);

				this.rMSApiService.setData(error);
				this.router.navigate(['/Error'])

			}
		)
	};



	insertNewResult() {
		// insert a blank new row, providing the first sport as a default in the sport column
		this.updates = this.gridApi.updateRowData(
			{
				add: [{
					date: this.columnDefs
				}]
			},
		);
		this.gridApi.setFocusedCell(this.updates.add[0].rowIndex);
		this.gridApi.startEditingCell({
			rowIndex: this.updates.add[0].rowIndex,
			colKey: 'date'
		});
	};

	// inline Edit Service
	onCellValueChanged(e) {
		this.updatedId = e.data;
		this.rMSApiService.setRowDateId(this.updatedId)
	}

	onRowClicked(e) {
	

		this.rMSApiService.setRowDateId(e.data.id);
		
	}

	printResult(res) {
		res.remove.forEach(function (rowNode) {
		
		});
	}

	backpage() {
		this.router.navigateByUrl('/Port');
	};

	// voyage sequence click and open modal 
	voyageSequence() {
		this.config.data = {

		}
		let dialogRef = this.dialog.open(VoyageSequenceComponent, { panelClass: 'custom-dialog-container' });
	}
	// voyage history click and open modal 	
}

var minRowHeight = 30;
var currentRowHeight = minRowHeight;


