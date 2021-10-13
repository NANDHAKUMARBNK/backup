import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EmitterService } from 'common/services/emitterService';
import { RMSApiService } from 'common/services/RMSApiService';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AffidavitDetailComponent } from './AffidavitDetailComponent';
import { SalesHistoryComponent } from './SalesHistoryComponent';
import { ManagementService } from '../service/ManagementService';
import { SalesCommentComponent } from './SalesCommentComponent';
import { ToasterComponent } from 'common/components/ToasterComponent';
import { NotesModalComponent } from 'common/components/NotesModal';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
	selector: 'app-salesselect',
	templateUrl: "../../../../../../../Views/Finance/Management/SalesSelect.html",

})
export class SalesSelectComponent {
	data: any;
	config = new MatDialogConfig();
	typeData: any;
	selectType: boolean = true;
	selectTypeName: boolean = false;
	showLockIcon: boolean = false;

	return: any;
	typeId = new FormControl("");
	selectedoption: boolean = false;
	sourceData: any;
	gridApi: any;
	colParams: any;

	constructor(private dialog: MatDialog, private managementService: ManagementService, private emitterService: EmitterService, private rMSApiService: RMSApiService, private toasterComponent: ToasterComponent) {
		this.sourceData = this.rMSApiService.getcascaddingitem();
	
	}

	agInit(params) {
		this.data = params.data;
		this.gridApi = params.api;
		this.colParams = params;
		if(this.data.checkselectDefalut){
			this.typeId.patchValue(this.data.checkselectDefalut);

		}
		else if (this.data.businessLogic.salesTypeCodeDefault) {
			this.typeId.patchValue(this.data.businessLogic.salesTypeCodeDefault);
		}
	   else if(this.data.salesIntiDefalut){

			this.data.checkEditSles = true;
			this.data.retunMaxValidation=false;
			this.data.cursor = false;
			this.data.saleSelectValidation = true;
			this.typeId.patchValue(this.data.salesIntiDefalut)
			this.data.selectedByDefalut=this.data.salesIntiDefalut;
			//this.data.selectedByDefalut = this.data.salesTypeValue;
			// this.emitterService.salesSelect.emit(params.node.rowIndex);
			// this.gridApi.setFocusedCell(params.node.rowIndex);
			// this.gridApi.startEditingCell({
			// 	rowIndex: params.node.rowIndex,
			// 	colKey: 'businessLogic.amountDefault'
			// });
		}
		else if(this.data.selectedByDefalut){
			this.typeId.patchValue(this.data.selectedByDefalut)

		}

	};


	ngOnInit() {
		if (this.data.businessLogic.salesTypeLabel) {
			this.data.saleSelectValidation = true;
		}
		// let cheking=[this.data]
		// let check=cheking.filter(item => item.code != "NOSLS");
		// console.log(check,'check');
		//this.typeData = JSON.parse(JSON.stringify(this.sourceData.businessLogic.salesTypeOptions));
		this.typeData = this.data.businessLogic.salesTypeOptions;
		if (this.data.lockUserID != null && this.data.lockUserID) {
			this.showLockIcon = true;
			this.selectType = false;
			this.selectTypeName = true;
		} else if (this.data.businessLogic.salesTypeControl == 'LABEL') {
			this.showLockIcon = false;
			this.selectType = false;
			this.selectTypeName = true;
		} else if (this.data.businessLogic.salesTypeControl == 'DRPDWN') {
			this.showLockIcon = false;
			this.selectType = true;
			this.selectTypeName = false;
		}

		// if (this.data.lockUserID != null && this.data.lockUserID) {
		// 	this.showLockIcon = true;
		// 	this.selectType = false;
		// 	this.selectTypeName = false;
		// 	console.log("lock")
		// } else if (this.data.typeCode == "FF") {
		// 	this.typeData = this.typeData.filter(item => item.code == "RETURN");
		// 	console.log("ff")
		// 	this.selectType = true;
		// 	this.selectTypeName = false;
		// 	this.showLockIcon = false;
		// } else if (this.data.statusCode == "SUBMTD") {
		// 	console.log("SUBMTD")
		// 	this.selectType = false;
		// 	this.selectTypeName = true;
		// 	this.showLockIcon = false;
		// } else if (this.data.statusCode == "PRCSNG" || this.data.statusCode == "PRCSSD") {
		// 	this.typeData = this.typeData.filter(item => item.code != "NOSLS");
		// 	this.selectType = true;
		// 	this.selectTypeName = false;
		// 	this.showLockIcon = false;
		// };

		// this.typeData= JSON.parse(JSON.stringify(this.sourceData));
		// if(this.data.statusCode == "UNRPTD"){

		// 	console.log("source data=>", this.typeData)
		// }
		// // if (this.data.statusCode == "PRCSNG" || this.data.statusCode == "PRCSSD") {
		// // 		this.typeData = this.typeData.filter(item => item.code != "NOSLS");
		// // }

		// if (this.data.lockUserID == null) {
		// 	if (this.data.statusCode == "SUBMTD") {
		// 		this.selectType = false;
		// 		this.selectTypeName = true;
		// 		this.showLockIcon = false;
		// 	};
		// 	//this.typeData = this.rMSApiService.getcascaddingitem();
		// }
		// else if (this.data.lockUserID) {
		// 	console.log("hi lockuser")
		// 	this.showLockIcon = true;
		// 	this.selectType = false;
		// 	this.selectTypeName = false;

		// }
		// else if (this.data.statusCode == "SUBMTD") {
		// 	let tempArray;
		// 	this.selectType = false;
		// 	this.selectTypeName = true;
		// 	this.showLockIcon = false;
		// 	//tempArray.push(this.data.typeId);
		// 	//this.rMSApiService.setData(this.data.typeId)
		// } else if (this.data.typeCode == "FF") {
		// 	this.typeData = this.typeData.filter(item => item.code == "RETURN");
		// 	this.selectType = true;
		// 	this.selectTypeName = false;
		// 	this.showLockIcon = false;
		// 	//this.return=typeIndex.id;
		// }
		// if (this.data.typeCode == "FF") {
		// 	this.typeData = this.typeData.filter(item => item.code == "RETURN");
		// 	this.selectType = true;
		// 	this.selectTypeName = false;
		// 	this.showLockIcon = false;
		// 	//this.return=typeIndex.id;

		// }else if(this.data.statusCode == "PRCSNG" || this.data.statusCode == "PRCSSD"){
		// 		this.typeData = this.typeData.filter(item => item.code != "NOSLS");
		//  }




		this.typeId.valueChanges.subscribe((data: any) => {
			let findValue = this.typeData.find(item => item.id == data);
			if (data == "RETURN" || data == "NOSLS") {
				if (this.data.isComment ==true) {
					this.config.data = {
						salesId: this.data.contractSalesId,
						FINANCE_SALES: "FINANCE_SALES",
						View: "Edit",
						title: "Sales"

					};
					

					let dialogRef = this.dialog.open(NotesModalComponent, this.config);
				} else {
					this.config.data = {
						salesId: this.data.contractSalesId,
						FINANCE_SALES: "FINANCE_SALES",
						View: "Add",
						title: "Sales"

					}
					let dialogRef = this.dialog.open(NotesModalComponent, this.config);
				}






			}

			// } else if (this.data.statusCode == "UNRPTD" && findValue.code == "RETURN") {

			// } else if (this.data.statusCode == "PRCSNG" && findValue.code == "RETURN") {
			// 	this.config.data = {
			// 		id: this.data.contractSalesId
			// 	}
			// 	let dialogRef = this.dialog.open(SalesCommentComponent, this.config);
			// } else if (this.data.statusCode == "PRCSSD" && findValue.code == "RETURN") {
			// 	this.config.data = {
			// 		id: this.data.contractSalesId
			// 	}
			// 	let dialogRef = this.dialog.open(SalesCommentComponent, this.config);
			// };
		})

	};



