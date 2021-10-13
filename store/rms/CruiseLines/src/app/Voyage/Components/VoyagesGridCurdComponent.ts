import { Component } from '@angular/core';
import { CruiseLineService } from '../../Service/CruiseLineService';
import { RMSApiService } from 'common/services/RMSApiService';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { EmitterService } from 'common/services/emitterService';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationModalComponent } from 'common/components/ConfirmationModal';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { VoyageSequenceComponent } from './VoyageSequenceComponent';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { shallowEqual } from '@angular/router/src/utils/collection';

@Component({
	selector: 'app-voyagecurd',
	templateUrl: '../../../../../../../Views/CruiseLines/VoyageCurd.html',
	styleUrls: ['../../../styles/cruiseLine.scss', '../../../../../../common/styles/AgGrid.scss'],
	providers: [DatePipe]
})
export class VoyageCurdComponent {
	data: any;
	gridApi: any;
	params: any;
	gridColumnApi: any;
	col: any;
	colParams: any;
	currentIndex: any;
	deleteIcontrue: boolean = false;
	deleteIconfalse: boolean = false;
	editIconTrue: boolean = false;
	editIconFalse: boolean = false;
	saveicon: boolean = false;
	VoyagesId: any;
	updateId: any;
	config = new MatDialogConfig();
	rowData: any;
	singleId: any;
	addGrid: boolean=false;

	constructor(
		private cruiseLineService: CruiseLineService, private dialog: MatDialog,
		private rMSApiService: RMSApiService, private toasterComponent: ToasterComponent,
		private emitterService: EmitterService, private route: ActivatedRoute, private datePipe: DatePipe

	) {
		this.VoyagesId = this.route.snapshot.paramMap.get('id');
	}

	agInit(params) {
		console.log("hi")
		this.colParams = params
		this.gridColumnApi = params.columnApi;
		this.gridApi = params.api;
		this.data = params.data;

		this.col = this.rMSApiService.getData();
		//this.currentIndex = this.rMSApiService.getRowDateId();
		if (this.data.isSalesExist == true && this.data.popupclosd == false) {
			this.deleteIcontrue = true;
			this.deleteIconfalse = false;
			this.editIconTrue = true;
			this.editIconFalse = false;
		} else if (this.data.isSalesExist == false && this.data.popupclosd == false) {
			this.deleteIconfalse = true;
			this.deleteIcontrue = false;
			this.editIconFalse = true;
			this.editIconTrue = false; //false
		} else if(this.data.popupclosd == false ) {
			//this.deleteIcontrue = true;
			this.saveicon = true;
			//this.editIconFalse = false;
		}else{
			this.saveicon = true;

		}


	};


