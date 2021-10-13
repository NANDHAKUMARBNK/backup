import React, { useState, useEffect } from "react";
import Atoms from "../../atoms";
import TtGridSetting from "./ttGridSetting";
import "bootstrap/dist/js/bootstrap.js";
import { updateSprintCheckListAPI } from "../../../../services/sprintViewService";
import toastr from "toastr";
const TechnicalTeamChecklist = (props) => {
  let [rowData, setRowData] = useState("");
  let [gridApi, setGridApi] = useState("");
  // let [gridColumnApi, setGridColumnApi] = useState("");
  let [reqRowData, setReqRowData] = useState("");
  let updateDate = (valueFromCellRenderAllocationHours, rowIndex) => {
    if (valueFromCellRenderAllocationHours) {
      let dataSprint = props.SprintInformation;
      if (dataSprint) {
        let In_CompleteData = dataSprint.sprint_checklist_incomplete;
        let CompleteData = dataSprint.sprint_checklist_completed;
        let mergedArr = [...In_CompleteData, ...CompleteData];
        let TechnicalTeam_Arr = mergedArr.filter(
          (item) => item.project_role_name === "Technical Lead"
        );
        TechnicalTeam_Arr[
          rowIndex
        ].checklist_date_completed = valueFromCellRenderAllocationHours;
        setRowData(TechnicalTeam_Arr);
      }
    }
  };
  const columnDefsTt = TtGridSetting(updateDate);
  useEffect(() => {
    retrieveTechnicalTeamListInfoAboutSprintDetails();
  }, []);
  const retrieveTechnicalTeamListInfoAboutSprintDetails = () => {
    if (props.SprintInformation) {
      let dataSprint = props.SprintInformation;
      if (dataSprint) {
        let In_CompleteData = dataSprint.sprint_checklist_incomplete;
        let CompleteData = dataSprint.sprint_checklist_completed;
        let mergedArr = [...In_CompleteData, ...CompleteData];
        let TechnicalTeam_Arr = mergedArr.filter(
          (item) => item.project_role_name === "Technical Lead"
        );
        setRowData(TechnicalTeam_Arr);
      }
    }
  };
  const gridApiReady = (params) => {
    let paramsApi = params.api;
    setGridApi(paramsApi);
    // let paramsColumnApi = params.columnApi;
    // setGridColumnApi(paramsColumnApi);
    paramsApi.getRenderedNodes().forEach(function (node) {
      if (node.data.sprint_checklist_id) {
        node.setSelected(true);
      }
    });
  };
  //   const cellClick = e => {};
  const rowSelect = (e) => {
    let selectedRows = gridApi.getSelectedRows();
    setReqRowData(selectedRows);
  };
  const onSaveTtChecklist = async () => {
    toastr.options = {
      positionClass: "toast-top-full-width",
      hideDuration: 300,
      timeOut: 3000,
    };
    gridApi.stopEditing();
    if (reqRowData) {
      reqRowData.forEach((insideSmInfo) => {
        delete insideSmInfo["project_checklist_title"];
        delete insideSmInfo["checklist_role"];
        delete insideSmInfo["project_role_name"];
        delete insideSmInfo["project_code"];
        delete insideSmInfo["sprint_id"];
      });
      // let filterRowRequestData = reqRowData.filter(
      //   (ele) => !ele.sprint_checklist_id
      // );
      const requestBody = {
        sprint_checklist_completed: reqRowData,
      };
      let sprintId = props.SprintInformation.sprint_id;
      let projectCode = props.projectInfo.project_code;
      let response = await updateSprintCheckListAPI(
        projectCode,
        sprintId,
        requestBody
      );
      if (response) {
        toastr.success(`Successfully Saved`);
        return;
      }
    }
  };
  return (
    <Atoms.Section className="agGridCommonContainer text-left mt-4">
      <Atoms.H5 content="Technical Team Checklist" />
      <Atoms.Div className="ag-theme-balham">
        <Atoms.AggridReact
          columnDefs={columnDefsTt}
          rowData={rowData}
          rowHeight="45"
          onGridReady={gridApiReady}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          //   onCellClicked={cellClick}
          onRowSelected={rowSelect}
        />
      </Atoms.Div>
      <Atoms.CustomButton buttonName="Add" className="mt-2 customVioletBtn" />
      <Atoms.CustomButton
        buttonName="Save"
        className="mt-2 ml-2 customVioletBtn"
        action={onSaveTtChecklist}
      />
    </Atoms.Section>
  );
};

export default TechnicalTeamChecklist;
