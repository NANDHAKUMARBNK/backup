import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
  useState,
} from "react";
import {
  PersonalInformationInput,
  Address,
} from "../application-step/Module/InputFuled";
import "../Style/aplicant.scss";
import "../../styles/JobPositions.scss";

import { TextInput } from "../../../common-themes/controls-validation-and-constants";
import {
  FormBuilder,
  FieldGroup,
  FieldControl,
  Validators,
} from "react-reactive-form";
import { Pattarn } from "./Module/Pattern";
import { Row, Col, Container, FormGroup } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Context } from "../ContextApi/ContextApi";
const PersonalInformation = forwardRef((props, ref: any) => {
  const { data, gender, maritalStatus }: any = useContext(Context);
  const [maritalValue, setMaritalValue]: any = useState(null);
  const [genderValue, setGenderValue]: any = useState(null);
  useImperativeHandle(ref, () => ({
    data() {
      if (personalInfoForm.valid) {
        return personalInfoForm.value;
      } else {
        markFormGroupTouched(personalInfoForm);
        return false;
      }
    },
  }));
  function markFormGroupTouched(formGroup: any) {
    Object.values(personalInfoForm.controls).forEach((control: any) => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
    Object.keys(personalInfoForm.get("AddressRQ").value).forEach(
      (control: any) => {
        personalInfoForm.get("AddressRQ").get(control).markAsTouched();
        personalInfoForm.get("AddressRQ").get(control).updateValueAndValidity();
      }
    );
  }
  const { t } = useTranslation();
  const personalInfoForm = FormBuilder.group({
    firstName: ["", [Validators.required]],
    lastname: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.pattern(Pattarn.email)]],
    birthDate: ["", [Validators.required, Validators.pattern(Pattarn.dob)]],
    mobileNumber: [
      "",
      [Validators.required, Validators.pattern(Pattarn.mobile)],
    ],
    phoneNumber: [
      "",
      [Validators.required, Validators.pattern(Pattarn.mobile)],
    ],
    gender: ["Male", [Validators.required]],
    maritalStatus: ["Single", [Validators.required]],
    AddressRQ: FormBuilder.group({
      HouseNumber: ["", [Validators.required]],
      streetName: ["", [Validators.required]],
      municipality: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      zipcode: ["", [Validators.required, Validators.pattern(Pattarn.number)]],
    }),
  });
  useEffect(() => {
    if (Object.values(data).length) {
      personalInfoForm.patchValue(data.payload);
    }
  }, [data]);
  const forGender = (Id: any) => {
    gender.map((item: any) => {
      if (item.id === Id) {
        item.isClicked = true;
      } else {
        item.isClicked = false;
      }
    });
  };
  const forMS = (Id: any) => {
    maritalStatus.map((item: any) => {
      if (item.id === Id) {
        item.isClicked = true;
      } else {
        item.isClicked = false;
      }
    });
  };
  function handleSubmit(e: any) {
    e.preventDefault();
  }
  return (
    <div className="content">
      <Row>
        <div className="col-md-12 text-center border-bottom ">
          <h3 className="aplicantHeading "> {t("Hey!")} </h3>
          <p className="applicantHeadingInfo ">
            {t("Thank you for your interest in working with IKANO industries")}
          </p>
        </div>
        <Container className="container aplicantFormBody">
          <FieldGroup
            control={personalInfoForm}
            render={({ get, invalid }) => (
              <form onSubmit={handleSubmit} className="row">
                {PersonalInformationInput.map((item: any, index: any) => {
                  return item.type !== "radio" ? (
                    <Col xl={6} key={index + 1} className="mb-4 ">
                      <FormGroup>
                        <FieldControl
                          name={item.name}
                          render={TextInput}
                          meta={{
                            label: item.placeholder,
                            errormsg: item.msg,
                            class: "form-control  aplicant_Input",
                            errorMessagePattern:
                              item.errorMessagePattern || false,
                          }}
                        />
                      </FormGroup>
                    </Col>
                  ) : (
                    <></>
                  );
                })}
                <Col xl={6} className="border-top">
                  <label className="gender mb-4 mt-4"> Gender : </label>
                  {gender &&
                    gender.length > 0 &&
                    gender.map((item: any, index: any) => {
                      return (
                        <div
                          className="radio-item mb-3 my-2 mx-3"
                          key={index + 1}
                        >
                          <input
                            type="radio"
                            id={item.id}
                            name="gender"
                            value={item.name}
                            onChange={(e: any) => {
                              setGenderValue(e.target.value);
                              forGender(item.id);
                            }}
                            checked={
                              item.isClicked ? item.isClicked : genderValue
                            }
                          />
                          <label htmlFor={item.id} className="radioIkanoValues">
                            {item.name}
                          </label>
                        </div>
                      );
                    })}
                </Col>
                <Col xl={6} className="border-top">
                  <label className="gender mb-4 mt-4"> Marital Status : </label>
                  {maritalStatus &&
                    maritalStatus.length > 0 &&
                    maritalStatus.map((element: any, index: any) => {
                      return (
                        <div
                          className="radio-item mb-3 my-2 mx-3"
                          key={index + 1}
                        >
                          <input
                            type="radio"
                            id={element.id}
                            name="maritalstatus"
                            value={element.name}
                            onChange={(e: any) => {
                              setMaritalValue(e.target.value);
                              forMS(element.id);
                            }}
                            checked={
                              element.isClicked
                                ? element.isClicked
                                : maritalValue
                            }
                          />
                          <label
                            htmlFor={element.id}
                            className="radioIkanoValues"
                          >
                            {element.name}
                          </label>
                        </div>
                      );
                    })}
                </Col>
                <Col xl={12} className="border-top">
                  <label className="gender mb-4 mt-4"> {t("Address")} : </label>
                </Col>
                <FieldGroup
                  control={personalInfoForm.get("AddressRQ")}
                  render={() =>
                    Address.map((item, index) => {
                      return (
                        <Col xl={6} key={index + 2} className="mb-4">
                          <FormGroup>
                            <FieldControl
                              name={item.name}
                              render={TextInput}
                              meta={{
                                errormsg: item.placeholder,
                                label: item.placeholder,
                                msg: item.placeholder,
                                class: "form-control  aplicant_Input",
                              }}
                            />
                          </FormGroup>
                        </Col>
                      );
                    })
                  }
                />
              </form>
            )}
          />
        </Container>
      </Row>
    </div>
  );
});

export default React.memo(PersonalInformation);
