import React from "react";
import Atoms from "../../ui/atoms";
import Templates from "../../ui/templates";
import Molecules from "../../ui/molecules";
import { useHistory } from "react-router-dom";
const CreateSprint = props => {
  let history = useHistory();
  return (
    <Templates.DashboardTemplate>
      <Templates.SprintHeader Data={history.location.state.projectData} />

      <Atoms.Section className="createSprintWhiteBgContainer">
        <Atoms.FormTag>
          <Templates.SecondarySprintHeader
            Data={history.location.state.projectData}
            responseData={history.location.state.responseSprintDetails}
          />

          <Atoms.Section>
            <Atoms.CustomRow>
              <Atoms.CustomCol xl={6} lg={6} md={6} className="mt-4 text-left">
                <Atoms.H5 content="Sprint Summary" />
                <Molecules.SprintSummary />
              </Atoms.CustomCol>
              <Atoms.CustomCol xl={6} lg={6} md={6} className="mt-4 text-left">
                <Atoms.H5 content="Story Point Estimation Exercise*" />
                <Molecules.StoryPointsEstimation />
              </Atoms.CustomCol>
            </Atoms.CustomRow>
          </Atoms.Section>

          <Molecules.AllocationOfHours />
          <Molecules.CapacityPlanExercise />
          <Molecules.CapacityPlanForm />
          <Molecules.ProductOwneroCheckList />
          <Molecules.ScrumMasterChecklist />
          <Molecules.TechnicalTeamChecklist />
          <Molecules.ConcernIssueNotes />
        </Atoms.FormTag>
      </Atoms.Section>
    </Templates.DashboardTemplate>
  );
};

export default CreateSprint;
