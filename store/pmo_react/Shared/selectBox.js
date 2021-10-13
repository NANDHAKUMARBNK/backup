import React from "react";
import { Form, FormGroup, Input } from "reactstrap";
import axiosConfig from "../Config/config";
import headers from "../Config/headers";
class CustomEstimateSelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getCost: [],
      EstimatedCost: ""
    };
    this.ChangeEstimatedCost = this.ChangeEstimatedCost.bind(this);
  }

  componentDidMount() {
    this.getEstimateType();
  }
  getEstimateType() {
    axiosConfig.get("/estimateType", { headers: headers() }).then(res => {
      this.setState({ getCost: res.data });
    });
  }
  ChangeEstimatedCost = e => {
    let Estimated_Cost = e.target.value;
    this.setState({
      EstimatedCost: Estimated_Cost
    });
    this.props.dropDownChangeEvent(Estimated_Cost, this.props.rowIndex);
  };
  render() {
    return (
      <div>
        <Form>
          <FormGroup>
            <Input
              type="select"
              name="select"
              onChange={this.ChangeEstimatedCost}
              value={this.state.EstimatedCost}
            >
              {this.state.getCost.map(res => {
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
        </Form>
      </div>
    );
  }
}

export default CustomEstimateSelectBox;
