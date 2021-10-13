import React, { forwardRef, useImperativeHandle } from "react";
import "../Style/aplicant.scss";
import { useTranslation } from "react-i18next";
const ValueFitAssessment = forwardRef((props, ref: any) => {
  useImperativeHandle(ref, () => ({
    data() {
      return true;
    },
  }));
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <div>
        <ul className="valuesFitAssessment">
          <li>{t("Our values are key to the Ikano success")}</li>
          <li>
            {t(
              "Recruiting competent people who share our values helps strengthening and sustaining our uniqueness, growth and profitability"
            )}
          </li>
          <li>
            {t(
              "We want to make sure that the people we recruit are right for Ikano,live our values everyday, and succeed in our culture"
            )}
          </li>
          <li>
            {t(
              "We want people who choose us for what we stand for, what we deliver and how we deliver it"
            )}
          </li>
          <li>
            {t(
              "This part of the Predictive Retention application will help us assess the candidate’s fit against our Ikano values, thus contributing to a more accurate hiring decision"
            )}
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
});
export default React.memo(ValueFitAssessment);
