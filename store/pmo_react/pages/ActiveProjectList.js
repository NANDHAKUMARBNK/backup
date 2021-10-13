import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import axiosConfig from "../Config/config";
import headers from "../Config/headers";
import UpdateActiveProjectsModal from "./UpdateActiveProjectModal";
import AddBtn from "../Shared/AddButton";

class ActiveProjList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "Project Code",
          field: "project_code",
          sortable: true,
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Project Name",
          field: "project_name",
          sortable: true,
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Project Start",
          field: "customer_name",
          sortable: true,
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Project End",
          field: "project_type_Name",
          sortable: true,
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Total Sprints",
          field: "project_process_name",
          sortable: true,
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Current Sprints",
          field: "cost_type_Name",
          sortable: true,
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Project Status Name",
          field: "project_status_name",
          sortable: true,
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Edit",
          //field: "utilized_hours",
          maxWidth: 50,
          cellStyle: { cursor: "pointer" },
          cellRenderer: function (params) {
            return `<i class="fas fa-edit" ></i>`;
          },
        },
      ],
      rowData: [],
      showPopup: false,
      passData: {},
    };

    this.createnewproject = this.createnewproject.bind(this);
  }
  componentDidMount() {
    this.ActiveListOfProjects();
  }
  errorHandle = (err) => {
    if (err.response.status === 401) {
      this.props.history.push("/");
      window.location.reload();
    }
  };
  onCellClicked(e) {
    let DataFromParticularRow = e;
    this.setState({ passData: DataFromParticularRow });
    let HeaderName = e.colDef.headerName;
    if (HeaderName === "Edit") {
      this.setState({ showPopup: true, title: "Edit" });
    } else {
      let Data = e.data;
      if (Data) {
        this.props.history.push("sprintview", { Data });
      }
    }
  }
  onRowSelected(e) {
    // console.log("e", e);
  }
  createnewproject() {
    this.props.history.push("createnewproject");
  }
  hideModalClosebtn = () => {
    this.setState({ showPopup: false });
  };
  ActiveListOfProjects() {
    axiosConfig
      .get("/activeProjects", { headers: headers() })
      .then((response) => {
        this.setState({ rowData: response.data });
      })
      .catch((err) => {
        this.errorHandle(err);
      });
  }
  render() {
    return (
      <div>
        <h1>List of Active Projects</h1>

        <Row>
          <Col xl={12} lg={12} md={12} sm={12} className="text-right">
            {/* <i
              className="fas fa-plus"
              id="tooltip"
              onClick={this.createnewproject}
            ></i> */}
            <AddBtn
              btnClass={"customVioletBtn mb-2"}
              click={this.createnewproject}
              iTagClassName={"fas fa-plus"}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div
              className="ag-theme-balham"
              style={{ height: "500px", width: "100%" }}
            >
              <AgGridReact
                columnDefs={this.state.columnDefs}
                rowData={this.state.rowData}
                suppressRowClickSelection={true}
                floatingFilter={true}
                onCellClicked={this.onCellClicked.bind(this)}
                onRowSelected={this.onRowSelected.bind(this)}
              ></AgGridReact>
            </div>
          </Col>
        </Row>

        {this.state.showPopup && this.state.title === "Edit" ? (
          <UpdateActiveProjectsModal
            showPopup={this.state.showPopup}
            title={this.state.title}
            data={this.state.passData}
            handleClosebtn={this.hideModalClosebtn}
          ></UpdateActiveProjectsModal>
        ) : null}
      </div>
    );
  }
}

export default ActiveProjList;
