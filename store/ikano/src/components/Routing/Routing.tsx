import React from "react";
import ApplicantHomeRender from "../applicant/applicant-home/ApplicationHomeRender";
import Login from "../login/Login";
import AdminDashbord from "../admin-dashboard/AdminDashbord";
import AdminManageJobPositions from "../admin-dashboard/AdminManageJobPositions";
import AvailablePositions from "../available-positions/AvailablePositions";
import SubmitMessage from "../applicant/application-step/SubmitMessage";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
// import useToken from "./useToken";
import AdminSpecificJobPositionDetails from "../admin-dashboard/Grids/adminSpecificJobPositionDetails";
export default function RoutingComponent() {
  // const [token, setToken]: any = useToken();
  // if (!token) return <Login setToken={setToken} />;
  return (
    <div>
      {/* {!token ? (
        <Login setToken={setToken} />
      ) : ( */}
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/admin" component={AdminDashbord} />
          <Route
            exact
            path="/availablepositions/:lang"
            component={AvailablePositions}
          />
          <Route
            exact
            path="/admin/jobposition"
            component={AdminSpecificJobPositionDetails}
          />
          <Route
            exact
            path="/admin/managejobpositions"
            component={AdminManageJobPositions}
          />
          <Route
            exact
            path="/applicant-home/:aplicantType/:jobId"
            component={ApplicantHomeRender}
          />
          <Route
            exact
            path="/submitSucess/:aplicantType"
            component={SubmitMessage}
          />

          <Redirect to="/" />
        </Switch>
      </Router>

      {/* )} */}
    </div>
  );
}
