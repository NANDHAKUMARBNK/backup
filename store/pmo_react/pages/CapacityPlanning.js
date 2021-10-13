import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import EmployeeCustomSelectBox from "../Shared/EmployeCustomSelect";
import AddBtn from "../Shared/AddButton";

class CapacityPlanTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "People",
          field: "emp_id",
          sortable: true,
          filter: "agTextColumnFilter",
          editable: true,
          cellRendererFramework: EmployeeCustomSelectBox,
          cellRendererParams: {
            dropDownChangeEvent: this.dropDownChangeEvent,
            rowData: this.rowData
          }
        },
        {
          headerName: "Allocation Type",
          field: "project_capacity_type_name",
          editable: true,
          sortable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Allocation",
          field: "project_capacity_hours",
          sortable: true,
          editable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Calculated Hours",
          field: "project_capacity_hours",
          sortable: true,
          editable: true,
          filter: "agTextColumnFilter"
        }
      ],
      rowData: [],
      rowHeight: 45,
      Cap_Plan_Arr: [],
      Capacity_Planning_Single_Obj: {},
      TypeName: "",
      HoursCapacity: "",
      SingleObjSprint: {}
    };
    this.dropDownChangeEvent = this.dropDownChangeEvent.bind(this);
  }
  componentDidMount() {
    this.DataFromEditSprint();
  }
  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };
  onCellClicked(e) {
    console.log("E is coming", e);
    // this.setState({ passData: e });
    // if (e.colDef.headerName === "edit") {
    //   this.setState({ showPopup: true, title: "Edit" });
    // }
    // if (e.colDef.headerName === "delete") {
    //   this.setState({ delete: true });
    //   this.setState({ passData: e.data });
    // }
  }
  onRowSelected(e) {
    let Data = this.gridApi.getSelectedRows();
    console.log("Hello Row Selected", Data);
    console.log("Hello Row Selected e", e);
  }
  DataFromEditSprint() {
    let Sprint_obj = this.props.SprintDetails;
    if (Sprint_obj) {
      this.setState({
        SingleObjSprint: Sprint_obj
      });
      let Capacity_Planning_Arr = Sprint_obj.project_capacity_allocation;
      if (Capacity_Planning_Arr) {
        // Capacity_Planning_Arr.forEach(Inside_ElementData => {
        //   if (Inside_ElementData) {
        //     this.setState({
        //       Capacity_Planning_Single_Obj: Inside_ElementData
        //     });
        //     let Data_CapacityType =
        //       Inside_ElementData.project_capacity_type_name;
        //     if (Data_CapacityType) {
        //       this.setState({
        //         TypeName: Data_CapacityType
        //       });
        //     }
        //     let Data_CapacityHours = Inside_ElementData.project_capacity_hours;
        //     if (Data_CapacityHours) {
        //       this.setState({
        //         HoursCapacity: Data_CapacityHours
        //       });
        //     }
        //   }
        // });
        this.setState({
          Cap_Plan_Arr: Capacity_Planning_Arr
        });
        this.setState({
          rowData: Capacity_Planning_Arr
        });
      }
    }
  }
  dropDownChangeEvent = (selectedvalue, rowIndex) => {
    this.state.rowData[rowIndex].emp_id = parseInt(selectedvalue);
  };
  render() {
    return (
      <section
        className="ag-theme-balham"
        style={{ height: "250px", width: "100%" }}
      >
        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
          rowHeight={this.state.rowHeight}
          suppressRowClickSelection={true}
          onCellClicked={this.onCellClicked.bind(this)}
          onRowSelected={this.onRowSelected.bind(this)}
        ></AgGridReact>
        <AddBtn
          btnClass={"customVioletBtn mt-2"}
          iTagClassName={"fas fa-plus"}
        />
      </section>
    );
  }
}

export default CapacityPlanTable;
