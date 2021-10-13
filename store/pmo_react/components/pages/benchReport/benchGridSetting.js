const BenchGridSetting = () => {
  return [
    {
      headerName: "Year",
      field: "name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Employee ID",
      field: "EMPID",
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
      headerName: "Skill Name",
      field: "skill_name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "EBM Allocation",
      field: "ebm_allocation",
      sortable: true,
      filter: "agNumberColumnFilter"
    }
  ];
};
export default BenchGridSetting;
