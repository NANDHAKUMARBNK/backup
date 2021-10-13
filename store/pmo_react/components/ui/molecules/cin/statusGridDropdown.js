import React, { useState, useEffect } from "react";
import Atoms from "../../atoms";
import { getSprintConcernIssueStatusAPI } from "../../../../services/sprintViewService";

const StatusGridDropdown = (props) => {
  let [statusIssues, setStatusIssues] = useState("");
  let [statusSprint, setStatusFromSprint] = useState(props.value);
  useEffect(() => {
    fetchStatusIssues();
  }, []);
  const fetchStatusIssues = async () => {
    let responseFromIssueApi = await getSprintConcernIssueStatusAPI();
    if (responseFromIssueApi) {
      setStatusIssues(responseFromIssueApi);
    }
  };
  const changeStatusDropDown = (e) => {
    let inputValue = e.target.value;
    setStatusFromSprint(inputValue);
    props.updateStatusDropdown(inputValue, props.rowIndex);
  };
  return (
    <Atoms.FormInput
      as="select"
      changeValue={changeStatusDropDown}
      Value={statusSprint}
      options={statusIssues}
    />
  );
};
export default StatusGridDropdown;
