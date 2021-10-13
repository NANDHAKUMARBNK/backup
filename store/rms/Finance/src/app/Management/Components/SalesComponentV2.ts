import { Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import {
  MatDialogConfig,
  MatDialog,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from "@angular/material";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { SalesHistoryIconComponent } from "./HistoryIconComponent";
import { SalesCommentIconComponent } from "./SalesCommentIcon";
import { SalesHistoryComponent } from "./SalesHistoryComponent";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { ManagementService } from "../service/ManagementService";
import { ToasterComponent } from "common/components/ToasterComponent";
import { DatePipe } from "@angular/common";
import { interval } from "rxjs";
declare var $: any;
import * as _moment from "moment";
//import { Location } from '@angular/common';
import { default as _rollupMoment } from "moment";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { RMSApiService } from "common/services/RMSApiService";
import { SalesSelectComponent } from "./SalesSelectComponent";
import { EmitterService } from "common/services/emitterService";
import { NumericEditorComponent } from "common/components/NumericEditorComponent";
import { CustomValidatorService } from "common/CustomValidation/CustomValidatorService";
import { RMSMomentDateAdapter } from "common/adapter/RMSMomentDateAdapter";
import { SalesCommentComponent } from "./SalesCommentComponent";
import { SaelsInputEditorComponent } from "./salesInputComponet";
import { balancePreviousStylesIntoKeyframes } from "@angular/animations/browser/src/util";
import { identifierModuleUrl } from "@angular/compiler";
import { ItineraryModule } from "apps/CruiseLines/src/app/Itinerary/ItineraryModule";
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: "MM/DD/YY"
  },
  display: {
    dateInput: "MM/DD/YY",
    monthYearLabel: "MMM YYYY"
  }
};
@Component({
  selector: "app-financesalesv2",
  templateUrl: "../../../../../../../Views/Finance/Management/salesV2.html",
  styleUrls: [
    "../../../../../../common/styles/AgGrid.scss",
    "../../../../../../common/styles/Modal.scss"
  ],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: RMSMomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    CustomValidatorService
  ]
})
export class ManagementSalesV2Component {
  @ViewChild("pageSize") pageSize: ElementRef;
  private gridApi;
  private gridColumnApi;

  // addNewReportForm: FormGroup;

  columnDefs: any;
  defaultColDef: any;
  rowData: any;
  deleteid: [];
  searchValue: string;
  updatedId: any;
  getRowHeight;
  private getRowNodeId;
  dataId: any;
  singleClickEdit: any;
  brand: string;
  gridId: any;
  gridOptions: any;
  overlayLoadingTemplate;
  overlayNoRowsTemplate;
  name: any;
  rowSelection: string;
  panelOpenState = false;
  showDocument: boolean = false;
  config = new MatDialogConfig();
  data: any;
  id: any;
  parentCustomerSales: any;
  customerSales: any;
  shipSales: any;
  portSales: any;
  statusSales: any;
  contractTypeSales: any;
  salesForm: FormGroup;
  parentCustomerSalesId: any;
  customerSalesId: any;
  shipSalesId: any;
  portSalesId: any;
  statusSalesId: any;
  contractTypeSalesId: any;
  required: boolean = false;
  //hasError: boolean = false;
  minSalesStartDate: any;
  minSalesEndDate: any;
  callstartdate = new FormControl(moment());
  callenddate = new FormControl(moment());
  saletenminutes: boolean = false;
  salezerominutes: boolean = false;
  updateSales: boolean = true;
  amountChanged: any;
  salesEditArray: any = [];
  salesTypeId: any;
  updatetypeId: any;
  SelecttypeId: any = [];
  findParentObject: any;
  domLayout: any;
  paginationPageSize: any;
  cascadingParenetCustomercheck: any;
  shipid: string;
  cascadingcallDateEnd: any;
  cascadingContracttype: any;
  cascadingcallDateStart: any;
  cascadingChildCustomer: any;
  cascadingParenetCustomer: any;
  loading: boolean = true;
  subscription: any;
  combinefeid: any;
  settypeBoolean: boolean = false;
  typeChangeDataAvaliable: any = [];
  typeDataSelect: any;
  salesTypeSelectEdit: any = [];
  setEditableCondition: any;
  getRowStyle: any;
  colorIndex: any;
  colors = ["#000000", "#000066", "#006600", "#660000"];
  rowClassRules: any;
  amountmax: boolean = false;
  getRowClass: any;
  newSlesEditArray: any = [];
  maxDate: any;
  maxEndDate: any;
  embarkDateTime: string;

  @HostListener("window:beforeunload") goToPage() {
    this.salesUnlock();
  }

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private router: Router,
    private emitterService: EmitterService,
    private toasterComponent: ToasterComponent,
    private customValidatorService: CustomValidatorService,
    private fb: FormBuilder,
    private rMSApiService: RMSApiService,
    private managementService: ManagementService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    // var colorsNames = [];
    // // this.managementService.getTypeSalesGrid().subscribe((data: any) => {
    // // 	this.typeDataSelect = data.items;

