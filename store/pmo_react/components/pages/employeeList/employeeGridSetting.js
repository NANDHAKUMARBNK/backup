import Moment from "moment";
const EmployeeGridSetting = () => {
  return [
    {
      headerName: "Employee ID",
      field: "emp_id",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Employee Name",
      field: "employee_name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Employee DOJ",
      field: "employee_doj",
      sortable: true,
      filter: "agNumberColumnFilter",
      cellRenderer: function(params) {
        return Moment(params.value).format("DD-MM-YYYY");
      }
    },
    {
      headerName: "Employee Last Date",
      field: "employee_lastdate",
      sortable: true,
      filter: "agNumberColumnFilter",
      cellRenderer: function(params) {
        if (
          params.data.employee_lastdate === null ||
          params.data.employee_lastdate === "Invalid date" ||
          params.data.employee_lastdate === "" ||
          params.data.employee_lastdate === "0000-00-00"
        ) {
          return "<span> - </span>";
        } else {
          return Moment(params.value).format("DD-MM-YYYY");
        }
      }
    },
    {
      headerName: "edit",
      feild: "edit",
      cellStyle: { cursor: "pointer" },
      maxWidth: 50,
      cellRenderer: function(params) {
        return `<i class="fas fa-edit" ></i>`;
      }
    }
  ];
};
export default EmployeeGridSetting;
