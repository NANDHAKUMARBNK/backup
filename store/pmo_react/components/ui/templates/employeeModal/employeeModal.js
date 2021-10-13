import React, { useState, useEffect } from "react";
import Atoms from "../../atoms";
import Molecules from "../../molecules";
import TextField from "@material-ui/core/TextField";
import {
  getEmployeeAPI,
  getEmployeesAPI,
  postEmployeeAPI,
} from "../../../../services/employeeListService";
import Moment from "moment";
const EmployeeModal = (props) => {
  let [eid, setEmployeeUniqueId] = useState("");
  let [eName, setEmployeeName] = useState("");
  let [eDoj, setEmployeeDoj] = useState("");
  let [eLastDate, setEmployeeLastDate] = useState("");
  let [employees, setEmployees] = useState("");
  useEffect(() => {
    getGridCellDataFromEmployeeList();
    getEmployeeDropDown();
  }, []);
  const getGridCellDataFromEmployeeList = async () => {
    if (props.passData) {
      let employeeIde = props.passData.emp_id;
      let responseFromEmp = await getEmployeeAPI(employeeIde);
      if (responseFromEmp) {
        responseFromEmp.forEach((insideEmployee) => {
          setEmployeeUniqueId(insideEmployee.emp_id);
          setEmployeeName(insideEmployee.employee_name);
          setEmployeeDoj(
            Moment(insideEmployee.employee_doj).format("YYYY-MM-DD")
          );
          setEmployeeLastDate(
            Moment(insideEmployee.employee_lastdate).format("YYYY-MM-DD")
          );
        });
      }
    }
  };
  const getEmployeeDropDown = async () => {
    let responseEmployees = await getEmployeesAPI();
    if (responseEmployees) {
      setEmployees(responseEmployees);
    }
  };
  const handleChangeEmployeeDropDown = (e, values) => {
    if (values) {
      setEmployeeName(values.employee_name);
    } else {
      setEmployeeName(e.target.value);
    }
  };
  const handleChangeEmployeeIdDropDown = (e, values) => {
    if (values) {
      setEmployeeUniqueId(values.emp_id);
    } else {
      setEmployeeUniqueId(e.target.value);
    }
  };
  const changeStart = (e, values) => {
    if (values) {
      setEmployeeDoj(Moment(values).format("YYYY-MM-DD"));
    } else {
      setEmployeeDoj(e.target.value);
    }
  };
  const changeLastDate = (e, values) => {
    if (values) {
      setEmployeeLastDate(Moment(values).format("YYYY-MM-DD"));
    } else {
      setEmployeeLastDate(e.target.value);
    }
  };
  const clickSubmit = async () => {
    let employeeUserName = eName;
    let employeeDateOfJoin = eDoj;
    if (employeeDateOfJoin === "Invalid date") {
      employeeDateOfJoin = "";
    }
    let employeeFinalDate = eLastDate;
    if (employeeFinalDate === "Invalid date") {
      employeeFinalDate = "";
    }
    const requestEmployeeInformation = {
      employee_name: employeeUserName,
      employee_doj: employeeDateOfJoin,
      employee_lastdate: employeeFinalDate,
    };
    if (props.passData) {
      let responseFromCreateUpdateApi = await postEmployeeAPI(
        requestEmployeeInformation,
        eid
      );
      if (responseFromCreateUpdateApi) {
        props.closePopup();
      }
    }
  };
  return (
    <Atoms.Section className="modalDialog">
      <Atoms.Div>
        <Atoms.H2 content="Add (or) Edit Employee Modal" />
        <Atoms.Div title="Close" className="close">
          <Atoms.ITag className="fas fa-times" click={props.closePopup} />
        </Atoms.Div>
        <Atoms.CustomRow className="mt-4">
          {props.title === "Add" ? (
            <Atoms.CustomCol xl={6} lg={6} md={6}>
              <Molecules.GroupAutoComplete
                className="text-left"
                labelName="Employee Id"
                options={employees}
                getOptionLabel={(data) => (data.emp_id ? data.emp_id : eid)}
                value={eid}
                onChange={handleChangeEmployeeIdDropDown}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=""
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Atoms.CustomCol>
          ) : null}
          {props.title === "Edit" ? (
            <Atoms.CustomCol xl={6} lg={6} md={6}>
              <Molecules.FormGroup
                className="text-left"
                labelName="Employee Id"
                Value={eid}
                readOnly
              />
            </Atoms.CustomCol>
          ) : null}

          <Atoms.CustomCol xl={6} lg={6} md={6}>
            <Molecules.GroupAutoComplete
              className="text-left"
              labelName="Employee Name"
              options={employees}
              getOptionLabel={(data) =>
                data.employee_name ? data.employee_name : eName
              }
              value={eName}
              onChange={handleChangeEmployeeDropDown}
              renderInput={(params) => (
                <TextField {...params} label="" variant="outlined" fullWidth />
              )}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol className="mt-2" xl={6} lg={6} md={6}>
            <Molecules.FormGroup
              className="text-left"
              labelName="Employee Doj"
              type="date"
              changeValue={changeStart}
              Value={Moment(eDoj).format("YYYY-MM-DD")}
            />
          </Atoms.CustomCol>
          <Atoms.CustomCol className="mt-2" xl={6} lg={6} md={6}>
            <Molecules.FormGroup
              className="text-left"
              labelName="Employee Last Date"
              type="date"
              changeValue={changeLastDate}
              Value={Moment(eLastDate).format("YYYY-MM-DD")}
            />
          </Atoms.CustomCol>
        </Atoms.CustomRow>
        <Atoms.CustomRow className="justify-content-center">
          <Atoms.CustomCol xl={2} className="text-right">
            <Atoms.CustomButton
              className="customVioletBtn"
              buttonName="Submit"
              action={clickSubmit}
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

export default EmployeeModal;