    // // 	this.typeDataSelect.forEach(color => {
    // // 		colorsNames.push(color.name);
    // // 	})
    // 	console.log("hi data", this.typeDataSelect)
    // 	this.rMSApiService.setcascaddingitem(this.typeDataSelect)

    // });

    var setEditableCondition;
    this.updatetypeId = this.rMSApiService.getSalesType();
    this.emitterService.salesSelect.subscribe(data => {
      setEditableCondition = data;
    });

    this.emitterService.refreshNoSlaesEdit.subscribe(data => {
      if (data) {
        setEditableCondition = null;
      }
    });
    this.emitterService.refreshInputChanged.subscribe(data => {
      this.amountmax = true;
      // this.rowClassRules = {
      //     "sick-days-warning": function(params) {
      //         console.log("params",params)

      //       var numSickDays = params.node.rowIndex==backgroundColorSet;
      //       return numSickDays
      //     },
      //     "sick-days-breach": "data.sickDays > 8"
      //   };
    });
    let backgroundColorSet;
    this.emitterService.refreshSlesBackground.subscribe(data => {
      backgroundColorSet = data;
    });

    this.columnDefs = [
      {
        headerName: "Customer",
        field: "gpCustomerId",
        sortable: true,
        editable: false,
        autoHeight: true,
        width: 125
      },
      {
        headerName: "Customer Name",
        field: "customerName",
        sortable: true,
        editable: false,
        autoHeight: true,
        width: 200
      },

      {
        headerName: "Call Date",
        field: "callDate",
        sortable: true,
        editable: false,
        autoHeight: true,
        width: 90,
        cellRenderer: params => {
          return this.datePipe.transform(params.value, "MM/dd/yy");
        }
      },
      {
        headerName: "Ship",
        field: "shipName",
        sortable: true,
        editable: false,
        autoHeight: true,
        width: 90
      },
      {
        headerName: "Contract",
        field: "typeName",
        sortable: true,
        autoHeight: true,
        editable: false,
        width: 125
      },
      {
        headerName: "Status",
        field: "statusName",
        sortable: true,
        editable: false,
        autoHeight: true,
        width: 100
      },

      {
        headerName: "Sales/Fee",
        field: "salesFeeDisplay",
        sortable: true,
        editable: false,
        autoHeight: true,
        width: 160
        //cellRenderer: (params) => {
        //	if (params.value)
        //		return '$' + params.value.toFixed(2);
        //	else
        //		return

        //},
      },
      {
        headerName: "Type",
        field: "salesTypeOptions",
        autoHeight: true,
        cellRendererFramework: SalesSelectComponent,
        width: 150,
        cellStyle: { border: "none", outline: "none" }
        //editable:true

        // cellEditor: 'agSelectCellEditor',
        // editable: function (params) {
        //     //this.rMSApiService.setcascaddingitem(params.data)
        //     console.log(params.data.businessLogic.salesTypeControl);
        //     return params.data.businessLogic.salesTypeControl == 'DRPDWN'
        // 	if (params.data.businessLogic.salesTypeControl == 'DRPDWN') {

        // 	}
        // 	// allow `min_value` cell to be edited for rows with correct `validation_type`
        // 	//return params.data.lockUserID == null;
        // },
        //cellEditorParams:  { values:  this.salesTypeSelectEdit},
        // cellEditorParams: function(params) {
        //     console.log(params,'params');
        //     let value=[]
        //     params.data.businessLogic.salesTypeOptions.map(item => {
        //          value.push(item.salesTypeValue)
        //     });

        //     // if(params.data.businessLogic.SalesTypeCodeDefault){
        //     //     return {
        //     //         values: params.data.businessLogic.SalesTypeCodeDefault
        //     //     };
        //     // }else{
        //         return {

        //             values: value
        //         };
        // //    }

        // },
        // cellRenderer: function (params: any) {
        // 	console.log(params.data.businessLogic.salesTypeControl, 'cellrender');
        // 	if (params.data.businessLogic.salesTypeControl == 'LABEL') {
        // 		return `<p>${params.data.businessLogic.salesTypeLabel} </p>`
        // 	}
        // 	//return this.typeDataSelect;
        // },
        // onCellValueChanged: function (params: any) {
        //     console.log(params,'params')
        //     var selectedTypeName = params.data.businessLogic.salesTypeOptions;
        //     console.log(selectedTypeName,'options')

        //     var finalselectedCode = selectedTypeName.find(serviceType => serviceType.salesTypeValue == params.newValue)

        //     console.log("finalselectedCode",finalselectedCode)
        //     if(finalselectedCode.salesTypeCode == "RETURN"){
        //         // this.config.data = {
        //         //     id: params.data.contractSalesId
        //         // }
        //         let dialogRef = this.dialog.open(SalesCommentComponent, {});
        //     }
        //   },
        // },
      },
      {
        headerName: "Amount",
        field: "businessLogic.amountDefault",
        sortable: true,
        //editable: false,
        autoHeight: true,
        width: 100,
        cellStyle: function(params) {
          if (params.data.lockUserID == null) {
            if (params.data.salesEditInit) {
              return { cursor: "pointer" };
            }
            if (params.data.businessLogic.salesTypeControl == "LABEL") {
              if (params.data.businessLogic.amountIsEditable == true) {
                return { cursor: "pointer" };
              }
            } else if (
              params.data.businessLogic.salesTypeControl == "DRPDWN" &&
              setEditableCondition == params.node.rowIndex
            ) {
              return { cursor: "pointer" };
            } else if (
              params.data.businessLogic.salesTypeControl == "DRPDWN" &&
              params.data.businessLogic.amountDefault &&
              params.data.checkEditSles
            ) {
              return { cursor: "pointer" };
            } else if (params.data.cursor) {
              return { cursor: "default" };
            } else if (params.data.checkEditSles) {
              return { cursor: "pointer" };
            }
          }

          // if (params.data.lockUserID) {
          //     return {border: 'none',outline:'none'};
          // } else if (params.data.businessLogic.salesTypeControl == 'LABEL') {
          //     if (params.data.businessLogic.amountIsEditable == false) {
          //         return {border: 'none',outline:'none'};
          //     }else if(params.data.businessLogic.amountIsEditable == true){
          //         return {border: 'none',outline:'none'};
          //     }
          // }else if (params.data.businessLogic.amountDefault) {
          //     return {border: 'none',outline:'none'};

          // }
        },
        // cellStyle: { 'cursor': "pointer" },
        //cellRendererFramework: SalesInputComponent,
        cellEditorFramework: SaelsInputEditorComponent,
        cellRenderer: function(params) {
          if (params.data.lockUserID) {
            return ' <i class="fas fa-lock"></i>';
          } else if (params.data.businessLogic.salesTypeControl == "LABEL") {
            if (params.data.businessLogic.amountIsEditable == false) {
              let amountFalse = params.data.businessLogic.amountDefault;
              return `<p>${amountFalse}  </p>`;
            } else if (params.data.businessLogic.amountIsEditable == true) {
              let amountTrue = params.data.businessLogic.amountDefault;
              return `<p>${amountTrue}  </p>`;
            }
          } else if (params.data.businessLogic.amountDefault) {
            let amount = params.data.businessLogic.amountDefault;
            return `<p>${amount}  </p>`;
          }
        },
        editable: function(params) {
          // allow `min_value` cell to be edited for rows with correct `validation_type`
          if (params.data.lockUserID == null) {
            if (params.data.salesEditInit) {
              return true;
            }
            if (params.data.businessLogic.salesTypeControl == "LABEL") {
              if (params.data.businessLogic.amountIsEditable == true) {
                return true;
              }
            } else if (
              params.data.businessLogic.salesTypeControl == "DRPDWN" &&
              setEditableCondition == params.node.rowIndex
            ) {
              return true;
            } else if (
              params.data.businessLogic.salesTypeControl == "DRPDWN" &&
              params.data.businessLogic.amountDefault &&
              params.data.checkEditSles
            ) {
              return true;
            }
          }
          //	return params.data.lockUserID == null || params.data.amountIsEditable>=1;
        }
      },
      {
        headerName: "",
        field: "",
        width: 100,
        cellRendererFramework: SalesHistoryIconComponent
      }
      // {
      // 	headerName: '',
      // 	field: "embark",
      // 	width: 100,
      // 	cellRendererFramework: SalesCommentIconComponent,
      // },
    ];

