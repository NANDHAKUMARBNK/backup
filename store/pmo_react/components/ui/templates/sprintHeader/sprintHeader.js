import React from "react";
import Atoms from "../../atoms";
import Molecules from "../../molecules";

const SprintHeader = props => {
  const projectName = props.Data.project_name;
  const projectCode = props.Data.project_code;
  return (
    <Atoms.Section className="SprintHeaderContainer mt-5 mb-4">
      <Atoms.CustomRow className="mt-3 SprintHeaderOuter">
        <Atoms.CustomCol>
          <Molecules.HeaderCard
            paraContent="Project Name"
            h5ContentSecondary={projectName}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol>
          <Molecules.HeaderCard
            paraContent="Project Code"
            h5ContentSecondary={projectCode}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol>
          <Molecules.HeaderCard
            h5classPrimary="customTxtOrangeYellow"
            paraContent="Story Points Claimed"
            h5ContentSecondary="26%"
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol>
          <Molecules.HeaderCard
            h5classPrimary="customTxtBlue"
            paraContent="Efforts Consumed"
            h5ContentSecondary="56%"
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol>
          <Molecules.HeaderCard
            h5classPrimary="text-danger text-uppercase"
            paraContent="Calculated RAG Status"
            h5ContentSecondary="At Risk"
          />
        </Atoms.CustomCol>
      </Atoms.CustomRow>
    </Atoms.Section>
  );
};

export default SprintHeader;
