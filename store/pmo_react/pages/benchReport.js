import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import editDelete from "./cellRenderer";
import axiosConfig from "../Config/config";
import headers from "../Config/headers";
import AddBtn from "../Shared/AddButton";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
class BenchReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "Year",
          field: "name",
          sortable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Employee ID",
          field: "EMPID",
          sortable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Employee Name",
          field: "employee_name",
          sortable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Skill Name",
          field: "skill_name",
          sortable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "EBM Allocation",
          field: "ebm_allocation",
          sortable: true,
          filter: "agNumberColumnFilter"
        }
      ],
      rowData: [],
      defaultColDef: { resizable: true },
      rowDatafilter: [],
      periodData: [],
      projectData: [],
      showPopup: false,
      passData: {},
      paginationPageSize: 14,
      frameworkComponents: {
        editDelete: editDelete
      },
      periodValue: "",
      filterRowData: [],
      filterRowTable: false,
      executionmonth_id: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  errorHandle = err => {
    if (err.response.status === 401) {
      this.props.history.push("/");
      window.location.reload();
    }
  };
  componentDidMount() {
    this.getPeriod();
  }
  autoCompleteGetOptionLabel = (option) =>  {
    var name = "";
    if (option) {
      if(this.state.periodData && this.state.periodData.length > 0) {
        var filter = this.state.periodData.filter(item => item.executionmonth_id === option.executionmonth_id);
        if(filter && filter.length > 0) {
          name = filter[0].name;
        }
      }
    }
    return name;
  }
  onGridReady = params => {
    this.gridApi = params.api;

    window.onresize = () => {
      this.gridApi.sizeColumnsToFit();
    };
  };

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

  handleChange(e, values) {
    this.setState({ executionmonth_id: values});
    const targetValue = values.executionmonth_id;
    console.log(targetValue);
    axiosConfig
      .get(`/reportBench/${targetValue}`, { headers: headers() })
      .then(response => {
        this.setState({ rowData: response.data });
        this.setState({ filterRowData: response.data });
      })
      .catch(err => {
        this.errorHandle(err);
      });
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

  render() {
    return (
      <div>
        <h1>Bench Report</h1>
        <Row className="mb-2 mt-2">
          <Col md={2}>
            {/* <select
              className="form-control"
              onChange={this.handleChange}
              id="yearOption"
              name="year"
            >
              <option> Period </option>
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
            </select> */}

            <Autocomplete
              id=""
              options={this.state.periodData}
              getOptionLabel={(data) => data.name ? data.name: this.state.executionmonth_id}
              value={this.state.executionmonth_id}
              onChange={this.handleChange}
              renderInput={params => (
                <TextField
                  className="bg-white"
                  {...params}
                  label=""
                  variant="outlined"
                  placeholder="period"
                  fullWidth
                />
              )}
            />
          </Col>
          <Col md={9}></Col>
          <Col md={1}>
            {" "}
            <AddBtn
              btnClass={"customVioletBtn"}
              click={this.onBtnExportDataAsCsv.bind(this)}
              iTagClassName={"fas fa-file-export"}
            />{" "}
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
            frameworkComponents={this.state.frameworkComponents}
            paginationPageSize={this.state.paginationPageSize}
            floatingFilter={true}
            rowData={this.state.filterRowData}
          ></AgGridReact>
        </div>
      </div>
    );
  }
}

export default BenchReport;