    this.defaultColDef = {
      resizable: true,
      suppressCellSelection: true
    };

    this.getRowStyle = function(params) {
      // return {'background-color': 'yellow'}

      if (params.data.backgroundcheck == true) {
        return { "background-color": "#FFFFD1" };
      }
      return null;
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
      '<span class="ag-overlay-loading-center nodata" >Searching...please wait</span>';
    this.overlayNoRowsTemplate =
      '<span class="ag-overlay-loading-center nodata">No data to display</span>';
  }

  ngOnInit() {
    //	this.valuesChanges();
    this.formControlSetForAffidavit();
    this.shipSalesManagement();
    this.parentCustomerSalesManagement();
    this.valuesChanges();
    this.portSalesManagement();
    this.statusSalesManagement();
    this.contractTypeSalesManagement();
    this.setFormControls();
    this.embarkDateTime = sessionStorage.getItem("embarkDateTime");

    this.minSalesStartDate = _moment()
      .subtract(1, "days")
      .format();
    this.minSalesEndDate = _moment()
      .subtract(1, "day")
      .format();
    this.maxEndDate = _moment().format();
    setInterval(() => {
      let minute = new Date().getMinutes();
      if (minute >= 50 && minute < 60) {
        this.saletenminutes = true;
        this.salezerominutes = false;
      } else if (minute > 0 && minute < 5) {
        this.salezerominutes = true;
        this.saletenminutes = false;
      } else if (minute >= 35 && minute < 40) {
      }
    }, 1000);

    this.emitterService.updateSales.subscribe(d => {
      if (this.salesEditArray) {
        this.salesEditArray = [];
      }
      if (this.updatetypeId) {
        this.updatetypeId = [];
      }
      if (this.SelecttypeId) {
        this.SelecttypeId = [];
      }
    });

    this.emitterService.refreshSlesTypeChanged.subscribe(data => {
      if (data == "NOSLS" || data == "Select") {
        this.gridApi.stopEditing();
      }
      if (data.saleSelectValidation && data.salesInputValidation) {
        this.updateSales = false;
      } else if (data.salesSelectNoSales) {
        data.salesInputValidation = true;
        this.salesEditArray = this.arrayAdd(this.salesEditArray, data);
        this.updateSales = false;
      }
    });

    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.router.url == "") {
        } else {
          this.salesUnlock();
        }
      }
    });

    this.emitterService.refreshNotes.subscribe(d => {
      this.rowData = [];
      this.searchSales();
    });
  }

  getsalesSelect() {
    this.managementService.getTypeSalesGrid().subscribe((data: any) => {
      this.typeDataSelect = data.items;
      this.rMSApiService.setcascaddingitem(this.typeDataSelect);
    });
  }

  dateValueChanged(e) {
    this.rMSApiService.setFinaceStartDate(e.value);

    // this.minEndDate = _moment(e.value).add(1, 'day').format();
    // this.maxDate = _moment(e.value).add(1, 'day').format();
    // this.maxEndDate = _moment().subtract(1, "day").format();

    // this.minSalesEndDate = _moment(e.value).add(1, 'day').format();
    this.maxDate = _moment(e.value)
      .add(1, "day")
      .format();
    //this.maxEndDate = _moment().subtract(1, "day").format();
  }
  hasError(controlName: string, errorName: string) {
    return this.salesForm.controls[controlName].hasError(errorName);
  }
  onColumnResized() {
    this.gridApi.resetRowHeights();
  }
  onCellEditingStopped() {
    this.onColumnResized();
  }
  getErrorMessage(pickerInput: string): string {
    if (!pickerInput || pickerInput === "") {
      return;
    }
    return this.customValidatorService.isMyDateFormat(pickerInput);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    //this.rowSelection = "multiple";
    window.onresize = () => {
      this.gridApi.sizeColumnsToFit();
    };
    this.paginationPageSize = 100;
    this.gridApi.setDomLayout("autoHeight");
  }

  // salesFinance management starts
  formControlSetForAffidavit() {
    this.salesForm = this.fb.group({
      parentCustomerSalesCtrl: [""],
      customerSalesCtrl: [""],
      shipSalesCtrl: [""],
      portSalesCtrl: [""],
      statusSalesCtrl: [""],
      callstartdate: [null],
      callenddate: [null],
      contractTypeSalesCtrl: [""]
    });
  }

  setFormControls() {
    this.cascadingParenetCustomer = this.rMSApiService.getFinanceParentCustomer();
    this.cascadingChildCustomer = this.rMSApiService.getFinanceChildCustomer();
    this.cascadingcallDateStart = this.rMSApiService.getFinaceStartDate();
    this.cascadingContracttype = this.rMSApiService.getFinanceContract();
    this.cascadingcallDateEnd = this.rMSApiService.getFinaceEndDate();
    this.shipid = localStorage.getItem("salesthis.shipid");
    this.cascadingParenetCustomercheck = this.cascadingParenetCustomer;
    this.findParentObject = this.cascadingParenetCustomer;

    if (this.shipid) {
      this.salesForm.patchValue({
        shipSalesCtrl: parseInt(this.shipid)
      });
    }
    if (this.cascadingParenetCustomer) {
      this.salesForm.patchValue({
        parentCustomerSalesCtrl: this.cascadingParenetCustomer.name
      });
    }
    if (this.cascadingChildCustomer) {
      this.salesForm.patchValue({
        customerSalesCtrl: this.cascadingChildCustomer
      });
    }

    if (this.cascadingcallDateStart) {
      this.salesForm.patchValue({
        callstartdate: this.cascadingcallDateStart
      });
    }
    if (this.cascadingcallDateEnd) {
      this.salesForm.patchValue({
        callenddate: this.cascadingcallDateEnd
      });
    }
    if (this.cascadingContracttype) {
      this.salesForm.patchValue({
        contractTypeSalesCtrl: this.cascadingContracttype
      });
    }

    //this.casccadingApi(this.cascadingParenetCustomer,this.cascadingChildCustomer,this.shipid,this.this.cascadingContracttype,this.cascadingcallDateEnd,this.cascadingcallDateStart)
  }

  casccadingApi() {
    let patchValue = this.salesForm.value;
    if (
      patchValue.parentCustomerSalesCtrl ||
      patchValue.customerSalesCtrl ||
      patchValue.shipSalesCtrl ||
      patchValue.portSalesCtrl ||
      patchValue.statusSalesCtrl ||
      patchValue.callstartdate ||
      patchValue.callenddate ||
      patchValue.contractTypeSalesCtrl
    ) {
      this.parentCustomerSalesManagement();
      if (
        this.cascadingParenetCustomer == undefined ||
        this.cascadingParenetCustomer == NaN ||
        this.cascadingParenetCustomer == null
      )
        this.cascadingParenetCustomer.parentGPCustomerId = "";
      else
        this.cascadingParenetCustomer = this.rMSApiService.getFinanceParentCustomer();

      this.managementService
        .getCustomerSalesManagement(
          this.cascadingParenetCustomer.parentGPCustomerId
        )
        .subscribe(
          (response: any) => {
            this.customerSales = response.items;
          },
          error => {
            this.toasterComponent.onError(error);
          }
        );
      if (
        this.cascadingChildCustomer == undefined ||
        this.cascadingChildCustomer == NaN ||
        this.cascadingChildCustomer == null
      )
        this.cascadingChildCustomer = "";
      else
        this.cascadingChildCustomer = this.rMSApiService.getFinanceChildCustomer();

      if (
        this.cascadingParenetCustomer == undefined ||
        this.cascadingParenetCustomer == NaN ||
        this.cascadingParenetCustomer == null
      )
        this.cascadingParenetCustomer.id = "";
      else
        this.cascadingParenetCustomer = this.rMSApiService.getFinanceParentCustomer();

      if (this.shipid == undefined) this.shipid = "";
      else this.shipid = localStorage.getItem("salesthis.shipid");
      let portSalesId = "";
      let statusSalesId = this.salesForm.get("statusSalesCtrl").value;
      let beginDate = this.rMSApiService.getFinaceStartDate();
      let endDate = this.rMSApiService.getFinaceEndDate();
      if (
        beginDate == undefined ||
        beginDate == NaN ||
        beginDate == null ||
        beginDate == ""
      ) {
        beginDate = "";
      } else {
        beginDate = this.datePipe.transform(
          this.cascadingcallDateStart,
          "yyyy-MM-dd"
        );
      }
      if (
        endDate == undefined ||
        endDate == NaN ||
        endDate == null ||
        endDate == ""
      ) {
        endDate = "";
      } else {
        endDate = this.datePipe.transform(
          this.cascadingcallDateEnd,
          "yyyy-MM-dd"
        );
      }
      if (
        this.cascadingContracttype == undefined ||
        this.cascadingContracttype == NaN ||
        this.cascadingContracttype == null
      )
        this.cascadingContracttype = "";
      else this.cascadingContracttype = this.rMSApiService.getFinanceContract();
      this.rMSApiService.showLoader(true);
      let salesShipIdFromVoyage = sessionStorage.getItem("salesshipid");
      let startDateFromVoyage = sessionStorage.getItem("embarkDateTime");
      let endDateFromVoyage = sessionStorage.getItem("debarkDateTime");
      if (salesShipIdFromVoyage) {
        (this.shipid = salesShipIdFromVoyage),
          (beginDate = startDateFromVoyage),
          (endDate = endDateFromVoyage);
      }
      this.managementService
        .getGridSalesManagementListV2(
          this.cascadingParenetCustomer.id,
          this.cascadingChildCustomer,
          this.shipid,
          portSalesId,
          statusSalesId,
          beginDate,
          endDate,
          this.cascadingContracttype
        )
        .subscribe(
          (data: any) => {
            this.rowData = data;
            this.rowData.forEach(item => {
              item.focus = true;
              item.salesInputValidation = false;
              item.saleSelectValidation = false;
              item.salesSelectNoSales = false;
              item.checkEditSles = true;
              item.retunMaxValidation = false;
              // item.businessLogic.amountMaxValue=59.99;
              //item.lockUserID=0;
              if (item.processedAmount == 0) {
                item.processedAmount = null;
              }
              if (item.feeAmount == 0) {
                item.feeAmount = null;
              }
              if (item.progressAmount == 0) {
                item.progressAmount = null;
              }
              if (item.lockUserID == 0) {
                item.lockUserID = 1;
              }
              if (item.businessLogic.amountDefault) {
                //    parseInt(item.businessLogic.amountDefault).toFixed(2)
                item.businessLogic.amountDefault = item.businessLogic.amountDefault.toFixed(
                  2
                );
              }
              item.businessLogic.salesTypeOptions.forEach(data => {
                if (item.businessLogic.salesTypeCodeDefault) {
                } else if (data.salesTypeCode == "SALES") {
                  item.salesIntiDefalut = data.salesTypeCode;
                  item.salesEditInit = true;
                }
              });
            });
            this.rMSApiService.showLoader(false);
          },
          error => {
            this.rMSApiService.showLoader(false);
            this.router.navigate(["/Error"]);
          }
        );

      //this.searchSales();
    } else {
      this.valuesChanges();
    }
  }

  searchSales() {
    if (this.salesForm.invalid) {
      return;
    }
    let parentId = this.findParentObject;
    if (parentId) {
      parentId = this.findParentObject.id;
    } else {
      parentId = "";
    }

    this.parentCustomerSalesId = this.salesForm.get(
      "parentCustomerSalesCtrl"
    ).value;
    this.customerSalesId = this.salesForm.get("customerSalesCtrl").value;
    this.shipSalesId = this.salesForm.get("shipSalesCtrl").value;
    this.portSalesId = this.salesForm.get("portSalesCtrl").value;
    this.statusSalesId = this.salesForm.get("statusSalesCtrl").value;
    let startDate = this.salesForm.get("callstartdate").value;
    let end = this.salesForm.get("callenddate").value;
    this.contractTypeSalesId = this.salesForm.get(
      "contractTypeSalesCtrl"
    ).value;

    let beginDate = this.datePipe.transform(startDate, "yyyy-MM-dd");
    if (beginDate == null) {
      beginDate = "";
    } else {
      beginDate = this.datePipe.transform(startDate, "yyyy-MM-dd");
    }

    let endDate = this.datePipe.transform(end, "yyyy-MM-dd");
    if (endDate == null) {
      endDate = "";
    } else {
      endDate = this.datePipe.transform(end, "yyyy-MM-dd");
    }
    this.rMSApiService.showLoader(true);
    let salesShipIdFromVoyage = sessionStorage.getItem("salesshipid");
    let startDateFromVoyage = sessionStorage.getItem("embarkDateTime");
    let endDateFromVoyage = sessionStorage.getItem("debarkDateTime");
    if (salesShipIdFromVoyage) {
      (this.shipSalesId = salesShipIdFromVoyage),
        (beginDate = startDateFromVoyage),
        (endDate = endDateFromVoyage);
    }

    this.managementService
      .getGridSalesManagementListV2(
        parentId,
        this.customerSalesId,
        this.shipSalesId,
        this.portSalesId,
        this.statusSalesId,
        beginDate,
        endDate,
        this.contractTypeSalesId
      )
      .subscribe(
        (data: any) => {
          this.rowData = data;
          // this.rowData[0].statusCode="UNRPTD"
          // this.salesTypeSelectEdit = [];
          if (this.salesEditArray) {
            this.salesEditArray = [];
          }
          if (this.updatetypeId) {
            this.updatetypeId = [];
          }
          if (this.SelecttypeId) {
            this.SelecttypeId = [];
          }
          //this.rowData[0].businessLogic.salesTypeCodeDefault = "NOSLS"
          this.updateSales = true;

          this.rowData.forEach(item => {
            item.focus = true;
            item.salesInputValidation = false;
            item.saleSelectValidation = false;
            item.salesSelectNoSales = false;
            item.backgroundcheck = false;
            item.selectedByDefalut = "";
            item.cursor = false;
            item.retunMaxValidation = false;
            item.salesErrorValidation = true;
            // item.businessLogic.salesTypeControl="LABEL"

            item.businessLogic.salesTypeOptions.forEach(data => {
              if (item.businessLogic.salesTypeCodeDefault) {
              } else if (data.salesTypeCode == "SALES") {
                item.salesIntiDefalut = data.salesTypeCode;
                item.salesEditInit = true;
              }
            });

            //item.businessLogic.amountMaxValue=59.99;
            //item.lockUserID=0;
            if (item.processedAmount == 0) {
              item.processedAmount = null;
            }
            if (item.feeAmount == 0) {
              item.feeAmount = null;
            }
            if (item.progressAmount == 0) {
              item.progressAmount = null;
            }
            if (item.lockUserID == 0) {
              item.lockUserID = 1;
            }
            if (item.businessLogic.amountDefault) {
              //    parseInt(item.businessLogic.amountDefault).toFixed(2)
              item.businessLogic.amountDefault = item.businessLogic.amountDefault.toFixed(
                2
              );
            }
          });

          this.rMSApiService.showLoader(false);
        },
        error => {
          this.rMSApiService.setData(error);
          this.rMSApiService.showLoader(false);
          this.router.navigate(["/Error"]);
        }
      );
  }
  validatedate(event) {
    this.customValidatorService.isDateMaxlengthForamt(event);
  }
  updateSalesClick() {
    this.gridApi.stopEditing();
    setTimeout(() => {
      this.updatetypeId = this.rMSApiService.getSalesType();
      this.updatetypeId.forEach(item => {
        this.salesTypeId = item;
      });
      let editsalesObj;
      let finaleditObj = [];
      let canSubmit = true;
      var rows = [];

      this.newSlesEditArray = this.salesEditArray.filter(item => {
        return item.selectedByDefalut != "Select";
      });
      this.newSlesEditArray.forEach(item => {
        if (item.selectedByDefalut == "Select") {
        } else if (
          item.businessLogic.amountDefault ||
          item.salesSelectNoSales
        ) {
          item.backgroundcheck = false;
          // item.checkEditSles=true;
          this.gridApi.redrawRows();
          editsalesObj = {
            customerId: item.customerId,
            contractRateId: item.contractRateId,
            itinerarySequenceId: item.itinSequenceId,
            inProgressTrxId: item.progressTrxId,
            salesTypeCode: item.selectedByDefalut,
            amount: item.businessLogic.amountDefault
          };
          finaleditObj.push(editsalesObj);
        }
      });

       console.log(finaleditObj, "finaleditingObject");

      if (!canSubmit) {
        this.toasterComponent.salesErrorMessage();
      }
      if (canSubmit) {

        this.managementService.updateSales(finaleditObj).subscribe(
          (data: any) => {
            //item.backgroundcheck = true;
            if (data.retID >= 0) {
              this.emitterService.updateSales.emit(true);
              this.searchSales();
              this.updateSales = true;
              // this.SelecttypeId = [];
              // this.salesTypeId = [];
              // this.updatetypeId = [];
              this.toasterComponent.onSucess();
            } else {
              this.toasterComponent.contractValidation(data);
            }
          },
          error => {
            //this.rMSApiService.showLoader(false);
            this.toasterComponent.onError(error);
          }
        );
      }
    }, 500);
    // this.newSlesEditArray.forEach(item => {
    //     if (item.saleSelectValidation == false || item.salesInputValidation == false) {
    //         item.backgroundcheck = true;
    //         //item.checkEditSles=true;
    //         item.selectedByDefalut = this.salesTypeId;

    //         //  item.toaster=true
    //         var that = this;
    //         // this.gridApi.forEachNode(function (rowNode) {
    //         //     //  rowNode.setDataValue("amountDefault", item.index);
    //         // });
    //         //that.gridApi.redrawRows()
    //         canSubmit = false;

    //         return false;

    //     } else {
    //         if (item.selectedByDefalut == 'Select') {

    //         } else {
    //             item.backgroundcheck = false;
    //             // item.checkEditSles=true;
    //             this.gridApi.redrawRows()
    //             editsalesObj = { 'customerId': item.customerId, 'contractRateId': item.contractRateId, 'itinerarySequenceId': item.itinSequenceId, 'inProgressTrxId': item.progressTrxId, 'salesTypeCode': item.selectedByDefalut, 'amount': item.businessLogic.amountDefault }
    //             finaleditObj.push(editsalesObj)
    //         }
    //     };

    // });
  }

  onCellValueChanged(event) {
    console.log(event, "cell value chnaged");
    //event.preventdefault();

    if (this.amountmax == true) {
      //checking amount validation using emitter service
      event.data.businessLogic.amountDefault = null;
      event.data.salesInputValidation = false;
    }
    let cellChangedValue = event.data;
    this.updatetypeId = this.rMSApiService.getSalesType();

    if (cellChangedValue.salesSelectNoSales) {
      //checking no sales set true input
      cellChangedValue.salesInputValidation = true;
    }
    if (cellChangedValue.businessLogic.amountDefault) {
      cellChangedValue.salesInputValidation = true;
    } else {
      cellChangedValue.salesInputValidation = false;
    }

    if (cellChangedValue.businessLogic.amountDefault) {
      this.amountChanged = event.data;
    } else {
      this.salesEditArray = this.arrayRemove2(
        this.salesEditArray,
        event.node);
    }

    this.amountChanged["index"] = event.node.rowIndex;

    this.salesEditArray = this.arrayRemove2(
      this.salesEditArray,
      event.node);
    this.salesEditArray = this.arrayAdd(this.salesEditArray, this.amountChanged);

    if (
      cellChangedValue.saleSelectValidation &&
      cellChangedValue.salesInputValidation
    )
      this.updateSales = false;

    this.managementService.salesLockPost(event.data.contractSalesId).subscribe(
      (data: any) => {
        //this.searchSales();
        if (data.retID <= 0) {
          this.toasterComponent.contractValidation(data);
        }
      },
      error => {
        //this.toasterComponent.onError(error)
      }
    );
  }

    arrayRemove2(arr, obj) {
        return arr.filter(function (item) {
            return !(item.contractSalesId == obj.contractSalesId);
        });
    }

    arrayRemove(arr, value) {
    return arr.filter(function(ele) {
      return ele.index != value;
    });
  }

  arrayAdd(arr, obj){
    var len = arr.length;
    var exists = false;

    for (let i = 0; i < len; i++) {
      var item = arr[i];
      if(item.contractSalesId == obj.contractSalesId){
        arr[i] = obj;
        exists = true;
        break;
      }
    }

    if (!exists){
      arr.push(obj);
    }

    return arr;
  }

  //***************cancel button*********************/

  // Get parent customer from SalesManagement service to bind the data
  parentCustomerSalesManagement() {
    this.loading = true;
    this.managementService.getParentCustomerSalesManagement().subscribe(
      (response: any) => {
        this.parentCustomerSales = response.items;
        this.loading = false;
      },
      error => {
        this.toasterComponent.onError(error);
      }
    );
  }

  getParentCustomer() {
    let parentId = this.salesForm.get("parentCustomerSalesCtrl").value;
    this.findParentObject = this.parentCustomerSales.find(
      item => item.name == parentId
    );
    this.rMSApiService.setFinanceParentCustomer(this.findParentObject);

    this.managementService
      .getCustomerSalesManagement(this.findParentObject.parentGPCustomerId)
      .subscribe(
        (response: any) => {
          this.customerSales = response.items;
        },
        error => {
          this.toasterComponent.onError(error);
        }
      );
  }
  valuesChanges() {
    let parentGPCustomerId = "";
    this.managementService
      .getCustomerSalesManagement(parentGPCustomerId)
      .subscribe(
        (response: any) => {
          this.customerSales = response.items;
        },
        error => {
          this.toasterComponent.onError(error);
        }
      );
  }
  childcustomer(event) {
    this.rMSApiService.setFinanceChildCustomer(event.value);
  }

  contractChange(event) {
    this.rMSApiService.setFinanceContract(event.value);
  }

  // Get ship from SalesManagement service to bind the data
  shipSalesManagement() {
    this.managementService.getShipSalesManagement().subscribe(
      (response: any) => {
        this.shipSales = response;

        let embarkS = moment(this.embarkDateTime).format();
        let debarkDateTime = sessionStorage.getItem("debarkDateTime");
        let shipIdSales = sessionStorage.getItem("salesshipid");
        let dembarkS = moment(debarkDateTime).format();
        if (this.embarkDateTime) {
          console.log("casssssss");
          this.salesForm.patchValue({
            callstartdate: embarkS,
            callenddate: dembarkS,
            statusSalesCtrl: "",
            shipSalesCtrl: parseInt(shipIdSales)
          });
        }
      },
      error => {
        this.toasterComponent.onError(error);
      }
    );
  }
  // Get port from SalesManagement service to bind the data
  portSalesManagement() {
    let shipid = this.salesForm.get("shipSalesCtrl").value;
    this.managementService.getPortSalesManagement(shipid).subscribe(
      (response: any) => {
        this.portSales = response;
      },
      error => {
        this.toasterComponent.onError(error);
      }
    );
  }
  // Get status from SalesManagement service to bind the data
  statusSalesManagement() {
    this.managementService.getStatusSalesManagement().subscribe(
      (response: any) => {
        this.statusSales = response.items;

        if (this.embarkDateTime) {
        } else {
          this.statusSales.forEach(item => {
            if (item.code == "UNRPTD") {
              this.salesForm.patchValue({
                statusSalesCtrl: item.id
              });
            }
          });
        }

        if (this.cascadingParenetCustomercheck) {
          this.casccadingApi();
        }
        if (
          !this.cascadingParenetCustomercheck ||
          !this.cascadingChildCustomer
        ) {
          this.searchSales();
        }
      },
      error => {
        this.toasterComponent.onError(error);
      }
    );
  }

  // Get ContractType from SalesManagement service to bind the data
  contractTypeSalesManagement() {
    this.managementService.getContractTypeSalesManagement().subscribe(
      (response: any) => {
        this.contractTypeSales = response.items;
      },
      error => {
        this.toasterComponent.onError(error);
      }
    );
  }

  callendDateChange(e) {
    this.rMSApiService.setFinaceEndDate(e.value);
  }

  onQuickFilterChanged(e) {
    this.gridApi.setQuickFilter(this.searchValue);
  }
  onRowClicked(e) {}
  removesearch() {
    this.searchValue = null;
    this.gridApi.setQuickFilter(this.searchValue);
  }
  onPageSizeChanged() {
    var value = this.pageSize.nativeElement.value;
    this.gridApi.paginationSetPageSize(Number(value));
    let element = document.getElementById("myGrid");
    this.gridApi.setDomLayout("autoHeight");
  }

  salesUnlock() {
    this.managementService.salesUnlock().subscribe(data => {});
  }

  cancel() {
    this.salesForm = this.fb.group({
      parentCustomerSalesCtrl: [""],
      customerSalesCtrl: [""],
      shipSalesCtrl: [""],
      portSalesCtrl: [""],
      statusSalesCtrl: [""],
      callstartdate: [null],
      callenddate: [null],
      contractTypeSalesCtrl: [""]
    });

    this.required = false;
    this.rMSApiService.removeFinanceParentCustomer();
    this.rMSApiService.removeFinanceChildCustomer();
    this.rMSApiService.removeFinanceContract();
    this.rMSApiService.removeFinanaceReportStatus();
    this.rMSApiService.removeFinaceStartDate();
    this.rMSApiService.removeFinaceEndDate();
    this.rMSApiService.removePort();
    this.maxDate = "";
    this.maxEndDate = "";
    this.rowData = [];
    this.valuesChanges();
    this.findParentObject = "";
    console.log(this.rMSApiService.removeFinaceStartDate(), "removestart");
    console.log(this.rMSApiService.getFinaceStartDate(), "settt");
    console.log(this.salesForm.value, "value");
  }

  ngOnDestroy() {
    sessionStorage.clear();
    if (this.salesEditArray) {
      this.salesEditArray = [];
    }
    if (this.updatetypeId) {
      this.updatetypeId = [];
    }
    if (this.SelecttypeId) {
      this.SelecttypeId = [];
    }
    if (
      this.router.url == "/Management/sales" ||
      this.router.url == "/Management/invoice" ||
      this.router.url == "/Management/history" ||
      this.router.url == "/Management/Affidavit"
    ) {
    } else {
      this.rMSApiService.removeFinanceParentCustomer();
      this.rMSApiService.removeFinanceChildCustomer();
      this.rMSApiService.removeFinanceContract();
      this.rMSApiService.removeFinanaceReportStatus();
      this.rMSApiService.removeFinaceStartDate();
      this.rMSApiService.removeFinaceEndDate();
    }
    //this.salesUnlock();
    // this.rMSApiService.removeFinanceParentCustomer();
    // this.rMSApiService.removeFinanceChildCustomer();
    // this.rMSApiService.removeFinanceContract();
    // this.rMSApiService.removeFinanaceReportStatus();
    // this.rMSApiService.removeFinaceStartDate();
    // this.rMSApiService.removeFinaceEndDate();
    // this.rMSApiService.removePort();
    localStorage.removeItem("salesthis.shipid");
    sessionStorage.removeItem("salesshipid");
    sessionStorage.removeItem("embarkDateTime");
    sessionStorage.removeItem("debarkDateTime");
  }
}
