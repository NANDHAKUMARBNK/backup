import React from "react";
import { Route } from "react-router-dom";
import EmployeeList from "../components/pages/employeeList/employeeList";
import ResourceUtilization from "../components/pages/resourceUtilization/resourceUtilization";
function EmployeeRoutes() {
  return (
    <div>
      <Route exact path="/dashboard/employeelist" component={EmployeeList} />
      <Route
        exact
        path="/dashboard/resourceutilization"
        component={ResourceUtilization}
      />
    </div>
  );
}

export default EmployeeRoutes;
