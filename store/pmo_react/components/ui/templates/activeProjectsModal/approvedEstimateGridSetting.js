import CellRendererFrameworkEstimate from "./cellRendererFrameworkEstimate";
const ApprovedEstimateGridSetting = (props) => {
  return [
    {
      headerName: "Cost Head",
      field: "project_estimate_type",
      sortable: true,
      filter: "agTextColumnFilter",
      cellRendererFramework: CellRendererFrameworkEstimate,
      editable: true,
      cellRendererParams: {
        updateDropdown: props,
      },
    },
    {
      headerName: "Hours",
      field: "project_estimate_hours",
      sortable: true,
      editable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Delete",
      field: "delete",
      cellClass: "",
      filter: "agTextColumnFilter",
      cellRenderer: function (params) {
        return `<i class="fas fa-trash"></i>`;
      },
    },
  ];
};
export default ApprovedEstimateGridSetting;
