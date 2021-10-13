import React, { useEffect } from "react";
import "../Style/aplicant.scss";
import ikanoNextArrow from "../../../assets/Images/inspect/IKANO/Admin/Login/Group 5/hdpi/Arrow_white_ik1_rollup.png";
import sucessTick from "../../../assets/Images/Check_red_circle.png";
import Header from "../../header/header";
import { useTranslation } from "react-i18next";
import AudioPlayer from "../applicant-home/AudioPlayer";
import { useHistory } from "react-router-dom";
import i18nc from "../../../locate/i18n";
export default function SubmitMessage() {
  const { t } = useTranslation();
  const history: any = useHistory();
  useEffect(() => {
    let a: any = localStorage.getItem("submit");
    if (a) i18nc.changeLanguage(a);
  }, [localStorage.getItem("submit")]);
  const backToHome = () => {
    // window.location.href = "https://ikanoindustry.mx/reclutamiento.php";
    history.push(
      `/availablepositions/${
        localStorage.getItem("i18nextLng") ||
        localStorage.getItem("joblang") ||
        localStorage.getItem("submit")
      }`
    );
  };
  return (
    <React.Fragment>
      <Header />
      <div className="container mt-4">
        <div className="card p-3">
          <div className="col-md-10 m-auto">
            <div className="col-md-12">
              <div className="col-md-4 m-auto">
                <img src={sucessTick} alt="" className=" w-100 mt-5" />
              </div>
              <h3 className="submitmessageHeading text-center mt-5  mb-4">
                {t(
                  "You have successfully submitted your information, thank you!"
                )}
              </h3>
              <p className="applicantHeadingInfo mb-2 ">
                {t(
                  "Great, you have made the first step to become a member of Ikano Industry!"
                )}
              </p>
              {/* <p className="applicantHeadingInfo mb-5">
                {t(
                  "You have successfully submitted your information, thank you!"
                )}
              </p> */}
              <div
                className="applicantHeadingInfo mb-5"
                style={{ position: "relative", left: "28px", top: "30px" }}
              >
                <AudioPlayer />
              </div>
            </div>
            <div className="col-md-4 m-auto">
              <button
                type="submit"
                className="form-btn bg-red mb-2 my-3 backtohome"
                onClick={backToHome}
              >
                <span>
                  <img
                    src={ikanoNextArrow}
                    alt=""
                    className="submitArrow-modals-left-submit my-auto"
                  />
                </span>
                {t("Back to Home")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
