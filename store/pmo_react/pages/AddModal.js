import React, { Component } from "react";
import "../App.css";
import Button from "react-bootstrap/Button";
import Moment from "moment";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axiosConfig from "../Config/config";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import headers from "../Config/headers";

class Modal extends Component {
  constructor(props) {
    super();
    this.state = {
      employeeName: "",
      projectName: "",
      allocatedHours: "",
      utilizedHours: "",
      recorinzedHours: "",
      execution_period_master_id: "",
      employeeId: "",
      projectCode: "",
      pa_period: "",
      employeeData: [],
      periodData: [],
      emp_id: "",
      projectData: [],
      singleData: {},
      execution_id: "",
      project_id: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }
  close() {
    this.props.handleClosebtn();
  }
  errorHandle = err => {
    if (err.response.status === 401) {
      this.props.history.push("/");
      window.location.reload();
    }
  };

  componentDidMount() {
    if (this.props.data) {
      axiosConfig
        .get(`/resourceUtilization/${this.props.data.data.pa_id}`, { headers: headers() })
        .then(response => {
          //  this.setState({rowData:response.data});

          let list = response.data[0];
          this.setState({ singleData: list });
          let dateFormat = Moment(list.pa_period).format("YYYY-MM-DD");

          this.setState({
            pa_period: dateFormat,
            employeeId: list.emp_id,
            employeeName: list.employee_name,
            projectCode: list.project_name,
            project_id: list.project_code,
            execution_period_master_id: list.name,
            execution_id: list.execution_period_master_id,
            allocatedHours: list.allocated_hours,
            utilizedHours: list.utilized_hours,
            recorinzedHours: list.recognized_hours
          });
        })
        .catch(err => {
          this.errorHandle(err);
        });
    }
    this.getemplyeList();
    this.getPeriod();
    this.getProject();
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleChangeSelect(event, values) {
    console.log("Values:",values);
    this.setState({ employeeId: values });
  }

  getemplyeList() {
    axiosConfig
      .get("/employee", { headers: headers() })
      .then(response => {
        this.setState({ employeeData: response.data });
      })
      .catch(err => {
        this.errorHandle(err);
      });
  }
  // autoCompleteGetOptionLabel(option) {
  //   console.log("this.state.employeeData:",this.state.employeeData);
  //   var name = this.state.employeeName;
  //   if (option) {
  //     if (this.state.employeeData && this.state.employeeData.length > 0) {
  //       var filter = this.state.employeeData.filter(item => item.emp_id == option.emp_id);
  //       if (filter && filter.length > 0) {
  //         filter.forEach(item => {
  //           name = item.employee_name;
  //         });
  //       }
  //     }
  //   }
  //   return name;
  // }

  getPeriod() {
    axiosConfig
      .get("/executionPeriod", { headers: headers() })
      .then(response => {
        this.setState({ periodData: response.data });
      })
      .catch(err => {
        this.errorHandle(err);
      });
  }

  getProject() {
    axiosConfig
      .get("/projects", { headers: headers() })
      .then(response => {
        this.setState({ projectData: response.data });
      })
      .catch(err => {
        this.errorHandle(err);
      });
  }

  handleSubmit(event) {
    let reqData = {
      pa_period: this.state.pa_period,
      emp_id: this.state.employeeId,
      execution_period_master_id: parseInt(this.state.execution_id),
      project_code: this.state.project_id,
      allocated_hours: parseInt(this.state.allocatedHours),
      utilized_hours: parseInt(this.state.utilizedHours),
      recognized_hours: parseInt(this.state.recorinzedHours)
    };

    if (this.props.data) {
      axiosConfig
        .put(`/resourceUtilization/${this.props.data.data.pa_id}`, reqData, {
          headers: headers()
        })
        .then(response => {
          this.props.handleClose();
          reqData = {};
        })
        .catch(err => {
          this.errorHandle(err);
        });
    } else {
      if (
        reqData.pa_period &&
        reqData.emp_id &&
        reqData.execution_period_master_id &&
        reqData.project_code &&
        reqData.allocated_hours >= 0 &&
        reqData.utilized_hours >= 0
      ) {
        axiosConfig
          .post("/resourceUtilization", reqData, { headers: headers() })
          .then(response => {
            reqData = {};
            this.props.handleClose();
          })
          .catch(err => {
            this.errorHandle(err);
          });
      }
    }
  }

  AutocompleteChange(data, event) { }

  render() {
  //  var defaultdata =  this.state.employeeData.filter(item=>
  //     item.emp_id == this.state.employeeId
  // )
// console.log("defaultdata:",defaultdata);
    return (
      <div id="openModal-about" className="modalDialog">
        <div>
          <div onClick={() => this.close()} title="Close" className="close">
            {" "}
            X{" "}
          </div>
          <div> ADD / EDIT RESOURCES </div>
          <form>
            <Row>
              <Col md={6}>
                <label>Employee Id/Name </label>

                {/* <select
                  style={{ height: 50 }}
                  className="form-control"
                  value={this.state.employeeId}
                  onChange={this.handleChangeSelect}
                  id="yearOption"
                  name="year"
                >
                  <option>Period</option>

                  {this.state.employeeData.map((item, index) => {
                    return (
                      <option key={item.emp_id} value={item.emp_id}>
                        {item.employee_name}
                      </option>
                    );
                  })}
                </select> */}


                <Autocomplete
                  id="combo-box-demo-emplyee"
                  options={this.state.employeeData}
                  getOptionLabel={data => 
                    data.employee_name ?
                    data.employee_name : this.state.employeeName
                  }
                  value={this.state.employeeId}
                  onChange={(event, value) => {
                    console.log(value)
                    if (value) {
                      this.setState({
                        employeeId: value.emp_id,
                        employeeName:value.employee_name
                      });
                    }
                  }}
                  style={{ width: 300 }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label=""
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />

                {/* <Autocomplete
                  options={this.state.employeeData}
                  getOptionLabel={(option) => option.employee_name && option.employee_name.length > 0 ? option.employee_name : this.state.employeeName}
                  value={this.state.employeeId}
                  onChange={this.handleChangeSelect}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label=""
                      variant="outlined"
                      fullWidth
                    />
                  )}
                /> */}
              </Col>

              <Col md={6}>
                <label>Execution Period Master Id </label>

                <Autocomplete
                  id="combo-box-demo"
                  options={this.state.periodData}
                  getOptionLabel={optionexe =>
                    optionexe.name
                      ? optionexe.name
                      : this.state.execution_period_master_id
                  }
                  style={{ width: 300 }}
                  value={this.state.execution_period_master_id}
                  onChange={(event, value) => {
                    if (value) {
                      this.setState({
                        execution_period_master_id: value.name,
                        execution_id: value.executionmonth_id,
                        pa_period: Moment(value.name).format("YYYY-MM-DD")
                      });
                    }
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label=""
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <label>Project Code </label>

                <Autocomplete
                  id="combo-box-project"
                  options={this.state.projectData}
                  getOptionLabel={option =>
                    option.project_name
                      ? option.project_name
                      : this.state.projectCode
                  }
                  style={{ width: 300 }}
                  value={this.state.projectCode}
                  autoComplete
                  onChange={(event, value) => {
                    if (value) {
                      this.setState({
                        projectCode: value.project_name,
                        project_id: value.project_code
                      });
                    }
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label=""
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Col>

              <Col md={6}>
                <label>PA Period </label>
                <input
                  type="date"
                  name="pa_period"
                  className="form-control"
                  value={this.state.pa_period}
                  onChange={this.handleChange}
                  placeholder="Enter  pa_period"
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <label>Allocated Hours</label>
                <input
                  type="text"
                  name="allocatedHours"
                  className="form-control"
                  value={this.state.allocatedHours}
                  onChange={this.handleChange}
                  placeholder="Enter  AllocatedHours"
                />
              </Col>

              <Col md={6}>
                <label>Utilized Hours </label>
                <input
                  type="text"
                  name="utilizedHours"
                  className="form-control"
                  value={this.state.utilizedHours}
                  onChange={this.handleChange}
                  placeholder="Enter  UtilizedHours"
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <label>Recognized Hours</label>
                <input
                  type="text"
                  name="recorinzedHours"
                  className="form-control"
                  value={this.state.recorinzedHours}
                  onChange={this.handleChange}
                  placeholder="Enter  RecorinzedHours"
                />
              </Col>
            </Row>
            <div>
              <Button
                variant="success"
                className="mr-3"
                onClick={() => this.handleSubmit()}
              >
                Submit
              </Button>
              <Button variant="success" onClick={() => this.close()}>
                Cancel
              </Button>
            </div>
          </form>
        </div>{" "}
      </div>
    );
  }
}

export default Modal;
