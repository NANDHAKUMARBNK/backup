import React, { useState } from "react";
import Atoms from "../../atoms";
import CinGridSetting from "./cinGridSetting";
import { updateIssueListAPI } from "../../../../services/sprintViewService";
import toastr from "toastr";
const ConcernIssueNotes = (props) => {
  let [rowData, setRowdata] = useState(
    props.SprintInformation.sprint_issuelist
  );
  let [gridApi, setGridApi] = useState("");
  let updateBoth = (valueFromCellRenderCin, rowIndex) => {
    if (valueFromCellRenderCin) {
      let sliceData = valueFromCellRenderCin.slice(0, 2);
      if (sliceData === "20") {
        rowData[rowIndex].issue_log_date = valueFromCellRenderCin;
      }
      rowData[rowIndex].sprint_issue_status = valueFromCellRenderCin;
      setRowdata(rowData);
    }
  };
  const columnDefsCin = CinGridSetting(updateBoth);
  const gridApiReady = (params) => {
    let paramsApi = params.api;
    setGridApi(paramsApi);
    // let paramsColumnApi = params.columnApi;
    // setGridColumnApi(paramsColumnApi);
  };
  const onSaveIssueList = async () => {
    toastr.options = {
      positionClass: "toast-top-full-width",
      hideDuration: 300,
      timeOut: 3000,
    };
    gridApi.stopEditing();
    if (rowData) {
      rowData.forEach((issueInfo) => {
        issueInfo.sprint_issue_status = parseInt(issueInfo.sprint_issue_status);
        delete issueInfo["sprint_id"];
        delete issueInfo["sprint_issue_status_name"];
      });
    }
    const reqBody = {
      sprint_issuelist: rowData,
    };
    let sprintCode = props.SprintInformation.sprint_id;
    let projectCode = props.projectInfo.project_code;
    let response = await updateIssueListAPI(projectCode, sprintCode, reqBody);
    if (response) {
      toastr.success(`Successfully Saved`);
      return;
    }
  };

  return (
    <Atoms.Section className="agGridCommonContainer text-left mt-4">
      <Atoms.H5 content="Concern Issues Notes" />
      <Atoms.Div className="ag-theme-balham">
        <Atoms.AggridReact
          columnDefs={columnDefsCin}
          rowData={rowData}
          rowHeight="45"
          onGridReady={gridApiReady}
        />
      </Atoms.Div>
      <Atoms.CustomButton
        buttonName="Jira Story Link"
        className="mt-2 customVioletBtn"
      />
      <Atoms.CustomButton
        buttonName="Save"
        className="mt-2 ml-2 customVioletBtn"
        action={onSaveIssueList}
      />
    </Atoms.Section>
  );
};
export default ConcernIssueNotes;
