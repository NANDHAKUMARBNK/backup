import React from "react";
import Atoms from "../../ui/atoms";
import Templates from "../../ui/templates";
import Molecules from "../../ui/molecules";
const EditSprint = props => {
  const sprintData = props.history.location.state.SprintSingle_Data;
  return (
    <Templates.DashboardTemplate>
      <Templates.SprintHeader Data={props.history.location.state.Data} />
      <Atoms.Section className="createSprintWhiteBgContainer">
        <Atoms.FormTag>
          {sprintData ? (
            <Templates.SecondarySprintHeader
              SprintInformation={sprintData}
              projectInfo={props.history.location.state.Data}
            />
          ) : null}
          {sprintData.sprint_type === 1 ? (
            <Atoms.Section>
              <Atoms.CustomRow>
                <Atoms.CustomCol
                  xl={6}
                  lg={6}
                  md={6}
                  className="mt-4 text-left"
                >
                  <Atoms.H5 content="Sprint Summary" />
                  {sprintData ? (
                    <Molecules.SprintSummary
                      SprintInformation={sprintData}
                      projectInfo={props.history.location.state.Data}
                    />
                  ) : null}
                </Atoms.CustomCol>
                <Atoms.CustomCol
                  xl={6}
                  lg={6}
                  md={6}
                  className="mt-4 text-left"
                >
                  <Atoms.H5 content="Story Point Estimation Exercise*" />
                  {sprintData.sprint_type === 1 ? (
                    <Molecules.StoryPointsEstimation
                      SprintInformation={sprintData}
                      projectInfo={props.history.location.state.Data}
                    />
                  ) : null}
                </Atoms.CustomCol>
              </Atoms.CustomRow>
            </Atoms.Section>
          ) : null}
          {sprintData.sprint_type === 2 ? (
            <Atoms.Section>
              <Atoms.CustomRow>
                <Atoms.CustomCol
                  xl={6}
                  lg={6}
                  md={6}
                  className="mt-4 text-left"
                >
                  <Atoms.H5 content="Sprint Summary" />
                  {sprintData ? (
                    <Molecules.SprintSummary
                      SprintInformation={sprintData}
                      projectInfo={props.history.location.state.Data}
                    />
                  ) : null}
                </Atoms.CustomCol>
              </Atoms.CustomRow>
            </Atoms.Section>
          ) : null}
          {sprintData ? (
            <Molecules.AllocationOfHours
              SprintInformation={sprintData}
              projectInfo={props.history.location.state.Data}
            />
          ) : null}
          {sprintData.sprint_type === 1 && sprintData ? (
            <Molecules.CapacityPlanExercise
              SprintInformation={sprintData}
              projectInfo={props.history.location.state.Data}
            />
          ) : null}
          {sprintData.sprint_type === 1 && sprintData ? (
            <Molecules.CapacityPlanForm
              SprintInformation={sprintData}
              projectInfo={props.history.location.state.Data}
            />
          ) : null}
          {sprintData.sprint_type === 1 && sprintData ? (
            <Molecules.ProductOwneroCheckList
              SprintInformation={sprintData}
              projectInfo={props.history.location.state.Data}
            />
          ) : null}
          {sprintData.sprint_type === 1 && sprintData ? (
            <Molecules.ScrumMasterChecklist
              SprintInformation={sprintData}
              projectInfo={props.history.location.state.Data}
            />
          ) : null}
          {sprintData.sprint_type === 1 && sprintData ? (
            <Molecules.TechnicalTeamChecklist
              SprintInformation={sprintData}
              projectInfo={props.history.location.state.Data}
            />
          ) : null}
          {sprintData.sprint_type === 2 && sprintData ? (
            <Molecules.ConcernIssueNotes
              SprintInformation={sprintData}
              projectInfo={props.history.location.state.Data}
            />
          ) : null}
        </Atoms.FormTag>
      </Atoms.Section>
    </Templates.DashboardTemplate>
  );
};
export default EditSprint;
