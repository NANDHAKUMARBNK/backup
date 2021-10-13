import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Header from "../header/header";
import ManageJobPositions from "../admin-dashboard/Grids/manageJobPositions";
import { useHistory } from "react-router-dom";
import JobPosition from "./GridModals/JobPosition";
import plus from "../../assets/Images/plus.png";
import { getAllManageJobPositionsAPI } from "../Services/AdminServices/AllJobPositions";
import BlockUI from "../../common-themes/ui-blocker";
import { useTranslation } from "react-i18next";
function AdminManageJobPositions() {
  const [blockUi, setblockUi]: any = useState(true);
  const [openAdd, setOpenAdd]: any = useState(false);
  const [openEdit, setOpenEdit]: any = useState(false);
  const [editJobInfo, setEditJobInfo]: any = useState({});
  const [gridData, setGridData]: any = useState([]);
  const { t } = useTranslation();
  const history: any = useHistory();
  useEffect(() => {
    if (!localStorage.getItem("Access_Token")) {
      history.push("");
      localStorage.clear();
    }
    tokenExpire();
  });
  useEffect(() => {
    JobPositionsAvailability();
  }, []);
  function tokenExpire() {
    const token: any = localStorage.getItem("Access_Token");
    if (token) {
      const decodedToken: any = jwt_decode(token);
      const currentDate = new Date();
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        history.push("");
        localStorage.clear();
      }
    } else {
      history.push("");
    }
  }
  const JobPositionsAvailability = async () => {
    let lang: any = localStorage.getItem("i18nextLng");
    setblockUi(true);
    const AvailableJobPositions: any = [];
    const response: any = await getAllManageJobPositionsAPI();
    if (response) {
      setblockUi(false);
      response.data.map((item: any) => {
        AvailableJobPositions.push({
          Id: item.id ? item.id : t("Not Mentioned"),
          JobName:
            lang === "en"
              ? item.jobTitle
              : item.jobTitleSpanish
              ? item.jobTitleSpanish
              : t("Not Mentioned"),
          Availability: item.availableCount
            ? item.availableCount
            : t("Not Mentioned"),
          Type: item.jobType ? item.jobType : t("Not Mentioned"),
          Description:
            lang === "en"
              ? item.jobDescription
              : item.jobDescriptionSpanish
              ? item.jobDescriptionSpanish
              : t("Not Mentioned"),
          isJobActive: item.status ? item.status : false,
        });
      });
      if (AvailableJobPositions) {
        setGridData(AvailableJobPositions);
        return AvailableJobPositions;
      }
    }
    return AvailableJobPositions;
  };
  const closeAddJobPositionModal = () => {
    setOpenAdd(false);
    setOpenEdit(false);
  };
  const editJobTrigger = () => setOpenEdit(true);
  return (
    <>
      <Header />
      <div className="row justify-content-center my-4 m-0">
        <div className="col-11">
          <div className="adminManageJobPosition">
            <div className="adminManageJobPosition__title">
              <div className="col-6 text-left pl-0">
                <p>{t("Manage Job Positions")}</p>
              </div>
              <div className="col-6 text-right mx-3">
                <button
                  className="addNewJobBtn"
                  onClick={() => setOpenAdd(true)}
                >
                  {t("Add New Job")}
                  <img src={plus} alt="" />
                </button>
              </div>
            </div>
            <hr className="adminManageJobPosition__hr my-1"></hr>
            <br></br>
            <ManageJobPositions
              isOpenEditJob={editJobTrigger}
              collectJobInfo={setEditJobInfo}
              gridInfo={gridData}
              gridInfoAPI={JobPositionsAvailability}
            />
          </div>
          {openAdd && (
            <JobPosition
              close={closeAddJobPositionModal}
              gridInfoAPI={JobPositionsAvailability}
            />
          )}
          {openEdit && (
            <JobPosition
              close={closeAddJobPositionModal}
              JobInfo={editJobInfo}
              gridInfoAPI={JobPositionsAvailability}
            />
          )}
        </div>
      </div>
      <BlockUI loader={{ blocking: blockUi, title: t("Please wait...") }} />
    </>
  );
}

export default AdminManageJobPositions;
