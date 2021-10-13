import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Moment from "moment";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import SprintHead from "../Shared/SprintHeader";
import axiosConfig from "../Config/config";
import headers from "../Config/headers";
class SprntVw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SingleProjectDetailsData: [],
      SprintCapacityDetails: [],
      Sprint_DetailsArr: [],
      SingleSprintData: [],
      Sprint_Name: ""
    };
    this.createsprint = this.createsprint.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    this.getSingleProjectDetails();
  }
  errorHandle = err => {
    if (err.response.status === 401) {
      this.props.history.push("/");
      window.location.reload();
    }
  };
  getSingleProjectDetails() {
    let Data_fromActiveProjectList = this.props.location.state.Data;
    if (Data_fromActiveProjectList) {
      let projId = Data_fromActiveProjectList.project_code;
      axiosConfig
        .get(`/projects/${projId}`, { headers: headers() })
        .then(res => {
          let Response = res.data;

          this.setState({
            SingleProjectDetailsData: Response
          });
          Response.forEach(Item => {
            this.setState({
              SprintCapacityDetails: Item.sprint_capacity_details
            });
            this.setState({
              Sprint_DetailsArr: Item.sprint_details

            });
            Item.sprint_details.forEach(res => {
              this.setState({
                Sprint_Name: res.sprint_name
              })
            })
          });
        })
        .catch(err => {
          this.errorHandle(err);
        });
    }
  }

  createsprint() {
    let Data = this.props.location.state.Data;
    this.props.history.push("createsprint", { Data });
  }
  handleClick(ResponseFrom_card) {
    let Data_fromActiveProjectList = this.props.location.state.Data;
    let Proj_Code = Data_fromActiveProjectList.project_code;
    let Sprint_Id = ResponseFrom_card.sprint_id;
    axiosConfig
      .get(`/sprints/${Proj_Code}/${Sprint_Id}`, {
        headers: headers()
      })
      .then(response => {
        let ResponseFromSingleSprint = response.data;
        this.setState({ SingleSprintData: ResponseFromSingleSprint });
        let ResponseFrom_SingleSprint = this.state.SingleSprintData;
        if (ResponseFrom_SingleSprint) {
          let Data = this.props.location.state.Data;
          let SprintSingle_Data = ResponseFrom_SingleSprint;
          this.props.history.push("editsprintview", {
            Data,
            SprintSingle_Data
          });
        }
      })
      .catch(err => {
        this.errorHandle(err);
      });
  }
  render() {
    return (
      <div className="sprintViewContainer">
        <h1>Sprint View</h1>
        <Row className="justify-content-start">
          <Col xl={12} lg={12} md={12} className="">
            <SprintHead Data={this.props.location.state.Data} />
          </Col>
          {this.state.SprintCapacityDetails.map(res => {
            return (
              <Col
                xl={3}
                lg={3}
                md={3}
                className=""
                key={res.sprint_id}
                value={res.sprint_id}
              >
                <div
                  className="existingSprintSquareContainer backgroundOrange"
                  onClick={() => this.handleClick(res)}
                >
                  <p>
                    Start Date :
                    {Moment(res.sprint_start_date).format("YYYY-MM-DD")}
                  </p>
                  <p>
                    End Date :{Moment(res.sprint_end_date).format("YYYY-MM-DD")}
                  </p>
                  <p>Allocated Capactiy : {res.allocated_hours}</p>
                  <p>Available Capacity: {res.available_hours}</p>
                  <p>Committed Capacity: {res.committed_hours}</p>
                  <p>Extended Capactiy: {res.expended_hours}</p>
                  <p>Stories Committed vs Actuals</p>
                  <p>Technical Debt</p>
                  <p>Bug Debt</p>
                </div>
                {/* <h4 className="mt-3">{this.state.Sprint_Name}</h4> */}
              </Col>
            );
          })}
          {/* { this.state.SprintCapacityDetails ?
            <Col xl={12} lg={12} md={12}>
            <div className="customDividerLine mt-4"></div>
          </Col>
          } */}
          {
            this.state.SprintCapacityDetails.length > 0 ? (
              <Col xl={12} lg={12} md={12}>
                <div className="customDividerLine mt-4"></div>
              </Col>
            ) : null
          }

        </Row>

        <Row className="mt-5 justify-content-center mb-4">
          <Col xl={3} lg={3} md={3} className="createSprintSection">
            <h4>Create Sprint</h4>
            <div
              className="createSprintInnerCircle"
              onClick={this.createsprint}
            >
              <i className="fas fa-plus" id="tooltip"></i>
            </div>

          </Col>
        </Row>
      </div >
    );
  }
}

export default SprntVw;
