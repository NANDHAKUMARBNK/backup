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
import Moment from "moment";

class EditSprintView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      UniqueSprint: [],
      Sprint_Name: "",
      Sprint_StartDate: "",
      Sprint_EndDate: "",
      Sprint_Status: "",
      Sprint_StatusId: "",
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
  componentDidMount() {
    this.FromSprintView();
  }
  FromSprintView() {
    let Sprint = this.props.location.state.SprintSingle_Data;
    if (Sprint) {
      this.setState({
        UniqueSprint: Sprint
      });
      let name = Sprint.sprint_name;
      if (name) {
        this.setState({
          Sprint_Name: name
        });
      }
      let start = Sprint.sprint_start_date;
      if (start) {
        let startdate = Moment(start).format("YYYY-MM-DD");
        this.setState({
          Sprint_StartDate: startdate
        });
      }
      let end = Sprint.sprint_end_date;
      if (end) {
        let enddate = Moment(end).format("YYYY-MM-DD");
        this.setState({
          Sprint_EndDate: enddate
        });
      }
      let status_ID = Sprint.sprint_status;
      if (status_ID) {
        this.setState({
          Sprint_StatusId: status_ID
        });
      }
      let status = Sprint.sprint_status_name;
      if (status) {
        this.setState({
          Sprint_Status: status
        });
      }
    }
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
    let SingleProjectFromActiveProjectList = this.props.location.state.Data;
    let Items = this.props.location.state.SprintSingle_Data;
    return (
      <div>
        <h1>{this.state.Sprint_Name}</h1>
        <SprintHead Data={SingleProjectFromActiveProjectList} />

        <div className="createSprintWhiteBgContainer">
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
                      onChange={this.ChangeSprintName}
                      value={this.state.Sprint_Name}
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
                      name="start"
                      id="start"
                      onChange={this.startDate}
                      value={this.state.Sprint_StartDate}
                    ></Input>
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
                      name="end"
                      id="end"
                      onChange={this.enddate}
                      value={this.state.Sprint_EndDate}
                    ></Input>
                  </Col>
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form>
                <FormGroup row className="justify-content-center">
                  <Label
                    className="text-right align-self-center customLabelFontSize"
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

          {Items.sprint_type === 1 ? (
            <Row className="m-3 justify-content-between">
              <Col xl={6} lg={6} md={6} className="text-left p-0">
                <h6>Sprint summary</h6>
              </Col>
              <Col xl={6} lg={6} md={6} className="text-left p-0">
                <h6>Story Point Estimation Exercise*</h6>
              </Col>
              <Col xl={5} lg={5} md={5} className="">
                <div>
                  {Items ? (
                    <SprintSummary
                      SprintDetails={Items}
                      CreateSprintCallBack={this.callbackFnForSummaryValues.bind(
                        this
                      )}
                    />
                  ) : null}
                </div>
              </Col>
              <Col xl={6} lg={6} md={6} className="">
                {Items ? (
                  <StoryPointEst
                    SprintDetails={Items}
                    StoryPointEstimationInputValues={this.callbackFnForStoryPointEstimation.bind(
                      this
                    )}
                  />
                ) : null}
              </Col>
            </Row>
          ) : null}
          {Items.sprint_type === 2 ? (
            <Row className="m-3 justify-content-between">
              <Col xl={12} lg={12} md={12} sm={12} className="text-left p-0">
                <h6>Sprint summary</h6>
              </Col>

              <Col xl={5} lg={5} md={5} className="">
                <div>
                  {Items ? (
                    <SprintSummary
                      SprintDetails={Items}
                      CreateSprintCallBack={this.callbackFnForSummaryValues.bind(
                        this
                      )}
                    />
                  ) : null}
                </div>
              </Col>
            </Row>
          ) : null}

          <Row className="m-3 no-gutters">
            <Col xl={12} lg={12} md={12} className="text-left">
              <h6>Allocation of hours</h6>
              {Items ? <AllocationOfHours SprintDetails={Items} /> : null}
              <AddBtn
                btnClass={"customVioletBtn mt-2"}
                iTagClassName={"fas fa-plus"}
              />
            </Col>
          </Row>

          {Items.sprint_type === 1 ? (
            <Row className="m-3 no-gutters text-left justify-content-between">
              <Col xl={4} lg={4} md={4}>
                <h6>Capacity planning exercise*</h6>
                {Items ? <CapacityPlanTable SprintDetails={Items} /> : null}
              </Col>
              <Col xl={7} lg={7} md={7}>
                <section>
                  {Items ? (
                    <CapacityPlanForm
                      SprintDetails={Items}
                      CapacityPlanningExerciseForm={this.callbackFnForCapacityPlanningForm.bind(
                        this
                      )}
                    />
                  ) : null}
                </section>
              </Col>
            </Row>
          ) : null}

          {Items.sprint_type === 1 ? (
            <Row className="m-3 no-gutters">
              <Col xl={12} lg={12} md={12} className="mt-5">
                {Items ? <ProductOwnerCheckList SprintDetails={Items} /> : null}
              </Col>
            </Row>
          ) : null}
          {Items.sprint_type === 1 ? (
            <Row className="m-3 no-gutters">
              <Col xl={12} lg={12} md={12}>
                {Items ? <ScrumMasterCheckList SprintDetails={Items} /> : null}
              </Col>
            </Row>
          ) : null}
          {Items.sprint_type === 1 ? (
            <Row className="m-3 no-gutters">
              <Col xl={12} lg={12} md={12}>
                {Items ? (
                  <TechnicalTeamChecklist SprintDetails={Items} />
                ) : null}
              </Col>
            </Row>
          ) : null}
          {Items.sprint_type === 2 ? (
            <Row className="m-3 no-gutters">
              <Col xl={12} lg={12} md={12} className="text-left">
                <h6>Concern/Issues/Notes</h6>
                {Items ? <ConcernIssueNotes SprintDetails={Items} /> : null}
              </Col>
            </Row>
          ) : null}
        </div>
      </div>
    );
  }
}

export default EditSprintView;
