import React from "react";
import "../../styles/adminViewButton.scss";
import { useHistory } from "react-router-dom";
import ikanoViewNextArrow from "../../../assets/Images/arrow.png";
import { useTranslation } from "react-i18next";
function AdminJobPositionsViewButton(props: any) {
  const { data }: any = props;
  const history = useHistory();
  const { t } = useTranslation();
  const viewClickHandler = () => {
    if (data.jobTitle) {
      history.push("admin/jobposition", { data });
    } else {
      props.clicked({
        isFlag: true,
        candidateInfo: data,
      });
    }
  };
  return (
    <>
      <button type="button" onClick={viewClickHandler} className="primary-btn">
        <span>{t("View")}</span>
        <img src={ikanoViewNextArrow} alt="" />
      </button>
    </>
  );
}

export default AdminJobPositionsViewButton;
