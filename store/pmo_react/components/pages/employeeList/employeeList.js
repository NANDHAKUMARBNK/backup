import React, { useEffect, useState } from "react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import Atoms from "../../ui/atoms";
import Templates from "../../ui/templates";
import EmployeeGridSetting from "./employeeGridSetting";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { getEmployeesAPI } from "../../../services/employeeListService";
import Molecules from "../../ui/molecules";
const EmployeeList = (props) => {
  let [employees, setEmployees] = useState("");
  // let [gridApi, setGridApi] = useState("");
  // let [gridColumnApi, setGridColumnApi] = useState("");
  let [passInfo, setPassInfo] = useState("");
  let [isPopUp, setIsPopUp] = useState(false);
  let [title, setTitle] = useState("");
  // let [discard, setDiscard] = useState(false);
  const columnDefinitionEmployeeList = EmployeeGridSetting();
  const modulesCommunity = AllCommunityModules;
  const pageSizeForPagination = 14;
  useEffect(() => {
    employeesFn();
  }, []);
  const employeesFn = async () => {
    let responseEmployees = await getEmployeesAPI();
    if (responseEmployees) {
      setEmployees(responseEmployees);
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
  const cellClickEmpList = (e) => {
    let headerName_From_ColDef = e.colDef.headerName;
    let cellData = e.data;
    setPassInfo(cellData);
    if (headerName_From_ColDef === "edit") {
      setIsPopUp(true);
      setTitle("Edit");
    }
    if (headerName_From_ColDef === "delete") {
      // setDiscard(true);
      setPassInfo(cellData);
    }
  };
  const addItems = () => {
    setIsPopUp(true);
    setTitle("Add");
  };
  // const modelCloseAlongGridRefresh = async () => {
  //   await this.getEmployeesAPI();
  //   setIsPopUp(false);
  //   setDiscard(false);
  // };
  const modelClose = () => {
    setIsPopUp(false);
    // setDiscard(false);
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
          <Atoms.HeaderText content="Employee List" />
        </Molecules.RowColSet>
        <Atoms.CustomRow>
          <Atoms.CustomCol>
            <Atoms.CustomButton
              className="customVioletBtn float-right"
              buttonName="Add"
              action={addItems}
            />
          </Atoms.CustomCol>
        </Atoms.CustomRow>
        <Atoms.Section className="agGridCommonContainer">
          <div className="ag-theme-balham">
            <Atoms.AggridReact
              columnDefs={columnDefinitionEmployeeList}
              rowData={employees}
              onGridReady={gridApiReady}
              pagination={true}
              suppressRowClickSelection={true}
              paginationPageSize={pageSizeForPagination}
              modules={modulesCommunity}
              onCellClicked={cellClickEmpList}
              floatingFilter={true}
              defaultColDef={defaultColDefinition}
            />
          </div>
        </Atoms.Section>

        {isPopUp && title === "Edit" ? (
          <Templates.EmployeeModal
            closePopup={modelClose}
            passData={passInfo}
            isPopUp={isPopUp}
            title={title}
          />
        ) : null}
        {isPopUp && title === "Add" ? (
          <Templates.EmployeeModal
            closePopup={modelClose}
            isPopUp={isPopUp}
            title={title}
          />
        ) : null}
      </Templates.DashboardTemplate>
    </Atoms.Section>
  );
};
export default EmployeeList;
