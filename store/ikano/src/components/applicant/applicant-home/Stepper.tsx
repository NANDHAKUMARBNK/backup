import React, { useContext } from "react";
import { Stepper, StepLabel, Step } from "@material-ui/core";
import { Context } from "../ContextApi/ContextApi";
import "../Style/aplicant.scss";

function Steps(props: any) {
  const { next }: any = useContext(Context);
  const ar = Array.from({ length: props.props }, (_, x) => x + 1);
  return (
    <div className="w-100" style={{ overflowX: "auto" }}>
      <Stepper activeStep={next - 1} style={{ textAlign: "center" }}>
        {ar &&
          ar.length &&
          ar.map((a) => {
            return (
              <Step key={a}>
                <StepLabel className="step"></StepLabel>
              </Step>
            );
          })}
      </Stepper>
    </div>
  );
}

export default Steps;
