import React from "react";
import AplicantHome from "./AplicantHome";
import ContextApi from "../ContextApi/ContextApi";

function ApplicantHomeRender() {
  return (
    <>
      <ContextApi>
        <AplicantHome />
      </ContextApi>
    </>
  );
}
export default ApplicantHomeRender;
