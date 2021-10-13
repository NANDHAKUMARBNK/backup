import React, { useState, useEffect } from "react";
import Atoms from "../../ui/atoms";
import Templates from "../../ui/templates";
import { getProjectDetailsAPI } from "../../../services/sprintViewService";
import Molecules from "../../ui/molecules";
const SprintView = (props) => {
  let [SprintCapacityDetailsArray, setMergeSprintCapacityDetailsArr] = useState(
    ""
  );
  let [responseSingleProject, setResponseSingleProject] = useState("");
  useEffect(() => {
    detailsAboutSingleProject();
  }, []);
  const detailsAboutSingleProject = async () => {
    let projectInformation = props.history.location.state.projectData;
    if (projectInformation) {
      let projectCode = projectInformation.project_code;
      let res = await getProjectDetailsAPI(projectCode);
      let resData = res.data;
      if (res && resData) {
        let projectData = resData;
        setResponseSingleProject(projectData);
        projectData.forEach((ele) => {
          let capacityDetails = ele.sprint_capacity_details;
          let details = ele.sprint_details;
          let mergeSprintCapacityDetailsArray = details.map((item, index) =>
            Object.assign({}, item, capacityDetails[index])
          );
          if (mergeSprintCapacityDetailsArray) {
            setMergeSprintCapacityDetailsArr(mergeSprintCapacityDetailsArray);
          }
        });
      }
    }
  };

  return (
    <Atoms.Section>
      <Templates.DashboardTemplate>
        <Templates.SprintHeader
          Data={props.history.location.state.projectData}
        ></Templates.SprintHeader>
        <Atoms.Div className="customDividerLine" />
        {SprintCapacityDetailsArray ? (
          <Templates.SprintCard
            Data={props.history.location.state.projectData}
            capacityDetailsArray={SprintCapacityDetailsArray}
            listOfSprintCards={detailsAboutSingleProject}
          />
        ) : null}
        <Molecules.AddSprint
          Data={props.history.location.state.projectData}
          responseProjectInfo={responseSingleProject}
          listOfSprintCards={detailsAboutSingleProject}
        />
      </Templates.DashboardTemplate>
    </Atoms.Section>
  );
};
export default SprintView;
