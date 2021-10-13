import React from "react";
import { AgGridReact } from "ag-grid-react";
import Moment from "moment";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import StatusSelectBox from "../Shared/StatusSelectBox";
import AddBtn from "../Shared/AddButton";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import "bootstrap/dist/js/bootstrap.js";

class ConcernIssueNotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modules: AllCommunityModules,
      columnDefs: [
        {
          headerName: "Type",
          field: "type",
          sortable: true,
          filter: "agTextColumnFilter",
          editable: true
        },
        {
          headerName: "Topic",
          field: "sprint_issue",
          sortable: true,
          filter: "agTextColumnFilter",
          editable: true,
          width: 400
        },
        {
          headerName: "Date",
          field: "issue_log_date",
          sortable: true,
          filter: "agTextColumnFilter",
          editable: true,
          cellRenderer: function(params) {
            let Value = params.value;
            if (Value === null) {
              return;
            } else {
              return Moment(Value).format("DD-MM-YYYY");
            }
          },
          cellEditor: "datePicker"
        },
        {
          headerName: "Notes",
          field: "notes",
          sortable: true,
          filter: "agTextColumnFilter",
          editable: true,
          width: 400
        },
        {
          headerName: "Status",
          field: "sprint_issue_status_name",
          sortable: true,
          filter: "agTextColumnFilter",
          editable: true,
          width: 300,
          cellRendererFramework: StatusSelectBox,
          cellRendererParams: {
            dropDownChangeEvent: this.dropDownChangeEvent
          }
        }
      ],
      components: { datePicker: this.getDatePicker },
      rowData: [],
      Obj_Sprint: "",
      rowHeight: 45
    };
    this.dropDownChangeEvent = this.dropDownChangeEvent.bind(this);
  }
  componentDidMount() {
    this.IssuesFromEditSprintView();
  }
  getDatePicker = (function() {
    function Datepicker() {}
    Datepicker.prototype.init = function(params) {
      this.eInput = document.createElement("input");
      this.eInput.type = "date";
      if (params.value) {
        this.eInput.value = Moment(params.value).format("YYYY-MM-DD");
      }
    };
    Datepicker.prototype.getGui = function() {
      return this.eInput;
    };
    Datepicker.prototype.afterGuiAttached = function() {
      this.eInput.focus();
      this.eInput.select();
    };
    Datepicker.prototype.getValue = function() {
      return this.eInput.value;
    };
    Datepicker.prototype.destroy = function() {};
    Datepicker.prototype.isPopup = function() {
      return false;
    };
    return Datepicker;
  })();
  dropDownChangeEvent = (selectedvalue, rowIndex) => {
    this.state.rowData[rowIndex].cost_id = parseInt(selectedvalue);
  };
  IssuesFromEditSprintView() {
    let Sprint_Object = this.props.SprintDetails;
    if (Sprint_Object) {
      this.setState({
        Obj_Sprint: Sprint_Object
      });
      let Issues_SprintForSprint_N = Sprint_Object.sprint_issuelist;
      if (Issues_SprintForSprint_N) {
        this.setState({
          rowData: Issues_SprintForSprint_N
        });
      }
    }
  }
  onCellClicked(e) {
    //console.log("E is coming", e);
  }
  onRowSelected(e) {
    // let Data = this.gridApi.getSelectedRows();
    // console.log("Hello Row Selected", Data);
    // console.log("Hello Row Selected e", e);
  }
  render() {
    return (
      <section
        className="ag-theme-balham"
        style={{ height: "200px", width: "100%" }}
      >
        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
          rowHeight={this.state.rowHeight}
          components={this.state.components}
          suppressRowClickSelection={true}
          onCellClicked={this.onCellClicked.bind(this)}
          onRowSelected={this.onRowSelected.bind(this)}
        ></AgGridReact>

        <AddBtn
          btnClass={"customVioletBtn mr-3"}
          iTagClassName={"fas fa-plus"}
        />
        <AddBtn btnClass={"customVioletBtn"} btnText={"Jira Story Link"} />
      </section>
    );
  }
}

export default ConcernIssueNotes;
