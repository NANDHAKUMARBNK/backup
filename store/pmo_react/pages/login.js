// import React, { Component } from "react";
// import "ag-grid-community/dist/styles/ag-grid.css";
// import "ag-grid-community/dist/styles/ag-theme-balham.css";
// import axiosConfig from "../Config/config";
// import Col from "react-bootstrap/Col";
// import Row from 'react-bootstrap/Row';

// class Login extends Component {
//   constructor(props) {
//     super(props);
//     if (this.props.location.pathname === "/") {
//       localStorage.clear();
//     }

//     this.state = {
//       username: "",
//       password: "",
//       authDataResponse: []
//     };

//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleChange(e) {
//     const { name, value } = e.target;
//     this.setState({ [name]: value });
//   }
//   handleSubmit(e) {
//     e.preventDefault();

//     this.setState({ submitted: true });
//     const { username, password } = this.state;

//     // stop here if form is invalid
//     if (!(username && password)) {
//       return;
//     }
//     const payload = {
//       validate_email: this.state.username,
//       validate_password: this.state.password
//     };
//     axiosConfig
//       .post("/validateUser", payload)
//       .then(response => {
//         let token = response.data.token;
//         localStorage.setItem("userToken", token);
//         let authData = response.data.access;
//         let stringyFyData = JSON.stringify(authData);
//         localStorage.setItem("authData", stringyFyData);
//         let DataFromLocalStorage = JSON.parse(localStorage.getItem("authData"));
//         this.setState({
//           authDataResponse: DataFromLocalStorage
//         });
//         let authUserData = this.state.authDataResponse;
//         this.props.history.push("/dashboard", { authUserData });
//       })
//       .catch(error => {
//         //  alert(error.response.data.message);
//       });
//   }

//   render() {
//     const { username, password, submitted, loading, error } = this.state;
//     return (
//       <section className="loginContainer">
//         <div className="container h-100">
//           <div className="customBackgroundContainer">

//             <Row className="justify-content-center h-100 align-items-center">
//               <Col xl={8} lg={8} md={8} sm={8} xs={8} className="">
//                 <div className="loginblockOut">
//                   <Row className="m-0">
//                     <Col className="border-bottom">
//                       <h1>Login</h1>
//                     </Col>
//                   </Row>
//                   <Row className="loginFeildInnerBlock">
//                     <Col>
//                       <form name="form" onSubmit={this.handleSubmit}>
//                         <div
//                           className={
//                             "form-group mt-5" + (submitted && !username ? " has-error" : "")
//                           }
//                         >
//                           <label htmlFor="username">Email</label>
//                           <input
//                             type="email"
//                             className="form-control"
//                             name="username"
//                             value={username}
//                             onChange={this.handleChange}
//                           />
//                           {submitted && !username && (
//                             <div className="help-block">Email is required</div>
//                           )}
//                         </div>
//                         <div
//                           className={
//                             "form-group mt-4" + (submitted && !password ? " has-error" : "")
//                           }
//                         >
//                           <label htmlFor="password">Password</label>
//                           <input
//                             type="password"
//                             className="form-control"
//                             name="password"
//                             value={password}
//                             onChange={this.handleChange}
//                           />
//                           {submitted && !password && (
//                             <div className="help-block">Password is required</div>
//                           )}
//                         </div>
//                         <div className="text-left">
//                           <h6>Forgot Password ?</h6>
//                         </div>
//                         <div className="form-group mt-5">
//                           <button className="btn btn-success customLoginBtn btn w-100" disabled={loading}>
//                             Login
//                           </button>
//                         </div>
//                         {error && <div className={"alert alert-danger"}>{error}</div>}
//                       </form>
//                     </Col>
//                   </Row>

//                 </div>

//               </Col>
//             </Row>

//           </div>
//         </div>

//       </section>
//     );
//   }
// }

// export default Login;

import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Atoms from "../components/ui/atoms";
import Templates from "../components/ui/templates";
import FullPageTemplate from "../components/ui/templates/backgroundTemplate/backgroundTemplate";
function Login() {
  return (
    <FullPageTemplate>
      <div className="loginblockOut">
        <Row className="m-0">
          <Col className="border-bottom">
            <Atoms.HeaderText content="Login" />
          </Col>
        </Row>
        <Row className="loginFeildInnerBlock">
          <Col>
            <Templates.FormTemplate />
          </Col>
        </Row>
      </div>
    </FullPageTemplate>
  );
}

export default Login;
