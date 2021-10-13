import React, { useState, useEffect } from "react";
import "../../styles/AdminViewCandidateModal.scss";
import {
  getCandidateDetailsFromSpecificJobPositionAPI,
  updateCandidateApplicationStatusAPI,
  downloadCVAPI,
} from "../../Services/AdminServices/AllCandidateDetailsFromSpecificJobPosition";
import DownloadIcon from "../../../assets/Images/inspect/IKANO/Admin/View candidate details/Group 9/hdpi/Download_white.png";
import QualitiesAndScore from "../Grids/CustomizeGrids/QualitiesAndScore";
import LeadershipWords from "../Grids/CustomizeGrids/LeadershipWords";
import MotivationalFactor from "../Graph/MotivationalFactor";
import moment from "moment";
import CloseButton from "../../../assets/Images/close.png";
import { useTranslation } from "react-i18next";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";

function AdminViewCandidateModal(props: any) {
  const { candidateInfo, appStatusChanged, JobType }: any = props;
  const { t } = useTranslation();
  const [numberOfIteration, setNumberOfIteration]: any = useState(0);
  const [onlyCare, setOnlyCare]: any = useState([]);
  const [onlyInspire, setOnlyInspire]: any = useState([]);
  const [onlyDrive, setOnlyDrive]: any = useState([]);
  const [onlyDeliver, setOnlyDeliver]: any = useState([]);
  const [ApplicationStatus, setApplicationStatus]: any = useState(
    appStatusChanged ? appStatusChanged : candidateInfo.candidateStatus
  );
  const APPLICATION_STATUS_LOOKUP: any = [
    {
      statusId: 1,
      statusName: "Accepted",
    },
    {
      statusId: 2,
      statusName: "Rejected",
    },
    {
      statusId: 3,
      statusName: "Pending",
    },
  ];
  const [Personal, setPersonal]: any = useState([]);
  const [Experiance, setExperiance]: any = useState([]);
  const [Education, setEducation]: any = useState([]);
  const [Skill, setSkill]: any = useState([]);
  const [Qualities, setQualities]: any = useState([]);
  const [Motivational, setMotivationalFactor]: any = useState([]);
  const [downloadCV, setDownloadCV]: any = useState("");
  const [IkanoValues, setIkanoValues]: any = useState([]);
  useEffect(() => {
    candidateDetails();
  }, [candidateInfo.candidateId]);

  const handleChangeApplicationStatus = (e: any) => {
    setApplicationStatus(e.target.value);
  };
  const candidateDetails = async () => {
    const ID: any = candidateInfo.candidateId;
    const response: any = await getCandidateDetailsFromSpecificJobPositionAPI(
      ID
    );
    if (response) {
      const Candidate_PersonalInfo: any = [];
      const Candidate_HistoryOfEmployeement: any = [];
      const Candidate_HistoryOfEducation: any = [];
      const Candidate_SkillSet: any = [];
      const Candidate_IKANO_values: any = [];
      const Candidate_Score_Grid: any = [];
      const Candidate_Motivational_Factor: any = [];
      const item: any = response.data;
      let onlyCareLength: any = 0;
      let onlyInspireLength: any = 0;
      let onlyDriveLength: any = 0;
      let onlyDeliverLength: any = 0;
      setDownloadCV(
        item.personalInformation.cvFilePath
          ? item.personalInformation.cvFilePath
          : ""
      );
      setApplicationStatus(item.personalInformation.applicationStatus);
      // Personal Info
      Candidate_PersonalInfo.push({
        Id: item.personalInformation.id,
        FilePath: item.personalInformation.cvFilePath
          ? item.personalInformation.cvFilePath
          : t("Not Mentioned"),
        ApplicationStatus: item.personalInformation.applicationStatus
          ? item.personalInformation.applicationStatus
          : ApplicationStatus,
        Firstname: item.personalInformation.firstName
          ? item.personalInformation.firstName
          : t("Not Mentioned"),
        Lastname: item.personalInformation.lastName
          ? item.personalInformation.lastName
          : t("Not Mentioned"),
        Email: item.personalInformation.email
          ? item.personalInformation.email
          : t("Not Mentioned"),
        DOB: item.personalInformation.dateOfBirth
          ? moment(item.personalInformation.dateOfBirth).format("DD-MM-YYYY")
          : t("Not Mentioned"),
        Gender: item.personalInformation.gender
          ? item.personalInformation.gender
          : t("Not Mentioned"),
        MaritalStatus: item.personalInformation.maritalStatus
          ? item.personalInformation.maritalStatus
          : t("Not Mentioned"),
        PhoneNumber: item.personalInformation.phoneNumber
          ? item.personalInformation.phoneNumber
          : t("Not Mentioned"),
        MobileNumber: item.personalInformation.mobileNumber
          ? item.personalInformation.mobileNumber
          : t("Not Mentioned"),
        Address: `${
          item.personalInformation.address.houseNumber
            ? item.personalInformation.address.houseNumber
            : t("Not Mentioned")
        },
                  ${
                    item.personalInformation.address.streetName
                      ? item.personalInformation.address.streetName
                      : t("Not Mentioned")
                  },
                  ${
                    item.personalInformation.address.locality1
                      ? item.personalInformation.address.locality1
                      : t("Not Mentioned")
                  },
                  ${
                    item.personalInformation.address.locality2
                      ? item.personalInformation.address.locality2
                      : t("Not Mentioned")
                  },
                  ${
                    item.personalInformation.address.postalCode
                      ? item.personalInformation.address.postalCode
                      : t("Not Mentioned")
                  }`,
      });
      // Employeement History
      item.employmentHistories.map((element: any) => {
        Candidate_HistoryOfEmployeement.push({
          CompanyName: element.organisationName
            ? element.organisationName
            : t("Not Mentioned"),
          WebURL: element.websiteURL ? element.websiteURL : t("Not Mentioned"),
          TimePeriod: `${
            element.startDate
              ? moment(element.startDate).format("YYYY MMMM")
              : t("Not Mentioned")
          }-${
            element.endDate
              ? moment(element.endDate).format("YYYY MMMM")
              : "Present"
          }`,
          Location: element.location ? element.location : t("Not Mentioned"),
          Details: element.details ? element.details : t("Not Mentioned"),
          Position: element.position ? element.position : t("Not Mentioned"),
        });
      });
      // Education History
      item.educationHistories.map((element: any) => {
        Candidate_HistoryOfEducation.push({
          EducationType: element.educationType
            ? element.educationType
            : t("Not Mentioned"),
          SchoolName: element.institutionName
            ? element.institutionName
            : t("Not Mentioned"),
          Location: element.location ? element.location : t("Not Mentioned"),
          Subject: element.subject ? element.subject : t("Not Mentioned"),
          Qualification: element.qualificationName
            ? element.qualificationName
            : t("Not Mentioned"),
          TimePeriod: `${
            element.startDate
              ? moment(element.startDate).format("YYYY MMMM")
              : t("Not Mentioned")
          }-${
            element.endDate
              ? moment(element.endDate).format("YYYY MMMM")
              : "Present"
          }`,
          Title: element.educationType
            ? element.educationType
            : t("Not Mentioned"),

          Details: element.details ? element.details : t("Not Mentioned"),
        });
      });
      // Skills
      item.skills.map((element: any) => {
        Candidate_SkillSet.push({
          SkillId: element.id ? element.id : t("Not Mentioned"),
          SkillName: element.skillName ? element.skillName : t("Not Mentioned"),
        });
      });
      // Ikano Values
      item.ikanoValues.map((element: any) => {
        Candidate_IKANO_values.push({
          ikanoId: element.id ? element.id : t("Not Mentioned"),
          ikanoType: element.value ? element.value : t("Not Mentioned"),
          ikanoValueId: element.ikanoValueOptions
            ? element.ikanoValueOptions[0].id
            : t("Not Mentioned"),
          ikanoValue: element.ikanoValueOptions
            ? element.ikanoValueOptions[0].options
            : t("Not Mentioned"),
          ikanoIcon: element.iconUrl ? element.iconUrl : t("Not Mentioned"),
        });
      });
      // Grid
      item.qualityScores.map((element: any) => {
        Candidate_Score_Grid.push({
          Id: element.id ? element.id : t("Not Mentioned"),
          Quality: element.quality ? element.quality : t("Not Mentioned"),
          Score: element.score ? element.score : t("Not Mentioned"),
        });
      });
      // Leadership Words
      item.leadershipHeaders.map((it: any) => {
        if (it.header === "Care") {
          let leadershipWords: any;
          leadershipWords = Object.values(
            it.leadershipWords.reduce((r: any, o: any) => {
              r[o.id] = o;
              return r;
            }, {})
          );
          onlyCareLength =
            leadershipWords && leadershipWords.length > 0
              ? leadershipWords.length
              : 0;
          setOnlyCare(leadershipWords);
        }
      });
      item.leadershipHeaders.map((it2: any) => {
        if (it2.header === "Inspire") {
          let leadershipWords: any;
          leadershipWords = Object.values(
            it2.leadershipWords.reduce((r: any, o: any) => {
              r[o.id] = o;
              return r;
            }, {})
          );
          onlyInspireLength =
            leadershipWords && leadershipWords.length > 0
              ? leadershipWords.length
              : 0;
          setOnlyInspire(leadershipWords);
        }
      });
      item.leadershipHeaders.map((it3: any) => {
        if (it3.header === "Drive") {
          let leadershipWords: any;
          leadershipWords = Object.values(
            it3.leadershipWords.reduce((r: any, o: any) => {
              r[o.id] = o;
              return r;
            }, {})
          );
          onlyDriveLength =
            leadershipWords && leadershipWords.length > 0
              ? leadershipWords.length
              : 0;
          setOnlyDrive(leadershipWords);
        }
      });
      item.leadershipHeaders.map((it4: any) => {
        if (it4.header === "Deliver") {
          let leadershipWords: any;
          leadershipWords = Object.values(
            it4.leadershipWords.reduce((r: any, o: any) => {
              r[o.id] = o;
              return r;
            }, {})
          );
          onlyDeliverLength =
            leadershipWords && leadershipWords.length > 0
              ? leadershipWords.length
              : 0;
          setOnlyDeliver(leadershipWords);
        }
      });
      const overallLength: any = [
        onlyCareLength,
        onlyInspireLength,
        onlyDriveLength,
        onlyDeliverLength,
      ];
      let max = overallLength[0];
      let maxIndex = 0;
      for (let i = 1; i < overallLength.length; i++) {
        if (overallLength[i] > max) {
          maxIndex = i;
          max = overallLength[i];
        }
      }
      // Motivational Factor
      item.motivationFactors.map((item_: any) => {
        Candidate_Motivational_Factor.push({
          Id: item_.id ? item_.id : t("Not Mentioned"),
          Title: item_.factorHeader ? item_.factorHeader : t("Not Mentioned"),
          Description_Manager: item_.managerDesc
            ? item_.managerDesc
            : t("Not Mentioned"),
          Description_FloorOperator: item_.operatorDesc
            ? item_.operatorDesc
            : t("Not Mentioned"),
          Average: item_.factorValue ? item_.factorValue : 0,
        });
      });
      setPersonal(Candidate_PersonalInfo);
      setExperiance(Candidate_HistoryOfEmployeement);
      setEducation(Candidate_HistoryOfEducation);
      setSkill(Candidate_SkillSet);
      setNumberOfIteration(overallLength[maxIndex]);
      setMotivationalFactor(Candidate_Motivational_Factor);
      setQualities(Candidate_Score_Grid);
      setIkanoValues(Candidate_IKANO_values);
    }
  };
  const CandidateDownloadCV = async () => {
    const CV: any = downloadCV;
    if (CV) {
      const response: any = await downloadCVAPI(CV);
      if (response && response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.setAttribute("download", CV.substring(37)); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    } else {
      alert("No File Found");
    }
  };
  const update = async () => {
    if (ApplicationStatus) {
      const candidate_id: any = candidateInfo.candidateId;
      const status: any = ApplicationStatus;
      const response: any = await updateCandidateApplicationStatusAPI(
        candidate_id,
        status
      );
      if (response && response.data) {
        props.closeModal();
        props.candidateDetailsAPI();
      }
    }
  };

  const exportPDFWithMethod = () => {
    let element: any = document.getElementById('pdf-doc');
    savePDF(element, {
      paperSize: "auto",
      margin: 40,
      fileName: `${Personal && Personal.length && (Personal[0].Firstname + (Personal[0].Lastname || '')) || 'Ikea-applicant'} ${new Date().getFullYear()}`
    });
  };


  return (
    <>
      <div className="model">
        <div className="container mt-4">
          <div className="card p-3 dialogBox">
            <div className="aplicantHome_Heading w-100">
              <div className="row">
                <div className="col-lg-5 col-md-5 col-sm-5 ">
                  <h3 className="heading">{t("Candidate Details")}</h3>
                </div>
                <div className="col-md-3 text-right">
                  <p className="appstatus">{t("Application Status")}</p>
                </div>
                <div className="col-md-3 col-sm-3 text-right">
                  <div className="wrap-select-arrow">
                    <select
                      value={ApplicationStatus}
                      onChange={handleChangeApplicationStatus}
                    >
                      {APPLICATION_STATUS_LOOKUP.map((item: any) => (
                        <option
                          key={item.statusId}
                          value={item.statusName}
                          className="selectOption"
                        >
                          {t(item.statusName)}
                        </option>
                      ))}
                    </select>
                    <div className="select-arrow">
                      <div className="arrow-up"></div>
                    </div>
                  </div>
                </div>
                <div className="col-md-1">
                  <button className="closeButton" onClick={update}>
                    <img src={CloseButton} alt="" />
                  </button>
                </div>
              </div>
            </div>
            <div  id="pdf-doc">

            <p className="personalInfo my-3">{t("Personal Information")}</p>
            <div className="row  mt-2">
              {Personal.map((item: any) => (
                <>
                  <div className="col-md-6">
                    <div className="value">
                      <p className="head">{t("First name")}</p>
                      <p className="foot">{t(item.Firstname)}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="value">
                      <p className="head">{t("Last name")}</p>
                      <p className="foot">{t(item.Lastname)}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="value">
                      <p className="head">{t("Email")}</p>
                      <p className="foot">{t(item.Email)}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="value">
                      <p className="head">{t("Date of birth")}</p>
                      <p className="foot">{t(item.DOB)}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="value">
                      <p className="head">{t("Gender")}</p>
                      <p className="foot">{t(item.Gender)}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="value">
                      <p className="head">{t("Marital Status")}</p>
                      <p className="foot">{t(item.MaritalStatus)}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="value">
                      <p className="head">{t("Phone Number(Mobile)")}</p>
                      <p className="foot">{t(item.MobileNumber)}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="value">
                      <p className="head">{t("Phone Number(Home)")}</p>
                      <p className="foot">{t(item.PhoneNumber)}</p>
                    </div>
                  </div>
                  <div className="col-md-12 col-sm-12 mt-2">
                    <div className="value">
                      <p className="head">{t("Address")}</p>
                      <p className="foot">{t(item.Address)}</p>
                    </div>
                  </div>
                </>
              ))}
              {JobType !== t("Floor operator") && (
                <>
                  {/* Employeement History */}
                  <div className="col-md-12 col-sm-12">
                    <p className="personalInfo my-3">
                      {t("Employment History")}
                    </p>
                    {Experiance.map((item: any) => (
                      <>
                        <div className="rectangle-1 row mx-1">
                          <p
                            className="col-md-12 col-sm-12"
                            style={{
                              padding: "0px",
                              marginBottom: "28px",
                              textTransform: "capitalize",
                            }}
                          >
                            {t(item.Position)}
                          </p>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="value">
                                <p className="head">
                                  {t("Company/Organization")}
                                </p>
                                <p className="foot">{t(item.CompanyName)}</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="value">
                                <p className="head">{t("Website URL")}</p>
                                <p className="foot">{t(item.WebURL)}</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="value">
                                <p className="head">
                                  {t("Period of employment")}
                                </p>
                                <p className="foot">{t(item.TimePeriod)}</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="value">
                                <p className="head">{t("Location")}</p>
                                <p className="foot">{t(item.Location)}</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="value">
                                <p className="head">{t("Details")}</p>
                                <p className="foot">{t(item.Details)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                  {/* Education History */}
                  <div className="col-md-12 col-sm-12">
                    <p className="personalInfo my-3">
                      {t("Education History")}
                    </p>
                    {Education.map((item: any) => (
                      <>
                        <div className="rectangle-1 row mx-1">
                          <p
                            className="col-md-12 col-sm-12"
                            style={{
                              padding: "0px",
                              marginBottom: "28px",
                              textTransform: "capitalize",
                            }}
                          >
                            {t(item.Title)}
                          </p>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="value">
                                <p className="head">{t("Education Level")}</p>
                                <p className="foot">{t(item.EducationType)}</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="value">
                                <p className="head">
                                  {t("Name of School/University")}
                                </p>
                                <p className="foot">{t(item.SchoolName)}</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="value">
                                <p className="head">{t("Location")}</p>
                                <p className="foot">{t(item.Location)}</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="value">
                                <p className="head">{t("Subject of study")}</p>
                                <p className="foot">{t(item.Subject)}</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="value">
                                <p className="head">{t("Date of study")}</p>
                                <p className="foot">{t(item.TimePeriod)}</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="value">
                                <p className="head">{t("Education Area")}</p>
                                <p className="foot">{t(item.Qualification)}</p>
                              </div>
                            </div>
                            {/* <div className="col-md-6">
                              <div className="value">
                                <p className="head">{t("Title")}</p>
                                <p className="foot">{t(item.Title)}</p>
                              </div>
                            </div> */}
                            <div className="col-md-6">
                              <div className="value">
                                <p className="head">{t("Details")}</p>
                                <p className="foot">{t(item.Details)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                  {/* Skills */}
                  <div
                    className="col-md-12 col-sm-12"
                    style={{ padding: "0px" }}
                  >
                    <p className="personalInfo my-3 mx-3">{t("Skills")}</p>
                  </div>
                  {Skill.map((item: any) => (
                    <div className="col-md-6 mt-3">
                      <div className="card skillCard">
                        <div className="card-body">{t(item.SkillName)}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {/* IKANO Values */}
              <div className="col-md-12 col-sm-12">
                <p className="personalInfo my-3">{t("Ikano Values")}</p>
              </div>
              <div className="col-md-12 mt-3">
                {IkanoValues &&
                  IkanoValues.length > 0 &&
                  IkanoValues.map((item: any) => {
                    return (
                      <>
                        <div className="row ikanovalue mx-2">
                          <div className="col-md-1">
                            <img src={item ? item.ikanoIcon : ""} alt="" />
                          </div>
                          <div className="col-md-11">
                            <p>{item ? t(item.ikanoValue) : ""}</p>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
              <div className="col-md-12 col-sm-12 my-5 mx-3">
                <div className="row">
                  <div className="col-md-6 col-sm-6 pl-0">
                    <QualitiesAndScore
                      QualityScoreGrid={Qualities}
                      Total={candidateInfo ? candidateInfo.candidateScore : 0}
                    />
                  </div>
                </div>
              </div>
              {JobType !== t("Floor operator") && (
                <>
                  {/* Leadership Words */}
                  <div className="col-md-12 col-sm-12">
                    <p className="personalInfo my-3">{t("Leadership Words")}</p>
                  </div>
                  <div className="col-md-12 col-sm-12">
                    <div className="row">
                      <div className="col-md-6 col-sm-6">
                        <LeadershipWords
                          iterationsCount={numberOfIteration}
                          Care={onlyCare}
                          Inspire={onlyInspire}
                          Drive={onlyDrive}
                          Deliver={onlyDeliver}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* Motivational Factor */}
              <div className="col-md-12 col-sm-12 my-3">
                <p className="personalInfo my-3">{t("Motivation Factors")}</p>
              </div>
              <div
                className="col-md-12 col-sm-12 mx-3"
                style={{ borderBottom: "1px solid #CDC8BE" }}
              >
                <div className="row">
                  <div className="col-md-12 col-sm-12 my-5">
                    <MotivationalFactor Factors={Motivational} />
                  </div>
                </div>
              </div>
              {/*  */}
            </div>
          </div>
          <div className="col-md-12 m-auto mt-4 my-5">
                <div className="downloadCVButton">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={CandidateDownloadCV}
                  >
                    {t("Download CV")}
                    <img src={DownloadIcon} alt="" />
                  </button>

                  <button
                    type="submit"
                    className="ml-3 btn btn-primary"
                    onClick={exportPDFWithMethod}
                  >
                    {t("Print Candidate Details")}
                  </button>
                </div>
          </div>
              </div>
          
        </div>
      </div>
    </>
  );
}

export default AdminViewCandidateModal;
