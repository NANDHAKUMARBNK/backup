import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Molecules from "../../molecules";
import Atoms from "../../atoms";
import LoginService from "../../../../services/loginService";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useHistory } from "react-router-dom";
import {
  emailValidator,
  alphaNumericValidator,
  valueEmptyCheck,
} from "../../../../validators/loginValidator";

const FormTemplate = () => {
  let history = useHistory();
  let [username, set_UserEmailId] = useState("");
  let [password, set_UserPassword] = useState("");
  let [isEmail, set_isEmail] = useState("");
  let [isPasswordValid, set_isPasswordValid] = useState("");
  let userNameChange = (e) => {
    set_UserEmailId(e.target.value);
  };
  let passwordChange = (e) => {
    set_UserPassword(e.target.value);
  };
  let handleKeyUp = (e) => {
    set_isEmail("");
    emailValidator(e);
  };
  let handleKeyPressForPassword = (e) => {
    set_isPasswordValid("");
    alphaNumericValidator(e);
  };
  async function submit() {
    const request_Data = {
      validate_email: username,
      validate_password: password,
    };
    if (!valueEmptyCheck(username)) {
      set_isEmail("Enter Email Id");
      return;
    }
    if (!valueEmptyCheck(password)) {
      set_isPasswordValid("Enter Password");
      return;
    }
    if (!emailValidator(username)) {
      set_isEmail("Email Id Is Invalid");
    } else if (!alphaNumericValidator(password)) {
      set_isPasswordValid("Password Is Invalid ( AlphaNumeric Only)");
    } else {
      let response = await LoginService(request_Data);
      toastr.options = {
        positionClass: "toast-top-full-width",
        hideDuration: 300,
        timeOut: 3000,
      };
      if (response && response.data) {
        toastr.success(`Login SuccessFully`);
        let token = response.data.token;
        localStorage.setItem("userToken", token);
        let authData = response.data.access;
        let stringyFyData = JSON.stringify(authData);
        localStorage.setItem("authData", stringyFyData);
        let authUserData = JSON.parse(localStorage.getItem("authData"));
        history.push("/dashboard", { authUserData });
      } else {
        toastr.error(`Wrong Credentials or Please contact Spurtree Admin!!`);
      }
    }
  }
  return (
    <Form>
      <Molecules.FormGroup
        htmlForLabel="username"
        labelName="Email"
        type="email"
        className="mt-4"
        name="username"
        placeholder="Enter Email"
        changeValue={userNameChange}
        Value={username}
        keyUpValue={handleKeyUp}
      />
      <Molecules.RowColSet colClass="text-left">
        <Atoms.ITag className="text-danger" content={isEmail} />
      </Molecules.RowColSet>
      <Molecules.FormGroup
        htmlForLabel="password"
        labelName="Password"
        type="password"
        className="mt-4"
        name="password"
        placeholder="Enter Password"
        changeValue={passwordChange}
        Value={password}
        keyPressValue={handleKeyPressForPassword}
      />
      <Molecules.RowColSet colClass="text-left">
        <Atoms.ITag className="text-danger" content={isPasswordValid} />
      </Molecules.RowColSet>
      <Molecules.RowColSet colClass="text-left">
        <Atoms.Paragraph content="Forgot password ?" />
      </Molecules.RowColSet>
      <Atoms.CustomButton
        className="btn btn-success customLoginBtn btn w-100"
        buttonName="Login"
        action={submit}
      />
    </Form>
  );
};
export default FormTemplate;
