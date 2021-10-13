import React from "react";
import Col from "react-bootstrap/Col";
import { FormGroup, Label, Input } from "reactstrap";
import Moment from "moment";
class StoryPointEst extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      StoryPointEstimation: [],
      AudienceFrom_StoryPoint: "",
      when_StoryPoint: "",
      totalStory_StoryPoint: "",
      totalStorypoints_StoryPoint: "",
      NewAudience: "",
      NewWhen: "",
      CreateTotalStories: "",
      CreateTotalStoriesPoints: ""
    };
    this.Audience = this.Audience.bind(this);
    this.When = this.When.bind(this);
    this.TotalStory = this.TotalStory.bind(this);
    this.TotalStoryPoints = this.TotalStoryPoints.bind(this);
    this.DataSendingFor_CreateSprint = this.DataSendingFor_CreateSprint.bind(
      this
    );
  }
  componentDidMount() {
    let Sprint_Details_Obj = this.props.SprintDetails;
    if (Sprint_Details_Obj) {
      this.setState({
        Sprint_Single: Sprint_Details_Obj
      });
      let StoryPoint_estimation =
        Sprint_Details_Obj.project_estimation_exercise;
      if (StoryPoint_estimation) {
        StoryPoint_estimation.forEach(Inside_Item => {
          if (Inside_Item) {
            this.setState({
              StoryPointEstimation: Inside_Item
            });
            let Audience = Inside_Item.exercise_audience;
            if (Audience) {
              this.setState({
                AudienceFrom_StoryPoint: Audience
              });
            }
            let When = Moment(Inside_Item.exercise_date).format("YYYY-MM-DD");
            if (When) {
              this.setState({
                when_StoryPoint: When
              });
            }
            let TotalStories = Inside_Item.project_total_stories;
            if (TotalStories) {
              this.setState({
                totalStory_StoryPoint: TotalStories
              });
            }
            let TotalStoriesPoint = Inside_Item.project_total_story_points;
            if (TotalStoriesPoint) {
              this.setState({
                totalStorypoints_StoryPoint: TotalStoriesPoint
              });
            }
          }
        });
      }
    }
  }
  DataSendingFor_CreateSprint = e => {
    const Sending_Values = {
      Audience_New: this.state.NewAudience,
      When_New: this.state.NewWhen,
      TotalStory_New: this.state.CreateTotalStories,
      TotalStoryPoints_New: this.state.CreateTotalStoriesPoints
    };
    this.props.StoryPointEstimationInputValues(Sending_Values);
  };
  Audience = e => {
    let Value = e.target.value;
    this.setState({
      AudienceFrom_StoryPoint: Value
    });
  };
  When = e => {
    let When_Value = e.target.value;
    this.setState({
      when_StoryPoint: When_Value
    });
  };
  TotalStory = e => {
    let AllStory_Value = e.target.value;
    this.setState({
      totalStory_StoryPoint: AllStory_Value
    });
  };
  TotalStoryPoints = e => {
    let AllStoryPoints_Value = e.target.value;
    this.setState({
      totalStorypoints_StoryPoint: AllStoryPoints_Value
    });
  };
  AudienceName = e => {
    let Input_Value = e.target.value;
    this.setState({
      NewAudience: Input_Value
    });
  };
  WhenNewOne = e => {
    let Input_Value = e.target.value;
    this.setState({
      NewWhen: Input_Value
    });
  };
  CreateTotalStoriesFn = e => {
    let Input_Value = e.target.value;
    this.setState({
      CreateTotalStories: Input_Value
    });
  };
  CreateTotalStoriesPointsFn = e => {
    let Input_Value = e.target.value;
    this.setState({
      CreateTotalStoriesPoints: Input_Value
    });
  };
  render() {
    return (
      <section className="mt-3">
        {!this.state.Sprint_Single ? (
          <FormGroup row className="">
            <Label
              className="text-left align-self-center customLabelFontSize"
              for="audiencee"
              xl={4}
              lg={4}
              md={4}
            >
              Audience
            </Label>
            <Col xl={7} lg={7} md={7} className="">
              <Input
                type="text"
                name="audience"
                id="audience"
                onChange={this.AudienceName.bind(this)}
                value={this.state.NewAudience}
                onBlur={this.DataSendingFor_CreateSprint}
              />
            </Col>
          </FormGroup>
        ) : null}
        {this.state.Sprint_Single ? (
          <FormGroup row className="">
            <Label
              className="text-left align-self-center customLabelFontSize"
              for="audienceData"
              xl={4}
              lg={4}
              md={4}
            >
              Audience
            </Label>
            <Col xl={7} lg={7} md={7} className="">
              <Input
                type="text"
                name="audience"
                id="audience"
                onChange={this.Audience}
                value={this.state.AudienceFrom_StoryPoint}
              />
            </Col>
          </FormGroup>
        ) : null}
        {this.state.Sprint_Single ? (
          <FormGroup row className="">
            <Label
              className="text-left align-self-center customLabelFontSize"
              for="when"
              xl={4}
              lg={4}
              md={4}
            >
              When
            </Label>
            <Col xl={4} lg={4} md={4} className="">
              <Input
                type="text"
                name="select"
                id="when"
                onChange={this.When}
                value={this.state.when_StoryPoint}
              ></Input>
            </Col>
          </FormGroup>
        ) : null}
        {!this.state.Sprint_Single ? (
          <FormGroup row className="">
            <Label
              className="text-left align-self-center customLabelFontSize"
              for="when"
              xl={4}
              lg={4}
              md={4}
            >
              When
            </Label>
            <Col xl={4} lg={4} md={4} className="">
              <Input
                type="text"
                name="select"
                id="exampleSelect"
                onChange={this.WhenNewOne.bind(this)}
                value={this.state.NewWhen}
                onBlur={this.DataSendingFor_CreateSprint}
              ></Input>
            </Col>
          </FormGroup>
        ) : null}
        {this.state.Sprint_Single ? (
          <FormGroup row className="">
            <Label
              className="text-left align-self-center customLabelFontSize"
              for="total"
              xl={4}
              lg={4}
              md={4}
            >
              Total stories
            </Label>
            <Col xl={4} lg={4} md={4} className="">
              <Input
                type="text"
                name="totalstory"
                id="totalstory"
                onChange={this.TotalStory}
                value={this.state.totalStory_StoryPoint}
              />
            </Col>
          </FormGroup>
        ) : null}
        {!this.state.Sprint_Single ? (
          <FormGroup row className="">
            <Label
              className="text-left align-self-center customLabelFontSize"
              for="total"
              xl={4}
              lg={4}
              md={4}
            >
              Total stories
            </Label>
            <Col xl={4} lg={4} md={4} className="">
              <Input
                type="text"
                name="totalstory"
                id="totalstory"
                onChange={this.CreateTotalStoriesFn.bind(this)}
                value={this.state.CreateTotalStories}
                onBlur={this.DataSendingFor_CreateSprint}
              />
            </Col>
          </FormGroup>
        ) : null}
        {this.state.Sprint_Single ? (
          <FormGroup row className="">
            <Label
              className="text-left align-self-center customLabelFontSize"
              for="points"
              xl={4}
              lg={4}
              md={4}
            >
              Total Story points
            </Label>
            <Col xl={4} lg={4} md={4} className="">
              <Input
                type="text"
                name="storypoints"
                id="storypoints"
                onChange={this.TotalStoryPoints}
                value={this.state.totalStorypoints_StoryPoint}
              />
            </Col>
          </FormGroup>
        ) : null}
        {!this.state.Sprint_Single ? (
          <FormGroup row className="">
            <Label
              className="text-left align-self-center customLabelFontSize"
              for="points"
              xl={4}
              lg={4}
              md={4}
            >
              Total Story points
            </Label>
            <Col xl={4} lg={4} md={4} className="">
              <Input
                type="text"
                name="storypoints"
                id="storypoints"
                onChange={this.CreateTotalStoriesPointsFn.bind(this)}
                value={this.state.CreateTotalStoriesPoints}
                onBlur={this.DataSendingFor_CreateSprint}
              />
            </Col>
          </FormGroup>
        ) : null}
      </section>
    );
  }
}

export default StoryPointEst;
