import React, { useState } from "react";
import "../styles/login.scss";
import ikanoLogo from "../../assets/Images/inspect/IKANO/Admin/Login/hdpi/Ikano-Industry.png";
import ikanoTeamLogo from "../../assets/Images/inspect/IKANO/Admin/Login/hdpi/Group.png";
import ikanoNextArrow from "../../assets/Images/inspect/IKANO/Admin/Login/Group 5/hdpi/Arrow_white_ik1_rollup.png";
import eyeLogo from "../../assets/Images/inspect/IKANO/Admin/Login/hdpi/Eye_grey.png";
import { LoginApi } from "../Services/login/login-logout";
import { useHistory } from "react-router-dom";
import BlockUI from "./../../common-themes/ui-blocker";
export default function Login() {
  const History: any = useHistory();
  const [passwordShown, setPasswordShown]: any = useState(false);
  const [userName, setUserName]: any = useState();
  const [password, setPassword]: any = useState();
  const [isValid, setIsValid]: any = useState();
  const [blockUi, setblockUi]: any = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  async function login(e: any) {
    e.preventDefault();
    const data = {
      userName,
      password,
    };
    if (userName && password && isValid) {
      setblockUi(true);
      const response: any = await LoginApi(data);
      if (response.data && response.data.access_token) {
        localStorage.setItem("Access_Token", response.data.access_token.token);
        const AuthData: any = {
          Token: response.data.access_token.token,
          Data: response.data,
        };
        setblockUi(false);
        History.push("admin", AuthData);
      } else {
        setblockUi(false);
        setIsValid(false);
      }
    } else {
      setblockUi(false);
      setIsValid(false);
    }
  }
  return (
    <div className="login">
      <div className="login__appLogo mt-5">
        <img src={ikanoLogo} alt="" />
      </div>
      <div className="container">
        <div className="row no-gutters align-items-center">
          <div className="col-md-5">
            <div className="login__appLogoTeam">
              <img className="my-5" src={ikanoTeamLogo} alt="" />
            </div>
          </div>
          <div className="col-md-7">
            <div className="login__form">
              <form onSubmit={login}>
                {isValid === false ? (
                  <p className="error text-center d-block">
                    Invalid Credentials
                  </p>
                ) : (
                  ""
                )}
                <p>Login</p>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    aria-describedby="usernameHelp"
                    placeholder="User Name"
                    required
                    onChange={(e: any) => {
                      setUserName(e.target.value);
                      setIsValid(true);
                    }}
                  />
                </div>
                <div className="form-group">
                  <div className="login__formPasswordWrapper">
                    <input
                      type={passwordShown ? "text" : "password"}
                      className="form-control"
                      id="password"
                      aria-describedby="passwordHelp"
                      placeholder="Password"
                      required
                      onChange={(e: any) => {
                        setPassword(e.target.value);
                        setIsValid(true);
                      }}
                    />
                    <img
                      src={eyeLogo}
                      alt=""
                      onClick={togglePasswordVisiblity}
                    />
                  </div>
                </div>
                <div className="login__formButton">
                  <button type="submit" className="btn btn-primary">
                    Login
                    <img src={ikanoNextArrow} alt="" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <BlockUI loader={{ blocking: blockUi, title: "Please wait...  " }} />
    </div>
  );
}
