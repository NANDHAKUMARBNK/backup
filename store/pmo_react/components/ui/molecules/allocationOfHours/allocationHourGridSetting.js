import CellRendererFrameworkAllocationHours from "./cellRendererFrameworkAllocationHours";
import CellRendererFrameworkEstimateHours from "./cellRendererFrameworkEstimateHours";
const AllocationHourGridSettings = (props) => {
  return [
    {
      headerName: "People",
      field: "employee_id",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: true,
      cellRendererFramework: CellRendererFrameworkAllocationHours,
      cellRendererParams: {
        updateDropdown: props,
      },
    },
    {
      headerName: "Allocation Type",
      field: "capacity_allocation_type_id",
      sortable: true,
      editable: true,
      filter: "agTextColumnFilter",
      cellRendererFramework: CellRendererFrameworkEstimateHours,
      cellRendererParams: {
        updateDropdown: props,
      },
    },
    {
      headerName: "Allocation Hours",
      field: "allocated_hours",
      sortable: true,
      editable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Available Hours",
      field: "available_hours",
      sortable: true,
      editable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Committed Hours",
      field: "committed_hours",
      sortable: true,
      editable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Expended Hours",
      field: "expended_hours",
      sortable: true,
      editable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Remaining Hours",
      field: "remaining_hours",
      sortable: true,
      editable: true,
      filter: "agTextColumnFilter",
    },
  ];
};

export default AllocationHourGridSettings;
