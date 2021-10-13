import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
  useEffect,
} from "react";
import {
  EducationHistory,
  StartDate,
  EndDate,
  TeaxtArea,
  CheckMonth,
  Qualificationsdata,
} from "../application-step/Module/InputFuled";
import {
  FormBuilder,
  FieldGroup,
  FieldControl,
  Validators,
} from "react-reactive-form";
import { Col, Container, FormGroup } from "reactstrap";
import {
  TextInput,
  SelectInput,
  TextArea,
  SelectInputValue,
  SelectInput2,
} from "../../../common-themes/controls-validation-and-constants";
import { Context } from "../ContextApi/ContextApi";
import ikanoNextArrow from "../../../assets/Images/inspect/IKANO/Admin/Login/Group 5/hdpi/Arrow_white_ik1_rollup.png";
import CloseButton from "../../../assets/Images/close.png";
import DeleteButton from "../../../assets/Images/Trash-bin_red_ik1_rollup.png";
import { useTranslation } from "react-i18next";
import { getQualificationLookUpApplicant } from "../../Services/AdminServices/AllJobPositions";
const EducationiHistory = forwardRef((props, ref: any) => {
  const [educations, setEducations] = useState(Qualificationsdata);
  useEffect(() => {
    getQualifications();
    vauleChange();
  }, []);
  const [educationiHistory, seteducationiHistory] = useState(
    FormBuilder.group({
      EducationType: ["", Validators.required],
      InstitutionName: ["", Validators.required],
      Subject: ["", Validators.required],
      Location: ["", Validators.required],
      QualificationId: ["", Validators.required],
      // Title: ["", Validators.required],
      StartDate: FormBuilder.group({
        Month: ["", Validators.required],
        Year: ["", Validators.required],
      }),
      EndDate: FormBuilder.group({
        Year: [""],
        Month: [""],
      }),
      Details: ["", Validators.required],
    })
  );

  const { t } = useTranslation();
  async function getQualifications() {
    const response: any = await getQualificationLookUpApplicant();
    if (response && response.data && response.data.length) {
      const a: any = [{ value: "", label: t("Education Area") }];
      response.data.forEach((val: any) => {
        a.push({ value: val.id, label: t(val.qualificationName) });
      });
      setEducations(a);
    }
  }

  useImperativeHandle(ref, () => ({
    data(a: any) {
      if (a) {
        Setfrom({
          module: !Form.module,
          text: true,
        });
      } else if (EductionData.length) {
        return educationiHistory.value;
      } else {
        Setfrom({
          module: !Form.module,
          text: true,
        });
      }
    },
  }));
  const [Form, Setfrom]: any = useState({
    module: false,
    text: true,
  });
  const { EductionData, SetEductionData, Remove }: any = useContext(Context);
  const [deleteModule, setDeleteModule]: any = useState({
    module: false,
    id: Number,
  });
  const [editing, setEditing]: any = useState();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const ey = educationiHistory.get("EndDate").get("Year").value;
    const em = educationiHistory.get("EndDate").get("Month").value;
    if (educationiHistory.valid) {
      if (em && em !== "Select Month" && (!ey || ey === "Select year")) {
        educationiHistory
          .get("EndDate")
          .get("Year")
          .setValidators([Validators.required]);
        educationiHistory.get("EndDate").get("Year").updateValueAndValidity();
      }
      if (ey && ey !== "Select year" && (!em || em === "Select Month")) {
        educationiHistory
          .get("EndDate")
          .get("Month")
          .setValidators([Validators.required]);
        educationiHistory.get("EndDate").get("Month").updateValueAndValidity();
      }
      if (!educationiHistory.valid) {
        educationiHistory.get("EndDate").get("Year").clearValidators();
        educationiHistory.get("EndDate").get("Month").clearValidators();
        return;
      }
      if (editing || editing === 0) {
        EductionData[editing] = educationiHistory.value;
        SetEductionData([...EductionData]);
        setEditing(false);
      } else {
        SetEductionData([...EductionData, educationiHistory.value]);
      }

      Setfrom({
        module: !Form.module,
        text: true,
      });
      educationiHistory.reset();
    } else {
      markFormGroupTouched();
    }
  };
  function markFormGroupTouched() {
    Object.values(educationiHistory.controls).forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
    Object.keys(educationiHistory.get("StartDate").value).forEach(
      (control: any) => {
        educationiHistory.get("StartDate").get(control).markAsTouched();
        educationiHistory
          .get("StartDate")
          .get(control)
          .updateValueAndValidity();
      }
    );
    Object.keys(educationiHistory.get("EndDate").value).forEach(
      (control: any) => {
        educationiHistory.get("EndDate").get(control).markAsTouched();
        educationiHistory.get("EndDate").get(control).updateValueAndValidity();
      }
    );
  }

  const EditEmployment = (e: any) => {
    const edit = EductionData[e];
    setEditing(e);
    Setfrom({
      module: !Form.module,
      text: false,
    });

    seteducationiHistory(
      FormBuilder.group({
        EducationType: [edit.EducationType || "", Validators.required],
        InstitutionName: [edit.InstitutionName || "", Validators.required],
        Subject: [edit.Subject || "", Validators.required],
        Location: [edit.Location || "", Validators.required],
        QualificationId: [edit.QualificationId || "", Validators.required],
        // Title: [edit.Title || "", Validators.required],
        StartDate: FormBuilder.group({
          Month: [edit.StartDate.Month || "", Validators.required],
          Year: [edit.StartDate.Year || "", Validators.required],
        }),
        EndDate: FormBuilder.group({
          Year: [edit.EndDate.Year || ""],
          Month: [edit.EndDate.Month || ""],
        }),
        Details: [edit.Details || "", Validators.required],
      })
    );
  };

  const DeleteEmployment = (e: any) => {
    setDeleteModule({ module: !deleteModule.module, id: e });
  };

  const vauleChange = () => {
    educationiHistory
      .get("StartDate")
      .get("Month")
      .valueChanges.subscribe((res: any) => {
        checkMinimum();
      });
    educationiHistory
      .get("StartDate")
      .get("Year")
      .valueChanges.subscribe((res: any) => {
        checkMinimum();
      });
    educationiHistory
      .get("EndDate")
      .get("Year")
      .valueChanges.subscribe((res: any) => {
        checkMinimum();
      });
    educationiHistory
      .get("EndDate")
      .get("Month")
      .valueChanges.subscribe((res: any) => {
        checkMinimum();
      });
  };

  function checkMinimum() {
    const sy = educationiHistory.get("StartDate").get("Year").value;
    const sm = educationiHistory.get("StartDate").get("Month").value;
    const ey = educationiHistory.get("EndDate").get("Year").value;
    const em = educationiHistory.get("EndDate").get("Month").value;
    const cMonths: any = CheckMonth;
    if (sy && ey) {
      if (sy > ey) {
        educationiHistory.get("EndDate").get("Year").setValue("");
        alert(t("Ending year should be greater than starting year"));
      }
      if (sy === ey) {
        if (cMonths[sm] > cMonths[em]) {
          educationiHistory.get("EndDate").get("Month").setValue("");
          alert(t("Ending month should be greater than starting month"));
        }
      }
    }
  }

  return (
    <React.Fragment>
      <div className="col-md-12 col-sm-12">
        <div className="col-md-12 text-center">
          <p className="applicantHeadingInfo text-center">
            {" "}
            {t("Please add your education details")}
          </p>
        </div>
        <Container className="App container">
          {Form.module ? (
            <div className="model ">
              <div className="container mt-4">
                <div className="card p-3 bg-white dialog-box">
                  <div className="aplicantHome_Heading w-100 mb-4">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-6 ">
                        {Form.text ? (
                          <h3 className="heading">{t("Add Education")} </h3>
                        ) : (
                          <h3 className="heading">{t("Edit Education")} </h3>
                        )}
                      </div>

                      <div className="col-md-6 col-sm-6 text-right">
                        <button
                          className="closeButton closeIcon"
                          onClick={() => {
                            Setfrom({ module: !Form.module });
                            educationiHistory.reset();
                          }}
                        >
                          <img src={CloseButton} alt="" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <FieldGroup
                      control={educationiHistory}
                      render={({ get, invalid }) => (
                        <form onSubmit={handleSubmit} className="row">
                          {EducationHistory.map((item, index) => {
                            return item.type === "select" ? (
                              <Col xl={6} key={index + 1} className="mb-3">
                                <FormGroup>
                                  <FieldControl
                                    name={item.name}
                                    render={
                                      item.name === "QualificationId"
                                        ? SelectInputValue
                                        : SelectInput
                                    }
                                    meta={{
                                      t,
                                      option:
                                        item.name === "QualificationId"
                                          ? educations
                                          : item.option,
                                      errormsg: t(item.errorMsg),
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            ) : (
                              <Col xl={6} key={index + 1} className="mb-3">
                                <FormGroup>
                                  <FieldControl
                                    name={item.name}
                                    render={TextInput}
                                    meta={{
                                      label: t(item.placeholder),
                                      errormsg: t(item.errorMsg),
                                      option: item.option,
                                      class: "form-control  aplicant_Input",
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            );
                          })}

                          <Col xl={6}>
                            <label className="gender mb-3">
                              {" "}
                              {t("Starting From")}:{" "}
                            </label>
                            <div className="row">
                              <FieldGroup
                                control={educationiHistory.get("StartDate")}
                                render={() =>
                                  StartDate.map((item: any, index: any) => {
                                    return (
                                      <Col xl={6} key={index}>
                                        <FormGroup>
                                          <FieldControl
                                            name={item.name}
                                            render={SelectInput}
                                            meta={{
                                              t,
                                              option: item.option,
                                              errormsg: t(item.errorMsg),
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                    );
                                  })
                                }
                              />
                            </div>
                          </Col>
                          <Col xl={6}>
                            <label className="gender mb-3">
                              {" "}
                              {t("Ending In")}:
                            </label>
                            <div className="row mb-3">
                              <FieldGroup
                                control={educationiHistory.get("EndDate")}
                                render={() =>
                                  EndDate.map((item: any, index: any) => {
                                    return (
                                      <Col xl={6} key={index}>
                                        <FormGroup>
                                          <FieldControl
                                            name={item.name}
                                            render={SelectInput2}
                                            meta={{
                                              t,
                                              option: item.option,
                                              errormsg: t(item.errorMsg),
                                            }}
                                          />
                                        </FormGroup>
                                      </Col>
                                    );
                                  })
                                }
                              />
                            </div>
                          </Col>

                          {TeaxtArea.map((item, index) => {
                            return (
                              <Col xl={12} key={index + 1} className="mb-3">
                                <FormGroup>
                                  <FieldControl
                                    name={item.name}
                                    render={TextArea}
                                    meta={{
                                      label: t(item.placeholder),
                                      errormsg: t(item.errorMsg),
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            );
                          })}
                          <button
                            type="submit"
                            className="form-btn bg-red mb-2 m-auto "
                            onClick={() => handleSubmit}
                          >
                            <span style={{ color: "#fff" }}>{t("Submit")}</span>
                            <img
                              src={ikanoNextArrow}
                              alt=""
                              className="submitArrow-modals my-auto"
                            />
                          </button>
                        </form>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </Container>
        {/* -----------------EmploymeantData list------------------- */}
        {EductionData.map((item: any, index: any) => {
          return (
            <div className="rectangle-1 row mt-3" key={index}>
              <div className=" col-lg-6 col-md-6 col-sm-12">
                <h3 className="heading" style={{ marginBottom: "15px" }}>
                  {item.EducationType}{" "}
                </h3>
                <h4
                  className="org-details"
                  style={{ marginBottom: "20px", color: "#989794" }}
                >
                  {" "}
                  {item.InstitutionName + " "}
                  {item.Location}{" "}
                </h4>
                <p className="thank text-left mb-1">
                  {item.StartDate.Year &&
                  item.StartDate.Month &&
                  item.EndDate.Year &&
                  item.EndDate.Month
                    ? `${item.StartDate.Year} ${t(item.StartDate.Month)} - ${t(
                        item.EndDate.Month
                      )} ${item.EndDate.Year}`
                    : item.StartDate.Year &&
                      item.StartDate.Month &&
                      !item.EndDate.Year &&
                      !item.EndDate.Month
                    ? `${item.StartDate.Year} ${t(item.StartDate.Month)} - ${t(
                        "Present"
                      )}`
                    : ""}
                </p>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <button
                      className="edit mb-2 bg-red"
                      onClick={() => EditEmployment(index)}
                    >
                      <label className="mb-0 w-100 bg-red">
                        {t("Edit")}
                        <img
                          src={ikanoNextArrow}
                          alt=""
                          className="submitArrow-modals-delete float-right my-auto"
                        />
                      </label>
                    </button>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <button
                      className="edit mb-2"
                      onClick={() => DeleteEmployment(index)}
                    >
                      <label className="mb-0 w-100">
                        {t("Delete")}
                        <img
                          src={DeleteButton}
                          alt=""
                          className="submitArrow-modals-delete p4 float-right my-auto"
                        />
                      </label>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Delete module */}

        {deleteModule.module ? (
          <div className="model">
            <div className="container mt-4">
              <div className="card p-3 detelemodule">
                <div className="col-md-8 m-auto">
                  <h3
                    className="heading text-center"
                    style={{ marginBottom: "40px" }}
                  >
                    {t("Are you sure you want to delete")}
                  </h3>
                  <p className="thank" style={{ marginBottom: "65px" }}>
                    {t(
                      "This item will be deleted immediately, you can’t undo this action."
                    )}
                  </p>
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <button
                          onClick={() =>
                            setDeleteModule({ module: !deleteModule.module })
                          }
                          className="form-btn mb-2 w-100"
                        >
                          {t("Cancel")}
                        </button>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <button
                          type="submit"
                          className="form-btn bg-red mb-2 w-100"
                          onClick={() =>
                            Remove(
                              deleteModule.id,
                              EductionData,
                              SetEductionData,
                              setDeleteModule
                            )
                          }
                        >
                          {t("Delete")}
                          <span>
                            <img
                              src={ikanoNextArrow}
                              alt=""
                              className="submitArrow-modals my-auto"
                            />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </React.Fragment>
  );
});

export default React.memo(EducationiHistory);
