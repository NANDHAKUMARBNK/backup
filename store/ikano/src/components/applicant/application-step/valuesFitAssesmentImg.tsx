import React, { forwardRef, useImperativeHandle } from "react";
import "../Style/aplicant.scss";
import group2 from "../../../assets/Images/Group2.png";
const ValueFitAssessmentImg = forwardRef((props, ref: any) => {
  useImperativeHandle(ref, () => ({
    data() {
      return true;
    },
  }));
  return (
    <React.Fragment>
      <div className="text-center p-4 piegraph">
        <img src={group2} alt="" />
      </div>
    </React.Fragment>
  );
});
export default React.memo(ValueFitAssessmentImg);
