import React from "react";
import { Form, FormGroup, Input } from "reactstrap";
import axiosConfig from "../Config/config";
import headers from "../Config/headers";
class EmployeeCustomSelectBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      people: this.props.value,
      EmployeeData: this.props.data,
      Employees: []
    };
    this.EmpId_Name = this.EmpId_Name.bind(this);
  }
  componentDidMount() {
    this.Employeees();
  }
  errorHandle = err => {
    if (err.response.status === 401) {
      this.props.history.push("/");
      window.location.reload();
    }
  };
  Employeees() {
    axiosConfig
      .get("/employee", { headers: headers() })
      .then(response => {
        this.setState({ Employees: response.data });
      })
      .catch(err => {
        this.errorHandle(err);
      });
  }
  EmpId_Name = e => {
    let Id = e.target.value;
    if (Id) {
      this.setState({
        people: Id
      });
    }
  };
  render() {
    return (
      <div>
        <Form>
          <FormGroup>
            <Input
              type="select"
              name="select"
              onChange={this.EmpId_Name}
              value={this.state.people}
            >
              {this.state.Employees.map(res => {
                return (
                  <option key={res.emp_id} value={res.emp_id}>
                    Employee {res.emp_id}
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

export default EmployeeCustomSelectBox;
