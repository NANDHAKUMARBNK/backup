import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ContractService } from "../Service/ContractService";
import { ToasterComponent } from "common/components/ToasterComponent";
import { CheckBoxChildrenComponent } from "./contractChildrenCheckboxComponent";
import { RMSApiService } from "common/services/RMSApiService";
import { Router, NavigationEnd } from "@angular/router";
import { DatePipe } from "@angular/common";
declare var $: any;

@Component({
  selector: "app-applychildren",
  templateUrl: "../../../../../../../Views/Finance/ApplyChildrenModal.html",
  styleUrls: ["../../../../../../common/styles/AgGrid.scss"],
  providers: [DatePipe]
})
export class ApplyChildrenModalComponent {
  display: boolean = false;
  private gridApi;
  private gridColumnApi;
  columnDefs: any;
  defaultColDef: any;
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
  name: any;
  rowSelection: any;
  Data: any;
  tempCheckId: any = [];
  disabledupdatesettlement: boolean = true;
  availableCheckBox: boolean;
  isRowSelectable: (rowNode: any) => any;
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<ApplyChildrenModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private contractService: ContractService,
    private datePipe: DatePipe,
    private toasterComponent: ToasterComponent,
    private rMSApiService: RMSApiService
  ) {
    this.Data = data;

    this.columnDefs = [
      {
        headerName: "",
        field: "GPCustomerID",
        autoHeight: true,
		width: 50,
		checkboxSelection: function(params) {
            if (params.data.isCheckDisabled){
				return false;
			} 
			return true;
        },
        // checkboxSelection: true,
        // cellRenderer: params => {
		//   console.log(params);
		//   params.data.isCheckDisabled ? {'pointer-events': 'none'}
        //   : ''
        // //   if (params.data.isCheckDisabled) {
        // //     return false;
        // //   }
        // //   return true;
        // }
        //cellRendererFramework: CheckBoxChildrenComponent
      },
      {
        headerName: "Class",
        field: "customerClass",
        sortable: true,
        autoHeight: true,
        editable: true,
        width: 80
      },
      {
        headerName: "Customer ID",
        field: "gpCustomerId",
        sortable: true,
        autoHeight: true,
        width: 120
      },
      {
        headerName: "Customer Name",
        field: "customerName",
        sortable: true,
        autoHeight: true,
        width: 220
      },
      {
        headerName: "Status",
        field: "contractStatus",
        sortable: true,
        autoHeight: true,
        width: 105
      },
      {
        headerName: "Dates",
        field: "effectiveDates",
        sortable: true,
        autoHeight: true,
        width: 150,
        // cellRenderer: params => {
        //   return this.datePipe.transform(params.value, "MM/dd/yy");
        // }
      }
    ];

    this.defaultColDef = {
      editable: true,
      resizable: true
    };

    // Row HEIGHT
    this.getRowHeight = function(params) {
      if (params.node.level === 0) {
        return 28;
      } else {
        return 25;
      }
    };

    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center nodata" style="margin-top:-137px; border-radius:5px; font-size:15px;">No Data found.</span>';
    this.overlayNoRowsTemplate =
      "<span class='ag-overlay-loading-center nodata'>No Data found.</span>";
  }

  ngOnInit() {
    $(".oneSpec")
      .closest(".mat-dialog-container")
      .css("cssText", "width: 790px!important");

    this.getGrid();
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
  }

  getGrid() {
    this.contractService
      .getApllyChildren(
        this.Data.parentCustomerId,
        this.Data.cruiseLineId,
        this.Data.categoryId,
        this.Data.typeId,
        this.Data.contractId
      )
      .subscribe(
        (data: any) => {
          this.rowData = data.items;
          //   this.rowData.map(item => {
          // 	  console.log("Item", item)
          //     if (item.isCheckDisabled == true) {
          //       this.availableCheckBox = false;
          //     } else {
          //       this.availableCheckBox = true;
          //     }
          //   });
        },
        error => {
          this.toasterComponent.onError(error);
        }
      );
  }

  selectionChanged(params) {
    let data = this.gridApi.getSelectedRows();

    let tempArray = [];
    if (data.length > 0) {
      this.disabledupdatesettlement = false;
      tempArray.push(data);
    } else if (data.length < 0) {
      tempArray = tempArray.filter(element => element.id != data.id);
    } else if (data.length == 0) {
      this.disabledupdatesettlement = true;
    }

    this.rMSApiService.setData(tempArray);
  }

  saveChildren() {
    let targetGPCustomerId = this.rMSApiService.getData();
    targetGPCustomerId[0].forEach(item => {
      let tempObj = {
        targetGPCustomerId: item.gpCustomerId,
        contractId: this.Data.contractId
      };
      this.tempCheckId.push(tempObj);
    });

    let contractId;
    this.contractService.saveApplychildren(this.tempCheckId).subscribe(
      (data: any) => {
        this.rowData = data;
        this.toasterComponent.onSucess();
        this.dialogRef.close();
      },
      error => {
        this.toasterComponent.onError(error);
      }
    );
  }

  onQuickFilterChanged(e) {
    this.gridApi.setQuickFilter(this.searchValue);
  }
  close() {
    this.dialogRef.close();
  }
  saveDoc() {
    this.dialogRef.close();
  }
}
