import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Form, Button, FormGroup, Label, Input } from "reactstrap";
import CustomEstimateSelectBox from "../Shared/selectBox";
import { AgGridReact } from "ag-grid-react";
import axiosConfig from "../Config/config";
import AddBtn from "../Shared/AddButton";
import headers from "../Config/headers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
class UpdateActiveProjectsModal extends React.Component {
  constructor(props) {
    super(props);
    var rowData = [
      { cost_id: 1, estimate: 10 },
      { cost_id: 2, estimate: 20 }
    ];
    this.state = {
      rowData: rowData,
      columnDefs: [
        {
          headerName: "Cost Head",
          field: "project_capacity_type_id",
          sortable: true,
          filter: "agTextColumnFilter",
          cellRendererFramework: CustomEstimateSelectBox,
          cellRendererParams: {
            dropDownChangeEvent: this.dropDownChangeEvent
          },
          editable: true
        },
        {
          headerName: "Hours",
          field: "estimate",
          sortable: true,
          editable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Delete",
          field: "delete",
          cellClass: "",
          filter: "agTextColumnFilter",
          cellRenderer: function (params) {
            return `<i class="fas fa-trash"></i>`;
          }
        }
      ],
      customers: [],
      projects: [],
      costtype: [],
      activeProjects: [],
      rowHeight: 45,
      project_code: "",
      project_name: "",
      customer_name: "",
      cost_type_Name: "",
      project_type: "",
      project_type_Name: "",
      cost_type: "",
      StartDate: "",
      EndDate: "",
      defaultColDef: {
        editable: true,
        resizable: true
      },
      //rowData: rowData,
      UpdatedProjectData: [],
      RowDataEstimation_details: [],
      showPopup: false
    };
    this.changeprojectcode = this.changeprojectcode.bind(this);
    // this.changeprojectname = this.changeprojectname.bind(this);
    this.changecustomername = this.changecustomername.bind(this);
    this.changeprojecttype = this.changeprojecttype.bind(this);
    this.changebillingtype = this.changebillingtype.bind(this);
    this.ChangeStartDate = this.ChangeStartDate.bind(this);
    this.ChangeEndDate = this.ChangeEndDate.bind(this);
    this.dropDownChangeEvent = this.dropDownChangeEvent.bind(this);
  }
  close() {
    this.props.handleClosebtn();
  }

