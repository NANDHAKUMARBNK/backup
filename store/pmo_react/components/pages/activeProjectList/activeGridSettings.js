const ActiveGridSettings = () => {
    return [
    {
      headerName: "Project Code",
      field: "project_code",
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
      headerName: "Project Start",
      field: "customer_name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Project End",
      field: "project_type_Name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Total Sprints",
      field: "project_process_name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Current Sprints",
      field: "cost_type_Name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Project Status Name",
      field: "project_status_name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "edit",
      //field: "utilized_hours",
      maxWidth: 50,
      cellStyle: { cursor: "pointer" },
      cellRenderer: function(params) {
        return `<i class="fas fa-edit" ></i>`;
      }
    }
  ]}

export default ActiveGridSettings;