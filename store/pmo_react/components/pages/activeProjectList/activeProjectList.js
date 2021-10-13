import React, { useState, useEffect } from "react";
import Atoms from "../../ui/atoms";
import Molecules from "../../ui/molecules";
import Templates from "../../ui/templates";
import ActiveGridSettings from "./activeGridSettings";
import { getActiveProjectsListAPI } from "../../../services/activeProjectListService";
import { useHistory } from "react-router-dom";
const ActiveProjectList = (props) => {
  let history = useHistory();
  let [activeList, setActiveList] = useState("");
  let [isPopUp, setIsPopUp] = useState(false);
  let [title, setTitle] = useState("");
  let [passInfo, setPassInfo] = useState("");
  const columnDefinitionActiveListOfProjects = ActiveGridSettings();
  useEffect(() => {
    activeProjectList();
  }, []);

  const activeProjectList = async () => {
    let projectsList = await getActiveProjectsListAPI();
    if (projectsList) {
      setActiveList(projectsList);
    }
  };

  const cellClick = (e) => {
    let headerName = e.colDef.headerName;
    if (headerName === "edit") {
      let cellData = e.data;
      if (cellData) {
        setPassInfo(cellData);
        setIsPopUp(true);
        setTitle("Edit");
      }
    } else {
      let projectData = e.data;
      if (projectData) {
        history.push("sprintview", { projectData });
      }
    }
  };

  const closepopup = (e) => {
    setIsPopUp(false);
  };

  const addActiveProject = () => {
    setIsPopUp(true);
    setTitle("Add");
  };

  return (
    <Atoms.Section>
      <Templates.DashboardTemplate>
        <Molecules.RowColSet>
          <Atoms.HeaderText content="Active Projects List" />
        </Molecules.RowColSet>
        <Atoms.CustomRow>
          <Atoms.CustomCol>
            <Atoms.CustomButton
              className="customVioletBtn float-right"
              buttonName="Add"
              action={addActiveProject}
            />
          </Atoms.CustomCol>
        </Atoms.CustomRow>
        <Atoms.Section className="agGridCommonContainer">
          <div className="ag-theme-balham">
            <Atoms.AggridReact
              columnDefs={columnDefinitionActiveListOfProjects}
              rowData={activeList}
              onCellClicked={cellClick}
              floatingFilter={true}
            />
          </div>
        </Atoms.Section>

        {isPopUp && title === "Edit" ? (
          <Templates.ActiveProjectsModal
            isPopUp={isPopUp}
            title={title}
            closePopup={closepopup}
            passInfo={passInfo}
            listOfProjectsInGrid={activeProjectList}
          />
        ) : null}
        {isPopUp && title === "Add" ? (
          <Templates.ActiveProjectsModal
            isPopUp={isPopUp}
            title={title}
            closePopup={closepopup}
            listOfProjectsInGrid={activeProjectList}
          />
        ) : null}
      </Templates.DashboardTemplate>
    </Atoms.Section>
  );
};

export default ActiveProjectList;
