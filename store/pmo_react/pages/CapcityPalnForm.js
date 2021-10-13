import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FormGroup, Label, Input } from "reactstrap";

class CapacityPlanForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      SingleSprintObj: {},
      CapacityExercise_Arr: [],
      SingleObj_CapacityEx: {},
      Audience: "",
      CapacityPerson: "",
      FocusFactor: "",
      VelocityExpected: "",
      velocity: "",
      SprintCapacity: "",
      TotalCapacity: "",
      NoOfSprint: ""
    };
    this.AudienceChange = this.AudienceChange.bind(this);
    this.VelocityExpectedChange = this.VelocityExpectedChange.bind(this);
    this.FocusFactorChange = this.FocusFactorChange.bind(this);
    this.CapacityPersonChange = this.CapacityPersonChange.bind(this);
    this.NoOfSprintChange = this.NoOfSprintChange.bind(this);
    this.VelocityChange = this.VelocityChange.bind(this);
    this.SprintCapacityChange = this.SprintCapacityChange.bind(this);
    this.TotalCapacityChange = this.TotalCapacityChange.bind(this);
  }
  componentDidMount() {
    this.DataFromEditSprintView();
  }
  DataFromEditSprintView() {
    let SprintDetails = this.props.SprintDetails;
    if (SprintDetails) {
      this.setState({
        SingleSprintObj: SprintDetails
      });
      let ProjectCapacityExercise_Arr = SprintDetails.project_capacity_exercise;
      if (ProjectCapacityExercise_Arr) {
        this.setState({
          CapacityExercise_Arr: ProjectCapacityExercise_Arr
        });
        ProjectCapacityExercise_Arr.forEach(Value => {
          this.setState({
            SingleObj_CapacityEx: Value
          });
          if (Value) {
            let AudienceEx = Value.exercise_audience;
            this.setState({
              Audience: AudienceEx
            });
            let CapacityPersonEx = Value.capacity_person;
            this.setState({
              CapacityPerson: CapacityPersonEx
            });
            let FocusFactorEx = Value.focus_factor;
            this.setState({
              FocusFactor: FocusFactorEx
            });
            let ExpectedVelocity = Value.expected_velocity;
            this.setState({
              VelocityExpected: ExpectedVelocity
            });
          }
        });
      }
    }
  }
  AudienceChange = e => {
    let Input_Value = e.target.value;
    this.setState({
      Audience: Input_Value
    });
  };
  VelocityExpectedChange = e => {
    let Input_Value = e.target.value;
    this.setState({
      VelocityExpected: Input_Value
    });
  };
  FocusFactorChange = e => {
    let Input_Value = e.target.value;
    this.setState({
      FocusFactor: Input_Value
    });
  };
  CapacityPersonChange = e => {
    let Input_Value = e.target.value;
    this.setState({
      CapacityPerson: Input_Value
    });
  };
  NoOfSprintChange = e => {
    let Input_Value = e.target.value;
    this.setState({
      NoOfSprint: Input_Value
    });
  };
  VelocityChange = e => {
    let Input_Value = e.target.value;
    this.setState({
      velocity: Input_Value
    });
  };
  SprintCapacityChange = e => {
    let Input_Value = e.target.value;
    this.setState({
      SprintCapacity: Input_Value
    });
  };
  TotalCapacityChange = e => {
    let Input_Value = e.target.value;
    this.setState({
      TotalCapacity: Input_Value
    });
  };
  SendValuesToCreateSprint = () => {
    const CapacityPlan_To_CreateSprint = {
      Audience_: this.state.Audience,
      VelocityExpected_: this.state.VelocityExpected,
      FocusFactor_: this.state.FocusFactor,
      CapacityPerson_: this.state.CapacityPerson,
      NoOfSprint_: this.state.NoOfSprint,
      Velocity_: this.state.velocity,
      SprintCapacity_: this.state.SprintCapacity,
      TotalCapacity_: this.state.TotalCapacity
    };
    this.props.CapacityPlanningExerciseForm(CapacityPlan_To_CreateSprint);
  };
  render() {
    return (
      <section className="mt-4">
        <section className="m-2">
          <FormGroup row>
            <Label for="audience" xl={2} lg={2} md={2}>
              Audience
            </Label>
            <Col xl={9} lg={9} md={9}>
              <Input
                type="text"
                name="audience"
                id="audience"
                placeholder=""
                onChange={this.AudienceChange}
                value={this.state.Audience}
                onBlur={this.SendValuesToCreateSprint.bind(this)}
              />
            </Col>
          </FormGroup>
          <Row className="no-gutters">
            <Col>
              <FormGroup row>
                <Label for="capacity" xl={6} lg={6} md={6}>
                  Capacity/person
                </Label>
                <Col xl={4} lg={4} md={4} className="p-0">
                  <Input
                    type="text"
                    name="capacity"
                    id="capacity"
                    placeholder=""
                    onChange={this.CapacityPersonChange}
                    value={this.state.CapacityPerson}
                    onBlur={this.SendValuesToCreateSprint.bind(this)}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup row>
                <Label for="sprintcapacity" xl={6} lg={6} md={6}>
                  Capacity/sprint
                </Label>
                <Col xl={4} lg={4} md={4} className="p-0">
                  <Input
                    type="text"
                    name="sprintcapacity"
                    id="sprintcapacity"
                    placeholder=""
                    onChange={this.SprintCapacityChange}
                    value={this.state.SprintCapacity}
                    onBlur={this.SendValuesToCreateSprint.bind(this)}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup row>
                <Label for="factor" xl={6} lg={6} md={6}>
                  Focus factor
                </Label>
                <Col xl={4} lg={4} md={4} className="p-0">
                  <Input
                    type="text"
                    name="focusfactor"
                    id="focusfactor"
                    placeholder=""
                    onChange={this.FocusFactorChange}
                    value={this.state.FocusFactor}
                    onBlur={this.SendValuesToCreateSprint.bind(this)}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row className="justify-content-center w-100">
            <Col xl={12} lg={12} md={12}>
              <FormGroup row className="justify-content-center">
                <Label
                  for="velocity"
                  xl={6}
                  lg={6}
                  md={6}
                  className="text-center"
                >
                  Average Velocity Expected (Story Points)
                </Label>
                <Col xl={4} lg={4} md={4} className="p-0">
                  <Input
                    type="text"
                    name="velocity"
                    id="velocity"
                    placeholder=""
                    onChange={this.VelocityChange}
                    value={this.state.velocity}
                    onBlur={this.SendValuesToCreateSprint.bind(this)}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </section>

        <section className="m-2">
          <Row className="no-gutters">
            <Col>
              <FormGroup row>
                <Label for="total" xl={6} lg={6} md={6}>
                  Total Capacity
                </Label>
                <Col xl={4} lg={4} md={4} className="p-0">
                  <Input
                    type="text"
                    name="total"
                    id="total"
                    placeholder=""
                    onChange={this.TotalCapacityChange}
                    value={this.state.TotalCapacity}
                    onBlur={this.SendValuesToCreateSprint.bind(this)}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup row>
                <Label for="estimate" xl={6} lg={6} md={6}>
                  Estimated Capacity
                </Label>
                <Col xl={4} lg={4} md={4} className="p-0">
                  <Input
                    type="text"
                    name="estimate"
                    id="estimate"
                    placeholder=""
                    onChange={this.VelocityExpectedChange}
                    value={this.state.VelocityExpected}
                    onBlur={this.SendValuesToCreateSprint.bind(this)}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup row>
                <Label for="no" xl={7} lg={7} md={7}>
                  No. of Sprints
                </Label>
                <Col xl={4} lg={4} md={4} className="p-0">
                  <Input
                    type="text"
                    name="no"
                    id="no"
                    placeholder=""
                    onChange={this.NoOfSprintChange}
                    value={this.state.NoOfSprint}
                    onBlur={this.SendValuesToCreateSprint.bind(this)}
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </section>
      </section>
    );
  }
}

export default CapacityPlanForm;
