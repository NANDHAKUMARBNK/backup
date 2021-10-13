import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import EmployeeCustomSelectBox from "../Shared/EmployeCustomSelect";

class AllocationOfHours extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "People",
          field: "employee_id",
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
          sortable: true,
          editable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Allocation Hours",
          field: "allocated_hours",
          sortable: true,
          editable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Available Hours",
          field: "available_hours",
          sortable: true,
          editable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Committed Hours",
          field: "committed_hours",
          sortable: true,
          editable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Expended Hours",
          field: "expended_hours",
          sortable: true,
          editable: true,
          filter: "agTextColumnFilter"
        },
        {
          headerName: "Remaining Hours",
          field: "remaining_hours",
          sortable: true,
          editable: true,
          filter: "agTextColumnFilter"
        }
      ],
      rowData: [],
      rowHeight: 45,
      CapacityAlloc_Arr: [],
      eId: "",
      eName: "",
      Capacity_Type: "",
      Allocated_Hours: "",
      Available_Hours: "",
      Commited_Hours: "",
      Exp_Hours: ""
    };
    this.dropDownChangeEvent = this.dropDownChangeEvent.bind(this);
  }
  componentDidMount() {
    this.DataFromEditSprintViewDetails();
  }
  dropDownChangeEvent = (selectedvalue, rowIndex) => {
    this.state.rowData[rowIndex].emp_id = parseInt(selectedvalue);
  };
  DataFromEditSprintViewDetails() {
    let SprintTowards_AllocationOfHours = this.props.SprintDetails;
    if (SprintTowards_AllocationOfHours) {
      let CapacityAllocation_Arr =
        SprintTowards_AllocationOfHours.sprint_capacity_allocation;
      if (CapacityAllocation_Arr) {
        // CapacityAllocation_Arr.forEach(ele => {
        //   let Emp_Id = ele.employee_id;
        //   if (Emp_Id) {
        //     this.setState({
        //       eID: Emp_Id
        //     });
        //   }
        //   let Emp_Name = ele.employee_name;
        //   if (Emp_Name) {
        //     this.setState({
        //       eName: Emp_Name
        //     });
        //   }
        //   let CapacityType = ele.project_capacity_type_name;
        //   if (CapacityType) {
        //     this.setState({
        //       Capacity_Type: CapacityType
        //     });
        //   }
        //   let Allocated_Hrs = ele.allocated_hours;
        //   if (Allocated_Hrs) {
        //     this.setState({
        //       Allocated_Hours: Allocated_Hrs
        //     });
        //   }
        //   let Available_Hrs = ele.available_hours;
        //   if (Available_Hrs) {
        //     this.setState({
        //       Available_Hours: Available_Hrs
        //     });
        //   }
        //   let Commited_Hrs = ele.committed_hours;
        //   if (Commited_Hrs) {
        //     this.setState({
        //       Commited_Hours: Commited_Hrs
        //     });
        //   }
        //   let Exp_Hrs = ele.expended_hours;
        //   if (Exp_Hrs) {
        //     this.setState({
        //       Exp_Hours: Exp_Hrs
        //     });
        //   }
        // });
        this.setState({
          CapacityAlloc_Arr: CapacityAllocation_Arr
        });
        this.setState({
          rowData: CapacityAllocation_Arr
        });
      }
    }
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
          suppressRowClickSelection={true}
          onCellClicked={this.onCellClicked.bind(this)}
          onRowSelected={this.onRowSelected.bind(this)}
        ></AgGridReact>
      </section>
    );
  }
}

export default AllocationOfHours;
