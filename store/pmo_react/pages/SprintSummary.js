import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Form, FormGroup, Input } from "reactstrap";

class SprintSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SingleObj: {},
      Completed_Arr: [],
      Completed_SingleObj: {},
      In_Completed_Arr: [],
      In_Completed_SingleObj: {},
      Allocated_Story_Points: "",
      Committed_Story_Points: "",
      Actual_Story_Points: "",
      Allocated_Storys: "",
      Committed_Storys: "",
      Actual_Storys: "",
      Allocated_Hours: "",
      Committed_Hours: "",
      Actual_Hours: "",
      Allocated_TechnicalDebt: "",
      Committed_TechnicalDebt: "",
      Actual_TechnicalDebt: "",
      Allocated_EOSBugCount: "",
      Committed_EOSBugCount: "",
      Actual_EOSBugCount: ""
    };
    this.OverAllInputValues = this.OverAllInputValues.bind(this);
  }
  componentDidMount() {
    this.ItemsFromEditSprintView();
  }
  ItemsFromEditSprintView() {
    let Sprint_Obj_Data = this.props.SprintDetails;
    if (Sprint_Obj_Data) {
      this.setState({
        SingleObj: Sprint_Obj_Data
      });
      let Completed = Sprint_Obj_Data.sprint_summary_completed;
      if (Completed) {
        this.setState({
          Completed_Arr: Completed
        });
        Completed.forEach(Internal_Data => {
          this.setState({
            Completed_SingleObj: Internal_Data
          });

          if (Internal_Data.sprint_summary_name === "Story Points Allocated") {
            this.setState({
              Allocated_Story_Points: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Story Points Committed"
          ) {
            this.setState({
              Committed_Story_Points: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Story Points Actual"
          ) {
            this.setState({
              Actual_Story_Points: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Stories Allocated"
          ) {
            this.setState({
              Allocated_Storys: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Stories Committed"
          ) {
            this.setState({
              Committed_Storys: Internal_Data.summary_value
            });
          } else if (Internal_Data.sprint_summary_name === "Stories Actual") {
            this.setState({
              Actual_Storys: Internal_Data.summary_value
            });
          } else if (Internal_Data.sprint_summary_name === "Hours Allocated") {
            this.setState({
              Allocated_Hours: Internal_Data.summary_value
            });
          } else if (Internal_Data.sprint_summary_name === "Hours Committed") {
            this.setState({
              Committed_Hours: Internal_Data.summary_value
            });
          } else if (Internal_Data.sprint_summary_name === "Hours Actual") {
            this.setState({
              Actual_Hours: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Technical Debt Allocated"
          ) {
            this.setState({
              Allocated_TechnicalDebt: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Technical Debt Committed"
          ) {
            this.setState({
              Committed_TechnicalDebt: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Technical Debt Actual"
          ) {
            this.setState({
              Actual_TechnicalDebt: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "EOS Bug Count Allocated"
          ) {
            this.setState({
              Allocated_EOSBugCount: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "EOS Bug Count Committed"
          ) {
            this.setState({
              Committed_EOSBugCount: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "EOS Bug Count Actual"
          ) {
            this.setState({
              Actual_EOSBugCount: Internal_Data.summary_value
            });
          }
        });
      }
      let InCompleted = Sprint_Obj_Data.sprint_summary_incomplete;
      if (InCompleted) {
        this.setState({
          In_Completed_Arr: InCompleted
        });
        InCompleted.forEach(Internal_Data => {
          this.setState({
            In_Completed_SingleObj: Internal_Data
          });

          if (Internal_Data.sprint_summary_name === "Story Points Allocated") {
            this.setState({
              Allocated_Story_Points: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Story Points Committed"
          ) {
            this.setState({
              Committed_Story_Points: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Story Points Actual"
          ) {
            this.setState({
              Actual_Story_Points: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Stories Allocated"
          ) {
            this.setState({
              Allocated_Storys: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Stories Committed"
          ) {
            this.setState({
              Committed_Storys: Internal_Data.summary_value
            });
          } else if (Internal_Data.sprint_summary_name === "Stories Actual") {
            this.setState({
              Actual_Storys: Internal_Data.summary_value
            });
          } else if (Internal_Data.sprint_summary_name === "Hours Allocated") {
            this.setState({
              Allocated_Hours: Internal_Data.summary_value
            });
          } else if (Internal_Data.sprint_summary_name === "Hours Committed") {
            this.setState({
              Committed_Hours: Internal_Data.summary_value
            });
          } else if (Internal_Data.sprint_summary_name === "Hours Actual") {
            this.setState({
              Actual_Hours: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Technical Debt Allocated"
          ) {
            this.setState({
              Allocated_TechnicalDebt: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Technical Debt Committed"
          ) {
            this.setState({
              Committed_TechnicalDebt: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "Technical Debt Actual"
          ) {
            this.setState({
              Actual_TechnicalDebt: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "EOS Bug Count Allocated"
          ) {
            this.setState({
              Allocated_EOSBugCount: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "EOS Bug Count Committed"
          ) {
            this.setState({
              Committed_EOSBugCount: Internal_Data.summary_value
            });
          } else if (
            Internal_Data.sprint_summary_name === "EOS Bug Count Actual"
          ) {
            this.setState({
              Actual_EOSBugCount: Internal_Data.summary_value
            });
          }
        });
      }
    }
  }
  StoryPoints_Allocated = e => {
    let Value_StoryPts_Alloc = e.target.value;
    this.setState({
      Allocated_Story_Points: Value_StoryPts_Alloc
    });
  };
  StoryPoints_Committed = e => {
    let Value_ = e.target.value;
    this.setState({
      Committed_Story_Points: Value_
    });
  };
  StoryPoints_Actual = e => {
    let Value_ = e.target.value;
    this.setState({
      Actual_Story_Points: Value_
    });
  };
  Storys_Allocated = e => {
    let Value_ = e.target.value;
    this.setState({
      Allocated_Storys: Value_
    });
  };
  Storys_Committed = e => {
    let Value_ = e.target.value;
    this.setState({
      Committed_Storys: Value_
    });
  };
  Storys_Actual = e => {
    let Value_ = e.target.value;
    this.setState({
      Actual_Storys: Value_
    });
  };
  Hours_Allocated = e => {
    let Value_ = e.target.value;
    this.setState({
      Allocated_Hours: Value_
    });
  };
  Hours_Committed = e => {
    let Value_ = e.target.value;
    this.setState({
      Committed_Hours: Value_
    });
  };
  Hours_Actual = e => {
    let Value_ = e.target.value;
    this.setState({
      Actual_Hours: Value_
    });
  };
  TechnicalDebt_Allocated = e => {
    let Value_ = e.target.value;
    this.setState({
      Allocated_TechnicalDebt: Value_
    });
  };
  TechnicalDebt_Committed = e => {
    let Value_ = e.target.value;
    this.setState({
      Committed_TechnicalDebt: Value_
    });
  };
  TechnicalDebt_Actual = e => {
    let Value_ = e.target.value;
    this.setState({
      Actual_TechnicalDebt: Value_
    });
  };
  EOSBugCount_Allocated = e => {
    let Value_ = e.target.value;
    this.setState({
      Allocated_EOSBugCount: Value_
    });
  };
  EOSBugCount_Committed = e => {
    let Value_ = e.target.value;
    this.setState({
      Committed_EOSBugCount: Value_
    });
  };
  EOSBugCount_Actual = e => {
    let Value_ = e.target.value;
    this.setState({
      Actual_EOSBugCount: Value_
    });
  };

  OverAllInputValues = e => {
    const OverAllData = {
      StoryPoint_Allocated: parseInt(this.state.Allocated_Story_Points),
      StoryPoint_Committed: parseInt(this.state.Committed_Story_Points),
      StoryPoint_Actual: parseInt(this.state.Actual_Story_Points),
      Stories_Allocated: parseInt(this.state.Allocated_Storys),
      Stories_Committed: parseInt(this.state.Committed_Storys),
      Stories_Actual: parseInt(this.state.Actual_Storys),
      Hours_Allocated: parseInt(this.state.Allocated_Hours),
      Hours_Committed: parseInt(this.state.Committed_Hours),
      Hours_Actual: parseInt(this.state.Actual_Hours),
      Tech_Debt_Allocated: parseInt(this.state.Allocated_TechnicalDebt),
      Tech_Debt_Commited: parseInt(this.state.Committed_TechnicalDebt),
      Tech_Debt_Actual: parseInt(this.state.Actual_TechnicalDebt),
      EosBug_Allocated: parseInt(this.state.Allocated_EOSBugCount),
      EosBug_Committed: parseInt(this.state.Committed_EOSBugCount),
      EosBug_Actual: parseInt(this.state.Actual_EOSBugCount)
    };
    this.props.CreateSprintCallBack(OverAllData);
  };
  render() {
    return (
      <section className="SprintSummaryContainer mt-3">
        <div>
          <Form>
            <Row>
              <Col></Col>
              <Col className="text-left">
                <h6>Allocated</h6>
              </Col>
              <Col className="text-left">
                <h6>commited</h6>
              </Col>
              <Col className="text-left">
                <h6> Actual</h6>
              </Col>
            </Row>
            <Row>
              <Col className="text-left">
                <h6> StoryPoints</h6>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="Story Points Allocated"
                    id="Story Points Allocated"
                    placeholder=""
                    onChange={this.StoryPoints_Allocated.bind(this)}
                    value={this.state.Allocated_Story_Points}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="Story Points Committed"
                    id="Story Points Committed"
                    placeholder=""
                    onChange={this.StoryPoints_Committed.bind(this)}
                    value={this.state.Committed_Story_Points}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="Story Points Actual"
                    id="Story Points Actual"
                    placeholder=""
                    onChange={this.StoryPoints_Actual.bind(this)}
                    value={this.state.Actual_Story_Points}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="text-left">
                <h6>stories</h6>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="Stories Allocated"
                    id="Stories Allocated"
                    placeholder=""
                    onChange={this.Storys_Allocated.bind(this)}
                    value={this.state.Allocated_Storys}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="Stories Committed"
                    id="Stories Committed"
                    placeholder=""
                    onChange={this.Storys_Committed.bind(this)}
                    value={this.state.Committed_Storys}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="Stories Actual"
                    id="Stories Actual"
                    placeholder=""
                    onChange={this.Storys_Actual.bind(this)}
                    value={this.state.Actual_Storys}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="text-left">
                <h6>Hours</h6>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="Hours Allocated"
                    id="Hours Allocated"
                    placeholder=""
                    onChange={this.Hours_Allocated.bind(this)}
                    value={this.state.Allocated_Hours}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="Hours Committed"
                    id="Hours Committed"
                    placeholder=""
                    onChange={this.Hours_Committed.bind(this)}
                    value={this.state.Committed_Hours}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="Hours Actual"
                    id="Hours Actual"
                    placeholder=""
                    onChange={this.Hours_Actual.bind(this)}
                    value={this.state.Actual_Hours}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="text-left">
                <h6>Technical Debt</h6>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="Technical Debt Allocated"
                    id="Technical Debt Allocated"
                    placeholder=""
                    onChange={this.TechnicalDebt_Allocated.bind(this)}
                    value={this.state.Allocated_TechnicalDebt}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="Technical Debt Committed"
                    id="Technical Debt Committed"
                    placeholder=""
                    onChange={this.TechnicalDebt_Committed.bind(this)}
                    value={this.state.Committed_TechnicalDebt}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="Technical Debt Actual"
                    id="Technical Debt Actual"
                    placeholder=""
                    onChange={this.TechnicalDebt_Actual.bind(this)}
                    value={this.state.Actual_TechnicalDebt}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col className="text-left">
                <h6> EOS Bug Count</h6>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="EOS Bug Count Allocated"
                    id="EOS Bug Count Allocated"
                    placeholder=""
                    onChange={this.EOSBugCount_Allocated.bind(this)}
                    value={this.state.Allocated_EOSBugCount}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="EOS Bug Count Committed"
                    id="EOS Bug Count Committed"
                    placeholder=""
                    onChange={this.EOSBugCount_Committed.bind(this)}
                    value={this.state.Committed_EOSBugCount}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    name="EOS Bug Count Actual"
                    id="EOS Bug Count Actual"
                    placeholder=""
                    onChange={this.EOSBugCount_Actual.bind(this)}
                    value={this.state.Actual_EOSBugCount}
                    onBlur={this.OverAllInputValues}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>
      </section>
    );
  }
}

export default SprintSummary;
