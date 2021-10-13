import React from "react";
import { Route } from "react-router-dom";

import ProjectList from "../components/pages/projectList/projectList";
import ActiveProjectList from "../components/pages/activeProjectList/activeProjectList";
import CreateNwProject from "../pages/CreateNewProject";
function ProjectRoutes() {
  return (
    <>
      <Route exact path="/dashboard/projectlist" component={ProjectList} />
      <Route
        exact
        path="/dashboard/activeprojectslist"
        component={ActiveProjectList}
      />
      <Route
        exact
        path="/dashboard/createnewproject"
        component={CreateNwProject}
      />
    </>
  );
}

export default ProjectRoutes;
