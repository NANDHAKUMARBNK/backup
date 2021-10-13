import React from "react";
import { Route } from "react-router-dom";
import SprintView from "../components/pages/sprintView/sprintView";
import SprintCreate from "../components/pages/createSprint/createSprint";
import EditSprintView from "../components/pages/editSprint/editSprint";
function SprintRoutes() {
  return (
    <>
      <Route exact path="/dashboard/sprintview" component={SprintView} />
      <Route exact path="/dashboard/createsprint" component={SprintCreate} />
      <Route exact path="/dashboard/editsprint" component={EditSprintView} />
    </>
  );
}

export default SprintRoutes;
