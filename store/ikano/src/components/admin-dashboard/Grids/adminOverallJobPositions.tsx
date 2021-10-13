import React, { useState, useEffect } from "react";
import AdminJobPositionsViewButton from "../GridButtons/AdminJobPositionsViewButton";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "../../styles/adminAgGrid.scss";
import { AllModules } from "@ag-grid-enterprise/all-modules";
//import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { getAllJobPositionsAPI } from "../../Services/AdminServices/AllJobPositions";
import BlockUI from "../../../common-themes/ui-blocker";
import JobStatus from "../GridDropdowns/JobStatus";
import { useTranslation } from "react-i18next";
export default function AdminOverallJobPositions() {
  const { t } = useTranslation();
  //const modulesCommunity: any = AllCommunityModules;
  const [blockUi, setblockUi]: any = useState(false);
  const modulesEnterprise: any = AllModules;
  const [rowData, setRowData]: any = useState([]);
  const [style, setStyle] = useState({});
  useEffect(() => {
    AllJobPositions();
  }, []);
  let columnDefs: any = [
    {
      headerName: t("Job Positions"),
      field: "jobTitle",
      filter: "agMultiColumnFilter",
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
      width: 145,
      suppressNavigable: true,
      cellClass: "no-border",
    },
    {
      headerName: t("No of Positions"),
      field: "positions",
      width: 155,
      suppressNavigable: true,
      cellClass: "no-border",
    },
    {
      headerName: t("Total Applications"),
      field: "totalApplication",
      width: 185,
      suppressNavigable: true,
      cellClass: "no-border",
    },
    {
      headerName: t("Accepted"),
      field: "accepted",
      width: 130,
      suppressNavigable: true,
      cellClass: "no-border",
    },
    {
      headerName: t("Rejected"),
      field: "rejected",
      width: 130,
      suppressNavigable: true,
      cellClass: "no-border",
    },
    {
      headerName: t("Pending"),
      field: "pending",
      width: 130,
      suppressNavigable: true,
      cellClass: "no-border",
    },
    {
      headerName: t("Job Status"),
      field: "status",
      width: 130,
      suppressNavigable: true,
      cellClass: "no-border",
      cellRenderer: "JobStatusRenderer",
      filter: "agMultiColumnFilter",
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
      headerName: t("Action"),
      field: "jobId",
      width: 140,
      cellStyle: {
        cursor: "pointer",
      },
      cellRenderer: "viewCellRenderer",
      suppressNavigable: true,
      cellClass: "no-border",
    },
  ];
  const gridOptions: any = {
    rowHeight: 20,
    overlayLoadingTemplate:
      '<span class="ag-overlay-loading-center">Loading...</span>',
    overlayNoRowsTemplate:
      '<span style="margin-top:60px;height:30px;">No Rows To Show</span>',
  };
  let GridApiFeatures: any;
  const gridApiReady = (params: any) => {
    params.api.sizeColumnsToFit();
    window.onresize = () => {
      params.api.sizeColumnsToFit();
    };
    params.columnApi.autoSizeColumns();
    params.api.resetRowHeights();
    GridApiFeatures = params.api;
  };
  async function AllJobPositions() {
    setblockUi(false);
    const response: any = await getAllJobPositionsAPI();
    if (response && response.data) {
      let lang: any = localStorage.getItem("i18nextLng");
      setblockUi(false);
      setRowData(
        response.data.map((item: any) => {
          return {
            id: item.id,
            jobTitle:
              lang === "en"
                ? item.jobTitle
                : item.jobTitleSpanish
                ? item.jobTitleSpanish
                : t("Not Mentioned"),
            jobTitleSpanish: item.jobTitleSpanish
              ? item.jobTitleSpanish
              : t("Not Mentioned"),
            positions: item.positions,
            accepted: item.accepted,
            pending: item.pending,
            rejected: item.rejected,
            totalApplication: item.totalApplication,
            status: item.status ? "Enabled" : "Disabled",
            jobType: item.jobType ? item.jobType : "",
          };
        })
      );
      const capacity = response.data.length;
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
  }
  return (
    <>
      <div className="ag-theme-balham" style={style} id="aggrid">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          suppressCellSelection={true}
          floatingFilter={true}
          onGridReady={gridApiReady}
          // modules={modulesCommunity}
          modules={modulesEnterprise}
          headerHeight={50}
          defaultColDef={{
            resizable: true,
            autoHeight: true,
            suppressMenu: true,
          }}
          frameworkComponents={{
            viewCellRenderer: AdminJobPositionsViewButton,
            JobStatusRenderer: JobStatus,
          }}
          gridOptions={gridOptions}
          popupParent={document.body}
        ></AgGridReact>
      </div>
      <BlockUI loader={{ blocking: blockUi, title: t("Please wait...") }} />
    </>
  );
}