	deleteRow(event) {
		if (event.data.id && event.data.isSalesExist == false) {
			this.config.data = {
			};
			let dialogRef = this.dialog.open(ConfirmationModalComponent, {
				disableClose: false,
				width: '500px',
			});

			let deleteRowData = event.node.data;
			dialogRef.componentInstance.confirmMessage = `Confirm you want to delete the ${moment(deleteRowData.date).format("MM/DD/YY")}  ${deleteRowData.portName} entry`
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					let id = event.node.data.id
					this.cruiseLineService.deleteProfileGrid(deleteRowData.id).subscribe((data: any) => {
						this.editIconTrue = false;
						this.editIconFalse = false;
						this.deleteIconfalse = false;
						this.deleteIcontrue = false;
						this.saveicon = false;
						this.data.date = null;
						this.data.arrivalTime = null
						this.data.departureTime = null
						this.data.arrivalTime = null
						this.data.portId = null;
						this.data.portName=null;
						var selectedData = this.gridApi.getSelectedRows();
						var res = this.gridApi.updateRowData({ remove: selectedData });
						res.remove.forEach(function(rowNode) {
						  });
						//printResult(res);
						//	this.gridApi.redrawRows();
						//this.data={};
						//this.refreshGridById(deleteRowData.id)
						this.emitterService.refreshvoyagesCurd.emit(true);
						//this.gridApi.refreshView();
					},
						error => {
							this.toasterComponent.onError(error);
						}
					)
				}
			})
		} else if (event.data.id && event.data.isSalesExist == true) {
			this.config.data = {
				action: "delete",
				ItinerarySequenceID: event.node.data.id
			};
			let dialogRef = this.dialog.open(VoyageSequenceComponent, this.config);
			dialogRef.afterClosed().subscribe(
				data => {
					var selectedData = this.gridApi.getSelectedRows();
						var res = this.gridApi.updateRowData({ remove: selectedData });
						res.remove.forEach(function(rowNode) {
							console.log("Removed Row Node", rowNode);
						  });
					
					this.data.popupclosd = true;
					if (this.data.popupclosd) {
						this.editIconTrue = true;
						this.editIconFalse = false;
						this.saveicon = false;
					};
					//this.refreshGridById(event.node.data.id)
				})
		}
	}


	deleteVoyageDetail() {

	}

	onBtStartEditing(event) {
		console.log(event,'event')

		this.updateId = event.data.id;

		this.rMSApiService.setGlobalVariable(event.value);
		this.rMSApiService.buttonClickEventTrack.next(event.data.id);
		this.singleId = event.data.id;
		this.gridApi.setFocusedCell(event.node.rowIndex);

		this.gridApi.startEditingCell({
			rowIndex: event.node.rowIndex,
			colKey: 'Date'
		});

		if (event.node.id) {
			this.saveicon = true;
			this.editIconFalse = false;
			this.editIconTrue = false;
		}

	};


	refreshGridById(id) {
		this.rMSApiService.showLoader(true);
		this.cruiseLineService.refreshGridById(id).subscribe((data: any) => {

            this.data.popupclosd=false;
			this.data.date = data.date;
			this.data.arrivalTime = data.arrivalTime;
			this.data.departureTime = data.departureTime;
			this.data.portId = data.portId;
			this.data.isDeparture = data.isDeparture;
			this.data.isSalesExist = data.isSalesExist;
			this.data.portName = data.portName;

			this.data.customdate=data.date
			this.data.customdepature=data.departureTime
			this.data.customPort=data.portName
			this.data.customarrival=data.arrivalTime
			this.data.id = data.id;
			console.log(this.data,'refreshh')
			if (this.data.isSalesExist == true) {
				this.deleteIcontrue = true;
				this.deleteIconfalse = false;
				this.editIconTrue = true;
				this.editIconFalse = false;
				this.saveicon=false;
			} else if (this.data.isSalesExist == false) {
				this.deleteIconfalse = true;
				this.deleteIcontrue = false;
				this.saveicon=false;
				this.editIconFalse = true;
				this.editIconTrue = false; //false
			} else {
				//this.deleteIcontrue = true;
				this.saveicon = true;
				//this.editIconFalse = false;
			};
			this.rMSApiService.showLoader(false)

			this.gridApi.stopEditing();



		},
		error=>{
			this.rMSApiService.showLoader(false);
			this.toasterComponent.onError(error)
		}
		)
	}

	saveData(event) {
		let intDate = this.rMSApiService.getitineraryDate();
		let intselect = this.rMSApiService.getitinerarySelect();
		let intarrival = this.rMSApiService.getitineraryarrival();
		moment(this.data.departureDateTime).format("HH:mm");
		let arrival = moment(intarrival).format("HH:mm");
		let intdepture = this.rMSApiService.getitineraryDepatur();
		let depture = moment(intdepture).format("HH:mm");

		if (this.updateId && this.data.isSalesExist == false) {
			if (intDate == null || intDate == "") {
				intDate = this.data.date
			}
			if (intselect == null || intselect == "") {
				intselect = this.data.portId;
			}
			if (intarrival == null || intarrival == "") {
				intarrival = this.data.arrivalTime
			}
			if (intdepture == null || intdepture == "") {
				intdepture = this.data.departureTime
			};

			const reqData = {
				voyageId: this.VoyagesId,
				date: intDate,
				portId: intselect,
				arrivalTime: intarrival,
				departureTime: intdepture,
			}

			this.cruiseLineService.updateProfileGrid(this.updateId, reqData).subscribe((data: any) => {
				//this.gridApi.refreshView();
				this.rMSApiService.clearitineraryarrival();
				this.rMSApiService.clearitineraryDepatur();
				this.rMSApiService.clearitinerarySelect();
				this.rMSApiService.clearitineraryDate();
				this.editIconTrue = false;
				this.editIconFalse = true;
				this.saveicon = false;
				this.data.isShowText = true;
				//this.refreshGridById(this.updateId)

				// if(this.updateId){
				// this.data.date=this.data.date;
				// this.data.arrivalTime=this.data.arrivalTime;
				// this.data.departureTime=this.data.departureTime;
				// this.data.arrivalTime=this.data.arrivalTime;
				// this.data.portId=this.data.portId;
				// //this.data.isDeparture=true;

				// this.gridApi.stopEditing();
				// this.data.isShowText = true;
				// this.gridApi.redrawRows()

				// }
				//this.toasterComponent.onUpdated();
				this.emitterService.refreshvoyagesCurd.emit(this.updateId);
				// this.saveicon = false;
				// this.editIconFalse = true;
				// this.editIconTrue = true;
			},
				error => {
					this.toasterComponent.onError(error);
				}
			)
		} else if (this.updateId && this.data.isSalesExist == true) {
			if (intDate == null || intDate == "") {
				intDate = this.data.date
			}
			if (intselect == null || intselect == "") {
				intselect = this.data.portId;
			}
			if (intarrival == null || intarrival == "") {
				intarrival = this.data.arrivalTime
			}
			if (intdepture == null || intdepture == "") {
				intdepture = this.data.departureTime
			}
			this.config.data = {
				action: "edit",
				ItinerarySequenceID: this.updateId,
				voyageId: this.VoyagesId,
				date: intDate,
				portId: intselect,
				arrivalTime: intarrival,
				departureTime: intdepture,

			};

			let dialogRef = this.dialog.open(VoyageSequenceComponent, this.config);
			dialogRef.afterClosed().subscribe(
				data => {
					this.data.popupclosd = true;
					if (this.data.popupclosd) {
						 this.editIconTrue = true;
						 this.editIconFalse = false;
						 this.saveicon = false;
						this.data.isShowText = true;
					};
					//this.refreshGridById(this.updateId);
				});

		} else {
			const detailsData = {
				voyageId: this.VoyagesId,
				date: intDate,
				portId: intselect,
				arrivalTime: intarrival,
				departureTime: intdepture,
			}
			this.cruiseLineService.saveProfileGrid(detailsData).subscribe((res: any) => {
				//this.gridApi.refreshView();
				this.rMSApiService.clearitineraryarrival();
				this.rMSApiService.clearitineraryDepatur();
				this.rMSApiService.clearitinerarySelect();
				this.rMSApiService.clearitineraryDate();
				this.emitterService.refreshvoyagesCurd.emit(true);
				this.addGrid=true;
				this.saveicon = false;
				this.data.isShowText = true;
				this.data.popupclosd == false
				//this.refreshGridById(res);

			},
				error => {
					this.toasterComponent.onError(error);
				}
			)
		}
	};

	cancel() {
		this.data.isShowText = true;

		//if (this.updateId) {
		this.gridApi.stopEditing();
		if (this.singleId == this.data.id) {
			this.data.isShowText = true;
			//this.emitterService.refreshvoyagesCurd.emit(true);
		}
		if (this.data.isSalesExist == true) {
			this.editIconTrue = true;
			this.editIconFalse = false;
			this.saveicon = false;
			//this.emitterService.refreshvoyagesCurd.emit(true);
		} else if (this.data.isSalesExist == false) {
			this.editIconTrue = false;
			this.editIconFalse = true;
			this.saveicon = false;
			//this.emitterService.refreshvoyagesCurd.emit(true);
		}
		this.data.date = this.data.customdate;
		this.data.departureTime = this.data.customdepature;
		this.data.portId = this.data.customPort;
		this.data.arrivalTime = this.data.customarrival;


		console.log(this.data,'cancel')
	


		//this.data.date=this.data.date
	}


}
