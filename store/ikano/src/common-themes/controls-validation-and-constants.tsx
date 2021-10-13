import React from "react";
import { Input } from "reactstrap";
import "../components/applicant/Style/aplicant.scss";
import "../components/styles/JobPositions.scss";

export const TextInput = ({ handler, touched, hasError, meta, value }: any) => (
  <>
    <Input
      type={meta.type || "text"}
      className={meta.class || "form-control"}
      placeholder={meta.label}
      {...handler()}
    />
    <span className="error">
      {touched && hasError("required") && `${meta.errormsg}`}

      {touched &&
        hasError("pattern") &&
        `${meta.errormsg} is invalid ${
          meta.errorMessagePattern ? meta.errorMessagePattern : ""
        }`}
      {touched && hasError("minLength") && `${meta.errormsg} is invalid`}
      {touched && hasError("maxLength") && `${meta.errormsg} is invalid`}
      {touched && hasError("customError") && `${meta.errormsg} is invalid`}
    </span>
  </>
);

export const RadioInput = ({ handler, touched, hasError, meta }: any) => (
  <React.Fragment>
    {meta.option.map((opt: any, index: any) => {
      return (
        <div
          key={index + 1}
          className="d-inline ml-3 radio-input-g radio-item mb-3 my-2 mx-3"
        >
          <Input
            type="radio"
            {...handler()}
            name={meta.name}
            value={opt.value}
            id={opt.value}
            // checked={meta.checked === opt.value || false}
            className="ml-0 position-relative"
          />
          <label htmlFor="" className="ml-2">
            {opt.title}
          </label>
        </div>
      );
    })}

    <p className="error">
      {touched && hasError("required") && `${meta.errormsg}`}
    </p>
  </React.Fragment>
);

export const SelectInput = ({ handler, touched, hasError, meta }: any) => (
  <div>
    <Input
      className="form-control  aplicant_Input pb-0 pt-0"
      type="select"
      {...handler()}
      name={meta.name}
    >
      {meta.option.map((val: any, index: any) => {
        return (
          <option value={val.label || ""} key={index}>
            {meta.t(val.label) || "Select"}{" "}
          </option>
        );
      })}
    </Input>
    <p className="error">
      {touched && hasError("required") && `${meta.errormsg}`}
    </p>
  </div>
);
export const SelectInput2 = ({ handler, touched, hasError, meta }: any) => (
  <div>
    <Input
      className="form-control  aplicant_Input pb-0 pt-0"
      type="select"
      {...handler()}
      name={meta.name}
    >
      {meta.option.map((val: any, index: any) => {
        return (
          <option value={val.value} key={index}>
            {meta.t(val.label)}
          </option>
        );
      })}
    </Input>
    <p className="error">
      {touched && hasError("required") && `${meta.errormsg}`}
    </p>
  </div>
);

export const SelectInputValue = ({ handler, touched, hasError, meta }: any) => (
  <div>
    <Input
      className="form-control  aplicant_Input pb-0 pt-0"
      type="select"
      {...handler()}
      name={meta.name}
    >
      {meta.option.map((val: any, index: any) => {
        return (
          <option value={val.value || ""} key={index}>
            {meta.t(val.label) || "Select"}{" "}
          </option>
        );
      })}
    </Input>
    <p className="error">
      {touched && hasError("required") && `${meta.errormsg}`}
    </p>
  </div>
);

export const TextArea = ({ handler, touched, hasError, meta }: any) => (
  <div>
    <Input
      className="form-control  aplicant_Input "
      rows="5"
      type="textarea"
      {...handler()}
      name={meta.name}
      placeholder={meta.label}
    />
    <p className="error">
      {touched && hasError("required") && `${meta.errormsg}`}
    </p>
  </div>
);

export const floorOperator = [
  { title: "Personal Information" },
  { title: "Values fit assessment" },
  { title: "Ikano Values" },
  { title: "Motivation Factors" },
  // { title: "Values fit assessment" },
  { title: "Upload CV" },
];

export const manager = [
  { title: "Personal Information" },
  { title: "Employment History", btn: "Add Employment" },
  { title: "Education History", btn: "Add Education" },
  { title: "Skills" },
  { title: "Values fit assessment" },
  { title: "Ikano Values" },
  { title: "Leadership Words" },
  { title: "Motivation Factors" },
  // { title: "Values fit assessment" },
  { title: "Upload CV" },
];
