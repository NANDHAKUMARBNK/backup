import Moment from "moment";
const resourceGridSettings = () => {
  return [
    {
      headerName: "",
      field: "check",
      checkboxSelection: true,
      maxWidth: 50
    },
    {
      headerName: "Execution Period",
      field: "pa_period",
      maxWidth: 130,
      sortable: true,
      cellRenderer: function(params) {
        return Moment(params.value).format("DD-MM-YYYY");
      },
      filter: "agNumberColumnFilter"
    },
    {
      headerName: "Employee Name",
      field: "employee_name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Project Name",
      field: "project_name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Allocated Hours",
      field: "allocated_hours",
      sortable: true,
      maxWidth: 150,
      filter: "agNumberColumnFilter"
    },
    {
      headerName: "Utilized Hours",
      field: "utilized_hours",
      sortable: true,
      maxWidth: 150,
      filter: "agNumberColumnFilter"
    },
    {
      headerName: "Recongized Hours",
      field: "recognized_hours",
      sortable: true,
      maxWidth: 150,
      filter: "agNumberColumnFilter"
    },
    {
      headerName: "edit",
      field: "utilized_hours",
      maxWidth: 50,
      cellStyle: { cursor: "pointer" },
      cellRenderer: function(params) {
        return `<i class="fas fa-edit" ></i>`;
      }
    },
    {
      headerName: "delete",
      field: "recognized_hours",
      maxWidth: 50,
      cellStyle: { cursor: "pointer" },
      cellRenderer: function(params) {
        return `<i class="fas fa-trash"></i>`;
      }
    }
  ];
};
export default resourceGridSettings;
