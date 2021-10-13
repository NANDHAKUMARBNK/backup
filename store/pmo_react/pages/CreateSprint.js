import React from "react";
import SprintHead from "../Shared/SprintHeader";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Form, FormGroup, Label, Input } from "reactstrap";
import SprintSummary from "./SprintSummary";
import StoryPointEst from "./StoryPointEstimation";
import AllocationOfHours from "./AllocationHours";
import AddBtn from "../Shared/AddButton";
import CapacityPlanTable from "./CapacityPlanning";
import CapacityPlanForm from "./CapcityPalnForm";
import ProductOwnerCheckList from "./ProductOwnerChecklist";
import ScrumMasterCheckList from "./ScrumMasterChecklist";
import TechnicalTeamChecklist from "./TechnicalTeamChecklist";
import ConcernIssueNotes from "./ConcernIssueNotes";
class SprintCreate extends React.Component {
  constructor(props) {
    super(props);
    // console.log(
    //   "Itzz Coming Here Props===> ",
    //   this.props
    // );
    this.state = {
      SingleProjectFromActiveProjectList: "",
      Sprint_Name: "",
      Sprint_StartDate: "",
      Sprint_EndDate: "",
      Sprint_Status: "",
      Summary_Data: "",
      Story_Point_Estimation_Data: "",
      Capacity_Planning_Exercise_Data: "",
      Loopup_Status: [
        {
          sprint_status_id: 1,
          sprint_status_name: "Draft",
          isActive: 0
        },
        {
          sprint_status_id: 2,
          sprint_status_name: "On Going",
          isActive: 1
        },
        {
          sprint_status_id: 3,
          sprint_status_name: "Completed",
          isActive: 0
        },
        {
          sprint_status_id: 4,
          sprint_status_name: "Differed",
          isActive: 0
        }
      ]
    };
    this.ChangeSprintName = this.ChangeSprintName.bind(this);
    this.startDate = this.startDate.bind(this);
    this.enddate = this.enddate.bind(this);
    this.sprintstatus = this.sprintstatus.bind(this);
  }

  ChangeSprintName = e => {
    let Sprint_Name = e.target.value;
    this.setState({
      Sprint_Name: Sprint_Name
    });
  };
  startDate = e => {
    let Sprint_StartDate = e.target.value;
    this.setState({
      Sprint_StartDate: Sprint_StartDate
    });
  };
  enddate = e => {
    let Sprint_EndDate = e.target.value;
    this.setState({
      Sprint_EndDate: Sprint_EndDate
    });
  };
  sprintstatus = e => {
    let Sprint_Status = e.target.value;
    this.setState({
      Sprint_Status: Sprint_Status
    });
  };
  SaveSprint = () => {
    let NameOfThe_Sprint = this.state.Sprint_Name;
    let StartDateOfThe_Sprint = this.state.Sprint_StartDate;
    let EndDateOfThe_Sprint = this.state.Sprint_EndDate;
    let StatusOfThe_Sprint = this.state.Sprint_Status;
    const Request = {
      Sprintname: NameOfThe_Sprint,
      StartdateSprint: StartDateOfThe_Sprint,
      EnddateSprint: EndDateOfThe_Sprint,
      StatusSprint: StatusOfThe_Sprint,
      Summary: this.state.Summary_Data,
      StoryPointEstimation: this.state.Story_Point_Estimation_Data,
      CapacityPlanningExercise: this.state.Capacity_Planning_Exercise_Data
    };
    console.log("Request Here", Request);
  };

