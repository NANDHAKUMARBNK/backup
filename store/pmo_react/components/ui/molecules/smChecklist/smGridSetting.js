import "bootstrap/dist/js/bootstrap.js";
import DatepickerAgGrid from "../../../../common/datepickerAgGrid";
const SmGridSetting = (props) => {
  return [
    {
      headerName: "Scrum Master Checklist",
      field: "project_checklist_title",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: true,
      width: 400,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: true,
      checkboxSelection: true,
      width: 400,
    },
    {
      headerName: "Date Completed",
      field: "checklist_date_completed",
      sortable: true,
      filter: "agTextColumnFilter",
      width: 400,
      editable: true,
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
      width: 400,
    },
  ];
};
export default SmGridSetting;
