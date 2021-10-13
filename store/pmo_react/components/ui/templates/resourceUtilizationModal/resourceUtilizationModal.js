import React, { useState, useEffect } from "react";
import Atoms from "../../atoms";
import Molecules from "../../molecules";
import TextField from "@material-ui/core/TextField";
import Moment from "moment";
import {
  getExecutionPeriodAPI,
  getProjectsAPI,
  editResourceUtilizationAPI,
  createResourceUtilizationAPI,
  getResourceUtilizationAPI_BasedOnId,
} from "../../../../services/resourceUtilizationService";
import { getEmployeesAPI } from "../../../../services/employeeListService";

const ResourceUtilizationModal = (props) => {
  let [exePeriod, setExePeriod] = useState("");
  let [proj, setProj] = useState("");
  let [emp, setEmp] = useState("");
  let [pa_period, setPa_period] = useState("");
  let [employeeId, setEmployeeId] = useState("");
  let [employeeName, setEmployeeName] = useState("");
  let [projectCode, setProjectCode] = useState("");
  let [execution_period_master_id, setExecutionPeriodMasterId] = useState("");
  let [execution_id, setExecution_id] = useState("");
  let [project_id, setProject_id] = useState("");
  let [allocatedHours, setAllocatedHours] = useState("");
  let [utilizedHours, setUtilizedHours] = useState("");
  let [recorinzedHours, setRecorinzedHours] = useState("");
  useEffect(() => {
    getResourseUtilization();
    periodExecution();
    projects();
    employees();
  }, []);

  const getResourseUtilization = async () => {
    let infoAboutRowInGrid = props.data;
    if (infoAboutRowInGrid) {
      let Id = infoAboutRowInGrid.data.pa_id;
      let responseFromResourceUtilizationBasedOnId = await getResourceUtilizationAPI_BasedOnId(
        Id
      );
      let dataFromResponse = responseFromResourceUtilizationBasedOnId.data;
      let response = responseFromResourceUtilizationBasedOnId;
      if (response && dataFromResponse) {
        dataFromResponse.forEach((Item) => {
          let paPeriod = Item.pa_period;
          if (paPeriod) {
            let formatPeriod = Moment(paPeriod).format("YYYY-MM-DD");
            setPa_period(formatPeriod);
          }
          let empId = Item.emp_id;
          if (empId) {
            setEmployeeId(empId);
          }
          let empName = Item.employee_name;
          if (empName) {
            setEmployeeName(empName);
          }
          let projectUniqueCode = Item.project_name;
          if (projectUniqueCode) {
            setProjectCode(projectUniqueCode);
          }
          let projectId = Item.project_code;
          if (projectId) {
            setProject_id(projectId);
          }
          let exePrMasterId = Item.name;
          if (exePrMasterId) {
            setExecutionPeriodMasterId(exePrMasterId);
          }
          let executionId = Item.execution_period_master_id;
          if (executionId) {
            setExecution_id(executionId);
          }
          let allocHours = Item.allocated_hours;
          if (allocHours) {
            setAllocatedHours(allocHours);
          }
          let utilHours = Item.utilized_hours;
          if (utilHours) {
            setUtilizedHours(utilHours);
          }
          let recogHours = Item.recognized_hours;
          if (recogHours) {
            setRecorinzedHours(recogHours);
          }
        });
      }
    }
  };
  const periodExecution = async () => {
    let responseFromExecutionPeriod = await getExecutionPeriodAPI();
    if (responseFromExecutionPeriod) {
      setExePeriod(responseFromExecutionPeriod);
    }
  };
  const projects = async () => {
    let responseFromProjects = await getProjectsAPI();
    if (responseFromProjects) {
      setProj(responseFromProjects);
    }
  };
  const employees = async () => {
    let responseFromEmployees = await getEmployeesAPI();
    if (responseFromEmployees) {
      setEmp(responseFromEmployees);
    }
  };
  const handleChangePaPeriod = (e, values) => {
    if (values) {
      setExecutionPeriodMasterId(values.name);
      setExecution_id(values.executionmonth_id);
      setPa_period(Moment(values.name).format("YYYY-MM-DD"));
    }
  };
  const handleChangeEmployee = (e, values) => {
    if (values) {
      setEmployeeId(values.emp_id);
      setEmployeeName(values.employee_name);
    }
  };
  const handleChangeProjects = (e, values) => {
    if (values) {
      setProjectCode(values.project_name);
      setProject_id(values.project_code);
    }
  };
  const handleChangeAllocatedHours = (e) => {
    let Value_ = e.target.value;
    setAllocatedHours(Value_);
  };
  const handleChangeUtilizedHours = (e) => {
    let Value_ = e.target.value;
    setUtilizedHours(Value_);
  };
  const handleChangeRecogHours = (e) => {
    let Value_ = e.target.value;
    setRecorinzedHours(Value_);
  };
  const handleSubmit = async () => {
    let reqData = {
      pa_period: pa_period,
      emp_id: employeeId,
      execution_period_master_id: parseInt(execution_id),
      project_code: project_id,
      allocated_hours: parseInt(allocatedHours),
      utilized_hours: parseInt(utilizedHours),
      recognized_hours: parseInt(recorinzedHours),
    };
    let info = props.data;
    if (info) {
      let Id = info.pa_id;
      let responseForEditApi = await editResourceUtilizationAPI(reqData, Id);
      if (responseForEditApi) {
        props.closePopup();
      }
    } else {
      if (
        reqData.pa_period &&
        reqData.emp_id &&
        reqData.execution_period_master_id &&
        reqData.project_code &&
        reqData.allocated_hours >= 0 &&
        reqData.utilized_hours >= 0
      ) {
        let responseForCreateApi = await createResourceUtilizationAPI(reqData);
        if (responseForCreateApi) {
          props.closePopup();
        }
      }
    }
  };
  return (
    <Atoms.Section className="modalDialog">
      <Atoms.Div>
        <Atoms.H2 content="Add (or) Edit Resource Modal" />
        <Atoms.Div title="Close" className="close">
          <Atoms.ITag className="fas fa-times" click={props.closePopup} />
        </Atoms.Div>
        <Atoms.CustomRow className="mt-4">
          <Atoms.CustomCol xl={6} lg={6} md={6}>
            <Molecules.GroupAutoComplete
              id=""
              className="text-left"
              labelName="Execution Period"
              options={exePeriod}
              getOptionLabel={(data) =>
                data.name ? data.name : execution_period_master_id
              }
              value={execution_period_master_id}
              onChange={handleChangePaPeriod}
              renderInput={(params) => (
                <TextField {...params} label="" variant="outlined" fullWidth />
              )}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol xl={6} lg={6} md={6}>
            <Molecules.GroupAutoComplete
              className="text-left"
              labelName="Employee Name"
              options={emp}
              getOptionLabel={(data) =>
                data.employee_name ? data.employee_name : employeeName
              }
              value={employeeName}
              onChange={handleChangeEmployee}
              renderInput={(params) => (
                <TextField {...params} label="" variant="outlined" fullWidth />
              )}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol className="mt-2" xl={6} lg={6} md={6}>
            <Molecules.GroupAutoComplete
              className="text-left"
              labelName="Project Name"
              options={proj}
              getOptionLabel={(data) =>
                data.project_name ? data.project_name : projectCode
              }
              value={projectCode}
              onChange={handleChangeProjects}
              renderInput={(params) => (
                <TextField {...params} label="" variant="outlined" fullWidth />
              )}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol className="mt-2" xl={6} lg={6} md={6}>
            <Molecules.FormGroup
              className="text-left"
              labelName="Allocated Hours"
              name="allocatedHours"
              type="text"
              changeValue={handleChangeAllocatedHours}
              Value={allocatedHours}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol className="mt-2" xl={6} lg={6} md={6}>
            <Molecules.FormGroup
              className="text-left"
              labelName="Utilized Hours"
              name="utilizedHours"
              type="text"
              changeValue={handleChangeUtilizedHours}
              Value={utilizedHours}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol className="mt-2" xl={6} lg={6} md={6}>
            <Molecules.FormGroup
              className="text-left"
              labelName="Recognized Hours"
              name="recorinzedHours"
              type="text"
              changeValue={handleChangeRecogHours}
              Value={recorinzedHours}
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
              action={props.closePopup}
            />
          </Atoms.CustomCol>
        </Atoms.CustomRow>
      </Atoms.Div>
    </Atoms.Section>
  );
};

export default ResourceUtilizationModal;
