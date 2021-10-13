import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import Header from "../header/header";
import AdminOverallJobPositions from "./Grids/adminOverallJobPositions";
import "../styles/adminDashboard.scss";
import { getOverAllStatusCountAPI } from "../Services/AdminServices/AllJobPositions";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BlockUI from "../../common-themes/ui-blocker";
export default function AdminDashbord() {
  const [blockUi, setblockUi]: any = useState(true);
  const { t } = useTranslation();
  const history: any = useHistory();
  const [statusCount, setStatusCount]: any = useState([]);
  useEffect(() => {
    OverAllStatusCountAPI();
    if (!localStorage.getItem("Access_Token")) {
      history.push("");
      localStorage.clear();
    }
    tokenExpire();
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
  async function OverAllStatusCountAPI() {
    setblockUi(true);
    const counts: any = [];
    const response: any = await getOverAllStatusCountAPI();
    if (response) {
      setblockUi(false);
      response.data.map((item: any) => {
        counts.push({
          totalPosition: item.positions ? item.positions : 0,
          totalApplication: item.totalApplication ? item.totalApplication : 0,
          totalAccepted: item.accepted ? item.accepted : 0,
          totalRejected: item.rejected ? item.rejected : 0,
          totalPending: item.pending ? item.pending : 0,
        });
      });
      setStatusCount(counts);
    }
  }
  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="row justify-content-center text-center my-5 m-0">
          <div className="col-lg-2 col-md-2 col-sm-2">
            <div className="card">
              <div className="card-body">
                {statusCount.length > 0 && (
                  <>
                    <h3>{statusCount[0].totalPosition}</h3>
                    <p>{t("No of Positions")}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-2">
            <div className="card">
              <div className="card-body">
                {statusCount.length > 0 && (
                  <>
                    <h3>{statusCount[0].totalApplication}</h3>
                    <p>{t("Total Applications")}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-2">
            <div className="card">
              <div className="card-body">
                {statusCount.length > 0 && (
                  <>
                    <h3>{statusCount[0].totalAccepted}</h3>
                    <p>{t("Accepted")}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-2">
            <div className="card">
              <div className="card-body">
                {statusCount.length > 0 && (
                  <>
                    <h3>{statusCount[0].totalRejected}</h3>
                    <p>{t("Rejected")}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-2">
            <div className="card">
              <div className="card-body">
                {statusCount.length > 0 && (
                  <>
                    <h3>{statusCount[0].totalPending}</h3>
                    <p>{t("Pending")}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center m-0">
          <div className="col-11">
            <AdminOverallJobPositions />
          </div>
        </div>
        <br></br>
        <BlockUI loader={{ blocking: blockUi, title: t("Please wait...") }} />
      </div>
    </>
  );
}
