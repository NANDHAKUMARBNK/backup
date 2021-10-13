import React, { useState, useEffect } from "react";
import Atoms from "../../atoms";
import Molecules from "../../molecules";
import Moment from "moment";
import toastr from "toastr";
import {
  getSprintStatusAPI,
  updateBasicDetailsSprintAPI,
} from "../../../../services/sprintViewService";
const SecondarySprintHeader = (props) => {
  let [sprintname, setName] = useState("");
  let [start, setStart] = useState("");
  let [end, setEnd] = useState("");
  let [status, setStatus] = useState("");
  let [issue, setIssue] = useState("");
  useEffect(() => {
    fromSprintViewCard();
    getStatusDropDown();
  }, []);
  const fromSprintViewCard = () => {
    if (props.SprintInformation) {
      const sprintName = props.SprintInformation.sprint_name;
      if (sprintName) {
        setName(sprintName);
      }
      const sprintStartDate = props.SprintInformation.sprint_start_date;
      if (sprintStartDate) {
        setStart(Moment(sprintStartDate).format("YYYY-MM-DD"));
      }
      const sprintEndDate = props.SprintInformation.sprint_end_date;
      if (sprintEndDate) {
        setEnd(Moment(sprintEndDate).format("YYYY-MM-DD"));
      }
      const sprintStatus = props.SprintInformation.sprint_status;
      if (sprintStatus) {
        setStatus(sprintStatus);
      }
    }
  };
  const getStatusDropDown = async () => {
    let response = await getSprintStatusAPI();
    if (response) {
      setIssue(response);
    }
  };

  const changeName = (e) => {
    let eventName = e.target.value;
    if (eventName) {
      setName(eventName);
    }
  };
  function changeStart(e) {
    let eventStart = e.target.value;
    if (eventStart) {
      setStart(eventStart);
    }
  }
  function changeEnd(e) {
    let eventEnd = e.target.value;
    if (eventEnd) {
      setEnd(eventEnd);
    }
  }
  function changeStatus(e) {
    let eventStatus = e.target.value;
    if (eventStatus) {
      setStatus(eventStatus);
    }
  }
  const onSave = async () => {
    toastr.options = {
      positionClass: "toast-top-full-width",
      hideDuration: 300,
      timeOut: 3000,
    };
    let nameSprint = sprintname;
    let startSprint = start;
    let endSprint = end;
    let statusSprint = status;
    const storyUrl = "jira jira jira jira jira jira";
    let sprintId = props.SprintInformation.sprint_id;
    let projectCode = props.projectInfo.project_code;
    const requestSprintInfo = {
      sprint_name: nameSprint,
      sprint_status_id: statusSprint,
      sprint_start_date: startSprint,
      sprint_end_date: endSprint,
      sprint_story_url: storyUrl,
    };
    let response = await updateBasicDetailsSprintAPI(
      projectCode,
      sprintId,
      requestSprintInfo
    );
    if (response) {
      toastr.success(`Successfully Saved`);
      return;
    }
  };
  return (
    <Atoms.Section>
      <Atoms.CustomRow>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Molecules.FormGroup
            labelName="SprintName"
            type="text"
            Value={sprintname}
            changeValue={changeName}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Molecules.FormGroup
            labelName="Sprint Start Date"
            type="date"
            Value={start}
            changeValue={changeStart}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Molecules.FormGroup
            labelName="Sprint End Date"
            type="date"
            Value={end}
            changeValue={changeEnd}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Molecules.FormGroup
            as="select"
            labelName="Sprint Status"
            type="text"
            Value={status}
            changeValue={changeStatus}
            options={issue}
          />
        </Atoms.CustomCol>
        <Atoms.CustomButton
          buttonName="Save"
          className="mt-2 customVioletBtn"
          action={onSave}
        />
      </Atoms.CustomRow>
      <Atoms.Div className="customDividerLine" />
    </Atoms.Section>
  );
};

export default SecondarySprintHeader;
