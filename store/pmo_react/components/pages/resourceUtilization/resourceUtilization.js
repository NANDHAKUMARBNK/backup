import React, { useEffect, useState } from "react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import "./resourceUtilization.css";
import Atoms from "../../ui/atoms";
import TextField from "@material-ui/core/TextField";
import Templates from "../../ui/templates";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import resourceGridSettings from "./resourceGridSettings";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  getResourceUtilizationAPI,
  getExecutionPeriodAPI,
  getProjectsAPI,
  addCopyResourceUtilizationAPI,
} from "../../../services/resourceUtilizationService";
import Molecules from "../../ui/molecules";

const ResourceUtilization = (props) => {
  let [resourceUtilization, setResourceUtilization] = useState("");
  let [executionPeriod, setExecutionPeriod] = useState("");
  let [projects, setProjects] = useState("");
  let [gridApi, setGridApi] = useState("");
  let [showPopUp, setShowPopUp] = useState(false);
  let [passInformation, setPassInformation] = useState("");
  let [isDelete, setIsDelete] = useState(false);
  let [title, setTitle] = useState("");
  let [isDisableCopy, setIsDisableCopy] = useState(false);
  let [isChecked, setIsChecked] = useState(true);
  let [cascadingYear, setCascadingYear] = useState("");
  let [cascadingProject, setCascadingProject] = useState("");
  let [autocomplete, setAutoComplete] = useState("");
  let [filterRowData, setFilterRowData] = useState([]);
  const modulesCommunity = AllCommunityModules;
  const pageSizeForPagination = 14;
  const columnDefinitionResourceUtilization = resourceGridSettings();
  useEffect(() => {
    resourceUtilizationFn();
    executionPeriodFn();
    projectsFn();
  }, []);

  const resourceUtilizationFn = async () => {
    let responseResourceUtilization = await getResourceUtilizationAPI();
    if (responseResourceUtilization) {
      setResourceUtilization(responseResourceUtilization);
      setFilterRowData(responseResourceUtilization);
    }
  };

  const executionPeriodFn = async () => {
    let responseExecutionPeriod = await getExecutionPeriodAPI();
    if (responseExecutionPeriod) {
      setExecutionPeriod(responseExecutionPeriod);
    }
  };

  const projectsFn = async () => {
    let responseProjects = await getProjectsAPI();
    if (responseProjects) {
      setProjects(responseProjects);
    }
  };
  const gridApiReady = (params) => {
    let paramsApi = params.api;
    setGridApi(paramsApi);
  };
  const cellClick = (e) => {
    let headerName_From_ColDef = e.colDef.headerName;
    let cellData = e.data;
    setPassInformation(e);
    if (headerName_From_ColDef === "edit") {
      setShowPopUp(true);
      setTitle("Edit");
      setPassInformation(cellData);
    }
    if (headerName_From_ColDef === "delete") {
      setTitle("Delete");
      setIsDelete(true);
    }
  };
  const rowSelect = (e) => {
    let gridSelectedRowData = gridApi.getSelectedRows();
    if (gridSelectedRowData.length > 0) {
      setIsDisableCopy(true);
      setCascadingYear("");
      setAutoComplete("");
      setIsChecked(false);
    } else {
      setIsDisableCopy(false);
      setIsChecked(true);
    }
  };
  const add = () => {
    setShowPopUp(true);
    setTitle("Add");
    setPassInformation("");
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
  const handleChange = (e, value) => {
    let nameAutocomplete = e.target.id;
    let name;
    let FirstLetter = nameAutocomplete.substring(0, 1);
    if (FirstLetter === "y") {
      name = "year";
    }
    if (FirstLetter === "p") {
      name = "project";
    }
    var yearValue = "";
    var projectValue = "";
    if (name === "year") {
      projectValue = document.getElementById("projectOption").value;
      let projectDetails = projects.find(
        (ele) => ele.project_name === projectValue
      );
      if (projectDetails) {
        projectValue = projectDetails.project_code;
      }
      if (value) {
        yearValue = value.executionmonth_id;
        setCascadingYear(yearValue);
        setAutoComplete(value.name);
      }
    }
    if (name === "project") {
      yearValue = document.getElementById("yearOption").value;
      let yearDetails = executionPeriod.find((ele) => ele.name === yearValue);
      if (yearDetails) {
        yearValue = yearDetails.executionmonth_id;
      }
      if (value) {
        projectValue = value.project_code;
        setCascadingProject(projectValue);
      }
    }
    let tempArray = JSON.stringify(resourceUtilization);
    let rowDatafilter = JSON.parse(tempArray);
    if (isChecked) {
      let selectionData = rowDatafilter;
      if (projectValue && yearValue) {
        selectionData = selectionData.filter(
          (item) =>
            item.project_code === projectValue &&
            item.execution_period_master_id === parseInt(yearValue)
        );
      } else if (yearValue) {
        selectionData = selectionData.filter(
          (item) => item.execution_period_master_id === parseInt(yearValue)
        );
      } else if (projectValue) {
        selectionData = selectionData.filter(
          (item) => item.project_code === projectValue
        );
      }
      setFilterRowData(selectionData);
    }
  };
  const hideModal = async () => {
    await resourceUtilizationFn();
    let rowDatafilter = resourceUtilization;
    let yearDefalutValue = cascadingYear;
    let projectDefalutValue = cascadingProject;
    let selectionData = rowDatafilter;
    if (yearDefalutValue) {
      selectionData = selectionData.filter(
        (item) => item.execution_period_master_id === yearDefalutValue
      );
    }
    if (projectDefalutValue) {
      selectionData = selectionData.filter(
        (item) => item.project_code === projectDefalutValue
      );
    }
    setFilterRowData(selectionData);
    setShowPopUp(false);
    setIsDelete(false);
  };
  const copy = () => {
    toastr.options = {
      positionClass: "toast-top-full-width",
      hideDuration: 300,
      timeOut: 3000,
    };
    var executionPeriodData = "";
    let informationFromSelectedGridRows = gridApi.getSelectedRows();
    if (!cascadingYear) {
      alert(`Please Select Period Value`);
    } else if (informationFromSelectedGridRows) {
      informationFromSelectedGridRows.forEach((ele) => {
        let stringifyExec_PeriodData = JSON.stringify(executionPeriod);
        let period = JSON.parse(stringifyExec_PeriodData);
        period.forEach((insideExecutionPeriodData) => {
          let paId = insideExecutionPeriodData.executionmonth_id;
          let cascadingPeriodYear = cascadingYear;
          if (paId === parseInt(cascadingPeriodYear)) {
            executionPeriodData = insideExecutionPeriodData.name;
          }
        });
        let pa_Id = ele.pa_id;
        let pa_Name = executionPeriodData;
        let executionPeriodIdFromDropDown = cascadingYear;
        if (pa_Id && pa_Name && executionPeriodIdFromDropDown) {
          const req = {
            pId: pa_Id,
            newPeriodDate: pa_Name + "-01",
            newPeriodId: executionPeriodIdFromDropDown,
          };
          let response = addCopyResourceUtilizationAPI(req);
          if (response) {
            toastr.success(`Copied Successfully`);
            resourceUtilizationFn();
            setCascadingYear("");
            setAutoComplete("");
            setCascadingProject("");
            setIsDisableCopy(false);
            setIsChecked(true);
          }
        }
      });
    } else {
      alert(`Select Rows for Copy`);
    }
  };

  const closePopup = () => {
    setShowPopUp(false);
  };

  const hideModalClosebtn = () => {
    setShowPopUp(false);
    setIsDelete(false);
  };
  return (
    <Atoms.Section>
      <Templates.DashboardTemplate>
        <Molecules.RowColSet>
          <Atoms.HeaderText content="Resource Utilization" />
        </Molecules.RowColSet>
        <Atoms.CustomRow>
          <Atoms.CustomCol>
            <Atoms.CustomRow>
              <Atoms.CustomCol xl={5} lg={5} md={5}>
                <Autocomplete
                  id="yearOption"
                  options={executionPeriod}
                  getOptionLabel={(data) =>
                    data.name ? data.name : autocomplete
                  }
                  onChange={handleChange}
                  value={autocomplete}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Period"
                      variant="outlined"
                      value={cascadingYear}
                      fullWidth
                    />
                  )}
                />
                {/* <Atoms.customAutoComplete
                  id="yearOption"
                  options={executionPeriod}
                  getOptionLabel={(data) =>
                    data.name || "" ? data.name || "" : cascadingYear || ""
                  }
                  name="year"
                  onChange={handleChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Period"
                      value={cascadingYear}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                /> */}
              </Atoms.CustomCol>
              <Atoms.CustomCol xl={5} lg={5} md={5}>
                {/* <Atoms.customAutoComplete
                  id="projectOption"
                  options={projects}
                  getOptionLabel={(data) =>
                    data.project_name ? data.project_name : cascadingProject
                  }
                  name="project"
                  onChange={handleChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Project"
                      value={cascadingProject}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                /> */}
                <Autocomplete
                  id="projectOption"
                  options={projects}
                  getOptionLabel={(data) =>
                    data.project_name ? data.project_name : cascadingProject
                  }
                  onChange={handleChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Project"
                      value={cascadingProject}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Atoms.CustomCol>
            </Atoms.CustomRow>
          </Atoms.CustomCol>
          <Atoms.CustomCol className="text-right pt-2">
            <Atoms.CustomButton
              className="mr-2 customVioletBtn"
              buttonName="Export"
              action={exportData}
            />
            {isDisableCopy ? (
              <Atoms.CustomButton
                className="mr-2 customVioletBtn"
                buttonName="Copy"
                action={copy}
              />
            ) : null}
            <Atoms.CustomButton
              className="customVioletBtn"
              buttonName="Add"
              action={add}
            />
          </Atoms.CustomCol>
        </Atoms.CustomRow>

        <Atoms.Section className="agGridCommonContainer">
          <div className="ag-theme-balham">
            <Atoms.AggridReact
              columnDefs={columnDefinitionResourceUtilization}
              rowData={filterRowData}
              onGridReady={gridApiReady}
              pagination={true}
              suppressRowClickSelection={true}
              modules={modulesCommunity}
              rowSelection="multiple"
              paginationPageSize={pageSizeForPagination}
              onCellClicked={cellClick}
              onRowSelected={rowSelect}
              floatingFilter={true}
            />
          </div>
        </Atoms.Section>

        {showPopUp ? (
          <Templates.ResourceUtilizationModal
            closePopup={closePopup}
            data={passInformation}
            showPopUp={showPopUp}
            title={title}
            handleClose={hideModal}
            handleClosebtn={hideModalClosebtn}
          />
        ) : null}
        {isDelete ? (
          <Templates.DeleteResourceUtilization
            data={passInformation}
            handleClose={hideModal}
            handleClosebtn={hideModalClosebtn}
          />
        ) : null}
      </Templates.DashboardTemplate>
    </Atoms.Section>
  );
};

export default ResourceUtilization;
