import React from "react";
import Atoms from "../../atoms";
import { createSprintAPI } from "../../../../services/sprintViewService";
const AddSprint = (props) => {
  const createSprint = async () => {
    let projectData = props.Data;
    let code_Project = props.Data.project_code;
    if (projectData) {
      const requestInfo = {
        sprint_name: null,
        sprint_start_date: null,
        sprint_end_date: null,
      };
      let response = await createSprintAPI(code_Project, requestInfo);
      if (response) {
        props.listOfSprintCards();
        return;
      }
    }
  };
  return (
    <Atoms.CustomRow className="mt-5 justify-content-center mb-4">
      <Atoms.CustomCol xl={3} lg={3} md={3} className="createSprintSection">
        <Atoms.H4 content="Create Sprint" />
        <Atoms.Div className="createSprintInnerCircle" onClick={createSprint}>
          <i className="fas fa-plus" id="tooltip"></i>
        </Atoms.Div>
      </Atoms.CustomCol>
    </Atoms.CustomRow>
  );
};

export default AddSprint;
