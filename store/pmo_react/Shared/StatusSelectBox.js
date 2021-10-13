import React from "react";
import { Form, FormGroup, Input } from "reactstrap";

class StatusSelectBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Loopup_Status: [
        {
          sprint_issue_status_id: 1,
          sprint_issue_status_name: "At Risk",
          isClosed: 0
        },
        {
          sprint_issue_status_id: 2,
          sprint_issue_status_name: "Resolved",
          isClosed: 1
        },
        {
          sprint_issue_status_id: 3,
          sprint_issue_status_name: "In Progress",
          isClosed: 0
        },
        {
          sprint_issue_status_id: 4,
          sprint_issue_status_name: "Blocked",
          isClosed: 0
        }
      ],

      Status: ""
    };
    this.StatusDropDown = this.StatusDropDown.bind(this);
  }

  componentDidMount() {}
  StatusDropDown = e => {
    let Value = e.target.value;
    this.setState({
      Status: Value
    });
    this.props.dropDownChangeEvent(Value, this.props.rowIndex);
  };
  render() {
    console.log("Coming here", this.state.Loopup_Status);
    return (
      <div>
        <Form>
          <FormGroup>
            <Input
              type="select"
              name="select"
              onChange={this.StatusDropDown}
              value={this.state.Status}
            >
              {this.state.Loopup_Status.map(res => {
                return (
                  <option
                    key={res.sprint_issue_status_id}
                    value={res.sprint_issue_status_id}
                  >
                    {res.sprint_issue_status_name}
                  </option>
                );
              })}
            </Input>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default StatusSelectBox;
