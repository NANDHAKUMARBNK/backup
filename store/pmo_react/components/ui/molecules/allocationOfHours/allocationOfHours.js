import React, { useState } from "react";
import Atoms from "../../atoms";
import AllocationHourGridSettings from "./allocationHourGridSetting";
import { updateCapacityAPI } from "../../../../services/sprintViewService";
import toastr from "toastr";
const AllocationOfHours = (props) => {
  let [rowData, setRowdata] = useState(
    props.SprintInformation.sprint_capacity_allocation
  );
  let [gridApi, setGridApi] = useState("");
  //let [gridColumnApi, setGridColumnApi] = useState("");
  let updateDropdown = (valueFromCellRenderAllocationHours, rowIndex) => {
    if (valueFromCellRenderAllocationHours) {
      let filterData = valueFromCellRenderAllocationHours.charAt(0);
      if (filterData === "E") {
        rowData[rowIndex].employee_id = valueFromCellRenderAllocationHours;
      }
      rowData[
        rowIndex
      ].capacity_allocation_type_id = valueFromCellRenderAllocationHours;
      setRowdata(rowData);
    }
  };
  const columnDefsAllocationHours = AllocationHourGridSettings(updateDropdown);
  const gridApiReady = (params) => {
    let paramsApi = params.api;
    setGridApi(paramsApi);
    // let paramsColumnApi = params.columnApi;
    // setGridColumnApi(paramsColumnApi);
  };
  const onSaveAllocation = async () => {
    toastr.options = {
      positionClass: "toast-top-full-width",
      hideDuration: 300,
      timeOut: 3000,
    };
    gridApi.stopEditing();
    if (rowData) {
      rowData.forEach((insideInfo) => {
        insideInfo.capacity_allocation_type_id = parseInt(
          insideInfo.capacity_allocation_type_id
        );
        insideInfo.allocated_hours = parseInt(insideInfo.allocated_hours);
        insideInfo.available_hours = parseInt(insideInfo.available_hours);
        insideInfo.committed_hours = parseInt(insideInfo.committed_hours);
        insideInfo.expended_hours = parseInt(insideInfo.expended_hours);
        delete insideInfo["sprint_capacity_allocation_id"];
        delete insideInfo["sprint_id"];
        delete insideInfo["employee_name"];
        delete insideInfo["project_capacity_type_name"];
      });
    }
    const request = {
      sprint_capacity_allocation: rowData,
    };
    let sprintUniqueCode = props.SprintInformation.sprint_id;
    let projectCode = props.projectInfo.project_code;
    let responseFromUpdateCapacity = await updateCapacityAPI(
      projectCode,
      sprintUniqueCode,
      request
    );
    if (responseFromUpdateCapacity) {
      toastr.success(`Successfully Saved`);
      return;
    }
  };

  return (
    <Atoms.Section className="agGridCommonContainer text-left">
      <Atoms.H5 content="Allocation Of hours" />
      <Atoms.Div className="ag-theme-balham">
        <Atoms.AggridReact
          columnDefs={columnDefsAllocationHours}
          rowData={rowData}
          rowHeight="45"
          onGridReady={gridApiReady}
        />
      </Atoms.Div>
      <Atoms.CustomButton buttonName="Add" className="mt-2 customVioletBtn" />
      <Atoms.CustomButton
        buttonName="Save"
        className="mt-2 ml-2 customVioletBtn"
        action={onSaveAllocation}
      />
    </Atoms.Section>
  );
};

export default AllocationOfHours;
