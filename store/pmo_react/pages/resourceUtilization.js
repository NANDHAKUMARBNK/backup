import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import Modal from "./AddModal";
import editDelete from "./cellRenderer";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import Moment from "moment";

import Delete from "../Shared/DeleteComponent";
import axiosConfig from "../Config/config";
import headers from "../Config/headers";
import AddBtn from "../Shared/AddButton";

class ResourceUtilization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "",
          field: "check",
          checkboxSelection: true,
          maxWidth: 50
        },
        {
          headerName: "Execution Period",
          field: "pa_period",
          maxWidth: 130,
          sortable: true,
          cellRenderer: function(params) {
            return Moment(params.value).format("DD-MM-YYYY");
          },
          filter: "agNumberColumnFilter"
        },
        {
          headerName: "Employee Name",
          field: "employee_name",
          sortable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Project Name",
          field: "project_name",
          sortable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Allocated Hours",
          field: "allocated_hours",
          sortable: true,
          maxWidth: 150,
          filter: "agNumberColumnFilter"
        },
        {
          headerName: "Utilized Hours",
          field: "utilized_hours",
          sortable: true,
          maxWidth: 150,
          filter: "agNumberColumnFilter"
        },
        {
          headerName: "Recongized Hours",
          field: "recognized_hours",
          sortable: true,
          maxWidth: 150,
          filter: "agNumberColumnFilter"
        },
        {
          headerName: "edit",
          field: "utilized_hours",
          maxWidth: 50,
          cellStyle: { cursor: "pointer" },
          cellRenderer: function(params) {
            return `<i class="fas fa-edit" ></i>`;
          }
        },
        {
          headerName: "delete",
          field: "recognized_hours",
          maxWidth: 50,
          cellStyle: { cursor: "pointer" },
          cellRenderer: function(params) {
            return `<i class="fas fa-trash"></i>`;
          }
        }
      ],
      rowData: [],
      copyData: [],
      rowDatafilter: [],
      selectedRowData: [],
      periodData: [],
      projectData: [],
      showPopup: false,
      passData: {},
      showDeclarative: false,
      paginationPageSize: 14,
      frameworkComponents: {
        editDelete: editDelete
      },
      delete: false,
      checked: true,
      periodValue: "",
      pId: [],
      filterRowData: [],
      filterRowTable: false,
      disabledupdatesettlement: false,
      cassadingPriod: "",
      cassadingYear: "",
      modules: AllCommunityModules,
      rowSelection: "multiple",
      initialData: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.clickCopyButton = this.clickCopyButton.bind(this);
  }

  errorHandle = err => {
    if (err.response.status === 401) {
      this.props.history.push("/");
      window.location.reload();
    }
  };

  async componentDidMount() {
    await this.getemplyeList();
    this.getPeriod();
    this.getProject();
  }

  async getemplyeList() {
    try {
      var response = await axiosConfig.get("/resourceUtilization", {
        headers: headers()
      });
      this.setState({ rowData: response.data });
      this.setState({ filterRowData: response.data });
    } catch (err) {
      this.errorHandle(err);
    }
  }

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

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  onCellClicked(e) {
    this.setState({ passData: e });
    if (e.colDef.headerName === "edit") {
      this.setState({ showPopup: true, title: "Edit" });
    }
    if (e.colDef.headerName === "delete") {
      this.setState({ delete: true });
      this.setState({ passData: e.data });
    }
  }
  handleChange(e, value) {
    console.log(e.target, value);
    const name = e.target.name;
    let yearDefalutValue = false;
    let projectDefalutValue = false;
    var yearValue = "";
    var projectValue = "";
    if (name === "year") {
      projectValue = document.getElementById("projectOption").value;
      yearValue = e.target.value;
      this.setState({ cassadingYear: yearValue });
    }
    if (name === "project") {
      yearValue = document.getElementById("yearOption").value;
      projectValue = e.target.value;
      this.setState({ cassadingPriod: projectValue });
    }
    yearDefalutValue = yearValue === "Period";
    projectDefalutValue = projectValue === "Project";
    let tempArray = JSON.stringify(this.state.rowData);
    let rowDatafilter = JSON.parse(tempArray);
    if (this.state.checked) {
      let slectionData = rowDatafilter;
      if(!projectDefalutValue){
        slectionData = slectionData.filter(
          item => item.project_code === projectValue
        );
      }
      if(!yearDefalutValue){
        slectionData = slectionData.filter(
          item => item.execution_period_master_id === parseInt(yearValue)
        );
      }

      this.setState({ filterRowData: slectionData });
      
    }
  }
  onRowSelected(e) {
    let Data = this.gridApi.getSelectedRows();
    if (e.node.selected && Data.length > 0) {
      this.setState({
        disabledupdatesettlement: true
      });
      this.setState({
        cassadingYear: ""
      });
      this.setState({ checked: false });
    } else {
      this.setState({
        disabledupdatesettlement: false
      });
      this.setState({ checked: true });
    }
  }
  onSelectionChanged(e) {}

  addItems() {
    this.setState({ showPopup: true, title: "Add" });
  }

  hideModal = async () => {
    await this.getemplyeList();
    let rowDatafilter = this.state.rowData;
    let yearDefalutValue = this.state.cassadingYear;
    let projectDefalutValue = this.state.cassadingPriod;
    let slectionData = rowDatafilter;
      if(yearDefalutValue){
        slectionData = slectionData.filter(
          item => item.execution_period_master_id === yearDefalutValue
        );
      }
      if(projectDefalutValue){
         slectionData = slectionData.filter(
          item => item.project_code === projectDefalutValue
        ); 
      }
      this.setState({ filterRowData: slectionData,showPopup:false,delete:false});
  };

  clickCopyButton(params) {
    var periodDataName = "";
    let Data = this.gridApi.getSelectedRows();
    if (!this.state.cassadingYear) {
      //alert(`Please Select Period value`);
    } else if (Data) {
      Data.forEach(element => {
        let tempArray = JSON.stringify(this.state.periodData);
        let PeriodData = JSON.parse(tempArray);
        PeriodData.forEach(item => {
          let pa_idPeriodData = item.executionmonth_id;
          let cascaddingYearPeriodId = this.state.cassadingYear;
          if (pa_idPeriodData === parseInt(cascaddingYearPeriodId)) {
            periodDataName = item.name;
          }
        });
        let pa_id = element.pa_id;
        //let name = element.name;
        let name = periodDataName;
        let periodIdFromDropdown = this.state.cassadingYear;
        if (periodIdFromDropdown && name && pa_id) {
          this.callingCopyButtonApi(pa_id, name, periodIdFromDropdown);
        } else {
          //alert(`OOPs Something went wrong`);
        }
      });
    } else {
      //alert(`Select Any Fields`);
    }
  }
  callingCopyButtonApi(pid, name, periodid) {
    const reqData = {
      pId: pid,
      newPeriodDate: name + "-01",
      newPeriodId: periodid
    };
    axiosConfig
      .post("/copyUtilization", reqData, { headers: headers() })
      .then(response => {
        this.setState({ copyData: response.data });
        this.getemplyeList();
        this.setState({
          cassadingYear: ""
        });
        this.setState({
          cassadingPriod: ""
        });
        this.setState({
          disabledupdatesettlement: false
        });
        // this.state.disabledupdatesettlement = false;
        this.setState({ checked: true });
      })
      .catch(err => {
        this.errorHandle(err);
      });
  }

  onBtnExportDataAsCsv() {
    let params = this.getParams();
    this.gridApi.exportDataAsCsv(params);
  }

  getParams() {
    return {
      allColumns: true
    };
  }

  getBooleanValue(checkboxSelector) {
    return document.querySelector(checkboxSelector).checked;
  }

  hideModalClosebtn = () => {
    this.setState({ showPopup: false });
    this.setState({ delete: false });
  };
  render() {
    return (
      <div>
        <h1>Resource Utilization </h1>
        <Row className="mb-2 mt-2 justify-content-between">
          <Col xl={5} lg={5} md={5}>
            <Row>
              <Col className="text-left" xl={5} lg={5} md={5}>
                <select
                  onChange={this.handleChange}
                  id="yearOption"
                  name="year"
                  className="form-control"
                  value={this.state.cassadingYear}
                >
                  <option>Period</option>

                  {this.state.periodData.map((item, index) => {
                    return (
                      <option
                        key={item.executionmonth_id}
                        value={item.executionmonth_id}
                      >
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </Col>
              <Col className="text-left" xl={5} lg={5} md={5}>
                <select
                  className="projectSelect"
                  id="projectOption"
                  onChange={this.handleChange}
                  name="project"
                  className="form-control"
                  value={this.state.cassadingPriod}
                >
                  <option>Project</option>
                  {this.state.projectData.map((item, index) => {
                    return (
                      <option key={item.project_code} value={item.project_code}>
                        {item.project_name}
                      </option>
                    );
                  })}
                </select>
              </Col>
            </Row>
          </Col>

          <Col xl={5} lg={5} md={5} className="text-right">
            <AddBtn
              btnClass={"customVioletBtn mr-3"}
              click={this.onBtnExportDataAsCsv.bind(this)}
              iTagClassName={"fas fa-file-export"}
            />
            {this.state.disabledupdatesettlement ? (
              <AddBtn
                btnClass={"customVioletBtn mr-3"}
                click={this.clickCopyButton}
                iTagClassName={"fas fa-copy"}
              />
            ) : null}
            <AddBtn
              btnClass={"customVioletBtn"}
              click={this.addItems.bind(this)}
              iTagClassName={"fas fa-plus"}
            />
          </Col>
        </Row>

        <div
          className="ag-theme-balham"
          style={{ height: "500px", width: "100%" }}
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            onGridReady={this.onGridReady}
            pagination={true}
            suppressRowClickSelection={true}
            modules={this.state.modules}
            rowSelection={this.state.rowSelection}
            frameworkComponents={this.state.frameworkComponents}
            paginationPageSize={this.state.paginationPageSize}
            onSelectionChanged={this.onSelectionChanged.bind(this)}
            onCellClicked={this.onCellClicked.bind(this)}
            onRowSelected={this.onRowSelected.bind(this)}
            floatingFilter={true}
            rowData={this.state.filterRowData}
          ></AgGridReact>
        </div>

        {this.state.showPopup && this.state.title === "Edit" ? (
          <Modal
            history={this.props.history}
            showPopup={this.state.showPopup}
            title={this.state.title}
            data={this.state.passData}
            handleClose={this.hideModal}
            handleClosebtn={this.hideModalClosebtn}
          >
            <p>Modal</p>
            <p>Data</p>
          </Modal>
        ) : null}
        {this.state.showPopup && this.state.title === "Add" ? (
          <Modal
            history={this.props.history}
            showPopup={this.state.showPopup}
            title={this.state.title}
            handleClose={this.hideModal}
            handleClosebtn={this.hideModalClosebtn}
          >
            <p>Modal</p>
            <p>Data</p>
          </Modal>
        ) : null}

        {this.state.delete ? (
          <Delete
            data={this.state.passData}
            handleClose={this.hideModal}
            handleClosebtn={this.hideModalClosebtn}
          ></Delete>
        ) : null}
      </div>
    );
  }
}

export default ResourceUtilization;
