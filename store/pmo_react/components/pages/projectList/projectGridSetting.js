const ProjectGridSetting = () => {
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
      filter: "agNumberColumnFilter"
    },
    {
      headerName: "Customer Name",
      field: "customer_name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Project Type",
      field: "project_type_Name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Project Process",
      field: "project_process_name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Cost Type",
      field: "cost_type_Name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Project Status",
      field: "project_status_name",
      sortable: true,
      filter: "agTextColumnFilter"
    }
  ];
};
export default ProjectGridSetting;
