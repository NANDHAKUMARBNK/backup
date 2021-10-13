import React, { useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";

const topOptions: any = {
  alignedGrids: [],
  defaultColDef: {
    flex: 1,
    // minWidth: 100,
    resizable: true,
  },
  suppressHorizontalScroll: false,
};

const bottomOptions: any = {
  alignedGrids: [],
  defaultColDef: {
    flex: 1,
    // minWidth: 100,
    resizable: true,
  },
  suppressHorizontalScroll: false,
};
topOptions.alignedGrids.push(bottomOptions);
bottomOptions.alignedGrids.push(topOptions);
const columnDefs: any = [
  {
    headerName: "Qualities",
    field: "quality",
    width: 250,
    suppressNavigable: true,
    cellClass: "no-border",
  },
  {
    headerName: "Score",
    field: "score",
    width: 50,
    suppressNavigable: true,
    cellClass: "no-border",
  },
];
const bottomData: any = [
  {
    quality: "Total",
    score: "33%",
  },
];

const AdminIkanoValues = () => {
  const [gridApi, setGridApi]: any = useState(null);
  const [gridColumnApi, setGridColumnApi]: any = useState(null);
  const [footer_gridApi, footer_setGridApi]: any = useState(null);
  const [footer_gridColumnApi, footer_setGridColumnApi]: any = useState(null);
  const [rowData, setRowData]: any = useState([
    {
      quality: "Common sense and simplicity",
      score: "4/10",
    },
    {
      quality: "Working together",
      score: "5/10",
    },
    {
      quality: "Daring to be different",
      score: "3/10",
    },
    {
      quality: "On fair terms",
      score: "10/10",
    },
  ]);
  const [topGrid, setTopGrid]: any = useState(null);
  const onFirstDataRendered = () => {
    topGrid.columnApi.autoSizeAllColumns();
  };

  function onGridReady(params: any): any {
    setTopGrid(params);
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.columnApi.autoSizeColumns();
    params.api.sizeColumnsToFit();
    window.onresize = () => {
      params.api.sizeColumnsToFit();
    };
    params.api.setDomLayout("autoHeight");
  }
  function onGridReadyFooter(params: any): any {
    setTopGrid(params);
    footer_setGridApi(params.api);
    footer_setGridColumnApi(params.columnApi);
    params.columnApi.autoSizeColumns();
    params.api.sizeColumnsToFit();
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "50%",
      }}
      className="ag-theme-alpine"
    >
      <div style={{ flex: "1 1 auto" }}>
        <AgGridReact
          rowData={rowData}
          gridOptions={topOptions}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
          modules={AllCommunityModules}
          suppressCellSelection={true}
          defaultColDef={{
            suppressMenu: true,
          }}
        />
      </div>
      {/* Footer */}
      <div
        style={{
          flex: "none",
        }}
      >
        <AgGridReact
          rowData={bottomData}
          gridOptions={bottomOptions}
          columnDefs={columnDefs}
          headerHeight={0}
          modules={AllCommunityModules}
          rowStyle={{ fontWeight: "bold", color: "red !important" }}
          suppressCellSelection={true}
          onGridReady={onGridReadyFooter}
        />
      </div>
    </div>
  );
};

export default AdminIkanoValues;
