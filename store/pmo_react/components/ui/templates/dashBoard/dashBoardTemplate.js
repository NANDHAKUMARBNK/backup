import React, { useState, useEffect } from "react";
import { Navbar, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Templates from "../../templates";
import Accordion from "react-bootstrap/Accordion";
import "../dashBoard/dashBoardTemplate.css";
import Atoms from "../../atoms";

const DashboardTemplate = (props) => {
  let [authUser, setAuthUser] = useState("");
  useEffect(() => {
    getUserForAuthorizedOne();
  }, []);
  const getUserForAuthorizedOne = () => {
    let AuthorizedUser = props.authorizedUserData;
    if (AuthorizedUser === undefined) {
      let localData = JSON.parse(localStorage.getItem("authData"));
      setAuthUser(localData);
    } else if (AuthorizedUser) {
      setAuthUser(AuthorizedUser);
    }
  };
  return (
    <Templates.BackgroundTemplate>
      <Navbar bg="dark" expand="lg" className="NavBarTop" />
      <Container fluid={true}>
        <Atoms.CustomRow className="customsideNavContainer">
          <Atoms.CustomCol xl={2} lg={2} md={2} className="leftNav bg-dark">
            <Accordion defaultActiveKey="0">
              {authUser.UD_resourceUtilization ? (
                <Card>
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey="0"
                    className="border-bottom"
                  >
                    Utilization Details
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {authUser.UD_resourceUtilization ? (
                        <Link to="/dashboard/resourceutilization">
                          <i className="fa fa-list" aria-hidden="true"></i>{" "}
                          Resource Utilization
                        </Link>
                      ) : null}

                      {authUser.UD_employeeList ? (
                        <Link to="/dashboard/employeelist">
                          <i className="fa fa-list" aria-hidden="true"></i>{" "}
                          Employee List
                        </Link>
                      ) : null}
                      {authUser.UD_projectList ? (
                        <Link to="/dashboard/projectlist">
                          <i className="fa fa-list" aria-hidden="true"></i>{" "}
                          Project List
                        </Link>
                      ) : null}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              ) : null}
              {authUser.RP_reportsAllocation ? (
                <Card>
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey="1"
                    className="border-bottom"
                  >
                    Reports
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      {authUser.RP_reportsAllocation ? (
                        <Link to="/dashboard/allocationreport">
                          <i className="fa fa-list" aria-hidden="true"></i>{" "}
                          Allocation Report
                        </Link>
                      ) : null}
                      {authUser.RP_reportsSkill ? (
                        <Link to="/dashboard/underutilizedreport">
                          <i className="fa fa-list" aria-hidden="true"></i>{" "}
                          Utilization By Skill
                        </Link>
                      ) : null}
                      {authUser.RP_reportsBench ? (
                        <Link to="/dashboard/benchreport">
                          {" "}
                          <i className="fa fa-list" aria-hidden="true"></i>{" "}
                          Bench Report
                        </Link>
                      ) : null}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              ) : null}
              {authUser.PR_projectList ? (
                <Card>
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey="2"
                    className="border-bottom"
                  >
                    Project Reports
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="2">
                    <Card.Body>
                      {authUser.PR_projectList ||
                      !authUser.UD_resourceUtilization ? (
                        <Link to="/dashboard/activeprojectslist">
                          <i className="fa fa-list" aria-hidden="true"></i> List
                          of Active Projects
                        </Link>
                      ) : null}
                      {authUser.PR_projectSummary ? (
                        <Link to="">
                          <i className="fa fa-list" aria-hidden="true"></i>{" "}
                          Summary of RAG status
                        </Link>
                      ) : null}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              ) : null}
            </Accordion>
          </Atoms.CustomCol>
          <Atoms.CustomCol xl={10} lg={10} md={10}>
            {props.children}
          </Atoms.CustomCol>
        </Atoms.CustomRow>
      </Container>
    </Templates.BackgroundTemplate>
  );
};

export default DashboardTemplate;
