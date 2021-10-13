import React from "react";
import Atoms from "../../atoms";
import Moment from "moment";
import { useHistory } from "react-router-dom";
import {
  getSprintDetailsAPI,
  deleteSprintAPI,
} from "../../../../services/sprintViewService";
const SprintCard = (props) => {
  let history = useHistory();
  const capacity_Data = props.capacityDetailsArray;
  const sprintCard = (responseFromCard) => {
    return getSprint(responseFromCard);
  };
  async function getSprint(dataFromSprintCard) {
    let sprintId = dataFromSprintCard.sprint_id;
    let project_Info = props.Data;
    let project_Code_Id = project_Info.project_code;
    if (project_Code_Id && sprintId) {
      let responseFromSprintDetailsAPI = await getSprintDetailsAPI(
        project_Code_Id,
        sprintId
      );
      let responseData = responseFromSprintDetailsAPI.data;
      if (responseFromSprintDetailsAPI && responseData) {
        let SprintSingle_Data = responseData;
        let Data = props.Data;
        history.push("editsprint", {
          Data,
          SprintSingle_Data,
        });
      }
    }
  }
  const deleteCard = (responseFromCard) => {
    return deleteSprint(responseFromCard);
  };
  async function deleteSprint(dataFromSprintCard) {
    let sprintId = dataFromSprintCard.sprint_id;
    let project_Info = props.Data;
    let project_Code_Id = project_Info.project_code;
    if (project_Code_Id && sprintId) {
      let responseFromDeleteAPI = await deleteSprintAPI(
        project_Code_Id,
        sprintId
      );
      if (responseFromDeleteAPI) {
        props.listOfSprintCards();
        return;
      }
    }
  }

  return (
    <Atoms.Section className="sprintViewContainer mt-4">
      <Atoms.CustomRow className="justify-content-start">
        {capacity_Data.map((response) => {
          return (
            <Atoms.CustomCol
              xl={3}
              lg={3}
              md={3}
              key={response.sprint_id}
              value={response.sprint_id}
            >
              <Atoms.Div className="existingSprintSquareContainer backgroundOrange">
                {response.sprint_start_date && response.sprint_end_date ? (
                  <Atoms.Paragraph
                    content={Moment(response.sprint_start_date).format(
                      "YYYY-MM-DD"
                    )}
                  >
                    {Moment(response.sprint_end_date).format("YYYY-MM-DD")}
                  </Atoms.Paragraph>
                ) : null}
                {!response.sprint_start_date || !response.sprint_end_date ? (
                  <Atoms.Paragraph content="Date Not Available"></Atoms.Paragraph>
                ) : null}
                <Atoms.Paragraph content="Allocated Capacity :">
                  {response.allocated_hours}
                </Atoms.Paragraph>
                <Atoms.Paragraph content="Available Capacity :">
                  {response.available_hours}
                </Atoms.Paragraph>
                <Atoms.Paragraph content="Commited Capacity :">
                  {response.committed_hours}
                </Atoms.Paragraph>
                <Atoms.Paragraph content="Expended Capactiy :">
                  {response.expended_hours}
                </Atoms.Paragraph>
                <Atoms.Paragraph content="committed Stories Vs Actuals" />
                <Atoms.Paragraph content="Technical Debt" />
                <Atoms.Paragraph content="Bug Debt" />
                <Atoms.ITag
                  class="fas fa-edit"
                  click={() => sprintCard(response)}
                ></Atoms.ITag>
                &nbsp; &nbsp;
                <Atoms.ITag
                  class="fas fa-trash"
                  click={() => deleteCard(response)}
                ></Atoms.ITag>
              </Atoms.Div>

              <Atoms.Div className="my-4">
                <Atoms.H2 content={response.sprint_type_name} />
              </Atoms.Div>
            </Atoms.CustomCol>
          );
        })}
      </Atoms.CustomRow>
      <Atoms.Div className="customDividerLine" />
    </Atoms.Section>
  );
};

export default SprintCard;