  componentDidMount() {
    let Project_Details = this.props.location;
    if (Project_Details) {
      this.setState({
        SingleProjectFromActiveProjectList: Project_Details.state.Data
      });
    }
  }
  callbackFnForSummaryValues = SummaryData => {
    this.setState({
      Summary_Data: SummaryData
    });
  };
  callbackFnForStoryPointEstimation = DataFromStry_Estimation => {
    this.setState({
      Story_Point_Estimation_Data: DataFromStry_Estimation
    });
  };
  callbackFnForCapacityPlanningForm = DataFromCapacityPlanning => {
    this.setState({
      Capacity_Planning_Exercise_Data: DataFromCapacityPlanning
    });
  };
  render() {
    //let SingleProjectFromActiveProjectList = this.props.location.state.Data;
    return (
      <section>
        <h1>Create Sprint</h1>
        {this.state.SingleProjectFromActiveProjectList ? (
          <SprintHead Data={this.state.SingleProjectFromActiveProjectList} />
        ) : null}

        <section className="createSprintWhiteBgContainer">
          <Row className="m-0 justify-content-center pb-4">
            <Col>
              <Form>
                <FormGroup row className="justify-content-center">
                  <Label
                    className="text-left align-self-center customLabelFontSize"
                    for="sprintname"
                    xl={5}
                    lg={5}
                    md={5}
                  >
                    Sprint Name
                  </Label>
                  <Col xl={7} lg={7} md={7}>
                    <Input
                      type="text"
                      name="sprintname"
                      id="sprintname"
                      placeholder="sprintname"
                      value={this.state.Sprint_Name}
                      onChange={this.ChangeSprintName}
                    />
                  </Col>
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup row className="justify-content-center">
                  <Label
                    className="text-left align-self-center customLabelFontSize"
                    for="start"
                    xl={5}
                    lg={5}
                    md={5}
                  >
                    Sprint Start Date
                  </Label>
                  <Col xl={7} lg={7} md={7} className="p-0">
                    <Input
                      type="date"
                      name=""
                      id="sprintstartdate"
                      value={this.state.Sprint_StartDate}
                      onChange={this.startDate}
                    />
                  </Col>
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup row className="justify-content-center">
                  <Label
                    className="text-left align-self-center customLabelFontSize"
                    for="end"
                    xl={5}
                    lg={5}
                    md={5}
                  >
                    Sprint End Date
                  </Label>
                  <Col xl={7} lg={7} md={7} className="p-0">
                    <Input
                      type="date"
                      name=""
                      id="sprintenddate"
                      value={this.state.Sprint_EndDate}
                      onChange={this.enddate}
                    />
                  </Col>
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup row className="justify-content-center">
                  <Label
                    className="text-left align-self-center customLabelFontSize"
                    for="status"
                    xl={5}
                    lg={5}
                    md={5}
                  >
                    Sprint Status
                  </Label>
                  <Col xl={7} lg={7} md={7}>
                    <Input
                      type="select"
                      name="status"
                      id="status"
                      onChange={this.sprintstatus}
                      value={this.state.Sprint_Status}
                    >
                      {this.state.Loopup_Status.map(res => {
                        return (
                          <option
                            key={res.sprint_status}
                            value={res.sprint_status}
                          >
                            {res.sprint_status_name}
                          </option>
                        );
                      })}
                    </Input>
                  </Col>
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row className="m-3 justify-content-between">
            <Col xl={6} lg={6} md={6} className="text-left p-0">
              <h6>Sprint summary</h6>
            </Col>
            <Col xl={6} lg={6} md={6} className="text-left p-0">
              <h6>Story Point Estimation Exercise*</h6>
            </Col>
            <Col xl={5} lg={5} md={5}>
              <div>
                <SprintSummary
                  CreateSprintCallBack={this.callbackFnForSummaryValues.bind(
                    this
                  )}
                />
              </div>
            </Col>
            <Col xl={6} lg={6} md={6}>
              <StoryPointEst
                StoryPointEstimationInputValues={this.callbackFnForStoryPointEstimation.bind(
                  this
                )}
              />
            </Col>
          </Row>

          <Row className="m-3 no-gutters">
            <Col xl={12} lg={12} md={12} className="text-left">
              <h6>Allocation of hours</h6>
              <AllocationOfHours />
              <AddBtn
                btnClass={"customVioletBtn mt-2"}
                iTagClassName={"fas fa-plus"}
              />
            </Col>
          </Row>

          <Row className="m-3 no-gutters text-left justify-content-between">
            <Col xl={12} lg={12} md={12}>
              <h6>Capacity planning exercise*</h6>
              <CapacityPlanTable />
            </Col>
            <Col xl={12} lg={12} md={12} className="mt-5">
              <CapacityPlanForm
                CapacityPlanningExerciseForm={this.callbackFnForCapacityPlanningForm.bind(
                  this
                )}
              />
            </Col>
          </Row>

          <Row className="m-3 no-gutters">
            <Col xl={12} lg={12} md={12}>
              <ProductOwnerCheckList />
            </Col>
          </Row>
          <Row className="m-3 no-gutters">
            <Col xl={12} lg={12} md={12}>
              <ScrumMasterCheckList />
            </Col>
          </Row>
          <Row className="m-3 no-gutters">
            <Col xl={12} lg={12} md={12}>
              <TechnicalTeamChecklist />
            </Col>
          </Row>

          <Row className="m-3 no-gutters">
            <Col xl={12} lg={12} md={12} className="text-left">
              <h6>Concern/Issues/Notes</h6>
              <ConcernIssueNotes />
            </Col>
          </Row>
          <Row>
            <Col xl={12} lg={12} md={12}>
              <AddBtn
                btnClass={"customVioletBtn"}
                click={this.SaveSprint}
                btnText={"Save"}
              />
            </Col>
          </Row>
        </section>
      </section>
    );
  }
}

export default SprintCreate;
