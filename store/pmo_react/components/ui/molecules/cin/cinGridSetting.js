import "bootstrap/dist/js/bootstrap.js";
import StatusGridDropdown from "./statusGridDropdown";
import DatepickerAgGrid from "../../../../common/datepickerAgGrid";
const CinGridSetting = (props) => {
  return [
    {
      headerName: "Type",
      field: "type",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: true,
    },
    {
      headerName: "Topic",
      field: "sprint_issue",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: true,
      width: 400,
    },
    {
      headerName: "Date",
      field: "issue_log_date",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: true,
      cellRendererFramework: DatepickerAgGrid,
      cellRendererParams: {
        updateDate: props,
      },
    },
    {
      headerName: "Notes",
      field: "notes",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: true,
      width: 400,
    },
    {
      headerName: "Status",
      field: "sprint_issue_status",
      sortable: true,
      filter: "agTextColumnFilter",
      editable: true,
      width: 300,
      cellRendererFramework: StatusGridDropdown,
      cellRendererParams: {
        updateStatusDropdown: props,
      },
    },
  ];
};
export default CinGridSetting;
