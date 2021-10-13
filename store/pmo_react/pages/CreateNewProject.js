import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import Button from "react-bootstrap/Button";
import CustomEstimateSelectBox from "../Shared/selectBox";
import EstModal from "./EstimateModal";
import AddBtn from "../Shared/AddButton";
import axiosConfig from "../Config/config";
import headers from "../Config/headers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

class CreateNwProject extends React.Component {
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
      defaultColDef: {
        editable: true,
        resizable: true
      },
      //rowData: rowData,
      EstimatedDropDownValue: "",
      rowHeight: 45,
      showPopup: false,

      project_code: "",
      customer_id: "",
      customers: [],
      projects: [],
      costtype: [],
      project_type: "",
      project_type_id: "",
      project_type_name: "",
      project_process_type: "",
      cost_type: "",
      expected_start: "",
      expected_end: "",
      project_status: "",
      ProjectName: "",
      newCustomer: "",
      ProjectCode: "",
      ProjectType: "",
      CostType: "",
      cost_type_id: "",
      cost_type_name: "",
      StartDate: "",
      EndDate: "",
      DataFromGrid: [],
      CreateProjectData: []
    };
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.ChangeProjectName = this.ChangeProjectName.bind(this);
    this.ChangeCustomer = this.ChangeCustomer.bind(this);
    this.ChangeProjectCode = this.ChangeProjectCode.bind(this);
    this.ChangeProjectType = this.ChangeProjectType.bind(this);
    this.ChangeCostType = this.ChangeCostType.bind(this);
    this.ChangeStartDate = this.ChangeStartDate.bind(this);
    this.ChangeEndDate = this.ChangeEndDate.bind(this);
    this.dropDownChangeEvent = this.dropDownChangeEvent.bind(this);
  }

  dropDownChangeEvent = (selectedvalue, rowIndex) => {
    this.state.rowData[rowIndex].cost_id = parseInt(selectedvalue);
  };
  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  onCellClicked(e) {
    //console.log(e, "CellClicked");
    let Data = e.data;
    this.setState({
      DataFromGrid: Data
    });
  }
  openModal = () => {
    this.setState({ showPopup: true });
  };
  closeModal = () => {
    this.setState({ showPopup: false });
  };
  componentDidMount() {
    this.getCustomerNames();
    this.getProjects();
    this.getCost();
    this.getEstimateType();
  }
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
        //  res.data.forEach(item => {
        //   this.setState({project_type_name: item.project_type_name})
        // })


      })
      .catch(err => {
        this.errorHandle(err);
      });
  }
  getCost() {
    axiosConfig
      .get("/costType", { headers: headers() })
      .then(res => {
        this.setState({ costtype: res.data });
      })
      .catch(err => {
        this.errorHandle(err);
      });
  }
  getEstimateType() {
    axiosConfig
      .get("/estimateType", { headers: headers() })
      .then(res => {
        //this.setState({ rowData: res.data });
      })
      .catch(err => {
        this.errorHandle(err);
      });
  }
  ChangeProjectName = e => {
    let Project_Name = e.target.value;
    this.setState({
      ProjectName: Project_Name
    });
  };
  ChangeCustomer = e => {
    let Customer = e.target.value;
    this.setState({
      newCustomer: Customer
    });
  };
  ChangeProjectCode = e => {
    let Project_Code = e.target.value;
    this.setState({
      ProjectCode: Project_Code
    });
  };
  ChangeProjectType = e => {
    let Project_Type = e.target.value;
    console.log("Projecttype", Project_Type);
    this.setState(
      {
        ProjectType: Project_Type
      },
      () => {
        console.log("CB", this.state.ProjectType);
      }
    );
  };
  ChangeCostType = e => {
    let Cost_Type = e.target.value;
    this.setState({
      CostType: Cost_Type
    });
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
  errorHandle = err => {
    if (err.response.status === 401) {
      this.props.history.push("/");
      window.location.reload();
    } else{
      let error = err.response.data;
      let ErrorData = JSON.stringify(error);
      if (ErrorData) {
      
        this.props.history.push("activeprojectsList");
      }
    }
  };
  submit = () => {
    this.gridApi.stopEditing();
    var project_Status = 1;
    var project_process_type = 1;
    let rowDataFrom_SelectedGrid = this.state.rowData;
    if (rowDataFrom_SelectedGrid) {
      rowDataFrom_SelectedGrid.forEach(Data => {
        Data.cost_id = parseInt(Data.cost_id);
        Data.estimate = parseInt(Data.estimate);
      });
    }
    console.log("before", this.state.ProjectType);
    const reqBody = {
      project_code: this.state.ProjectCode,
      project_name: this.state.ProjectName,
      customer_id: parseInt(this.state.customer_id),
      project_type: parseInt(this.state.project_type_id),
      project_process_type: project_process_type,
      cost_type: parseInt(this.state.cost_type_id),
      expected_start: this.state.StartDate,
      expected_end: this.state.EndDate,
      project_status: project_Status,
      estimation_details: this.state.rowData
    };
    console.log(reqBody)
    axiosConfig
      .put("/projects", reqBody, { headers: headers() })
      .then(response => {
        this.setState({ CreateProjectData: response.data });
        this.props.history.push("activeprojectsList");
      })
      .catch(err => {
        this.errorHandle(err);
      });
  };
  close = () => {
    this.props.handleClosebtn();
  };
  render() {
    console.log(this.state.costtype);
    return (
      <div className="createProjectContainer">
        <h1>Create New Project</h1>
        <Row className="justify-content-center no-gutters customBorderOuter">
          <Col xl={11} lg={11} md={12}>
            <Form>
              <Row className="no-gutters">
                <Col xl={6} lg={6} md={6}>
                  <FormGroup row>
                    <Label for="project_name" xl={4} lg={4} md={4}>
                      project Name
                    </Label>
                    <Col xl={5} lg={5} md={5}>
                      <Input
                        type="text"
                        name="project_name"
                        id="project_name"
                        placeholder="name of project"
                        onChange={this.ChangeProjectName}
                        value={this.state.ProjectName}
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup row>
                    <Label for="customer_name" xl={4} lg={4} md={4}>
                      Customer Name
                    </Label>
                    <Col xl={6} lg={6} md={6}>
                      {/* <Input
                        type="select"
                        name="customer_name"
                        id="customer_name"
                        onChange={this.ChangeCustomer}
                        value={this.state.newCustomer}
                      >
                        <option>name of customer</option>

                        {this.state.customers.map(res => {
                          return (
                            <option
                              key={res.customer_id}
                              value={res.customer_id}
                            >
                              {res.customer_name}
                            </option>
                          );
                        })} */}
                      <Autocomplete className="bg-white" style={{ height: '40px' }}
                        id="customername"
                        options={this.state.customers}
                        getOptionLabel={data => data.customer_name ? data.customer_name : this.state.newCustomer}
                        value={this.state.newCustomer}
                        onChange={(e, value) => {
                          console.log(value)
                          this.setState({
                            customer_id: value.customer_id,
                            newCustomer: value.customer_name
                          })
                        }}
                        renderInput={params => (
                          <TextField
                            style={{ height: '40px' }}
                            {...params}
                            label=""
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="no-gutters">
                <Col xl={6} lg={6} md={6}>
                  <FormGroup row>
                    <Label for="" xl={4} lg={4} md={4}>
                      Project Type
                    </Label>
                    <Col xl={6} lg={6} md={6}>
                      {/* <Input
                        type="select"
                        name=""
                        id="exampleSelect"
                        onChange={this.ChangeProjectType}
                        value={this.state.ProjectType}
                      >
                        <option>Type Of Project</option>
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

                      <Autocomplete className="bg-white" style={{ height: '40px' }}
                        id="projecttype"
                        options={this.state.projects}
                        getOptionLabel={data => data.project_type_name ? data.project_type_name : this.state.project_type_name}
                        value={this.state.project_type_name}
                        onChange={(e, value) => {
                          this.setState({ project_type_id: value.project_type_id })
                          this.setState({ project_type_name: value.project_type_name })
                        }}
                        renderInput={params => (
                          <TextField
                            style={{ height: '40px' }}
                            {...params}
                            label=""
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />

                    </Col>
                  </FormGroup>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <FormGroup row>
                    <Label for="exampleEmail" xl={4} lg={4} md={4}>
                      Project Code
                    </Label>
                    <Col xl={5} lg={5} md={5}>
                      <Input
                        type="email"
                        name="email"
                        id="exampleEmail"
                        onChange={this.ChangeProjectCode}
                        value={this.state.ProjectCode}
                        placeholder="Enter project code"
                      />
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="no-gutters">
                <Col xl={6} lg={6} md={6}>
                  <FormGroup row>
                    <Label for="exampleEmail" xl={4} lg={4} md={4}>
                      Billing Type
                    </Label>
                    <Col xl={6} lg={6} md={6}>
                      {/* <Input
                        type="select"
                        name="select"
                        id="exampleSelect"
                        onChange={this.ChangeCostType}
                        value={this.CostType}
                      >
                        <option>Type Of Cost</option>
                        {this.state.costtype.map(res => {
                          return (
                            <option
                              key={res.cost_type_id}
                              value={res.cost_type_id}
                            >
                              {res.cost_type_name}
                            </option>
                          );
                        })}
                      </Input> */}

                      <Autocomplete className="bg-white" style={{ height: '40px' }}
                        id="Billingtype"
                        options={this.state.costtype}
                        getOptionLabel={data => data.cost_type_name ? data.cost_type_name : this.state.cost_type_name}
                        onChange={(e, value) => {
                          this.setState({ cost_type_id: value.cost_type_id })
                          this.setState({ cost_type_name: value.cost_type_name })
                        }}
                        renderInput={params => (
                          <TextField
                            style={{ height: '40px' }}
                            {...params}
                            label=""
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Col>
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

                    <Col xl={10} lg={10} md={10} className="text-left">
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
                          btnClass={"customVioletBtn mt-2"}
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
              <div>
                <div>
                  <Button
                    variant="success"
                    className="mr-3"
                    onClick={() => this.submit()}
                  >
                    Submit
                  </Button>
                  <Button variant="success" onClick={() => this.close()}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Form>
          </Col>
        </Row>
        {this.state.showPopup ? (
          <EstModal
            showPopup={this.state.showPopup}
            title={this.state.title}
            handleCloseBtn={this.closeModal}
          ></EstModal>
        ) : null}
      </div>
    );
  }
}

export default CreateNwProject;
