import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import ResourceUtilization from "./resourceUtilization";
import ProjectList from "./projectList";
import EmpList from "./empList";
import BenchReport from "./benchReport";
import AllocationReport from "./allocationReport";
import UtilizedReport from "./utilizedReport";
import ActiveProjList from "./ActiveProjectList";
import SprntVw from "./SprintView";
import SprintCreate from "./CreateSprint";
import CreateNwProject from "./CreateNewProject";
import Welcome from "./Welcome";
import EditSprintView from "./EditSprintView";

class RolesWelcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: ""
    };
  }
  componentDidMount() {
    let AuthorizedUser = this.props.location.state;
    if (AuthorizedUser === undefined) {
      let localData = JSON.parse(localStorage.getItem("authData"));
      this.setState({
        authUser: localData
      });
    } else if (AuthorizedUser.authUserData) {
      this.setState({
        authUser: AuthorizedUser.authUserData
      });
    } else if (AuthorizedUser.Data.project_code) {
      let localData = JSON.parse(localStorage.getItem("authData"));
      this.setState({
        authUser: localData
      });
    }
  }

  render() {
    return (
      <div className="customNavbarContainer">
        <Router>
          <Navbar className="navBar customNavbarTop"></Navbar>
          <Container fluid={true}>
            <Row>
              <Col md={2} className="leftNav">
                <Accordion defaultActiveKey="0">
                  {this.state.authUser.UD_resourceUtilization ? (
                    <Card>
                      <Accordion.Toggle as={Card.Header} eventKey="0" className="border-bottom">
                        Utilization Details
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          {this.state.authUser.UD_resourceUtilization ? (
                            <Link to="/dashboard/resourceutilization">
                              <i className="fa fa-list" aria-hidden="true"></i> Resource Utilization
                            </Link>
                          ) : null}
                          {this.state.authUser.UD_employeeList ? (
                            <Link to="/dashboard/employeelist">
                              <i className="fa fa-list" aria-hidden="true"></i> Employee List
                            </Link>
                          ) : null}
                          {this.state.authUser.UD_projectList ? (
                            <Link to="/dashboard/projectlist">
                              <i className="fa fa-list" aria-hidden="true"></i> Project List
                            </Link>
                          ) : null}
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  ) : null}
                  {this.state.authUser.RP_reportsAllocation ? (
                    <Card>
                      <Accordion.Toggle as={Card.Header} eventKey="1" className="border-bottom">
                        Reports
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          {this.state.authUser.RP_reportsAllocation ? (
                            <Link to="/dashboard/allocationreport">
                              <i className="fa fa-list" aria-hidden="true"></i> Allocation Report
                            </Link>
                          ) : null}
                          {this.state.authUser.RP_reportsSkill ? (
                            <Link to="/dashboard/underutilizedreport">
                              <i className="fa fa-list" aria-hidden="true"></i> Utilization By Skill
                            </Link>
                          ) : null}
                          {this.state.authUser.RP_reportsBench ? (
                            <Link to="/dashboard/benchreport">
                              {" "}
                              <i className="fa fa-list" aria-hidden="true"></i> Bench Report
                            </Link>
                          ) : null}
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  ) : null}
                  {this.state.authUser.PR_projectList ? (
                    <Card>
                      <Accordion.Toggle as={Card.Header} eventKey="2" className="border-bottom">
                        Project Reports
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey="2">
                        <Card.Body>
                          {this.state.authUser.PR_projectList ||
                            !this.state.authUser.UD_resourceUtilization ? (
                              <Link to="/dashboard/activeprojectsList">
                                <i className="fa fa-list" aria-hidden="true"></i>  List of Active Projects
                            </Link>
                            ) : null}
                          {this.state.authUser.PR_projectSummary ? (
                            <Link to="">
                              <i className="fa fa-list" aria-hidden="true"></i> Summary of RAG status
                              </Link>
                          ) : null}
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  ) : null}
                </Accordion>
              </Col>
              <Col xl={10} lg={10} md={10} sm={10} className="CustomPageRenderingSection">
                <Switch>
                  <Route exact path="/dashboard" component={Welcome} />
                  <Route
                    exact
                    path="/dashboard/resourceutilization"
                    component={ResourceUtilization}
                  />
                  <Route
                    exact
                    path="/dashboard/projectlist"
                    component={ProjectList}
                  />
                  <Route
                    exact
                    path="/dashboard/employeelist"
                    component={EmpList}
                  />
                  <Route
                    exact
                    path="/dashboard/benchreport"
                    component={BenchReport}
                  />
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
                  <Route
                    exact
                    path="/dashboard/activeprojectsList"
                    component={ActiveProjList}
                  />
                  <Route
                    exact
                    path="/dashboard/sprintview"
                    component={SprntVw}
                  />
                  <Route
                    exact
                    path="/dashboard/createsprint"
                    component={SprintCreate}
                  />
                   <Route
                    exact
                    path="/dashboard/editsprintview"
                    component={EditSprintView}
                  />
                  <Route
                    exact
                    path="/dashboard/createnewproject"
                    component={CreateNwProject}
                  />
                </Switch>
              </Col>
            </Row>
          </Container>
        </Router>
      </div>
    );
  }
}

export default RolesWelcome;
