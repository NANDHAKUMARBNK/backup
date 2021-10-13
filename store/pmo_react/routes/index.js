import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "../components/pages/login/login";
import DashboardRoutes from "./dashboard";
import ResourceUtilization from "../components/pages/resourceUtilization/resourceUtilization";
import ProjectList from "../components/pages/projectList/projectList";
import BenchReport from "../components/pages/benchReport/benchReport";
import AllocationReport from "../components/pages/allocationReport/allocationReport";
import UtilizedReport from "../components/pages/utilizedReport/utilizedReport";
import EmployeeList from "../components/pages/employeeList/employeeList";
import ActiveProjectList from "../components/pages/activeProjectList/activeProjectList";
import SprintView from "../components/pages/sprintView/sprintView";
import CreateSprint from "../components/pages/createSprint/createSprint";
import EditSprint from "../components/pages/editSprint/editSprint";
class MainRoute extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route
            exact
            path="/dashboard/resourceutilization"
            component={ResourceUtilization}
          />
          <Route
            exact
            path="/dashboard/employeelist"
            component={EmployeeList}
          />
          <Route exact path="/dashboard/projectlist" component={ProjectList} />

          <Route
            exact
            path="/dashboard/activeprojectslist"
            component={ActiveProjectList}
          />
          <Route exact path="/dashboard/benchreport" component={BenchReport} />
          <Route
            exact
            path="/dashboard/allocationreport"
            component={AllocationReport}
          />
          <Route
            exact
            path="/dashboard/underutilizedreport"
            component={UtilizedReport}
          />
          <Route exact path="/dashboard/sprintview" component={SprintView} />
          <Route
            exact
            path="/dashboard/createsprint"
            component={CreateSprint}
          />
          <Route exact path="/dashboard/editsprint" component={EditSprint} />

          <DashboardRoutes />
        </Switch>
      </Router>
    );
  }
}

export default MainRoute;
