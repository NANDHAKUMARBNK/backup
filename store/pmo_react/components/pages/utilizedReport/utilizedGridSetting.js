const UtilizedGridSetting = () => {
  return [
    {
      headerName: "Skill Name",
      field: "skill_name",
      sortable: true,
      filter: "agTextColumnFilter"
    },
    {
      headerName: "EBM Allocation",
      field: "allocated",
      sortable: true,
      filter: "agNumberColumnFilter"
    },
    {
      headerName: "Present",
      field: "available",
      sortable: true,
      filter: "agNumberColumnFilter"
    }
  ];
};
export default UtilizedGridSetting;
