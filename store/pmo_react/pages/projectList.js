import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import editDelete from "./cellRenderer";
import axiosConfig from "../Config/config";
import headers from "../Config/headers";

class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "Project Code",
          field: "project_code",
          sortable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Project Name",
          field: "project_name",
          sortable: true,
          filter: "agNumberColumnFilter"
        },
        {
          headerName: "Customer Name",
          field: "customer_name",
          sortable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Project Type",
          field: "project_type_Name",
          sortable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Project Process",
          field: "project_process_name",
          sortable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Cost Type",
          field: "cost_type_Name",
          sortable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Project Status",
          field: "project_status_name",
          sortable: true,
          filter: "agTextColumnFilter"
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
      filterRowTable: false
    };
  }
  errorHandle = err => {
    if (err.response.status === 401) {
      this.props.history.push("/");
      window.location.reload();
    }
  };
  componentDidMount() {
    this.getemplyeList();
  }

  getemplyeList() {
    axiosConfig
      .get("/projects", { headers: headers() })
      .then(response => {
        this.setState({ rowData: response.data });
      })
      .catch(err => {
        this.errorHandle(err);
      });
  }

  onGridReady = params => {
    this.gridApi = params.api;

    window.onresize = () => {
      this.gridApi.sizeColumnsToFit();
    };
  };

  render() {
    return (
      <div>
        <h1>Project List</h1>
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
            defaultColDef={this.state.defaultColDef}
            rowData={this.state.rowData}
          ></AgGridReact>
        </div>
      </div>
    );
  }
}

export default ProjectList;
