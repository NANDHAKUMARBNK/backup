import React from "react";
import Atoms from "../../ui/atoms";
import Templates from "../../ui/templates";

const DashBoard = (props) => {
  return (
    <Atoms.Section>
      <Templates.DashboardTemplate
        authorizedUserData={props.location.state.authUserData}
      >
        <Atoms.HeaderText content="Welcome To PMO Utilization Metrics" />
      </Templates.DashboardTemplate>
    </Atoms.Section>
  );
};

export default DashBoard;
