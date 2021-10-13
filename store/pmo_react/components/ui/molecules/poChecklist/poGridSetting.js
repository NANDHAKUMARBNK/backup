import DatepickerAgGrid from "../../../../common/datepickerAgGrid";
import "bootstrap/dist/js/bootstrap.js";
const PoGridSetting = (props) => {
  return [
    {
      headerName: "Product Owner Checklist",
      field: "project_checklist_title",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: true,
      width: 400,
    },
    {
      headerName: "Status",
      field: "check",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: true,
      checkboxSelection: true,
      width: 200,
    },
    {
      headerName: "Date Completed",
      field: "checklist_date_completed",
      sortable: true,
      editable: true,
      width: 200,
      cellRendererFramework: DatepickerAgGrid,
      cellRendererParams: {
        updateDate: props,
      },
    },
    {
      headerName: "Notes",
      field: "checklist_notes",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: true,
      width: 300,
    },
  ];
};
export default PoGridSetting;
