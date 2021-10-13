import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
  useState,
} from "react";
import "../Style/aplicant.scss";
import "../../styles/JobPositions.scss";
import { Row, Col, Container } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Context } from "../ContextApi/ContextApi";
import {
  isNumericValidator,
  emailValidator,
  mobileValidator,
  dobValidator,
  dobCompare,
} from "../../Common/Validators/CommonValidators";
import moment from "moment";
const PersonalInfo = forwardRef((props, ref: any) => {
  const {
    gender,
    setGender,
    gen,
    setGen,
    ms,
    setMs,
    setMaritalStatus,
    maritalStatus,
    fn,
    ln,
    em,
    dob,
    ph1,
    ph2,
    setFn,
    setLn,
    setEm,
    setDob,
    setPh1,
    setPh2,
    hn,
    setHn,
    munici,
    setMunici,
    munici2,
    setMunici2,
    stName,
    setStName,
    // city,
    // setCity,
    // state,
    // setState,
    zipcode,
    setZipcode,
    setPersonalInformation,
  }: any = useContext(Context);
  const [maritalValue, setMaritalValue]: any = useState(null);
  const [genderValue, setGenderValue]: any = useState(null);
  const [type, setType] = useState("text");
  // Validation Message
  const [fnMsg, setFnMsg]: any = useState("");
  const [lnMsg, setLnMsg]: any = useState("");
  const [emMsg, setEmMsg]: any = useState("");
  const [dobMsg, setDobMsg]: any = useState("");
  const [ph1Msg, setPh1Msg]: any = useState("");
  const [ph2Msg, setPh2Msg]: any = useState("");
  const [hnMsg, setHnMsg]: any = useState("");
  const [stnmMsg, setStNmMsg]: any = useState("");
  const [mnMsg, setMnMsg]: any = useState("");
  // const [cityMsg, setCityMsg]: any = useState("");
  // const [stateMsg, setStateMsg]: any = useState("");
  const [zipMsg, setZipMsg]: any = useState("");
  const [genderMsg, setGenderMsg]: any = useState("");
  const [msMsg, setMsMsg]: any = useState("");
  useImperativeHandle(ref, () => ({
    data() {
      if (formSubmit()) {
        return true;
      } else {
        return false;
      }
    },
  }));
  const { t } = useTranslation();
  useEffect(() => {
    if (gen.length === 0) {
      setGender(gender);
    }
  }, []);
  useEffect(() => {
    if (ms.length === 0) {
      setMaritalStatus(maritalStatus);
    }
  }, []);

  const forGender = (Id: any) => {
    gender.map((item: any) => {
      if (item.id === Id) {
        item.isClicked = true;
      } else {
        item.isClicked = false;
      }
    });
    setGender(gender);
    setGen(gender);
  };

  const forMS = (Id: any) => {
    maritalStatus.map((item: any) => {
      if (item.id === Id) {
        item.isClicked = true;
      } else {
        item.isClicked = false;
      }
    });
    setMaritalStatus(maritalStatus);
    setMs(maritalStatus);
  };
  const formSubmit = () => {
    const Gender: any = gender.filter(
      (element: any) => element.isClicked === true
    );
    const MaritalStatus: any = maritalStatus.filter(
      (element: any) => element.isClicked === true
    );
    if (
      !fn &&
      !ln &&
      !em &&
      !dob &&
      !ph1 &&
      Gender.length === 0 &&
      MaritalStatus.length === 0 &&
      !hn &&
      !stName &&
      !munici &&
      // !city &&
      // !state &&
      !zipcode
    ) {
      setFnMsg(`${t("First Name is required")}`);
      setLnMsg(`${t("Last Name is required")}`);
      setEmMsg(`${t("Email is required")}`);
      setDobMsg(`${t("Date of birth is required")}`);
      setPh1Msg(`${t("Phone Number(Mobile) is required")}`);
      setGenderMsg(`${t("Gender is required")}`);
      setMsMsg(`${t("Marital Status is required")}`);
      setHnMsg(`${t("House Number is required")}`);
      setStNmMsg(`${t("Street Name is required")}`);
      setMnMsg(`${t("Municipality is required")}`);
      // setCityMsg(`${t("Province 2 is required")}`);
      // setStateMsg(`${t("Province Abbrevation is required")}`);
      setZipMsg(`${t("Postal Code is required")}`);
      return;
    }
    if (!fn) {
      setFnMsg(`${t("First Name is required")}`);
      return;
    }
    if (!ln) {
      setLnMsg(`${t("Last Name is required")}`);
      return;
    }
    if (!em) {
      setEmMsg(`${t("Email is required")}`);
      return;
    }
    if (!dob) {
      setDobMsg(`${t("Date of birth is required")}`);
      return;
    }
    if (!ph1) {
      setPh1Msg(`${t("Phone Number(Mobile) is required")}`);
      return;
    }
    if (Gender.length === 0) {
      setGenderMsg(`${t("Gender is required")}`);
      return;
    }
    if (MaritalStatus.length === 0) {
      setMsMsg(`${t("Marital Status is required")}`);
      return;
    }
    if (!hn) {
      setHnMsg(`${t("House Number is required")}`);
      return;
    }
    if (!stName) {
      setStNmMsg(`${t("Street Name is required")}`);
      return;
    }
    if (!munici) {
      setMnMsg(`${t("Municipality is required")}`);
      return;
    }
    // if (!city) {
    //   setCityMsg(`${t("Province 2 is required")}`);
    //   return;
    // }
    // if (!state) {
    //   setStateMsg(`${t("Province Abbrevation is required")}`);
    //   return;
    // }
    if (!zipcode) {
      setZipMsg(`${t("Postal Code is required")}`);
      return;
    }
    if (!mobileValidator(ph1)) {
      setPh1Msg(t("Phone Number(Mobile) should be number"));
    } else if (!emailValidator(em)) {
      setEmMsg(t("Email should be valid format"));
    } else if (!mobileValidator(ph2 || "0123456789")) {
      setPh2Msg(t("Phone Number(Home) should be number"));
    } else if (!isNumericValidator(zipcode)) {
      setZipMsg(t("Postal Code should be number"));
    } else if (!dobValidator(dob)) {
      setDobMsg(`${t("Date of birth(Invalid Format)")}`);
    } else if (!dobCompare(dob)) {
      setDobMsg(
        `${t(
          "Date of birth Should be greater than 1900 and lesser than present year"
        )}`
      );
    } else {
      const payload: any = {
        firstName: fn,
        lastname: ln,
        email: em,
        birthDate: moment(dob).format("MM/DD/YYYY"),
        mobileNumber: ph1,
        phoneNumber: ph2,
        gender: Gender[0].name,
        maritalStatus: MaritalStatus[0].name,
        AddressRQ: {
          streetName: stName,
          HouseNumber: hn,
          locality2: munici2 ? munici2 : "",
          // province2: city,
          postalCode: zipcode,
          locality1: munici,
          // provinceAbbrevation: state,
          country: "Mexico",
        },
      };
      const RequestPersonalInfo: any = {
        PersonalInformationRQ: payload,
      };
      if (RequestPersonalInfo) {
        setPersonalInformation(RequestPersonalInfo);
        return true;
      } else {
        return false;
      }
    }
  };
  function handleSubmit(e: any) {
    e.preventDefault();
  }
  return (
    <div className="content">
      <Row>
        <div className="col-md-12 text-center border-bottom ">
          <h3 className="aplicantHeading "> {t("Hej!")} </h3>
          <p className="applicantHeadingInfo ">
            {t("Thank you for your interest in working with Ikano Industry")}
          </p>
        </div>

        <Container className="container aplicantFormBody">
          <form onSubmit={handleSubmit} className="row">
            <Col xl={6}>
              <div className="form-group m-b-32">
                <input
                  type="text"
                  className="form-control aplicant_Input"
                  id="fn"
                  aria-describedby="firstnameHelp"
                  placeholder={`${t("First Name")}*`}
                  value={fn}
                  onChange={(e: any) => {
                    setFn(e.target.value);
                    setFnMsg("");
                  }}
                  required
                />
                <strong style={{ color: "red" }}>{fnMsg ? fnMsg : ""}</strong>
              </div>
            </Col>
            <Col xl={6}>
              <div className="form-group m-b-32">
                <input
                  type="text"
                  className="form-control aplicant_Input"
                  id="ln"
                  aria-describedby="lastnameHelp"
                  placeholder={`${t("Last Name")}*`}
                  value={ln}
                  onChange={(e: any) => {
                    setLn(e.target.value);
                    setLnMsg("");
                  }}
                  required
                />
                <strong style={{ color: "red" }}>{lnMsg ? lnMsg : ""}</strong>
              </div>
            </Col>
            <Col xl={6}>
              <div className="form-group m-b-32">
                <input
                  type="text"
                  className="form-control aplicant_Input"
                  id="em"
                  aria-describedby="emHelp"
                  placeholder={`${t("Email")}*`}
                  value={em}
                  onChange={(e: any) => {
                    setEm(e.target.value);
                    setEmMsg("");
                  }}
                  required
                />
                <strong style={{ color: "red" }}>{emMsg ? emMsg : ""}</strong>
              </div>
            </Col>
            <Col xl={6}>
              <div className="form-group m-b-32">
                <input
                  type={type}
                  className="form-control aplicant_Input"
                  id="dob"
                  aria-describedby="dobHelp"
                  placeholder={`${t("Date of birth")}*`}
                  value={dob}
                  onFocus={() => setType("date")}
                  onBlur={() => setType("text")}
                  onChange={(e: any) => {
                    setDob(e.target.value);
                    setDobMsg("");
                  }}
                  required
                />
                <strong style={{ color: "red" }}>{dobMsg ? dobMsg : ""}</strong>
              </div>
            </Col>
            <Col xl={6}>
              <div className="form-group m-b-32">
                <input
                  type="text"
                  className="form-control aplicant_Input"
                  id="mn"
                  aria-describedby="mnHelp"
                  placeholder={`${t("Phone Number(Mobile)")}*`}
                  value={ph1}
                  onChange={(e: any) => {
                    setPh1(e.target.value);
                    setPh1Msg("");
                  }}
                  required
                />
                <strong style={{ color: "red" }}>{ph1Msg ? ph1Msg : ""}</strong>
              </div>
            </Col>
            <Col xl={6}>
              <div className="form-group m-b-32">
                <input
                  type="text"
                  className="form-control aplicant_Input"
                  id="mn2"
                  aria-describedby="mn2Help"
                  placeholder={`${t("Phone Number(Home)")}`}
                  value={ph2}
                  onChange={(e: any) => {
                    setPh2(e.target.value);
                    setPh2Msg("");
                  }}
                  required
                />
                <strong style={{ color: "red" }}>{ph2Msg ? ph2Msg : ""}</strong>
              </div>
            </Col>
            <Col xl={6} className="border-top">
              <label className="gender mb-4 mt-4"> {t("Gender")}: </label>
              {gender &&
                gender.length > 0 &&
                gender.map((item: any) => {
                  return (
                    <div className="radio-item mb-3 my-2 mx-3">
                      <input
                        key={item.id}
                        type="radio"
                        id={item.id}
                        name="gender"
                        value={item.name}
                        onChange={(e: any) => {
                          setGenderValue(e.target.value);
                          forGender(item.id);
                          setGenderMsg("");
                        }}
                        checked={item.isClicked}
                      />
                      <label htmlFor={item.id} className="radioPersonalInfo">
                        {t(item.name)}
                      </label>
                    </div>
                  );
                })}
              <div>
                <strong style={{ color: "red" }}>
                  {genderMsg ? genderMsg : ""}
                </strong>
              </div>
            </Col>
            <Col xl={6} className="border-top">
              <label className="gender mb-4 mt-4">{t("Marital Status")}:</label>
              {maritalStatus &&
                maritalStatus.length > 0 &&
                maritalStatus.map((element: any) => {
                  return (
                    <div className="radio-item mb-3 my-2 mx-3">
                      <input
                        key={element.id}
                        type="radio"
                        id={element.id}
                        name="maritalstatus"
                        value={element.name}
                        onChange={(e: any) => {
                          setMaritalValue(e.target.value);
                          forMS(element.id);
                          setMsMsg("");
                        }}
                        checked={element.isClicked}
                      />
                      <label htmlFor={element.id} className="radioPersonalInfo">
                        {t(element.name)}
                      </label>
                    </div>
                  );
                })}
              <div>
                <strong style={{ color: "red", whiteSpace: "nowrap" }}>
                  {msMsg ? msMsg : ""}
                </strong>
              </div>
            </Col>
            <Col xl={12} className="border-top">
              <label className="gender mb-4 mt-4"> {t("Address")}: </label>
            </Col>
            <Col xl={6}>
              <div className="form-group m-b-32">
                <input
                  type="text"
                  className="form-control aplicant_Input"
                  id="hn"
                  aria-describedby="housenumberHelp"
                  placeholder={`${t("House Number")}*`}
                  value={hn}
                  onChange={(e: any) => {
                    setHn(e.target.value);
                    setHnMsg("");
                  }}
                  required
                />
                <strong style={{ color: "red" }}>{hnMsg ? hnMsg : ""}</strong>
              </div>
            </Col>
            <Col xl={6}>
              <div className="form-group m-b-32">
                <input
                  type="text"
                  className="form-control aplicant_Input"
                  id="stname"
                  aria-describedby="streetnameHelp"
                  placeholder={`${t("Street Name")}*`}
                  value={stName}
                  onChange={(e: any) => {
                    setStName(e.target.value);
                    setStNmMsg("");
                  }}
                  required
                />
                <strong style={{ color: "red" }}>
                  {stnmMsg ? stnmMsg : ""}
                </strong>
              </div>
            </Col>
            <Col xl={6}>
              <div className="form-group m-b-32">
                <input
                  type="text"
                  className="form-control aplicant_Input"
                  id="muni"
                  aria-describedby="muniHelp"
                  placeholder={`${t("Municipality")}*`}
                  value={munici}
                  onChange={(e: any) => {
                    setMunici(e.target.value);
                    setMnMsg("");
                  }}
                  required
                />
                <strong style={{ color: "red" }}>{mnMsg ? mnMsg : ""}</strong>
              </div>
            </Col>
            {/* Loc2 */}
            <Col xl={6}>
              <div className="form-group m-b-32">
                <input
                  type="text"
                  className="form-control aplicant_Input"
                  id="muni2"
                  aria-describedby="muniHelp"
                  placeholder={`${t("State")}`}
                  value={munici2}
                  onChange={(e: any) => {
                    setMunici2(e.target.value);
                  }}
                />
              </div>
            </Col>
            {/* <Col xl={6}>
              <div className="form-group m-b-32">
                <input
                  type="text"
                  className="form-control aplicant_Input"
                  id="city"
                  aria-describedby="cityHelp"
                  placeholder={`${t("Province 2")}*`}
                  value={city}
                  onChange={(e: any) => {
                    setCity(e.target.value);
                    setCityMsg("");
                  }}
                  required
                />
                <strong style={{ color: "red" }}>
                  {cityMsg ? cityMsg : ""}
                </strong>
              </div>
            </Col> */}
            {/* <Col xl={6}>
              <div className="form-group m-b-32">
                <input
                  type="text"
                  className="form-control aplicant_Input"
                  id="stat"
                  aria-describedby="stateHelp"
                  placeholder={`${t("Province Abbrevation")}*`}
                  value={state}
                  onChange={(e: any) => {
                    setState(e.target.value);
                    setStateMsg("");
                  }}
                  required
                />
                <strong style={{ color: "red" }}>
                  {stateMsg ? stateMsg : ""}
                </strong>
              </div>
            </Col> */}
            <Col xl={6}>
              <div className="form-group m-b-32">
                <input
                  type="text"
                  className="form-control aplicant_Input"
                  id="zipcode"
                  aria-describedby="zipcodeHelp"
                  placeholder={`${t("Postal Code")}*`}
                  value={zipcode}
                  onChange={(e: any) => {
                    setZipcode(e.target.value);
                    setZipMsg("");
                  }}
                  required
                />
                <strong style={{ color: "red" }}>{zipMsg ? zipMsg : ""}</strong>
              </div>
            </Col>
          </form>
        </Container>
      </Row>
    </div>
  );
});

export default React.memo(PersonalInfo);
