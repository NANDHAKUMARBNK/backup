import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Form, Button, FormGroup, Label, Input } from "reactstrap";
import axiosConfig from "../Config/config";
import headers from "../Config/headers";
class EstModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      costhead: "",
      hours: "",
      NewRowData: []
    };
    this.EstimatedCostHead = this.EstimatedCostHead.bind(this);
    this.InputValueFrom_Hours = this.InputValueFrom_Hours.bind(this);
  }
  componentDidMount() {
    this.EstimateType();
  }
  close() {
    this.props.handleCloseBtn();
  }
  AddNewRowData = () => {
    alert(`Added ${this.state.costhead} ${this.state.hours}`);
  };
  EstimatedCostHead = e => {
    let Value = e.target.value;
    this.setState({
      costhead: Value
    });
  };
  InputValueFrom_Hours = e => {
    let Input_Value_Hours = e.target.value;
    this.setState({
      hours: Input_Value_Hours
    });
  };
  EstimateType() {
    axiosConfig
      .get("/estimateType", { headers: headers() })
      .then(Response => {
        let Data_CostHead = Response.data;
        this.setState({ NewRowData: Data_CostHead });
      })
      .catch(err => {
        this.errorHandle(err);
      });
  }

  render() {
    return (
      <div className="modalDialog">
        <div>
          <div onClick={() => this.close()} title="Close" className="close">
            {" "}
            X{" "}
          </div>
          <h5>Approximate Estimate</h5>
          <Form>
            <Row>
              <Col xl={6} lg={6} md={6}>
                <FormGroup>
                  <Label for="exampleEmail">Cost Head</Label>
                  <Input
                    type="select"
                    name="select"
                    id="exampleSelect"
                    onChange={this.EstimatedCostHead}
                    value={this.state.costhead}
                    style={{ height: 50 }}
                  >
                    {this.state.NewRowData.map(res => {
                      return (
                        <option
                          key={res.project_capacity_type_id}
                          value={res.project_capacity_type_id}
                        >
                          {res.project_capacity_type_name}
                        </option>
                      );
                    })}
                  </Input>
                </FormGroup>
              </Col>
              <Col xl={6} lg={6} md={6}>
                <FormGroup>
                  <Label for="hours">Hours</Label>
                  <Input
                    type="text"
                    name="hours"
                    id="hours"
                    onChange={this.InputValueFrom_Hours}
                    placeholder="Hours"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Button
              color="success"
              className="mr-3"
              onClick={this.AddNewRowData}
            >
              Submit
            </Button>
            <Button color="success" onClick={() => this.close()}>
              Cancel
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default EstModal;
