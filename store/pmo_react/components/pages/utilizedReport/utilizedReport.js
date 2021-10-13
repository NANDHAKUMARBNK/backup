import React, { useState, useEffect } from "react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Atoms from "../../ui/atoms";
import Templates from "../../ui/templates";
import UtilizedGridSetting from "./utilizedGridSetting";
import { getUtilizedReportsAPI } from "../../../services/utilizedReportService";
import TextField from "@material-ui/core/TextField";
import Molecules from "../../ui/molecules";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { getExecutionPeriodAPI } from "../../../services/resourceUtilizationService";
const UtilizedReport = (props) => {
  let [utilizedReports, setUtilizedReports] = useState([]);
  const columnDefinition = UtilizedGridSetting();
  let [gridApi, setGridApi] = useState("");
  let [executionmonth_id, setExecutionmonth_id] = useState("");
  // let [gridColumnApi, setGridColumnApi] = useState("");
  let [executionPr, setExecutionPeriod] = useState("");
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
  const getUtilizedReportsChange = async (e, values) => {
    if (values) {
      setExecutionmonth_id(values);
      let targetValue = values.executionmonth_id;
      let utilizedReportsResponse = await getUtilizedReportsAPI(targetValue);
      if (utilizedReportsResponse) {
        setUtilizedReports(utilizedReportsResponse);
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
          <Atoms.HeaderText content="Utilization By Skill Report" />
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
              onChange={getUtilizedReportsChange}
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
              onChange={getUtilizedReportsChange}
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
          <div className="ag-theme-balham">
            <Atoms.AggridReact
              columnDefs={columnDefinition}
              rowData={utilizedReports}
              onGridReady={gridApiReady}
              pagination={true}
              suppressRowClickSelection={true}
              paginationPageSize={pageSizeForPagination}
              modules={modulesCommunity}
              floatingFilter={true}
              defaultColDef={defaultColDefinition}
            />
          </div>
        </Atoms.Section>
      </Templates.DashboardTemplate>
    </Atoms.Section>
  );
};
export default UtilizedReport;
