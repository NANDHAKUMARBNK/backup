import React, { useState, useRef, useContext } from "react";
import { Context } from "../ContextApi/ContextApi";
import PersonalInfo from "../application-step/PersonalInfo";
import Employment from "../application-step/Employment";
import EducationiHistory from "../application-step/EducationHistory";
import Skills from "../application-step/SkillsSet";
import IkanoValues from "../application-step/IkanoValues";
import CVuploade from "../application-step/CVuploade";
import ValueFitAssessment from "../application-step/valuesFitAssessment";
// import ValueFitAssessmentImg from "../application-step/valuesFitAssesmentImg";
import LeaderShipWords from "../application-step/leadershipWords";
import Motivation from "../application-step/motivation";
import Steps from "./Stepper";
import "../Style/aplicant.scss";
import Header from "../../header/header";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BlockUI from "../../../common-themes/ui-blocker";

import {
  floorOperator,
  manager,
} from "../../../common-themes/controls-validation-and-constants";
import AudioPlayer from "./AudioPlayer";
import ikanoNextArrow from "../../../assets/Images/inspect/IKANO/Admin/Login/Group 5/hdpi/Arrow_white_ik1_rollup.png";
import ikanoBackArrow from "../../../assets/Images/Arrow_red_ik1_rollup.png";
import {
  MnagerApplicantSubmitApi,
  FloorOperatorApplicantSubmitApi,
} from "../../Services/ApplicantServices/applicant-submit";
import { CheckMonth } from "../application-step/Module/InputFuled";
import { useIdleTimer } from "react-idle-timer";
import AvailablePositions from "../../available-positions/AvailablePositions";
function AplicantHome() {
  const handleOnActive = (event: any) => {
    const a: any = getRemainingTime();
    if (a === 0) {
      window.location.reload();
    }
  };
  const { getRemainingTime } = useIdleTimer({
    timeout: 1000 * 60 * 10,
    onActive: handleOnActive,
    debounce: 500,
    crossTab: {
      type: "simulate",
      channelName: "idle-timer",
      fallbackInterval: 2000,
      responseTime: 100,
      removeTimeout: 1000 * 60,
      emitOnAllTabs: true,
    },
  });
  const [blockUi, setblockUi]: any = useState(false);
  const params: any = useParams();
  const heading: any =
    params && params.aplicantType === "floor-operator"
      ? floorOperator
      : params && params.aplicantType === "manager"
      ? manager
      : [];
  const history: any = useHistory();
  const Formik = (a: any) => {
    if (params && params.aplicantType === "floor-operator") {
      switch (a) {
        case 1:
          return <PersonalInfo ref={childRef} />;
        case 2:
          return <ValueFitAssessment ref={childRef} />;
        case 3:
          return <IkanoValues ref={childRef} />;
        case 4:
          return <Motivation ref={childRef} />;
        // case 5:
        //   return <ValueFitAssessmentImg ref={childRef} />;
        case 5:
          return <CVuploade ref={childRef} />;
      }
    } else if (params && params.aplicantType === "manager") {
      switch (a) {
        case 1:
          return <PersonalInfo ref={childRef} />;
        case 2:
          return <Employment ref={childRef} />;
        case 3:
          return <EducationiHistory ref={childRef} />;
        case 4:
          return <Skills ref={childRef} />;
        case 5:
          return <ValueFitAssessment ref={childRef} />;
        case 6:
          return <IkanoValues ref={childRef} />;
        case 7:
          return <LeaderShipWords ref={childRef} />;
        case 8:
          return <Motivation ref={childRef} />;
        // case 9:
        //   return <ValueFitAssessmentImg ref={childRef} />;
        case 9:
          return <CVuploade ref={childRef} />;
      }
    } else {
      history.push("/");
    }
  };
  checkUserTypeAndActiveComponents();
  function checkUserTypeAndActiveComponents() {
    if (params && params.aplicantType === "floor-operator") {
    } else if (params && params.aplicantType === "manager") {
    } else {
      history.push("/");
    }
  }

  const {
    next,
    nextPage,
    backPage,
    setData,
    PersonalInformation,
    EmploymeantData,
    EductionData,
    Skills_,
    UserChecked,
    words,
    FactorValue,
    filedata,
  }: any = useContext(Context);
  const payload = {};

  const childRef = useRef();
  const module = () => {
    const data: any = childRef.current;
    data.data(true);
  };

  const NextStep = () => {
    const data: any = childRef.current;
    const validation: any = data && data.data();
    if (validation && Object.values(validation)) {
      Object.assign(payload, validation);
      setData({ ...data, payload });
      nextPage(next);
    } else {
      data.data();
    }
  };
  function backToapp() {
    window.location.href =
      "https://ikanoindustry.mx/english/working-at-ikano.html";
  }
  const { t } = useTranslation();

  const SumbitApplicant = async () => {
    NextStep();
    setblockUi(true);
    const AllFormData = {
      PersonalInformation: PersonalInformation,
      EmploymeantData: EmploymeantData,
      EductionData: EductionData,
      Skills_: Skills_,
      ikonicvalue: UserChecked,
      leadershipWord: words,
      FactorValue: FactorValue,
      CVFilepath: filedata,
    };
    const data: any = AllFormData;
    if (data.Skills_ && data.Skills_.length) {
      data.Skills_ = data.Skills_.map((res: any) => {
        return { SkillId: res.id };
      });
    }
    if (data.leadershipWord && data.leadershipWord.length) {
      data.leadershipWord = data.leadershipWord.filter((res: any) => {
        if (res.isClicked) {
          return res;
        }
      });
      data.leadershipWord =
        (data.leadershipWord &&
          data.leadershipWord.length &&
          data.leadershipWord.map((res: any) => {
            if (res.isClicked) {
              return { WordId: res.id };
            }
          })) ||
        [];
    }

    if (data.FactorValue && data.FactorValue.length) {
      data.FactorValue = data.FactorValue.map((res: any) => {
        return { FactorId: res.Id, FactorValue: res.Average };
      });
    }

    if (data.ikonicvalue && data.ikonicvalue.length) {
      data.ikonicvalue = data.ikonicvalue.map((res: any) => {
        const ikValue =
          res.ikanoOptions &&
          res.ikanoOptions.length &&
          res.ikanoOptions.find((val: any) => val.isChecked);
        return {
          ValueId: res.id,
          IkanoValueOptionsRQ: [{ OptionId: ikValue ? ikValue.id : 0 }],
        };
      });
    }
    if (data.EmploymeantData && data.EmploymeantData.length) {
      data.EmploymeantData = data.EmploymeantData.map((res: any) => {
        if (res.StartDate && res.StartDate.Month) {
          res.StartDate.Month = CheckMonth[res.StartDate.Month];
        }
        if (res.EndDate && res.EndDate.Month) {
          res.EndDate.Month = CheckMonth[res.EndDate.Month];
        }
        if (res.StartDate && res.StartDate.Year) {
          res.StartDate.Year = parseInt(res.StartDate.Year);
        }
        if (res.EndDate && res.EndDate.Year) {
          res.EndDate.Year = parseInt(res.EndDate.Year);
        }
        if (res.EndDate && (!res.EndDate.Year || !res.EndDate.Month)) {
          res.EndDate = null;
        }
        return res;
      });
    }
    if (data.EductionData && data.EductionData.length) {
      data.EductionData = data.EductionData.map((res: any) => {
        if (res.StartDate && res.StartDate.Month) {
          res.StartDate.Month = CheckMonth[res.StartDate.Month];
        }
        if (res.EndDate && res.EndDate.Month) {
          res.EndDate.Month = CheckMonth[res.EndDate.Month];
        }
        if (res.StartDate && res.StartDate.Year) {
          res.StartDate.Year = parseInt(res.StartDate.Year);
        }
        if (res.EndDate && res.EndDate.Year) {
          res.EndDate.Year = parseInt(res.EndDate.Year);
        }
        if (res.QualificationId) {
          res.QualificationId = parseInt(res.QualificationId);
        }
        if (res.EndDate && (!res.EndDate.Year || !res.EndDate.Month)) {
          res.EndDate = null;
        }
        return res;
      });
    }
    let PersonalInfoDataSet: any;
    if (PersonalInformation) {
      PersonalInfoDataSet = {
        firstName: PersonalInformation.fn,
        lastname: PersonalInformation.ln,
        email: PersonalInformation.em,
        birthDate: PersonalInformation.dob
          ? new Date(PersonalInformation.dob)
          : "",
        mobileNumber: PersonalInformation.ph1,
        phoneNumber: PersonalInformation.ph2,
        gender:
          (PersonalInformation.gender &&
            PersonalInformation.gender.find((it: any) => it.isClicked) &&
            PersonalInformation.gender.find((it: any) => it.isClicked).name) ||
          "Male",
        maritalStatus:
          (PersonalInformation.maritalStatus &&
            PersonalInformation.maritalStatus.find((it: any) => it.isClicked) &&
            PersonalInformation.maritalStatus.find((it: any) => it.isClicked)
              .name) ||
          "Single",
        AddressRQ: {
          streetName: PersonalInformation.stName,
          HouseNumber: PersonalInformation.hn,
          locality2: PersonalInformation.munici2
            ? PersonalInformation.munici2
            : "",
          // province2: PersonalInformation.city,
          postalCode: PersonalInformation.zipcode,
          locality1: PersonalInformation.munici,
          // provinceAbbrevation: PersonalInformation.state,
          country: "Mexico",
        },
      };
    }
    var submitPage: any = localStorage.getItem("i18nextLng")
      ? localStorage.getItem("i18nextLng")
      : localStorage.getItem("langCode")
      ? localStorage.getItem("langCode")
      : "";
    localStorage.setItem("submit", submitPage);
    if (params && params.aplicantType === "manager") {
      const managerPayload = {
        PersonalInformationRQ: Object.assign(PersonalInfoDataSet || {}, {
          CVFilepath: AllFormData.CVFilepath || "",
          jobId: (params && params.jobId && parseInt(params.jobId)) || 12,
        }),
        EmploymentHistoryMRS: data.EmploymeantData,
        EducationHistoryMRS: data.EductionData,
        SkillsMRS: data.Skills_,
        IkanoValuesRQ: data.ikonicvalue,
        LeadershipWordsMRS: data.leadershipWord,
        MotivationFactorsRQ: data.FactorValue,
      };
      const response = await MnagerApplicantSubmitApi(managerPayload);
      if (response && response.status === 200) {
        history.push(`/submitSucess/${params.aplicantType}`);
      } else {
        alert(`${response.data.title}`);
      }
    }
    if (params && params.aplicantType === "floor-operator") {
      const floorOperatorPayload = {
        PersonalInformationRQ: Object.assign(PersonalInfoDataSet || {}, {
          CVFilepath: AllFormData.CVFilepath || "",
          jobId: (params && params.jobId && parseInt(params.jobId)) || 12,
        }),
        IkanoValuesRQ: data.ikonicvalue,
        MotivationFactorsRQ: data.FactorValue,
      };
      const response = await FloorOperatorApplicantSubmitApi(
        floorOperatorPayload
      );
      if (response && response.status === 200) {
        history.push(`/submitSucess/${params.aplicantType}`);
      } else {
        alert(`${response.data.title}`);
      }
    }
    setblockUi(false);
  };

  return (
    <div>
      {/* <Header /> */}
      <div className="container">
        <AvailablePositions />
        <section className="bg-img">
          <h2 className="application-form">{t("Application Form")}</h2>
          {/* {next === 1 || next === 2 ? <AudioPlayer /> : ""} */}
          {next ? (
            <AudioPlayer pages={next} type={params && params.aplicantType} />
          ) : (
            ""
          )}
        </section>
        <div className="card bg-white aplicantHomeCard">
          <div className="col-md-12">
            <div className="aplicantHome_Heading">
              <div className="row">
                <div className="col-md-6">
                  <h3 className="heading">
                    {heading && heading.length && t(heading[next - 1].title)}
                  </h3>
                </div>
                <div className="col-md-6">
                  {heading && heading.length && heading[next - 1].btn && (
                    <button
                      type="submit"
                      className="form-btn mb-3 float-right"
                      onClick={() => module()}
                    >
                      <label className="mb-0 w-100 p-10">
                        {" "}
                        {heading && heading.length && t(heading[next - 1].btn)}
                        <span className="float-right">+</span>
                      </label>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-md-12 col-sm-12 m-auto">
              <div className="aplicant_Form_Steps mt-3">
                <Steps props={heading.length} />
              </div>
            </div>
            <div
              className="col-lg-12 col-md-12 col-sm-12"
              style={{ marginBottom: "40px" }}
            >
              <div className="aplicant_Form mt-5">{Formik(next)}</div>
            </div>
            <div className="col-md-6 m-auto ">
              <div className="row mt-3">
                <div className="col-md-6">
                  {next === 1 ? (
                    <button
                      onClick={() => backToapp()}
                      className="form-btn mb-2 float-right cancelButton"
                    >
                      {t("Cancel")}
                    </button>
                  ) : (
                    <button
                      className="form-btn mb-2 float-right previousButton"
                      onClick={() => backPage(next)}
                    >
                      {" "}
                      <span>
                        <img
                          src={ikanoBackArrow}
                          alt=""
                          className="submitArrow-modals-left my-auto float-left"
                        />
                      </span>
                      {t("Previous")}
                    </button>
                  )}
                </div>
                <div className="col-md-6">
                  {next === heading.length ? (
                    <button
                      className="form-btn bg-red mb-2 submitButton"
                      onClick={SumbitApplicant}
                    >
                      {t("Submit")}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="form-btn bg-red mb-2 nextButton"
                      onClick={() => NextStep()}
                    >
                      {t("Next")}
                      <span>
                        <img
                          src={ikanoNextArrow}
                          alt=""
                          className="submitArrow-modals my-auto"
                        />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <BlockUI
              loader={{ blocking: blockUi, title: "Please wait...  " }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AplicantHome;
