import React, { useState, useEffect } from "react";
import "../../styles/JobPositions.scss";
import ikanoNextArrow from "../../../assets/Images/inspect/IKANO/Admin/Login/Group 5/hdpi/Arrow_white_ik1_rollup.png";
import {
  getQualificationLookUpAPI,
  getSkillsLookUpAPI,
  addJobPositionAPI,
  editJobPositionAPI,
  getJobTypeLookUpAPI,
} from "../../Services/AdminServices/AllJobPositions";
import CloseButton from "../../../assets/Images/close.png";
import { useTranslation } from "react-i18next";
import {
  isNumericValidator,
  valueEmptyCheck,
  alphaNumericValidator,
} from "../../Common/Validators/CommonValidators";
function JobPosition(props: any) {
  const { close, JobInfo, gridInfoAPI }: any = props;
  const [JobId, setJobId]: any = useState(JobInfo ? JobInfo.id : "");
  const [Title, setTitle]: any = useState(JobInfo ? JobInfo.jobTitle : "");
  const [TitleSpanish, setTitleSpanish]: any = useState(
    JobInfo ? JobInfo.jobTitleSpanish : ""
  );
  const [Type, setType]: any = useState(JobInfo ? JobInfo.jobType : "");
  const [TypeName, setTypeName]: any = useState(
    JobInfo ? JobInfo.jobTypeName : ""
  );
  const [Description, setDescription]: any = useState(
    JobInfo ? JobInfo.jobDescription : ""
  );
  const [DescriptionSpanish, setDescriptionSpanish]: any = useState(
    JobInfo ? JobInfo.jobDescriptionSpanish : ""
  );
  const [Position, setPosition]: any = useState(
    JobInfo ? JobInfo.availableCount : ""
  );
  const { t } = useTranslation();
  const [Skills, setSkills]: any = useState([]);
  const [Qualification, setQualification]: any = useState([]);
  const Flag: any = true;
  const [titleMessage, setTitleMessage]: any = useState("");
  const [titleSpanishMessage, setTitleSpanishMessage]: any = useState("");
  const [typeMessage, setTypeMessage]: any = useState("");
  const [descMessage, setDescMessage]: any = useState("");
  const [descSpanishMessage, setDescSpanishMessage]: any = useState("");
  const [positionMessage, setPositionMessage]: any = useState("");
  const [skillMessage, setSkillMessage]: any = useState("");
  const [qualificationMessage, setQualificationMessage]: any = useState("");
  const [managerLookup, setManagerLookup]: any = useState([]);
  const [floorOperatorLookup, setFloorOperatorLookup]: any = useState([]);
  useEffect(() => {
    SkillLookUp();
    QualificationLookUp();
    JobTypeLookUp();
    overall();
  }, []);
  const SkillLookUp = async () => {
    const response: any = await getSkillsLookUpAPI();
    return response.data;
  };
  const QualificationLookUp = async () => {
    const response: any = await getQualificationLookUpAPI();
    return response.data;
  };
  const JobTypeLookUp = async () => {
    const response: any = await getJobTypeLookUpAPI();
    if (response && response.data.length) {
      setManagerLookup(response.data);
    }
  };
  const overall = async () => {
    const skillAlone: any = await SkillLookUp();
    const qualificationAlone: any = await QualificationLookUp();
    let JobInfoSkill: any = [];
    let JobInfoQualification: any = [];
    if (JobInfo) {
      JobInfoSkill = JobInfo.skills;
      JobInfoQualification = JobInfo.qualifications;
    }
    const tempSkill: any = [];
    skillAlone.map((item: any) => {
      tempSkill.push({
        id: item.id,
        name: item.skillName,
        checked:
          JobInfoSkill.filter((ele: any) => ele.id === item.id).length !== 0,
        checkboxId: `Skill-${item.id}`,
      });
    });
    const tempQualification: any = [];
    qualificationAlone.map((item: any) => {
      tempQualification.push({
        id: item.id,
        name: item.qualificationName,
        checked:
          JobInfoQualification.filter((ele: any) => ele.id === item.id)
            .length !== 0,
        checkboxId: `Qualification-${item.id}`,
      });
    });
    setSkills(tempSkill);
    setQualification(tempQualification);
  };
  const submit = async () => {
    if (!JobInfo) {
      if (!valueEmptyCheck(Title)) {
        setTitleMessage(t("Job Title In English is required"));
        return;
      }
      if (!valueEmptyCheck(TitleSpanish)) {
        setTitleSpanishMessage(t("Job Title In Spanish is required"));
        return;
      }
      if (!valueEmptyCheck(Type)) {
        setTypeMessage(t("Job Type is required"));
        return;
      }
      if (!valueEmptyCheck(Description)) {
        setDescMessage(t("Job Description In English is required"));
        return;
      }
      if (!valueEmptyCheck(DescriptionSpanish)) {
        setDescSpanishMessage(t("Job Description In Spanish is required"));
        return;
      }
      if (!valueEmptyCheck(Position)) {
        setPositionMessage(t("Please fill in the field “Number of Positions”"));
        return;
      }
    }
    if (JobInfo) {
      if (!Title) {
        setTitleMessage(t("Job Title In English is required"));
        return;
      }
      if (!TitleSpanish) {
        setTitleSpanishMessage(t("Job Title In Spanish is required"));
        return;
      }
      if (!Type) {
        setTypeMessage(t("Job Type is required"));
        return;
      }
      if (!Description) {
        setDescMessage(t("Job Description In English is required"));
        return;
      }
      if (!DescriptionSpanish) {
        setDescSpanishMessage(t("Job Description In Spanish is required"));
        return;
      }
      if (!Position) {
        setPositionMessage(t("Please fill in the field “Number of Positions”"));
        return;
      }
    }
    const SelectedSkills: any = Skills.filter(
      (item: any) => item.checked === Flag
    );
    const SelectedQualification: any = Qualification.filter(
      (item: any) => item.checked === Flag
    );
    let Qualification_Payload: any = [];
    let Skills_Payload: any = [];
    if (SelectedQualification) {
      SelectedQualification.map((item: any) => {
        Qualification_Payload.push({
          Id: item.id,
          QualificationName: item.name,
        });
      });
    }
    if (SelectedSkills) {
      SelectedSkills.map((item: any) => {
        Skills_Payload.push({
          Id: item.id,
          SkillName: item.name,
        });
      });
    }
    if (Skills_Payload.length === 0) {
      setSkillMessage(t("Select Skills"));
      return;
    }
    if (Qualification_Payload.length === 0) {
      setQualificationMessage(t("Select Qualifications"));
      return;
    }
    if (!isNumericValidator(Position)) {
      setPositionMessage(t("Positions should be Number"));
    } else if (!alphaNumericValidator(Title)) {
      setTitleMessage(t("No Special characters"));
    } else {
      const Request: any = {
        JobTitle: Title,
        JobTitleSpanish: TitleSpanish,
        JobType: Type,
        JobTypeName: TypeName,
        JobDescription: Description,
        JobDescriptionSpanish: DescriptionSpanish,
        AvailableCount: parseInt(Position),
        Skills: Skills_Payload,
        Qualifications: Qualification_Payload,
      };
      if (JobId) {
        const response: any = await editJobPositionAPI(Request, JobId);
        if (response) {
          alert(t("Success"));
          gridInfoAPI();
          close();
        }
      } else {
        const response: any = await addJobPositionAPI(Request);
        if (response) {
          alert(t("Success"));
          gridInfoAPI();
          close();
        }
      }
    }
  };
  return (
    <>
      <div className="model addNewJobModel">
        <div className="container mt-4">
          <div className="card">
            <div className="aplicantHome_Heading w-100">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 ">
                  <h3 className="heading">
                    {JobInfo
                      ? t("Edit job position")
                      : t("Add new job position")}{" "}
                  </h3>
                </div>
                <div className="col-md-6 col-sm-6 text-right">
                  <button className="closeButton" onClick={() => close()}>
                    <img src={CloseButton} alt="" />
                  </button>
                </div>
              </div>
            </div>
            <form className="mt-4">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group m-b-32">
                    <input
                      type="text"
                      className="form-control aplicant_Input"
                      id="jobtitle"
                      aria-describedby="usernameHelp"
                      placeholder={`${t("Job Title In English")}*`}
                      value={Title}
                      onChange={(e: any) => {
                        setTitle(e.target.value);
                        setTitleMessage("");
                      }}
                      required
                    />
                    <strong style={{ color: "red" }}>
                      {titleMessage ? titleMessage : ""}
                    </strong>
                  </div>
                </div>
                {/* Spanish input */}
                <div className="col-md-6">
                  <div className="form-group m-b-32">
                    <input
                      type="text"
                      className="form-control aplicant_Input"
                      id="jobtitle"
                      aria-describedby="usernameHelp"
                      placeholder={`${t("Job Title In Spanish")}*`}
                      value={TitleSpanish}
                      onChange={(e: any) => {
                        setTitleSpanish(e.target.value);
                        setTitleSpanishMessage("");
                      }}
                      required
                    />
                    <strong style={{ color: "red" }}>
                      {titleSpanishMessage ? titleSpanishMessage : ""}
                    </strong>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="form-group">
                    <textarea
                      style={{ resize: "none" }}
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      rows={1}
                      placeholder={`${t("Job Description In English")}*`}
                      value={Description}
                      onChange={(e: any) => {
                        setDescription(e.target.value);
                        setDescMessage("");
                      }}
                      maxLength={250}
                      required
                    ></textarea>
                    <strong style={{ color: "red" }}>
                      {descMessage ? descMessage : ""}
                    </strong>
                  </div>
                </div>
              </div>
              {/* spanish Desc */}
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="form-group">
                    <textarea
                      style={{ resize: "none" }}
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      rows={1}
                      placeholder={`${t("Job Description In Spanish")}*`}
                      value={DescriptionSpanish}
                      onChange={(e: any) => {
                        setDescriptionSpanish(e.target.value);
                        setDescSpanishMessage("");
                      }}
                      maxLength={250}
                      required
                    ></textarea>
                    <strong style={{ color: "red" }}>
                      {descSpanishMessage ? descSpanishMessage : ""}
                    </strong>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <select
                      name="jobtype"
                      id="Manager"
                      className="form-control"
                      style={{ height: "50px" }}
                      value={TypeName}
                      disabled={JobInfo ? true : false}
                      onChange={(e: any) => {
                        setType(
                          managerLookup.find(
                            (ele: any) => ele.typeName === e.target.value
                          ).role
                        );
                        setTypeMessage("");
                        setTypeName(e.target.value);
                      }}
                    >
                      <option value="" id="">
                        {`${t("Type of Job")}*`}
                      </option>
                      {managerLookup &&
                        managerLookup.length &&
                        managerLookup.map((element: any) => (
                          <>
                            <option value={element.typeName}>
                              {t(element.typeName)}
                            </option>
                          </>
                        ))}
                    </select>
                    <strong style={{ color: "red" }}>
                      {typeMessage ? typeMessage : ""}
                    </strong>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group m-b-32">
                    <input
                      type="text"
                      className="form-control aplicant_Input"
                      id="no"
                      aria-describedby="positionHelp"
                      placeholder={`${t("Number of Positions")}*`}
                      value={Position}
                      onChange={(e: any) => {
                        setPosition(e.target.value);
                        setPositionMessage("");
                      }}
                      required
                    />
                    <strong style={{ color: "red" }}>
                      {positionMessage ? positionMessage : ""}
                    </strong>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <p style={{ fontWeight: "bold" }}>{t("Skills")}</p>
                </div>
              </div>
              <div className="row no-gutters">
                {Skills.map((itemSkill: any) => (
                  <>
                    <div className="col-md-3">
                      <input
                        className="checkboxStyle"
                        id={itemSkill.checkboxId}
                        type="checkbox"
                        value={itemSkill.id}
                        onChange={(e: any) => {
                          setSkillMessage("");
                          const checked: any = e.target.checked;
                          setSkills(
                            Skills.map((element: any) => {
                              if (itemSkill.id === element.id) {
                                element.checked = checked;
                              }
                              return element;
                            })
                          );
                        }}
                        checked={itemSkill.checked}
                      />
                      <label htmlFor={itemSkill.checkboxId}>
                        {t(itemSkill.name)}
                      </label>
                    </div>
                  </>
                ))}
              </div>
              <div className="row">
                <div className="col-md-12">
                  <strong style={{ color: "red" }}>
                    {skillMessage ? skillMessage : ""}
                  </strong>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 mt-1">
                  <p style={{ fontWeight: "bold" }}>{t("Qualifications")}</p>
                </div>
              </div>
              <div className="row no-gutters">
                {Qualification.map((itemQualification: any) => (
                  <>
                    <div className="col-md-3">
                      <input
                        className="checkboxStyle"
                        id={itemQualification.checkboxId}
                        type="checkbox"
                        value={itemQualification.id}
                        onChange={(e: any) => {
                          setQualificationMessage("");
                          const checked: any = e.target.checked;
                          setQualification(
                            Qualification.map((element: any) => {
                              if (itemQualification.id === element.id) {
                                element.checked = checked;
                              }
                              return element;
                            })
                          );
                        }}
                        checked={itemQualification.checked}
                      />
                      <label htmlFor={itemQualification.checkboxId}>
                        {" "}
                        {t(itemQualification.name)}
                      </label>
                    </div>
                  </>
                ))}
              </div>
              <div className="row">
                <div className="col-md-12">
                  <strong style={{ color: "red" }}>
                    {qualificationMessage ? qualificationMessage : ""}
                  </strong>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 jobPositionFooter">
                  <button
                    type="button"
                    className="primary-btn withBg"
                    onClick={submit}
                  >
                    <span style={{ color: "#fff" }}>{t("Submit")}</span>
                    <img src={ikanoNextArrow} alt="" className="submitArrow" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobPosition;
