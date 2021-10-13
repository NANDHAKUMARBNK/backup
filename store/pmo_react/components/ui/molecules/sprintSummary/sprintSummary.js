import React, { useState, useEffect } from "react";
import Atoms from "../../atoms";
import { updateSummaryAPI } from "../../../../services/sprintViewService";
import toastr from "toastr";
const SprintSummary = (props) => {
  let [allocated_Story_Points, setAllocated_Story_Points] = useState("");
  let [committed_Story_Points, setCommitted_Story_Points] = useState("");
  let [actual_Story_Points, setActual_Story_Points] = useState("");
  let [allocated_Storys, setAllocated_Storys] = useState("");
  let [committed_Storys, setCommitted_Storys] = useState("");
  let [actual_Storys, setActual_Storys] = useState("");
  let [allocated_Hours, setAllocated_Hours] = useState("");
  let [committed_Hours, setCommitted_Hours] = useState("");
  let [actual_Hours, setActual_Hours] = useState("");
  let [allocated_TechnicalDebt, setAllocated_TechnicalDebt] = useState("");
  let [committed_TechnicalDebt, setCommitted_TechnicalDebt] = useState("");
  let [actual_TechnicalDebt, setActual_TechnicalDebt] = useState("");
  let [allocated_EOSBugCount, setAllocated_EOSBugCount] = useState("");
  let [committed_EOSBugCount, setCommitted_EOSBugCount] = useState("");
  let [actual_EOSBugCount, setActual_EOSBugCount] = useState("");
  let [obj1, setObj1] = useState("");
  let [obj2, setObj2] = useState("");
  let [obj3, setObj3] = useState("");
  let [obj4, setObj4] = useState("");
  let [obj5, setObj5] = useState("");
  let [obj6, setObj6] = useState("");
  let [obj7, setObj7] = useState("");
  let [obj8, setObj8] = useState("");
  let [obj9, setObj9] = useState("");
  let [obj10, setObj10] = useState("");
  let [obj11, setObj11] = useState("");
  let [obj12, setObj12] = useState("");
  let [obj13, setObj13] = useState("");
  let [obj14, setObj14] = useState("");
  let [obj15, setObj15] = useState("");
  useEffect(() => {
    fromEditSprintViewAboutInfo();
  }, []);
  const fromEditSprintViewAboutInfo = () => {
    let Sprint_Obj_Data = props.SprintInformation;
    if (Sprint_Obj_Data) {
      let Completed = Sprint_Obj_Data.sprint_summary_completed;
      let InCompleted = Sprint_Obj_Data.sprint_summary_incomplete;
      let mergedArr = [...Completed, ...InCompleted];
      let storyPointAllocatedArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "Story Points Allocated"
      );
      setObj1(storyPointAllocatedArray);
      storyPointAllocatedArray.forEach((ele) => {
        setAllocated_Story_Points(ele.summary_value);
      });
      let storyPointCommittedArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "Story Points Committed"
      );
      setObj2(storyPointCommittedArray);
      storyPointCommittedArray.forEach((ele) => {
        setCommitted_Story_Points(ele.summary_value);
      });
      let storyPointActualArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "Story Points Actual"
      );
      setObj3(storyPointActualArray);
      storyPointActualArray.forEach((ele) => {
        setActual_Story_Points(ele.summary_value);
      });
      let storysAllocatedArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "Stories Allocated"
      );
      setObj4(storysAllocatedArray);
      storysAllocatedArray.forEach((ele) => {
        setAllocated_Storys(ele.summary_value);
      });
      let storysCommittedArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "Stories Committed"
      );
      setObj5(storysCommittedArray);
      storysCommittedArray.forEach((ele) => {
        setCommitted_Storys(ele.summary_value);
      });
      let storysActualArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "Stories Actual"
      );
      setObj6(storysActualArray);
      storysActualArray.forEach((ele) => {
        setActual_Storys(ele.summary_value);
      });
      let hoursAllocatedArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "Hours Allocated"
      );
      setObj7(hoursAllocatedArray);
      hoursAllocatedArray.forEach((ele) => {
        setAllocated_Hours(ele.summary_value);
      });
      let hoursCommittedArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "Hours Committed"
      );
      setObj8(hoursCommittedArray);
      hoursCommittedArray.forEach((ele) => {
        setCommitted_Hours(ele.summary_value);
      });
      let hoursActualArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "Hours Actual"
      );
      setObj9(hoursActualArray);
      hoursActualArray.forEach((ele) => {
        setActual_Hours(ele.summary_value);
      });
      let technicalDebtAllocatedArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "Technical Debt Allocated"
      );
      setObj10(technicalDebtAllocatedArray);
      technicalDebtAllocatedArray.forEach((ele) => {
        setAllocated_TechnicalDebt(ele.summary_value);
      });
      let technicalDebtCommittedArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "Technical Debt Committed"
      );
      setObj11(technicalDebtCommittedArray);
      technicalDebtCommittedArray.forEach((ele) => {
        setCommitted_TechnicalDebt(ele.summary_value);
      });
      let technicalDebtActualArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "Technical Debt Actual"
      );
      setObj12(technicalDebtActualArray);
      technicalDebtActualArray.forEach((ele) => {
        setActual_TechnicalDebt(ele.summary_value);
      });
      let eosAllocatedArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "EOS Bug Count Allocated"
      );
      setObj13(eosAllocatedArray);
      eosAllocatedArray.forEach((ele) => {
        setAllocated_EOSBugCount(ele.summary_value);
      });
      let eosCommittedArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "EOS Bug Count Committed"
      );
      setObj14(eosCommittedArray);
      eosCommittedArray.forEach((ele) => {
        setCommitted_EOSBugCount(ele.summary_value);
      });
      let eosActualArray = mergedArr.filter(
        (item) => item.sprint_summary_name === "EOS Bug Count Actual"
      );
      setObj15(eosActualArray);
      eosActualArray.forEach((ele) => {
        setActual_EOSBugCount(ele.summary_value);
      });
    }
  };
  const storyPoints_Allocated = (e) => {
    let Value_StoryPts_Alloc = e.target.value;
    setAllocated_Story_Points(Value_StoryPts_Alloc);
  };
  const storyPoints_Committed = (e) => {
    let Value_ = e.target.value;
    setCommitted_Story_Points(Value_);
  };
  const storyPoints_Actual = (e) => {
    let Value_ = e.target.value;
    setActual_Story_Points(Value_);
  };
  const storys_Allocated = (e) => {
    let Value_ = e.target.value;
    setAllocated_Storys(Value_);
  };
  const storys_Committed = (e) => {
    let Value_ = e.target.value;
    setCommitted_Storys(Value_);
  };
  const storys_Actual = (e) => {
    let Value_ = e.target.value;
    setActual_Storys(Value_);
  };
  const hours_Allocated = (e) => {
    let Value_ = e.target.value;
    setAllocated_Hours(Value_);
  };
  const hours_Committed = (e) => {
    let Value_ = e.target.value;
    setCommitted_Hours(Value_);
  };
  const hours_Actual = (e) => {
    let Value_ = e.target.value;
    setActual_Hours(Value_);
  };
  const technicalDebt_Allocated = (e) => {
    let Value_ = e.target.value;
    setAllocated_TechnicalDebt(Value_);
  };
  const technicalDebt_Committed = (e) => {
    let Value_ = e.target.value;
    setCommitted_TechnicalDebt(Value_);
  };
  const technicalDebt_Actual = (e) => {
    let Value_ = e.target.value;
    setActual_TechnicalDebt(Value_);
  };
  const eOSBugCount_Allocated = (e) => {
    let Value_ = e.target.value;
    setAllocated_EOSBugCount(Value_);
  };
  const eOSBugCount_Committed = (e) => {
    let Value_ = e.target.value;
    setCommitted_EOSBugCount(Value_);
  };
  const eOSBugCount_Actual = (e) => {
    let Value_ = e.target.value;
    setActual_EOSBugCount(Value_);
  };
  const onSaveSummary = async () => {
    toastr.options = {
      positionClass: "toast-top-full-width",
      hideDuration: 300,
      timeOut: 3000,
    };
    let allocatedStoryPoints = obj1;
    if (allocated_Story_Points) {
      allocatedStoryPoints.forEach((Inside) => {
        if (allocated_Story_Points) {
          Inside.summary_value = parseInt(allocated_Story_Points);
        }
      });
    }
    let committedStoryPoints = obj2;
    if (committedStoryPoints) {
      committedStoryPoints.forEach((Inside) => {
        if (committed_Story_Points) {
          Inside.summary_value = parseInt(committed_Story_Points);
        }
      });
    }
    let actualStoryPoints = obj3;
    if (actualStoryPoints) {
      actualStoryPoints.forEach((Inside) => {
        if (actual_Story_Points) {
          Inside.summary_value = parseInt(actual_Story_Points);
        }
      });
    }
    let allocatedStories = obj4;
    if (allocatedStories) {
      allocatedStories.forEach((Inside) => {
        if (allocated_Storys) {
          Inside.summary_value = parseInt(allocated_Storys);
        }
      });
    }
    let committedStories = obj5;
    if (committedStories) {
      committedStories.forEach((Inside) => {
        if (committed_Storys) {
          Inside.summary_value = parseInt(committed_Storys);
        }
      });
    }
    let actualStories = obj6;
    if (actualStories) {
      actualStories.forEach((Inside) => {
        if (actual_Storys) {
          Inside.summary_value = parseInt(actual_Storys);
        }
      });
    }
    let allocatedHours = obj7;
    if (allocatedHours) {
      allocatedHours.forEach((Inside) => {
        if (allocated_Hours) {
          Inside.summary_value = parseInt(allocated_Hours);
        }
      });
    }
    let committedHours = obj8;
    if (committedHours) {
      committedHours.forEach((Inside) => {
        if (committed_Hours) {
          Inside.summary_value = parseInt(committed_Hours);
        }
      });
    }
    let actualHours = obj9;
    if (actualHours) {
      actualHours.forEach((Inside) => {
        if (actual_Hours) {
          Inside.summary_value = parseInt(actual_Hours);
        }
      });
    }
    let allocatedTechnicalDebt = obj10;
    if (allocatedTechnicalDebt) {
      allocatedTechnicalDebt.forEach((Inside) => {
        if (allocated_TechnicalDebt) {
          Inside.summary_value = parseInt(allocated_TechnicalDebt);
        }
      });
    }
    let committedTechnicalDebt = obj11;
    if (committedTechnicalDebt) {
      committedTechnicalDebt.forEach((Inside) => {
        if (committed_TechnicalDebt) {
          Inside.summary_value = parseInt(committed_TechnicalDebt);
        }
      });
    }
    let actualTechnicalDebt = obj12;
    if (actualTechnicalDebt) {
      actualTechnicalDebt.forEach((Inside) => {
        if (actual_TechnicalDebt) {
          Inside.summary_value = parseInt(actual_TechnicalDebt);
        }
      });
    }
    let allocatedEosBug = obj13;
    if (allocatedEosBug) {
      allocatedEosBug.forEach((Inside) => {
        if (allocated_EOSBugCount) {
          Inside.summary_value = parseInt(allocated_EOSBugCount);
        }
      });
    }
    let committedEosBug = obj14;
    if (committedEosBug) {
      committedEosBug.forEach((Inside) => {
        if (committed_EOSBugCount) {
          Inside.summary_value = parseInt(committed_EOSBugCount);
        }
      });
    }
    let actualEosBug = obj15;
    if (actualEosBug) {
      actualEosBug.forEach((Inside) => {
        if (actual_EOSBugCount) {
          Inside.summary_value = parseInt(actual_EOSBugCount);
        }
      });
    }
    let singleArrayForAll = [
      ...allocatedStoryPoints,
      ...committedStoryPoints,
      ...actualStoryPoints,
      ...allocatedStories,
      ...committedStories,
      ...actualStories,
      ...allocatedHours,
      ...committedHours,
      ...actualHours,
      ...allocatedTechnicalDebt,
      ...committedTechnicalDebt,
      ...actualTechnicalDebt,
      ...allocatedEosBug,
      ...committedEosBug,
      ...actualEosBug,
    ];
    if (singleArrayForAll) {
      singleArrayForAll.forEach((item) => {
        delete item["sprint_id"];
        delete item["sprint_summary_name"];
      });
    }
    const requestBody = {
      sprint_summary_completed: singleArrayForAll,
    };
    let sprintId = props.SprintInformation.sprint_id;
    let projectCode = props.projectInfo.project_code;
    let response = await updateSummaryAPI(projectCode, sprintId, requestBody);
    if (response) {
      toastr.success(`Successfully Saved`);
      return;
    }
  };
  return (
    <Atoms.Section className="SprintSummaryContainer mt-3">
      <Atoms.CustomRow className="justify-content-center">
        <Atoms.CustomCol xl={3} lg={3} md={3} className="text-center">
          <Atoms.FormLabel labelName="Allocated" />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3} className="text-center">
          <Atoms.FormLabel labelName="Committed" />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3} className="text-center">
          <Atoms.FormLabel labelName="Actual" />
        </Atoms.CustomCol>
      </Atoms.CustomRow>
      <Atoms.CustomRow className="justify-content-center mt-4">
        <Atoms.CustomCol xl={12} lg={12} md={12} className="text-left">
          <Atoms.FormLabel labelName="Story Points :" />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput
            changeValue={storyPoints_Allocated}
            Value={allocated_Story_Points}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput
            changeValue={storyPoints_Committed}
            Value={committed_Story_Points}
            name="Story Points Committed"
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput
            changeValue={storyPoints_Actual}
            Value={actual_Story_Points}
          />
        </Atoms.CustomCol>
      </Atoms.CustomRow>
      <Atoms.CustomRow className="justify-content-center mt-4">
        <Atoms.CustomCol xl={12} lg={12} md={12} className="text-left">
          <Atoms.FormLabel labelName="Stories :" />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput
            changeValue={storys_Allocated}
            Value={allocated_Storys}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput
            changeValue={storys_Committed}
            Value={committed_Storys}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput changeValue={storys_Actual} Value={actual_Storys} />
        </Atoms.CustomCol>
      </Atoms.CustomRow>
      <Atoms.CustomRow className="justify-content-center mt-4">
        <Atoms.CustomCol xl={12} lg={12} md={12} className="text-left">
          <Atoms.FormLabel labelName="Hours :" />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput
            changeValue={hours_Allocated}
            Value={allocated_Hours}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput
            changeValue={hours_Committed}
            Value={committed_Hours}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput changeValue={hours_Actual} Value={actual_Hours} />
        </Atoms.CustomCol>
      </Atoms.CustomRow>
      <Atoms.CustomRow className="justify-content-center mt-4">
        <Atoms.CustomCol xl={12} lg={12} md={12} className="text-left">
          <Atoms.FormLabel labelName="Technical Debt :" />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput
            changeValue={technicalDebt_Allocated}
            Value={allocated_TechnicalDebt}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput
            changeValue={technicalDebt_Committed}
            Value={committed_TechnicalDebt}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput
            changeValue={technicalDebt_Actual}
            Value={actual_TechnicalDebt}
          />
        </Atoms.CustomCol>
      </Atoms.CustomRow>
      <Atoms.CustomRow className="justify-content-center mt-4">
        <Atoms.CustomCol xl={12} lg={12} md={12} className="text-left">
          <Atoms.FormLabel labelName="Eos Bug Count :" />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput
            changeValue={eOSBugCount_Allocated}
            Value={allocated_EOSBugCount}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput
            changeValue={eOSBugCount_Committed}
            Value={committed_EOSBugCount}
          />
        </Atoms.CustomCol>
        <Atoms.CustomCol xl={3} lg={3} md={3}>
          <Atoms.FormInput
            changeValue={eOSBugCount_Actual}
            Value={actual_EOSBugCount}
          />
        </Atoms.CustomCol>
      </Atoms.CustomRow>
      <Atoms.CustomButton
        buttonName="Save"
        className="mt-2 customVioletBtn"
        action={onSaveSummary}
      />
    </Atoms.Section>
  );
};

export default SprintSummary;
