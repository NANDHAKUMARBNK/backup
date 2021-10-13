import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { DatePipe } from '@angular/common';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { RMSApiService } from 'common/services/RMSApiService';
import { EmitterService } from 'common/services/emitterService';
import { Router } from '@angular/router';
declare var $: any;


@Component({
	selector: 'app-voyageseq',
	templateUrl: '../../../../../../../Views/CruiseLines/VoyageSequence.html',
	styles: ['../../../styles/cruiseLine.scss','../../../../../../common/styles/commonApp.scss'],
	providers: [DatePipe]
})
export class VoyageSequenceComponent {
	// title = 'CruiseLines';
	Datadoc: any;

	Data: any;
	upload: File;
	cacheId: any;
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
	statusL: any;

	constructor(private dialogRef: MatDialogRef<VoyageSequenceComponent>, @Inject(MAT_DIALOG_DATA) data,
		private cruiseLineService: CruiseLineService, private datePipe: DatePipe, private emitterService: EmitterService,
		private toasterComponent: ToasterComponent, private rMSApiService: RMSApiService, private router: Router) {
	
		this.Data = data;
		this.columnDefs = [
			{
				headerName: 'Call',
				field: "callDate",
				width: 80,
				sortable: true,
				cellRenderer: (params) => {
					return this.datePipe.transform(params.value, 'MM/dd/yy')
				}
			},
			{
				headerName: 'Port',
				field: "portName",
				sortable: true,
				width: 80,
			},
			{
				headerName: 'Retailer',
				field: "customerName",
				sortable: true,
				width: 200,
			},
			{
				headerName: 'Contract',
				field: "typeName",
				sortable: true,
				width: 100,
			},
			{
				headerName: 'Sales',
				field: "amount",
				sortable: true,
				width: 100,
				cellRenderer: (params) => {
					if (params.value == 0) {
						return;
					} else {
						return '$' + params.value.toFixed(2);
					}

				}
			},
			{
				headerName: 'Commission',
				field: "feeAmount",
				sortable: true,
				width: 100,
				cellRenderer: (params) => {
					if (params.value == 0) {
						return;
					} else {
						return '$' + params.value.toFixed(2);
					}
					// let avgSalesValue = params.value;
					// let integerAmount = parseInt(avgSalesValue);
					// let amount = integerAmount.toFixed(2);

				}
			},

		];

		this.defaultColDef = {
			// editable: true,
			resizable: true,
			autoHeight: true,
		}


		this.getRowHeight = function (params) {
			if (params.node.level === 0) {
				return 28;
			} else {
				return 25;
			}
		};

		this.overlayLoadingTemplate =
			'<span class="ag-overlay-loading-center nodata" style=\"margin-top:-137px; border-radius:5px; font-size:15px;">Data not loaded yet.</span>';
		this.overlayNoRowsTemplate =
			"<span class='ag-overlay-loading-center nodata'>No record(s) found.</span>";
	}
	ngOnInit() {
		$(".oneSpec").closest(".mat-dialog-container").css('cssText', 'width: 1050px !important');
	}

	onColumnResized() {
		this.gridApi.resetRowHeights();
	}
	onCellEditingStopped() {
		this.onColumnResized();
	}
	onGridReady(params) {
		this.getGrid();
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.rowSelection = "multiple";
		window.onresize = () => {
			this.gridApi.sizeColumnsToFit();
		}
		console.log(this.gridApi.sizeColumnsToFit())
	}



	getGrid() {
		var ItinerarySequenceID;
		var voyageId;
		if (this.Data.ItinerarySequenceID == null)
			ItinerarySequenceID = '';
		else
			ItinerarySequenceID = this.Data.ItinerarySequenceID;

		if (this.Data.voyageIdprofile == null)
			voyageId = '';
		else
			voyageId = this.Data.voyageIdprofile
		this.rMSApiService.showLoader(true);
		this.cruiseLineService.getGridDeletePop(ItinerarySequenceID, voyageId).subscribe((data: any) => {
			this.rowData = data;
		
			this.rMSApiService.showLoader(false);
		},
			error => {
				this.toasterComponent.onError(error);
				this.rMSApiService.showLoader(false);

			}
		)

	};

	print() {
		var ItinerarySequenceID;
		var voyageId;
		if (this.Data.ItinerarySequenceID == undefined || this.Data.ItinerarySequenceID == null)
			ItinerarySequenceID = '';
		else
			ItinerarySequenceID = this.Data.ItinerarySequenceID;

		if (this.Data.voyageIdprofile == undefined || this.Data.voyageIdprofile == null)
			voyageId = '';
		else
			voyageId = this.Data.voyageIdprofile
		//window.location.href = `api/cruiseLine/voyageDetailSequence/salesReport?itinerarySequenceId=${ItinerarySequenceID}&voyageId=${voyageId}`
	}

	cancel() {
		this.dialogRef.close();
	};

	Continue() {
		if (this.Data.action == "delete") {
			this.cruiseLineService.continueDelete(this.Data.ItinerarySequenceID).subscribe(data => {
				this.toasterComponent.onDeteled();
				let setValue="true";
				this.rMSApiService.clearitineraryarrival();
				this.rMSApiService.clearitineraryDepatur();
				this.rMSApiService.clearitinerarySelect();
				this.rMSApiService.clearitineraryDate();
				this.dialogRef.close(setValue);
				//this.router.navigate(['/Voyage'])
				this.emitterService.refreshvoyagespopup.emit(true);

			},
				error => {
					this.dialogRef.close();
					this.toasterComponent.onError(error)
				}
			)
		} else if (this.Data.action == "edit") {
			const reqData = {
				voyageId: this.Data.voyageId,
				date: this.Data.date,
				portId: this.Data.portId,
				arrivalTime: this.Data.arrivalTime,
				departureTime: this.Data.departureTime,
			}
			this.cruiseLineService.updateProfileGrid(this.Data.ItinerarySequenceID, reqData).subscribe(data => {
				this.toasterComponent.onSucess();
				this.rMSApiService.clearitineraryarrival();
				this.rMSApiService.clearitineraryDepatur();
				this.rMSApiService.clearitinerarySelect();
				this.rMSApiService.clearitineraryDate();
				let setValue="true";
				this.dialogRef.close(setValue);
				//localStorage.setItem("params",setValue)
				//this.router.navigate(['/Voyage'])
				this.emitterService.refreshvoyagespopup.emit(true);
				//this.emitterService.refreshintinareryGrid.emit(true);


			},
				error => {
					this.dialogRef.close();
					this.toasterComponent.onError(error)
				}
			)
		} else if (this.Data.action == "profileDelete") {
			this.cruiseLineService.deleteVoyagesProfile(this.Data.voyageIdprofile).subscribe((data: any) => {
				this.toasterComponent.onDeteled();
				this.dialogRef.close();
				//this.emitterService.refreshvoyagespopup.emit(true);
				this.router.navigate(['/Voyage'])

			},
				error => {
					this.dialogRef.close();
					this.toasterComponent.onError(error)
				}
			)

		} else if (this.Data.action == "profileSave") {
			this.cruiseLineService.saveVoyagesProfile(this.Data.voyageIdprofile, this.Data.typeId, this.Data.regionId).subscribe((data: any) => {
				this.toasterComponent.onSucess();
				this.dialogRef.close();
				//this.emitterService.refreshvoyagespopup.emit(true);
				this.router.navigate(['/Voyage'])

			},
				error => {
					this.dialogRef.close();
					this.toasterComponent.onError(error)
				}
			)
		}
	}

}