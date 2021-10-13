import React, { useState, useEffect } from "react";
import Atoms from "../../ui/atoms";
import Molecules from "../../ui/molecules";
import Templates from "../../ui/templates";
import "./projectList.css";
import projectGridSetting from "./projectGridSetting";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { getProjectsAPI } from "../../../services/resourceUtilizationService";
const ProjectList = (props) => {
  let [projects, setProjects] = useState("");
  // let [gridApi, setGridApi] = useState("");
  // let [gridColumnApi, setGridColumnApi] = useState("");
  const columnDefinitionProjectList = projectGridSetting();
  const modulesCommunity = AllCommunityModules;
  const pageSizeForPagination = 14;
  useEffect(() => {
    projectList();
  }, []);
  const projectList = async () => {
    let projectListResponse = await getProjectsAPI();
    if (projectListResponse) {
      setProjects(projectListResponse);
    }
  };
  const gridApiReady = (params) => {
    let paramsApi = params.api;
    window.onresize = () => {
      paramsApi.sizeColumnsToFit();
    };
    // setGridApi(paramsApi);
    // let paramsColumnApi = params.columnApi;
    // setGridColumnApi(paramsColumnApi);
  };
  function defaultColDefinition() {
    return {
      resizable: true,
    };
  }
  return (
    <Atoms.Section>
      <Templates.DashboardTemplate>
        <Molecules.RowColSet>
          <Atoms.HeaderText content="Projects List" />
        </Molecules.RowColSet>
        <Atoms.Section className="agGridCommonContainer">
          <div className="ag-theme-balham">
            <Atoms.AggridReact
              columnDefs={columnDefinitionProjectList}
              rowData={projects}
              onGridReady={gridApiReady}
              pagination={true}
              suppressRowClickSelection={true}
              paginationPageSize={pageSizeForPagination}
              modules={modulesCommunity}
              floatingFilter={true}
              defaultColDef={defaultColDefinition}
            />
          </div>
        </Atoms.Section>
      </Templates.DashboardTemplate>
    </Atoms.Section>
  );
};
export default ProjectList;
