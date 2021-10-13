import React from "react";
import { AgGridReact } from "ag-grid-react";
import Moment from "moment";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import "bootstrap/dist/js/bootstrap.js";
class ScrumMasterCheckList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modules: AllCommunityModules,
      columnDefs: [
        {
          headerName: "Scrum Master Checklist",
          field: "project_checklist_title",
          sortable: true,
          filter: "agTextColumnFilter",
          editable: true,
          width: 400
        },
        {
          headerName: "Status",
          field: "status",
          sortable: true,
          filter: "agTextColumnFilter",
          editable: true,
          checkboxSelection: true,
          width: 400
          //cellRenderer: "selectedClient"
        },
        {
          headerName: "Date Completed",
          field: "checklist_date_completed",
          sortable: true,
          filter: "agTextColumnFilter",
          width: 400,
          editable: true,
          cellRenderer: function(params) {
            let Value = params.value;
            if (Value === null) {
              return;
            } else {
              return Moment(Value).format("YYYY-MM-DD");
            }
          },
          cellEditor: "datePicker"
        },
        {
          headerName: "Notes",
          field: "checklist_notes",
          sortable: true,
          filter: "agTextColumnFilter",
          editable: true,
          width: 400
        }
      ],
      components: {
        datePicker: this.getDatePicker,
        selectedClient: this.selectedClient
      },

      rowData: [],
      Array: [],

      rowSelection: "multiple",
      Incomplete: [],
      Completed: [],
      OneArray: [],
      GridApiColumn: {},
      Inc: false
    };
  }
  componentDidMount() {
    this.FromEditSprint();
  }
  selectedClient(params) {
    console.log(params);
    return params.data.sprint_checklist_id
      ? `<input type='checkbox' checked>`
      : `<input type='checkbox'>`;
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

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.getRenderedNodes().forEach(function(node) {
      if (node.data.sprint_checklist_id) {
        node.setSelected(true);
      }
    });
  };
  FromEditSprint() {
    let Data = this.props.SprintDetails;
    if (Data) {
      let In_CompleteData = Data.sprint_checklist_incomplete;
      let CompleteData = Data.sprint_checklist_completed;
      this.setState(
        {
          OneArray: [...CompleteData, ...In_CompleteData]
        },
        () => {
          let Merged_Two_Arr = this.state.OneArray;
          if (Merged_Two_Arr) {
            let ScrumMaster_Arr = Merged_Two_Arr.filter(
              item => item.project_role_name === "Scrum Master"
            );
            this.setState({
              rowData: ScrumMaster_Arr
            });
          }
        }
      );
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
    //console.log("Array here", this.state.rowData);
    return (
      <section
        className="ag-theme-balham"
        style={{ height: "200px", width: "100%" }}
      >
        <AgGridReact
          columnDefs={this.state.columnDefs}
          onGridReady={this.onGridReady}
          rowData={this.state.rowData}
          rowSelection={this.state.rowSelection}
          components={this.state.components}
          suppressRowClickSelection={true}
          onCellClicked={this.onCellClicked.bind(this)}
          onRowSelected={this.onRowSelected.bind(this)}
        ></AgGridReact>
      </section>
    );
  }
}

export default ScrumMasterCheckList;
