import React, { useState, useEffect, useContext } from "react";
import ikanoLogo from "../../assets/Images/inspect/IKANO/Admin/Login/hdpi/Ikano-Industry.png";
import "../styles/header.scss";
import { useHistory } from "react-router-dom";
import { LogoutApi } from "../Services/login/login-logout";
import { getLangugaesApi } from "../Services/languageServices/languageServices";
import i18nc from "./../../locate/i18n";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import languageEN from "../../locate/en/translate.json";
import languageMX from "../../locate/mx/translate.json";
import eng from "../../assets/Images/english.png";
import spa from "../../assets/Images/mx.png";
import BlockUI from "../../common-themes/ui-blocker";
import i18n from "i18next";
export default function Header() {
  const params: any = useParams();
  const heading: any = (params && params.aplicantType) || false;
  const { t } = useTranslation();
  const history: any = useHistory();
  const Active: any = "nav-item active";
  const Non_Active: any = "nav-item";
  const [dashboard, setDashboard]: any = useState("");
  const [manageJob, setManageJob]: any = useState("");
  const [blockUi, setblockUi]: any = useState(false);
  const {
    location: { pathname },
  }: any = useHistory();
  useEffect(() => {
    const FirstNav: any = "/admin";
    const SecondNav: any = "/admin/managejobpositions";
    const ThirdNav: any = "/admin/jobposition";
    if (pathname === FirstNav || pathname === ThirdNav) {
      setDashboard(Active);
      setManageJob(Non_Active);
    }
    if (pathname === SecondNav) {
      setDashboard(Non_Active);
      setManageJob(Active);
    }
  });
  useEffect(() => {
    getDictionary();
  }, []);
  async function getDictionary() {
    const response: any = await getLangugaesApi();
    let lang: any = localStorage.getItem("langCode");
    if (response && response.data && response.data.languages) {
      const english: any = {
        translations: response.data.languages.en,
      };
      const spanish: any = {
        translations: response.data.languages.es,
      };
      localStorage.setItem("English", JSON.stringify(english));
      localStorage.setItem("Mexico", JSON.stringify(spanish));
      i18n.init({
        resources: {
          en: english,
          es: spanish,
        },
        lng: lang ? lang : "en",
        fallbackLng: "en",
      });
      let langFromIkano: any = localStorage.getItem("joblang");
      if (langFromIkano) {
        i18nc.changeLanguage(langFromIkano);
      }
    }
  }
  async function logout() {
    const response: any = await LogoutApi();
    if (response && response.data && response.data.success) {
      localStorage.removeItem("Access_Token");
      localStorage.clear();
      history.push("");
    }
  }
  function onLanguageHandle(vl: any) {
    i18nc.changeLanguage(vl);
  }
  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <img
          className="navbar-brand ml-5"
          src={ikanoLogo}
          alt=""
          onClick={() => {
            window.location.href = "https://ikanoindustry.mx/index.html";
          }}
        />
        <div className="collapse navbar-collapse"></div>
        <span className="navbar-text" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li>
              {/* <div className="dropdown my-2 show">
                <a
                  className="dropdown-toggle"
                  role="button"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {t("Language")}
                </a>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuLink"
                  style={{ cursor: "pointer" }}
                >
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      onLanguageHandle("en");
                      setblockUi(true);
                      setTimeout(() => {
                        setblockUi(false);
                      }, 5000);
                    }}
                  >
                    <img
                      src={eng}
                      alt=""
                      style={{
                        height: "100%",
                        width: "50%",
                      }}
                    />
                  </a>
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      onLanguageHandle("es");
                      setblockUi(true);
                      setTimeout(() => {
                        setblockUi(false);
                      }, 5000);
                    }}
                  >
                    <img
                      src={spa}
                      alt=""
                      style={{
                        height: "100%",
                        width: "50%",
                      }}
                    />
                  </a>
                </div>
              </div> */}
              <img
                src={eng}
                alt=""
                style={{
                  height: heading ? "100%" : "75%",
                  width: "50%",
                  position: "relative",
                  right: heading ? "70px" : "10px",
                  top: "5px",
                }}
                onClick={() => {
                  onLanguageHandle("en");
                  localStorage.removeItem("joblang");
                  localStorage.setItem("langCode", "en");
                  setblockUi(true);
                  if (!heading) {
                    window.location.reload();
                  }
                  setTimeout(() => {
                    setblockUi(false);
                  }, 5000);
                }}
              />
              <img
                src={spa}
                alt=""
                style={{
                  height: heading ? "100%" : "75%",
                  width: "50%",
                  position: "relative",
                  left: heading ? "" : "10px",
                  right: heading ? "55px" : "",
                  top: "5px",
                }}
                onClick={() => {
                  onLanguageHandle("es");
                  localStorage.removeItem("joblang");
                  localStorage.setItem("langCode", "es");
                  setblockUi(true);
                  if (!heading) {
                    window.location.reload();
                  }
                  setTimeout(() => {
                    setblockUi(false);
                  }, 5000);
                }}
              />
            </li>
            {!heading ? (
              <li className={dashboard}>
                <a
                  className="nav-link"
                  onClick={() => {
                    history.push("/admin");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {t("Dashboard")}
                </a>
              </li>
            ) : (
              ""
            )}
            {!heading ? (
              <li className={manageJob}>
                <a
                  className="nav-link"
                  onClick={() => {
                    history.push("/admin/managejobpositions");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {t("Manage Job Positions")}
                </a>
              </li>
            ) : (
              ""
            )}
            {!heading ? (
              <li className="nav-item active">
                <a
                  className="nav-link"
                  onClick={() => logout()}
                  style={{ cursor: "pointer" }}
                >
                  {t("Logout")}
                </a>
              </li>
            ) : (
              ""
            )}
          </ul>
        </span>
      </nav>
      <BlockUI loader={{ blocking: blockUi, title: t("Please wait...") }} />
    </div>
  );
}
