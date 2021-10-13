import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Form } from "reactstrap";
import Card from "react-bootstrap/Card";

class SprintHead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ProjectCode_fromActiveProjectList: this.props.Data.project_code,
      ProjectName_fromActiveProjectList: this.props.Data.project_name
    };
  }

  render() {
    return (
      <div className="SprintHeaderContainer">
        <Form>
          <Row className="position-relative SprintHeaderOuter">
            <Col>
              <Card>
                <Card.Body className="text-left">
                  <Card.Subtitle className="mb-2">Project Name</Card.Subtitle>

                  <h5 className="">
                    {this.state.ProjectName_fromActiveProjectList}
                  </h5>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body className="text-left">
                  <Card.Subtitle className="mb-2">Project Code</Card.Subtitle>

                  <h5 className="">
                    {this.state.ProjectCode_fromActiveProjectList}
                  </h5>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body className="text-left">
                  <Card.Subtitle className="mb-2">
                    Story Points claimed
                  </Card.Subtitle>

                  <h5 className="customTxtOrangeYellow">26%</h5>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body className="text-left">
                  <Card.Subtitle className="mb-2">
                    Efforts consumed
                  </Card.Subtitle>
                  <h5 className="customTxtBlue">56%</h5>
                </Card.Body>
              </Card>
            </Col>
            <Col className="text-center">
              <Card>
                <Card.Body className="text-left">
                  <Card.Subtitle className="mb-2">
                    Calculate RAG Status
                  </Card.Subtitle>
                  <h5 className="text-danger">ATRISK</h5>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={12} lg={12} md={12} xs={12}>
              <div className="customDividerLine mt-3"></div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default SprintHead;
