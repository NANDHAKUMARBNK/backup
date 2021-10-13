import React, { useState, useEffect } from "react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Atoms from "../../ui/atoms";
import Templates from "../../ui/templates";
import BenchGridSetting from "./benchGridSetting";
import { getBenchReportsAPI } from "../../../services/benchReportService";
import Molecules from "../../ui/molecules";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import TextField from "@material-ui/core/TextField";
import { getExecutionPeriodAPI } from "../../../services/resourceUtilizationService";
const BenchReport = (props) => {
  let [benchReports, setBenchReports] = useState([]);
  let [gridApi, setGridApi] = useState("");
  // let [gridColumnApi, setGridColumnApi] = useState("");
  let [executionPr, setExecutionPeriod] = useState("");
  let [executionmonth_id, setExecutionmonth_id] = useState("");
  const columnDefinition = BenchGridSetting();
  const modulesCommunity = AllCommunityModules;
  const pageSizeForPagination = 14;
  useEffect(() => {
    executionPeriodFn();
  }, []);
  const executionPeriodFn = async () => {
    let responseExecutionPeriod = await getExecutionPeriodAPI();
    if (responseExecutionPeriod) {
      setExecutionPeriod(responseExecutionPeriod);
    }
  };
  const getBenchReportsChange = async (e, values) => {
    if (values) {
      setExecutionmonth_id(values);
      let targetValue = values.executionmonth_id;
      let benchReportsResponse = await getBenchReportsAPI(targetValue);
      if (benchReportsResponse) {
        setBenchReports(benchReportsResponse);
      }
    }
  };
  const gridApiReady = (params) => {
    let paramsApi = params.api;
    window.onresize = () => {
      paramsApi.sizeColumnsToFit();
    };
    setGridApi(paramsApi);
    // let paramsColumnApi = params.columnApi;
    // setGridColumnApi(paramsColumnApi);
  };
  function getParams() {
    return {
      allColumns: true,
    };
  }
  const exportData = () => {
    let fromParams = getParams();
    gridApi.exportDataAsCsv(fromParams);
  };
  function defaultColDefinition() {
    return {
      resizable: true,
    };
  }
  return (
    <Atoms.Section>
      <Templates.DashboardTemplate>
        <Molecules.RowColSet>
          <Atoms.HeaderText content="Bench Report" />
        </Molecules.RowColSet>
        <Atoms.CustomRow>
          <Atoms.CustomCol xl={3} lg={3} md={3}>
            {/* <Atoms.customAutoComplete
              id=""
              className="text-left"
              labelName="Execution Period"
              options={executionPr}
              getOptionLabel={data =>
                data.name ? data.name : executionmonth_id
              }
              value={executionmonth_id}
              onChange={getBenchReportsChange}
              renderInput={params => (
                <TextField {...params} label="" variant="outlined" fullWidth />
              )}
            /> */}
            <Autocomplete
              id=""
              className="text-left"
              options={executionPr}
              getOptionLabel={(data) =>
                data.name ? data.name : executionmonth_id
              }
              value={executionmonth_id}
              onChange={getBenchReportsChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Execution Period"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol className="text-right pt-2">
            <Atoms.CustomButton
              className="mr-2 customVioletBtn"
              buttonName="Export"
              action={exportData}
            />
          </Atoms.CustomCol>
        </Atoms.CustomRow>
        <Atoms.Section className="agGridCommonContainer">
          <Atoms.Div className="ag-theme-balham">
            <Atoms.AggridReact
              columnDefs={columnDefinition}
              rowData={benchReports}
              onGridReady={gridApiReady}
              pagination={true}
              suppressRowClickSelection={true}
              paginationPageSize={pageSizeForPagination}
              modules={modulesCommunity}
              floatingFilter={true}
              defaultColDef={defaultColDefinition}
            />
          </Atoms.Div>
        </Atoms.Section>
      </Templates.DashboardTemplate>
    </Atoms.Section>
  );
};
export default BenchReport;
