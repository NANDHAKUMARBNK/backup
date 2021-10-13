const AllocationGridSetting = () => {
  return [
    {
      headerName: "Year",
      field: "name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
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
      headerName: "Skill Name",
      field: "skill_name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "Allocated",
      field: "allocated",
      sortable: true,
      filter: "agNumberColumnFilter"
    },
    {
      headerName: "Available",
      field: "available",
      sortable: true,
      filter: "agNumberColumnFilter"
    }
  ];
};
export default AllocationGridSetting;
