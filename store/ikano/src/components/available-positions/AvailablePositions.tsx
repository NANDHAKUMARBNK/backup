import React, { useState, useEffect } from "react";
import ikanoLogo from "../../assets/Images/inspect/IKANO/Admin/Login/hdpi/Ikano-Industry.png";
import { availablePositionsAPI } from "../Services/ApplicantServices/MotivationFactorsGraph";
import { useHistory, useParams } from "react-router-dom";
import i18nc from "./../../locate/i18n";
import { useTranslation } from "react-i18next";
import { getLangugaesApi } from "../Services/languageServices/languageServices";
function AvailablePositions() {
  const [Positions, setPositions]: any = useState([]);
  const history: any = useHistory();
  const a: any = useParams();
  const { t } = useTranslation();
  useEffect(() => {
    AvailableJobPositions();
    getDictionary();
  }, []);
  useEffect(() => {
    AvailableJobPositions();
    getDictionary();
  }, [localStorage.getItem("i18nextLng")]);
  const AvailableJobPositions = async () => {
    const response: any = await availablePositionsAPI();
    if (response && response.data) {
      let lang: any = localStorage.getItem("i18nextLng");
      setPositions(
        response.data.map((item: any) => {
          return {
            JobId: item.id ? item.id : null,
            JobPosition:
              lang === "en"
                ? item.jobTitle
                : item.jobTitleSpanish
                ? item.jobTitleSpanish
                : "Not Mentioned",
            isJobActive: item.status ? item.status : false,
            JobCategory: item.jobType ? item.jobType : "Not Mentioned",
          };
        })
      );
    }
  };
  async function getDictionary() {
    const response: any = await getLangugaesApi();
    if (response && response.data && response.data.languages) {
      const english: any = {
        translations: response.data.languages.en,
      };
      const spanish: any = {
        translations: response.data.languages.es,
      };
      // i18n.init({
      //   resources: {
      //     en: English,
      //     mx: Spanish,
      //   },
      // });
      localStorage.setItem("English", JSON.stringify(english));
      localStorage.setItem("Mexico", JSON.stringify(spanish));
      localizedHtml();
    }
  }
  const localizedHtml = () => {
    console.log(a, "deyyyy");
    if (a.lang) {
      localStorage.setItem("joblang", a.lang);
      i18nc.changeLanguage(a.lang);
    }
  };

  return (
    <>
      {/* <div className="header">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <img className="navbar-brand ml-5" src={ikanoLogo} alt="" />
          <div className="collapse navbar-collapse"></div>
        </nav>
      </div> */}
      {Positions && Positions.length ? (
        <div className="row availablePositionsPage">
          <div className="col-md-6">
            {/* <p
              style={{
                height: "30px",
                color: " #4A4946",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Available Positions
            </p>
            <p
              style={{
                color: " #4A4946",
                fontSize: "16px",
              }}
            >
              We are currently looking for talent and experiance to collaborate in
              the following areas:
            </p> */}
            <ul>
              {Positions &&
                Positions.length > 0 &&
                Positions.map((item: any) => {
                  return (
                    <>
                      {item.isJobActive === true && (
                        <li
                          style={{
                            color: " #4A4946",
                            fontSize: "16px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const path: any = "applicant-home";
                            if (item.JobCategory === "Floor operator") {
                              const link = document.createElement("a");
                              link.href = `/${path}/floor-operator/${item.JobId}`;
                              link.target = "_parent";
                              document.body.appendChild(link);
                              link.click();
                              // history.push(
                              //   `/${path}/floor-operator/${item.JobId}`
                              // );
                            } else {
                              const link = document.createElement("a");
                              link.href = `/${path}/manager/${item.JobId}`;
                              link.target = "_parent";
                              document.body.appendChild(link);
                              link.click();
                              //history.push(`/${path}/manager/${item.JobId}`);
                            }
                          }}
                        >
                          {t(item.JobPosition)}
                        </li>
                      )}
                    </>
                  );
                })}
            </ul>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default AvailablePositions;
