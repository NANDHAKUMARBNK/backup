import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Templates from "../../ui/templates";
import Atoms from "../../ui/atoms";
import Molecules from "../../ui/molecules";

const Login = () => {
  return (
    <Templates.BackgroundTemplate>
      <Atoms.Section className="container h-100">
        <Row className="justify-content-center h-100 align-items-center">
          <Col xl={5} lg={5} md={5} sm={12} xs={12}>
            <div className="loginblockOut">
              <Molecules.RowColSet rowClass="m-0" colClass="border-bottom">
                <Atoms.HeaderText content="Login" />
              </Molecules.RowColSet>
              <Molecules.RowColSet rowClass="loginFeildInnerBlock">
                <Templates.FormTemplate />
              </Molecules.RowColSet>
            </div>
          </Col>
        </Row>
      </Atoms.Section>
    </Templates.BackgroundTemplate>
  );
};

export default Login;
