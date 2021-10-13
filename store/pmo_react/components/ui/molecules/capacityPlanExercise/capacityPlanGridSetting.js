import CellRendererFrameworkCapacityPlanEmployee from "./cellRendererFrameworkCapacityPlanEmployee";
import CellRendererFrameworkCapacityPlanEstimate from "./cellRendererFrameworkCapacityPlanEstimate";
const CapacityPlanGridSetting = (props) => {
  return [
    {
      headerName: "People",
      field: "emp_id",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: true,
      cellRendererFramework: CellRendererFrameworkCapacityPlanEmployee,
      cellRendererParams: {
        updateDropdown: props,
      },
    },
    {
      headerName: "Allocation Type",
      field: "project_capacity_type_id",
      editable: true,
      sortable: true,
      filter: "agTextColumnFilter",
      cellRendererFramework: CellRendererFrameworkCapacityPlanEstimate,
      cellRendererParams: {
        updateDropdown: props,
      },
    },
    {
      headerName: "Allocation",
      field: "project_capacity_hours",
      sortable: true,
      editable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Calculated Hours",
      field: "project_capacity_hours",
      sortable: true,
      editable: true,
      filter: "agTextColumnFilter",
    },
  ];
};
export default CapacityPlanGridSetting;
