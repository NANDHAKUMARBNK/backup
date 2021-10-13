import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../components/pages/dashBoard/dashBoard";
function DashboardRoutes() {
  return (
    <div>
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/dashboard/welcome" component={Dashboard} />
    </div>
  );
}

export default DashboardRoutes;
