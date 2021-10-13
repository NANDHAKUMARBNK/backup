import React, { useState, useEffect } from "react";
import Atoms from "../../atoms";
import "./activeProjectsModal.css";
import Molecules from "../../molecules";
import TextField from "@material-ui/core/TextField";
import {
  getProjectAPI,
  editActiveProjectsAPI,
} from "../../../../services/projectListService";
import {
  getCustomersAPI,
  getProjectTypeAPI,
  getCostTypeAPI,
} from "../../../../services/activeProjectListService";
import { getProjectsAPI } from "../../../../services/resourceUtilizationService";
import ApprovedEstimateGridSetting from "./approvedEstimateGridSetting";
import Moment from "moment";
const ActiveProjectsModal = (props) => {
  let [projectCode, setProjectCode] = useState("");
  let [projectName, setProjectName] = useState("");
  let [customerId, setCustomerId] = useState("");
  let [projectType, setProjectType] = useState("");
  let [costType, setCostType] = useState("");
  let [customerName, setCustomerName] = useState("");
  let [projectTypeName, setProjectTypeName] = useState("");
  let [estimationDetails, setEstimationDetails] = useState("");
  let [customers, setCustomers] = useState("");
  let [projects, setProjects] = useState("");
  let [costtype, setCostTypeArr] = useState("");
  let [activeprojects, setActiveProjects] = useState("");
  let [start, setStart] = useState("");
  let [end, setEnd] = useState("");
  let [gridApi, setGridApi] = useState("");
  // let [gridColumnApi, setGridColumnApi] = useState("");
  let updateDropdown = (valueFromCellRenderAllocationHours, rowIndex) => {
    if (valueFromCellRenderAllocationHours) {
      let RowData = JSON.parse(localStorage.getItem("rowdata"));
      if (RowData) {
        RowData[rowIndex].project_estimate_type = parseInt(
          valueFromCellRenderAllocationHours
        );
        setEstimationDetails(RowData);
        localStorage.setItem("rowdata", JSON.stringify(RowData));
      }
    }
  };
  const columnDefsEstimate = ApprovedEstimateGridSetting(updateDropdown);
  useEffect(() => {
    getGridCellData();
    getCustomers();
    getProjectType();
    getCostType();
    getActiveProjects();
  }, []);
  const getGridCellData = async () => {
    if (props.passInfo) {
      let cellData = props.passInfo;
      let projectId = cellData.project_code;
      let response = await getProjectAPI(projectId);
      if (response) {
        response.forEach((projectInfo) => {
          let pCode = projectInfo.project_code;
          if (pCode) {
            setProjectCode(pCode);
          }
          let pName = projectInfo.project_name;
          if (pName) {
            setProjectName(pName);
          }
          let pCid = projectInfo.customer_id;
          if (pCid) {
            setCustomerId(pCid);
          }
          let pType = projectInfo.project_type;
          if (pType) {
            setProjectType(pType);
          }
          let pCostType = projectInfo.cost_type_Name;
          if (pCostType) {
            setCostType(pCostType);
          }
          let pProjType = projectInfo.project_type_Name;
          if (pProjType) {
            setProjectTypeName(pProjType);
          }
          let pCustomerName = projectInfo.customer_name;
          if (pCustomerName) {
            setCustomerName(pCustomerName);
          }
          let pEstimationDetails = projectInfo.estimation_details;
          if (pEstimationDetails) {
            setEstimationDetails(pEstimationDetails);
            localStorage.setItem("rowdata", JSON.stringify(pEstimationDetails));
          }
        });
      }
    }
  };
  const getCustomers = async () => {
    let response = await getCustomersAPI();
    if (response) {
      setCustomers(response);
    }
  };
  const getProjectType = async () => {
    let response = await getProjectTypeAPI();
    if (response) {
      setProjects(response);
    }
  };
  const getCostType = async () => {
    let response = await getCostTypeAPI();
    if (response) {
      setCostTypeArr(response);
    }
  };
  const getActiveProjects = async () => {
    let response = await getProjectsAPI();
    if (response) {
      setActiveProjects(response);
    }
  };

  const gridApiReady = (params) => {
    let paramsApi = params.api;
    setGridApi(paramsApi);
    // let paramsColumnApi = params.columnApi;
    // setGridColumnApi(paramsColumnApi);
  };
  const cellClick = (e) => {};
  const rowSelect = (e) => {};
  const changeProjectName = (e, value) => {
    if (value) {
      setProjectName(value.project_name);
    }
  };
  const changeCustomerName = (e, value) => {
    if (value) {
      setCustomerId(value.customer_id);
      setCustomerName(value.customer_name);
    }
  };
  const changeProjectTypeName = (e, value) => {
    if (value) {
      setProjectType(value.project_type_id);
      setProjectTypeName(value.project_type_name);
    }
  };
  const changeCostType = (e, value) => {
    if (value) {
      setCostType(value.cost_type_name);
    }
  };
  const changeStart = (e) => {
    setStart(e.target.value);
  };
  const changeEnd = (e) => {
    setEnd(e.target.value);
  };
  const handleSubmit = async () => {
    gridApi.stopEditing();
    const project_Status = 1;
    const project_process_type = 1;
    let Estimation_Details = estimationDetails;
    if (Estimation_Details) {
      Estimation_Details.forEach((Inside) => {
        delete Inside["project_capacity_type_name"];
      });
    }
    let fetchBillingType = costtype.find(
      (ele) => ele.cost_type_name === costType
    );
    let costTypeUniqueId = fetchBillingType.cost_type_id;
    const reqBody = {
      project_name: projectName,
      customer_id: parseInt(customerId),
      project_type: parseInt(projectType),
      project_process_type: project_process_type,
      cost_type: parseInt(costTypeUniqueId),
      expected_start: start,
      expected_end: end,
      project_status: project_Status,
      estimation_details: estimationDetails,
    };
    let Project_Code = projectCode;
    let response = await editActiveProjectsAPI(Project_Code, reqBody);
    if (response) {
      props.closePopup();
      props.listOfProjectsInGrid();
    }
  };
  const cancelButton = () => {
    props.closePopup();
  };
  return (
    <Atoms.Section className="modalDialog">
      <Atoms.Div>
        <Atoms.H2 content="Add (or) Edit Active Projects Modal" />
        <Atoms.Div title="Close" className="close">
          <Atoms.ITag className="fas fa-times" click={props.closePopup} />
        </Atoms.Div>
        <Atoms.CustomRow className="mt-4">
          <Atoms.CustomCol xl={6} lg={6} md={6}>
            <Molecules.FormGroup
              className="text-left"
              labelName="Project Code"
              type="text"
              Value={projectCode}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol className="mt-2" xl={6} lg={6} md={6}>
            <Molecules.GroupAutoComplete
              className="text-left"
              labelName="Project Name"
              options={activeprojects}
              getOptionLabel={(data) =>
                data.project_name ? data.project_name : projectName
              }
              value={projectName}
              onChange={changeProjectName}
              renderInput={(params) => (
                <TextField {...params} label="" variant="outlined" fullWidth />
              )}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol className="mt-2" xl={6} lg={6} md={6}>
            <Molecules.GroupAutoComplete
              className="text-left"
              labelName="Customer Name"
              options={customers}
              getOptionLabel={(data) =>
                data.customer_name ? data.customer_name : customerName
              }
              value={customerName}
              onChange={changeCustomerName}
              renderInput={(params) => (
                <TextField {...params} label="" variant="outlined" fullWidth />
              )}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol className="mt-2" xl={6} lg={6} md={6}>
            <Molecules.GroupAutoComplete
              className="text-left"
              labelName="Project Type"
              options={projects}
              getOptionLabel={(data) =>
                data.project_type_name
                  ? data.project_type_name
                  : projectTypeName
              }
              value={projectTypeName}
              onChange={changeProjectTypeName}
              renderInput={(params) => (
                <TextField {...params} label="" variant="outlined" fullWidth />
              )}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol className="mt-2" xl={6} lg={6} md={6}>
            <Molecules.GroupAutoComplete
              className="text-left"
              labelName="Billing Type"
              options={costtype}
              getOptionLabel={(data) =>
                data.cost_type_name ? data.cost_type_name : costType
              }
              value={costType}
              onChange={changeCostType}
              renderInput={(params) => (
                <TextField {...params} label="" variant="outlined" fullWidth />
              )}
            />
          </Atoms.CustomCol>
        </Atoms.CustomRow>
        <Atoms.Section className="agGridCommonContainer">
          <div className="ag-theme-balham">
            <Atoms.AggridReact
              columnDefs={columnDefsEstimate}
              rowData={estimationDetails}
              onGridReady={gridApiReady}
              suppressRowClickSelection={true}
              onCellClicked={cellClick}
              onRowSelected={rowSelect}
              rowHeight="45"
            />
          </div>
        </Atoms.Section>
        <Atoms.CustomRow>
          <Atoms.CustomCol className="mt-2" xl={6} lg={6} md={6}>
            <Molecules.FormGroup
              className="text-left"
              labelName="StartDate"
              type="date"
              changeValue={changeStart}
              Value={Moment(start).format("YYYY-MM-DD")}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol className="mt-2" xl={6} lg={6} md={6}>
            <Molecules.FormGroup
              className="text-left"
              labelName="EndDate"
              type="date"
              changeValue={changeEnd}
              Value={Moment(end).format("YYYY-MM-DD")}
            />
          </Atoms.CustomCol>
        </Atoms.CustomRow>
        <Atoms.CustomRow className="justify-content-center">
          <Atoms.CustomCol xl={2} className="text-right">
            <Atoms.CustomButton
              className="customVioletBtn"
              buttonName="Submit"
              action={handleSubmit}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol xl={2} className="text-left">
            <Atoms.CustomButton
              className="customVioletBtn"
              buttonName="Cancel"
              action={cancelButton}
            />
          </Atoms.CustomCol>
        </Atoms.CustomRow>
      </Atoms.Div>
    </Atoms.Section>
  );
};

export default ActiveProjectsModal;