  componentDidMount() {
    let Props_Data = this.props.data;
    console.log(Props_Data)
    if (Props_Data) {
      let projId = this.props.data.data.project_code;
      axiosConfig
        .get(`/projects/${projId}`, { headers: headers() })
        .then(res => {
          let Data = res.data;
          Data.forEach(Inside_Item => {
            console.log(Inside_Item)
            if (Inside_Item) {
              this.setState({ project_code: Inside_Item.project_code });
              this.setState({ project_name: Inside_Item.project_name });
              this.setState({ customer_id: Inside_Item.customer_id });
              this.setState({ project_type: Inside_Item.project_type });
              this.setState({ cost_type: Inside_Item.cost_type });
              this.setState({ customer_name: Inside_Item.customer_name });
              this.setState({ project_type_Name: Inside_Item.project_type_Name });
            }
            if (Inside_Item.estimation_details) {
              let Details = Inside_Item.estimation_details;
              console.log(Details);
              this.setState({
                RowDataEstimation_details: Details
              });
            }
          });
        })
        .catch(err => {
          this.errorHandle(err);
        });
    }
    this.getActiveProjectList();
    this.getCustomerNames();
    this.getProjects();
    this.getCost();
  }
  dropDownChangeEvent = (selectedvalue, rowIndex) => {
    this.state.rowData[rowIndex].cost_id = parseInt(selectedvalue);
  };
  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };
  onCellClicked(e) {
    // console.log(e);
  }
  openModal = () => {
    this.setState({ showPopup: true });
  };
  getCustomerNames() {
    axiosConfig
      .get("/customers", { headers: headers() })
      .then(response => {
        this.setState({ customers: response.data });
      })
      .catch(err => {
        this.errorHandle(err);
      });
  }
  getProjects() {
    axiosConfig
      .get("/projectType?", { headers: headers() })
      .then(res => {
        this.setState({ projects: res.data });
        // this.setState({ project_type_Name: res.data[0].project_type_Name})

      })
      .catch(err => {
        this.errorHandle(err);
      });
  }
  getCost() {
    axiosConfig
      .get("/costType", { headers: headers() })
      .then(res => {
        console.log(res);
        this.setState({ costtype: res.data });
        // this.setState({ cost_type_Name:})
      })
      .catch(err => {
        this.errorHandle(err);
      });
  }

  getActiveProjectList() {
    axiosConfig
      .get("/projects", { headers: headers() })
      .then(res => {
        this.setState({ activeProjects: res.data });
        res.data.forEach(item => {
          console.log(item)
          this.setState({ cost_type_Name: item.cost_type_Name })
        })
      })
  }
  errorHandle = err => {
    if (err.response.status === 401) {
      this.props.history.push("/");
      window.location.reload();
    }
  };
  handleSubmit = () => {
    this.gridApi.stopEditing();
    var project_Status = 1;
    var project_process_type = 1;
    let Estimation_Details = this.state.RowDataEstimation_details;
    if (Estimation_Details) {
      Estimation_Details.forEach(Inside => {
        delete Inside["project_capacity_type_name"];
      });
    }
    const reqBody = {
      project_name: this.state.project_name,
      customer_id: parseInt(this.state.customer_id),
      project_type: parseInt(this.state.project_type),
      project_process_type: project_process_type,
      cost_type: parseInt(this.state.cost_type),
      expected_start: this.state.StartDate,
      expected_end: this.state.EndDate,
      project_status: project_Status,
      estimation_details: this.state.RowDataEstimation_details
    };
    let Project_Code = this.state.project_code;
    axiosConfig
      .put(`/projects/${Project_Code}`, reqBody, { headers: headers() })
      .then(response => {
        this.setState({ UpdatedProjectData: response.data },
          () => {
            let Updated_Data = this.state.UpdatedProjectData;
            if (Updated_Data) {
              this.close();
              //this.props.history.push("activeprojectsList");
            }
          }
        );

      })
      .catch(err => {
        this.errorHandle(err);
      });
  };

  // autoCompleteGetOptionLabel(option) {
  //   var name = "";
  //   if (option) {
  //     if (this.state.customers && this.state.customers.length > 0) {
  //       var filter = this.state.customers.filter(item => item.customer_id == option.customer_id);
  //       if (filter && filter.length > 0) {
  //         filter.forEach(item => {
  //           name = item.customer_name;
  //         });
  //       }
  //     }

  //   }
  //   return name;
  // }

  changeprojectcode = e => {
    this.setState({ project_code: e.target.value });
  };
  // changeprojectname = e => {
  //   this.setState({ project_name: e.target.value });
  // };

  changecustomername = (e, values) => {
    this.setState({ customer_id: values });
  };
  changeprojecttype = (e, values) => {
    this.setState({ project_type: values });
  };
  changebillingtype = e => {
    this.setState({ cost_type: e.target.value });
  };
  ChangeStartDate = e => {
    let Start_Date = e.target.value;
    this.setState({
      StartDate: Start_Date
    });
  };
  ChangeEndDate = e => {
    let End_Date = e.target.value;
    this.setState({
      EndDate: End_Date
    });
  };
  render() {
    console.log(this.state.costtype)
    return (
      <section className="modalDialog">
        <div>
          <div onClick={() => this.close()} title="Close" className="close">
            x
          </div>
          <section className="UpdateActivemodalContainerOut">
            <h2>Edit active project List</h2>
            <Form>
              <Row>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label for="">Project Code</Label>
                    <Input
                      type="text"
                      placeholder="enter project code"
                      value={this.state.project_code}
                      onChange={this.changeprojectcode}
                      readOnly
                    />
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label for="">Project Name</Label>
                    {/* <Input
                      type="text"
                      placeholder="name of project"
                      value={this.state.project_name}
                      onChange={this.changeprojectname}
                    /> */}

                    <Autocomplete
                      id="projectname"
                      options={this.state.activeProjects}
                      getOptionLabel={data => data.project_name ? data.project_name : this.state.project_name}
                      value={this.state.project_name}
                      onChange={(e, value) => {
                        console.log(value);
                        if (value) {
                          this.setState({
                            project_name: value.project_name,
                          })
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
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label for="exampleEmail">Customer Name</Label>
                    {/* <Input
                      type="select"
                      name="select"
                      id="exampleSelect"
                      style={{ height: 50 }}
                      value={this.state.customer_id}
                      onChange={this.changecustomername}
                    >
                      {this.state.customers.map(res => {
                        return (
                          <option key={res.customer_id} value={res.customer_id}>
                            {res.customer_name}
                          </option>
                        );
                      })}
                    </Input> */}
                    <Autocomplete
                      id="customername"
                      options={this.state.customers}
                      getOptionLabel={data => data.customer_name ? data.customer_name : this.state.customer_name}
                      value={this.state.customer_name}
                      onChange={(event, value) => {
                        if (value) {
                          this.setState({
                            customer_id: value.customer_id,
                            customer_name: value.customer_name
                          })
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
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label for="exampleEmail">Project Type</Label>
                    {/* <Input
                      type="select"
                      name="select"
                      id="exampleSelect"
                      style={{ height: 50 }}
                      onChange={this.changeprojecttype}
                      value={this.state.project_type}
                    >
                      {this.state.projects.map(res => {
                        return (
                          <option
                            key={res.project_type_id}
                            value={res.project_type_id}
                          >
                            {res.project_type_name}
                          </option>
                        );
                      })}
                    </Input> */}
                    <Autocomplete
                      options={this.state.projects}
                      getOptionLabel={data => data.project_type_name ? data.project_type_name : this.state.project_type_Name}
                      value={this.state.project_type_Name}
                      onChange={(e, value) => {
                        this.setState({
                          project_type: value.project_type_id,
                          project_type_Name: value.project_type_name
                        })
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

                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup>
                    <Label for="exampleEmail">Billing Type</Label>
                    {/* <Input
                      type="select"
                      name="select"
                      id="exampleSelect"
                      style={{ height: 50 }}
                      value={this.state.cost_type}
                      onChange={this.changebillingtype}
                    >
                      {this.state.costtype.map(res => {
                        return (
                          <option key={res.cost_type_id} value={res.cost_type_id}>
                            {res.cost_type_name}
                          </option>
                        );
                      })}
                    </Input> */}
                    <Autocomplete
                      id="Billing Type"
                      options={this.state.costtype}
                      getOptionLabel={data => data.cost_type_name ? data.cost_type_name : this.state.cost_type_Name}
                      value={this.state.cost_type_Name}
                      onChange={(e, value) => {
                        this.setState({
                          cost_type: value.cost_type_id,
                          cost_type_name: value.cost_type_name
                        })
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
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xl={12} lg={12} md={12}>
                  <FormGroup row>
                    <Label for="exampleEmail" xl={2} lg={2} md={2}>
                      Approved Estimate
                    <p>(xxx hrs)</p>
                    </Label>

                    <Col xl={6} lg={6} md={6} className="text-left">
                      <div
                        className="ag-theme-balham"
                        style={{ height: "200px", width: "100%" }}
                      >
                        <AgGridReact
                          columnDefs={this.state.columnDefs}
                          rowData={this.state.rowData}
                          onCellClicked={this.onCellClicked.bind(this)}
                          rowHeight={this.state.rowHeight}
                          onGridReady={this.onGridReady}
                        ></AgGridReact>

                        <AddBtn
                          btnClass={"customVioletBtn"}
                          click={this.openModal}
                          iTagClassName={"fas fa-plus"}
                        />
                      </div>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="no-gutters mt-5">
                <Col xl={6} lg={6} md={6}>
                  <FormGroup row>
                    <Label for="exampleEmail" xl={4} lg={4} md={4}>
                      Expected Start Date
                  </Label>
                    <Col xl={5} lg={5} md={5}>
                      <Input
                        type="date"
                        name="date"
                        id=""
                        placeholder="Enter project code"
                        onChange={this.ChangeStartDate}
                        value={this.state.StartDate}
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup row className="no-gutters">
                    <Label for="exampleEmail" xl={5} lg={5} md={5}>
                      Expected End Date
                  </Label>
                    <Col xl={6} lg={6} md={6}>
                      <Input
                        type="date"
                        name="date"
                        id=""
                        placeholder="Enter project code"
                        onChange={this.ChangeEndDate}
                        value={this.state.EndDate}
                      />
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
              <Button
                color="success"
                className="mr-3"
                onClick={() => this.handleSubmit()}
              >
                Submit
            </Button>
              <Button color="success" onClick={() => this.close()}>
                Cancel
            </Button>
            </Form>
          </section>

        </div>
      </section>
    );
  }
}

export default UpdateActiveProjectsModal;
