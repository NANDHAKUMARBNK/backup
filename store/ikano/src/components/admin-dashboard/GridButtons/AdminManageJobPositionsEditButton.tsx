import React from "react";
import "../../styles/adminEditButton.scss";
import ikanoEditNextArrow from "../../../assets/Images/inspect/IKANO/Admin/Manage Job Postions/Group 5/hdpi/Arrow_white_ik1_rollup.png";
import { getSpecificJobPositionDetails } from "../../Services/AdminServices/AllJobPositions";
import { useTranslation } from "react-i18next";
function AdminManageJobPositionsEditButton(props: any) {
  const { data }: any = props;
  const { t } = useTranslation();
  // const EditJobPositionsAPI = async (ID: any) => {
  //   const response: any = await getSpecificJobPositionDetails(ID);
  //   return response;
  // };
  const EditJobPositionsAPI = async (ID: any) => {
    return await getSpecificJobPositionDetails(ID);
  };
  return (
    <>
      <button
        type="button"
        className="primary-btn"
        style={{ background: "#f01300" }}
        onClick={async () => {
          const ID: any = data.Id;
          const response: any = await EditJobPositionsAPI(ID);
          if (response) {
            props.clickedEditButton({
              jobInfo: response.data,
            });
          }
        }}
      >
        <span style={{ color: "#fff" }}>{t("Edit")}</span>
        <img src={ikanoEditNextArrow} alt="" />
      </button>
    </>
  );
}

export default AdminManageJobPositionsEditButton;