	typeSelected(event) {
		let checkTypeCode = this.typeId.value;
		this.data.checkselectDefalut=checkTypeCode;

		

		if (this.data.businessLogic.salesTypeCodeDefault) {
			this.data.saleSelectValidation = true;
		} else if (checkTypeCode) {
			this.data.saleSelectValidation = true;
			this.data.selectedByDefalut = checkTypeCode;
		}

		this.emitterService.refreshSlesTypeChanged.emit(event.data)

		let tempArray = this.rMSApiService.getSalesType();
		tempArray.push(checkTypeCode);

		if (checkTypeCode == "NOSLS") {
			this.gridApi.stopEditing(event.node.rowIndex);
			this.data.businessLogic.amountDefault = null;
			this.data.cursor = true;
			this.data.salesSelectNoSales = true;
			this.data.checkEditSles = false;
			let noEditSales = true;
			this.data.salesEditInit=false;
			this.emitterService.refreshNoSlaesEdit.emit(noEditSales)

			this.emitterService.refreshSlesTypeChanged.emit(event.data);

			var rowNode = this.gridApi.getRowNode(event.node.rowIndex);
			//this.data.businessLogic.amountDefault=null;
			rowNode.setData(this.data);
			this.gridApi.redrawRows()


		} else if (checkTypeCode == "Select") {
			this.gridApi.stopEditing(event.node.rowIndex);
			this.data.cursor = true;
			this.data.businessLogic.amountDefault = null;
			this.data.salesSelectNoSales = false;
			this.data.checkEditSles = false;
			let noEditSales = true;
			this.data.salesEditInit=false;

			this.emitterService.refreshNoSlaesEdit.emit(noEditSales)

			this.emitterService.refreshSlesTypeChanged.emit(event.data);
			var rowNode = this.gridApi.getRowNode(event.node.rowIndex);
			this.gridApi.redrawRows()
			//this.data.businessLogic.amountDefault=null;
			rowNode.setData(this.data);
		} else if(checkTypeCode == "RETURN"){
			this.data.retunMaxValidation=true;
			this.data.cursor = false;
			this.data.checkEditSles = true;
			this.emitterService.salesSelect.emit(event.node.rowIndex);
			this.gridApi.setFocusedCell(event.node.rowIndex);
			this.gridApi.startEditingCell({
				rowIndex: event.node.rowIndex,
				colKey: 'businessLogic.amountDefault'
			});
		}

		else if(checkTypeCode == "SALES") {
			this.data.checkEditSles = true;
			this.data.retunMaxValidation=false;
			this.data.cursor = false;
			this.emitterService.salesSelect.emit(event.node.rowIndex);
			this.gridApi.setFocusedCell(event.node.rowIndex);
			this.gridApi.startEditingCell({
				rowIndex: event.node.rowIndex,
				colKey: 'businessLogic.amountDefault'
			});
		};

	
		this.rMSApiService.setSalesType(tempArray)
	}



}