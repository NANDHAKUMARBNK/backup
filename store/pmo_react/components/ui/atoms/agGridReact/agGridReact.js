import React from "react";
import { AgGridReact } from "ag-grid-react";
const AggridReact = (props) => {
  return (
    <AgGridReact
      columnDefs={props.columnDefs}
      onGridReady={props.onGridReady}
      pagination={props.pagination}
      suppressRowClickSelection={props.suppressRowClickSelection}
      modules={props.modules}
      rowSelection={props.rowSelection}
      frameworkComponents={props.frameworkComponents}
      paginationPageSize={props.paginationPageSize}
      onSelectionChanged={props.onSelectionChanged}
      onCellClicked={props.onCellClicked}
      onRowSelected={props.onRowSelected}
      floatingFilter={props.floatingFilter}
      rowData={props.rowData}
      defaultColDef={props.defaultColDef}
      rowHeight={props.rowHeight}
      components={props.components}
      onCellValueChanged={props.onCellValueChanged}
      enterMovesDown={props.enterMovesDown}
      enterMovesDownAfterEdit={props.enterMovesDownAfterEdit}
      rowMultiSelectWithClick={props.rowMultiSelectWithClick}
    ></AgGridReact>
  );
};
export default AggridReact;
