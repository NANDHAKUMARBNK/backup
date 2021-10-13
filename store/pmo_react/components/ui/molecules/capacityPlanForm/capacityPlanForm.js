import React, { useState, useEffect } from "react";
import Atoms from "../../atoms";
import { updateCapacityPlanFormAPI } from "../../../../services/sprintViewService";
import toastr from "toastr";
const CapacityPlanForm = (props) => {
  let [ide, setId] = useState("");
  let [audience, setAudience] = useState("");
  let [capacityPerson, setCapacityPerson] = useState("");
  let [focusFactor, setFocusFactor] = useState("");
  let [velocityExpected, setVelocityExpected] = useState("");
  let [velocity, setVelocity] = useState("");
  let [sprintCapacity, setSprintCapacity] = useState("");
  let [totalCapacity, setTotalCapacity] = useState("");
  let [noOfSprint, setNoOfSprint] = useState("");
  useEffect(() => {
    retrieveCapacityPlanInfoAboutSprintDetails();
  }, []);
  const retrieveCapacityPlanInfoAboutSprintDetails = () => {
    if (props.SprintInformation) {
      let dataSprint = props.SprintInformation;
      let capacityPlanningFormData = dataSprint.project_capacity_exercise;
      if (capacityPlanningFormData) {
        capacityPlanningFormData.forEach((insideEle) => {
          let id = insideEle.project_capacity_exercise_id;
          setId(id);
          let AudienceEx = insideEle.exercise_audience;
          setAudience(AudienceEx);
          let CapacityPersonEx = insideEle.capacity_person;
          setCapacityPerson(CapacityPersonEx);
          let FocusFactorEx = insideEle.focus_factor;
          setFocusFactor(FocusFactorEx);
          let ExpectedVelocity = insideEle.expected_velocity;
          setVelocityExpected(ExpectedVelocity);
        });
      }
    }
  };
  const audienceChange = (e) => {
    let Input_Value = e.target.value;
    setAudience(Input_Value);
  };
  const velocityExpectedChange = (e) => {
    let Input_Value = e.target.value;
    setVelocityExpected(Input_Value);
  };
  const focusFactorChange = (e) => {
    let Input_Value = e.target.value;
    setFocusFactor(Input_Value);
  };
  const capacityPersonChange = (e) => {
    let Input_Value = e.target.value;
    setCapacityPerson(Input_Value);
  };
  const noOfSprintChange = (e) => {
    let Input_Value = e.target.value;
    setNoOfSprint(Input_Value);
  };
  const velocityChange = (e) => {
    let Input_Value = e.target.value;
    setVelocity(Input_Value);
  };
  const sprintCapacityChange = (e) => {
    let Input_Value = e.target.value;
    setSprintCapacity(Input_Value);
  };
  const totalCapacityChange = (e) => {
    let Input_Value = e.target.value;
    setTotalCapacity(Input_Value);
  };
  const onSaveCapacityPlanForm = async () => {
    toastr.options = {
      positionClass: "toast-top-full-width",
      hideDuration: 300,
      timeOut: 3000,
    };
    const capacityPlanFormData = [
      {
        project_capacity_exercise_id: ide,
        exercise_audience: audience,
        capacity_person: parseInt(capacityPerson),
        focus_factor: parseInt(focusFactor),
        expected_velocity: parseInt(velocityExpected),
      },
    ];
    const reqBody = {
      project_capacity_exercise: capacityPlanFormData,
    };
    let sprintCode = props.SprintInformation.sprint_id;
    let projectId = props.projectInfo.project_code;
    let response = await updateCapacityPlanFormAPI(
      projectId,
      sprintCode,
      reqBody
    );
    if (response) {
      toastr.success(`Successfully Saved`);
      return;
    }
  };

  return (
    <Atoms.Section className="text-left mt-4">
      <Atoms.H5 content="Capacity Plan Form" />
      <Atoms.CustomRow>
        <Atoms.CustomCol xl={4} lg={4} md={4}>
          <Atoms.FormGroup className="mt-4">
            <Atoms.FormLabel labelName="Audience" />
            <Atoms.FormInput
              type="text"
              changeValue={audienceChange}
              Value={audience}
            />
          </Atoms.FormGroup>
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={4} lg={4} md={4}>
          <Atoms.FormGroup className="mt-4">
            <Atoms.FormLabel labelName="Capacity Person" />
            <Atoms.FormInput
              type="text"
              changeValue={capacityPersonChange}
              Value={capacityPerson}
            />
          </Atoms.FormGroup>
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={4} lg={4} md={4}>
          <Atoms.FormGroup className="mt-4">
            <Atoms.FormLabel labelName="Capacity Sprint" />
            <Atoms.FormInput
              type="text"
              changeValue={sprintCapacityChange}
              Value={sprintCapacity}
            />
          </Atoms.FormGroup>
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={4} lg={4} md={4}>
          <Atoms.FormGroup className="mt-4">
            <Atoms.FormLabel labelName="Focus Factor" />
            <Atoms.FormInput
              type="text"
              changeValue={focusFactorChange}
              Value={focusFactor}
            />
          </Atoms.FormGroup>
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={4} lg={4} md={4}>
          <Atoms.FormGroup className="mt-4">
            <Atoms.FormLabel labelName="Average Velocity Expected(Story Points)" />
            <Atoms.FormInput
              type="text"
              changeValue={velocityExpectedChange}
              Value={velocityExpected}
            />
          </Atoms.FormGroup>
        </Atoms.CustomCol>
        <Atoms.Div className="customDividerLine" />
        <Atoms.CustomCol xl={4} lg={4} md={4}>
          <Atoms.FormGroup className="mt-4">
            <Atoms.FormLabel labelName="Total Capacity" />
            <Atoms.FormInput
              type="text"
              changeValue={totalCapacityChange}
              Value={totalCapacity}
            />
          </Atoms.FormGroup>
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={4} lg={4} md={4}>
          <Atoms.FormGroup className="mt-4">
            <Atoms.FormLabel labelName="Estimated Capacity" />
            <Atoms.FormInput
              type="text"
              changeValue={velocityChange}
              Value={velocity}
            />
          </Atoms.FormGroup>
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={4} lg={4} md={4}>
          <Atoms.FormGroup className="mt-4">
            <Atoms.FormLabel labelName="No of Sprints" />
            <Atoms.FormInput
              type="text"
              changeValue={noOfSprintChange}
              Value={noOfSprint}
            />
          </Atoms.FormGroup>
        </Atoms.CustomCol>
      </Atoms.CustomRow>
      <Atoms.CustomButton
        buttonName="Save"
        className="mt-2 customVioletBtn"
        action={onSaveCapacityPlanForm}
      />
    </Atoms.Section>
  );
};

export default CapacityPlanForm;
