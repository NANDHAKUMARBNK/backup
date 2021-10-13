import React, { useState, useEffect } from "react";
import Atoms from "../../atoms";
import { getEmployeesAPI } from "../../../../services/employeeListService";

const CellRendererFrameworkAllocationHours = (props) => {
  let [employee, setEmployees] = useState("");
  let [people, setPeople] = useState(props.value);
  useEffect(() => {
    fetchEmployees();
  }, []);
  const fetchEmployees = async () => {
    let responseFromEmpApi = await getEmployeesAPI();
    if (responseFromEmpApi) {
      setEmployees(responseFromEmpApi);
    }
  };
  const changeEmpId_Name = (e) => {
    let inputValue = e.target.value;
    setPeople(inputValue);
    props.updateDropdown(inputValue, props.rowIndex);
  };
  return (
    <Atoms.FormInput
      as="select"
      changeValue={changeEmpId_Name}
      Value={people}
      options={employee}
    />
  );
};

export default CellRendererFrameworkAllocationHours;
