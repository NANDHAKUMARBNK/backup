import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import "../../styles/adminManageJobPositions.scss";
import AdminJobPositionsEditButton from "../GridButtons/AdminManageJobPositionsEditButton";
import { updateJobPositionsActiveAPI } from "../../Services/AdminServices/AllJobPositions";
import { useTranslation } from "react-i18next";
import BlockUI from "../../../common-themes/ui-blocker";
import IsJobActiveDropdown from "../GridDropdowns/IsJobActiveDropdown";
function ManageJobPositions({
  collectJobInfo,
  isOpenEditJob,
  gridInfo,
  gridInfoAPI,
}: any) {
  const [blockUi, setblockUi]: any = useState(false);
  const { t } = useTranslation();
  const [rowData, setRowData]: any = useState([]);
  const [style, setStyle]: any = useState({});
  useEffect(() => {
    domLayoutHeight();
  }, []);
  const domLayoutHeight = async () => {
    setblockUi(false);
    const dataFromParent: any = await gridInfoAPI();
    if (dataFromParent) {
      setblockUi(false);
      setRowData(dataFromParent);
      const capacity = dataFromParent.length;
      if (capacity < 10) {
        if (GridApiFeatures) {
          GridApiFeatures.setDomLayout("autoHeight");
          setStyle({});
        }
      } else {
        setStyle({
          height: "450px",
          width: "100%",
        });
      }
    }
  };
  const gridOptions: any = {
    components: {
      booleanCellRenderer: booleanCellRenderer,
    },
    deltaRowDataMode: true,
    getRowNodeId: function (data: any) {
      return data.Id;
    },
    overlayLoadingTemplate:
      '<span class="ag-overlay-loading-center">Loading...</span>',
    overlayNoRowsTemplate:
      '<span style="margin-top:60px;height:30px;">No Rows To Show</span>',
  };
  const modulesEnterprise: any = AllModules;
  const PAGINATION__SIZE: any = 20;
  const [gridApi, setGridApi]: any = useState("");
  const columnDefs: any = [
    {
      headerName: t("Job Positions"),
      field: "JobName",
      filter: "agMultiColumnFilter",
      width: 200,
      suppressNavigable: true,
      cellClass: "no-border",
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            display: "subMenu",
          },
          {
            filter: "agSetColumnFilter",
            filterParams: {
              buttons: ["reset"],
            },
          },
        ],
      },
    },
    {
      headerName: "",
      field: "",
      width: 500,
      suppressNavigable: true,
      cellClass: "no-border",
      cellStyle: {
        cursor: "pointer",
      },
    },
    {
      headerName: t("Is Job Enabled"),
      field: "isJobActive",
      width: 180,
      suppressNavigable: true,
      cellClass: "no-border",
      cellRenderer: "isJobActiveCellRenderer",
      cellRendererParams: {
        selected: function (field: any) {
          cellTriggered(field.jobStatusChangedByUser, field.jobId);
        },
      },
    },
    {
      headerName: t("Action"),
      field: "",
      width: 110,
      suppressNavigable: true,
      cellClass: "no-border",
      cellStyle: {
        cursor: "pointer",
      },
      cellRenderer: "editCellRenderer",
      cellRendererParams: {
        clickedEditButton: function (field: any) {
          if (field) {
            collectJobInfo(field.jobInfo);
            isOpenEditJob();
          }
        },
      },
    },
  ];
  let GridApiFeatures: any;
  const gridApiReady = (params: any) => {
    params.api.sizeColumnsToFit();
    window.onresize = () => {
      params.api.sizeColumnsToFit();
    };
    setGridApi(params.api);
    GridApiFeatures = params.api;
    params.columnApi.autoSizeColumns();
    params.api.resetRowHeights();
  };
  const onPageSizeChanged = (event: any) => {
    let value = event.target.value;
    gridApi.paginationSetPageSize(Number(value));
  };
  function booleanComparator(value1: any, value2: any) {
    const value1Cleaned = booleanCleaner(value1);
    const value2Cleaned = booleanCleaner(value2);
    const value1Ordinal =
      value1Cleaned === true ? 0 : value1Cleaned === false ? 1 : 2;
    const value2Ordinal =
      value2Cleaned === true ? 0 : value2Cleaned === false ? 1 : 2;
    return value1Ordinal - value2Ordinal;
  }

  let count = 0;
  function booleanCellRenderer(params: any) {
    count++;
    if (count <= 1) {
      // params.api.onRowHeightChanged();
    }
    const valueCleaned = booleanCleaner(params.value);
    if (valueCleaned === true) {
      return "<span title='True' class='ag-icon ag-icon-tick content-icon' style='color:red !important;font-size:42px !important;font-weight:bold !important;'></span>";
    } else if (valueCleaned === false) {
      return "<span title='False' class='ag-icon ag-icon-cross content-icon' style='color:red !important;font-size:42px !important;font-weight:bold !important;'></span>";
    } else if (params.value !== null && params.value !== undefined) {
      return params.value.toString();
    } else {
      return null;
    }
  }
  function booleanCleaner(value: any) {
    if (value === "true" || value === true || value === 1) {
      return true;
    } else if (value === "false" || value === false || value === 0) {
      return false;
    } else {
      return null;
    }
  }
  const cellTriggered = async (isActive: any, Id: any) => {
    const Request: any = {
      jobId: Id,
      status: isActive,
    };
    const response: any = await updateJobPositionsActiveAPI(Request);
    if (response) {
      gridInfoAPI();
    }
  };
  return (
    <>
      <div className="ag-theme-balham my-1" style={style} id="aggrid">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={gridInfo ? gridInfo : rowData}
          suppressCellSelection={true}
          floatingFilter={true}
          onGridReady={gridApiReady}
          modules={modulesEnterprise}
          suppressScrollOnNewData={true}
          defaultColDef={{
            resizable: true,
            autoHeight: true,
            suppressMenu: true,
          }}
          frameworkComponents={{
            editCellRenderer: AdminJobPositionsEditButton,
            isJobActiveCellRenderer: IsJobActiveDropdown,
          }}
          headerHeight={50}
          pagination={true}
          paginationPageSize={PAGINATION__SIZE}
          gridOptions={gridOptions}
          popupParent={document.body}
        ></AgGridReact>
        <div className="adminManageJobPosition__pagination my-2 text-right mx-2">
          {t("Show")} &nbsp;
          <select onChange={onPageSizeChanged}>
            <option value={20} selected={true}>
              20
            </option>
            <option value={40}>40</option>
            <option value={60}>60</option>
            <option value={80}>80</option>
            <option value={100}>100</option>
          </select>{" "}
          &nbsp; {t("Page")}
        </div>
      </div>
      <BlockUI loader={{ blocking: blockUi, title: t("Please wait...") }} />
    </>
  );
}

export default ManageJobPositions;
