import React from "react";
import { Route } from "react-router-dom";
import BenchReport from "../components/pages/benchReport/benchReport";
import AllocationReport from "../components/pages/allocationReport/allocationReport";
import UtilizedReport from "../components/pages/utilizedReport/utilizedReport";
function ReportRoutes() {
  return (
    <>
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
    </>
  );
}

export default ReportRoutes;
