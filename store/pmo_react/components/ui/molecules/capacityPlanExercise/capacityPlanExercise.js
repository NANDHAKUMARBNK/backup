import React, { useState } from "react";
import Atoms from "../../atoms";
import CapacityPlanGridSetting from "./capacityPlanGridSetting";
import { updateProjectCapacityAPI } from "../../../../services/sprintViewService";
import toastr from "toastr";
const CapacityPlanExercise = (props) => {
  let [rowData, setRowdata] = useState(
    props.SprintInformation.project_capacity_allocation
  );
  let [gridApi, setGridApi] = useState("");
  let updateDropdown = (valueFromCellRenderAllocationHours, rowIndex) => {
    if (valueFromCellRenderAllocationHours) {
      let filterData = valueFromCellRenderAllocationHours.charAt(0);
      if (filterData === "E") {
        rowData[rowIndex].emp_id = valueFromCellRenderAllocationHours;
      }
      rowData[
        rowIndex
      ].project_capacity_type_id = valueFromCellRenderAllocationHours;
      setRowdata(rowData);
    }
  };
  const columnDefnCapacityPlan = CapacityPlanGridSetting(updateDropdown);
  const gridApiReady = (params) => {
    let paramsApi = params.api;
    setGridApi(paramsApi);
  };
  const onSaveCapacityPlanExercise = async () => {
    toastr.options = {
      positionClass: "toast-top-full-width",
      hideDuration: 300,
      timeOut: 3000,
    };
    gridApi.stopEditing();
    if (rowData) {
      rowData.forEach((insideInfo) => {
        insideInfo.project_capacity_type_id = parseInt(
          insideInfo.project_capacity_type_id
        );
        insideInfo.project_capacity_hours = parseInt(
          insideInfo.project_capacity_hours
        );
        delete insideInfo["project_capacity_planning_id"];
        delete insideInfo["employee_name"];
        delete insideInfo["project_capacity_type_name"];
      });
    }
    const request = {
      project_capacity_allocation: rowData,
    };
    let sprintUniqueCode = props.SprintInformation.sprint_id;
    let projectCode = props.projectInfo.project_code;
    let response = await updateProjectCapacityAPI(
      projectCode,
      sprintUniqueCode,
      request
    );
    if (response) {
      toastr.success(`Successfully Saved`);
      return;
    }
  };

  return (
    <Atoms.Section className="agGridCommonContainer text-left mt-4">
      <Atoms.H5 content="Capacity Planning Exercise*" />
      <Atoms.Div className="ag-theme-balham">
        <Atoms.AggridReact
          columnDefs={columnDefnCapacityPlan}
          rowData={rowData}
          rowHeight="45"
          onGridReady={gridApiReady}
        />
      </Atoms.Div>
      <Atoms.CustomButton buttonName="Add" className="mt-2 customVioletBtn" />
      <Atoms.CustomButton
        buttonName="Save"
        className="mt-2 ml-2 customVioletBtn"
        action={onSaveCapacityPlanExercise}
      />
    </Atoms.Section>
  );
};
export default CapacityPlanExercise;
