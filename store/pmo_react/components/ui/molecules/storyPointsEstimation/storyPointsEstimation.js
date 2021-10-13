import React, { useEffect, useState } from "react";
import Atoms from "../../atoms";
import Moment from "moment";
import { updateEstimationExerciseAPI } from "../../../../services/sprintViewService";
import toastr from "toastr";
const StoryPointsEstimation = (props) => {
  let [estimationId, setEstimationId] = useState("");
  let [audienceFrom_StoryPoint, setAudienceFrom_StoryPoint] = useState("");
  let [when_StoryPoint, setWhen_StoryPoint] = useState("");
  let [totalStory_StoryPoint, setTotalStory_StoryPoint] = useState("");
  let [totalStorypoints_StoryPoint, setTotalStorypoints_StoryPoint] = useState(
    ""
  );
  useEffect(() => {
    detailsFromEditSprint();
  }, []);
  const detailsFromEditSprint = () => {
    let Sprint_Details_Obj = props.SprintInformation;
    if (Sprint_Details_Obj) {
      let StoryPoint_estimation =
        Sprint_Details_Obj.project_estimation_exercise;
      if (StoryPoint_estimation) {
        StoryPoint_estimation.forEach((Inside_Item) => {
          if (Inside_Item) {
            let EstimationId = Inside_Item.project_estimation_exercise_id;
            if (EstimationId) {
              setEstimationId(EstimationId);
            }
            let Audience = Inside_Item.exercise_audience;
            if (Audience) {
              setAudienceFrom_StoryPoint(Audience);
            }
            let When = Moment(Inside_Item.exercise_date).format("YYYY-MM-DD");
            if (When) {
              setWhen_StoryPoint(When);
            }
            let TotalStories = Inside_Item.project_total_stories;
            if (TotalStories) {
              setTotalStory_StoryPoint(TotalStories);
            }
            let TotalStoriesPoint = Inside_Item.project_total_story_points;
            if (TotalStoriesPoint) {
              setTotalStorypoints_StoryPoint(TotalStoriesPoint);
            }
          }
        });
      }
    }
  };
  const audience = (e) => {
    let Value = e.target.value;
    setAudienceFrom_StoryPoint(Value);
  };
  const when = (e) => {
    let When_Value = e.target.value;
    setWhen_StoryPoint(When_Value);
  };
  const totalStory = (e) => {
    let AllStory_Value = e.target.value;
    setTotalStory_StoryPoint(AllStory_Value);
  };
  const totalStoryPoints = (e) => {
    let AllStoryPoints_Value = e.target.value;
    setTotalStorypoints_StoryPoint(AllStoryPoints_Value);
  };
  const onSaveEstimationExercise = async () => {
    toastr.options = {
      positionClass: "toast-top-full-width",
      hideDuration: 300,
      timeOut: 3000,
    };
    const dataEstimationExercise = [
      {
        project_estimation_exercise_id: estimationId,
        exercise_audience: audienceFrom_StoryPoint,
        exercise_date: when_StoryPoint,
        project_total_stories: parseInt(totalStory_StoryPoint),
        project_total_story_points: parseInt(totalStorypoints_StoryPoint),
      },
    ];
    const reqBody = {
      project_estimation_exercise: dataEstimationExercise,
    };
    let sprintCode = props.SprintInformation.sprint_id;
    let projectId = props.projectInfo.project_code;
    let responseEstimationExercise = await updateEstimationExerciseAPI(
      projectId,
      sprintCode,
      reqBody
    );
    if (responseEstimationExercise) {
      toastr.success(`Successfully Saved`);
      return;
    }
  };

  return (
    <Atoms.Section>
      <Atoms.CustomRow>
        <Atoms.CustomCol>
          <Atoms.FormGroup className="mt-5">
            <Atoms.FormLabel labelName="Audience" />
            <Atoms.FormInput
              type="text"
              changeValue={audience}
              Value={audienceFrom_StoryPoint}
            />
          </Atoms.FormGroup>
          <Atoms.FormGroup className="mt-5">
            <Atoms.FormLabel labelName="When" />
            <Atoms.FormInput
              type="text"
              changeValue={when}
              Value={when_StoryPoint}
            />
          </Atoms.FormGroup>
          <Atoms.FormGroup className="mt-5">
            <Atoms.FormLabel labelName="Total Stories" />
            <Atoms.FormInput
              type="text"
              changeValue={totalStory}
              Value={totalStory_StoryPoint}
            />
          </Atoms.FormGroup>
          <Atoms.FormGroup className="mt-5">
            <Atoms.FormLabel labelName="Story Points" />
            <Atoms.FormInput
              type="text"
              changeValue={totalStoryPoints}
              Value={totalStorypoints_StoryPoint}
            />
          </Atoms.FormGroup>
        </Atoms.CustomCol>
      </Atoms.CustomRow>
      <Atoms.CustomButton
        buttonName="Save"
        className="mt-2 customVioletBtn"
        action={onSaveEstimationExercise}
      />
    </Atoms.Section>
  );
};
export default StoryPointsEstimation;
