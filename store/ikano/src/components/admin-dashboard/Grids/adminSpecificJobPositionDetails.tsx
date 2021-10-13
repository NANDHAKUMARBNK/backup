import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import "../../styles/adminSpecificJobPositionDetails.scss";
import "../../styles/adminAgGrid.scss";
import Header from "../../header/header";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { AllModules } from "@ag-grid-enterprise/all-modules";
// import { AllCommunityModules } from "@ag-grid-community/all-modules";
import AdminJobPositionsViewButton from "../GridButtons/AdminJobPositionsViewButton";
import AdminApplicationStatusDropdown from "../GridDropdowns/AdminApplicationStatusDropdown";
import QualificationCell from "../GridDropdowns/QualificationCell";
import {
  getAllCandidateDetailsFromSpecificJobPositionAPI,
  updateCandidateApplicationStatusAPI,
} from "../../Services/AdminServices/AllCandidateDetailsFromSpecificJobPosition";
import AdminViewCandidateModal from "../GridModals/AdminViewCandidateModal";
import { useHistory } from "react-router-dom";
import BlockUI from "../../../common-themes/ui-blocker";
import { useTranslation } from "react-i18next";
export default function AdminSpecificJobPositionDetails({ history }: any) {
  const [blockUi, setblockUi]: any = useState(true);
  const { t } = useTranslation();
  const History: any = useHistory();
  if (history.location.state) {
    var {
      location: {
        state: { data },
      },
    }: any = history;
  } else {
    History.push("");
    localStorage.clear();
  }
  // const modulesCommunity: any = AllCommunityModules;
  const modulesEnterprise: any = AllModules;
  const PAGINATION__SIZE: any = 20;
  const [gridApi, setGridApi]: any = useState("");
  const [rowData, setRowData]: any = useState("");
  const [isLang, setIsLang]: any = useState("");
  const [isOpenViewCandidateList, setIsOpenViewCandidateList]: any =
    useState(false);
  const [candidateInfo, setCandidateInfo]: any = useState("");
  const [selectApplicationStatus, setSelectApplicationStatus]: any =
    useState("");
  const [style, setStyle]: any = useState({});
  useEffect(() => {
    if (!localStorage.getItem("Access_Token")) {
      History.push("");
      localStorage.clear();
    } else {
      let lang: any = localStorage.getItem("i18nextLng");
      setIsLang(lang);
      console.log(data, "orey");
      AllCandidateDetails();
      tokenExpire();
    }
  }, []);
  function tokenExpire() {
    const token: any = localStorage.getItem("Access_Token");
    if (token) {
      const decodedToken: any = jwt_decode(token);
      const currentDate = new Date();
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        history.push("");
        localStorage.clear();
      }
    } else {
      history.push("");
    }
  }
  const columnDefs = [
    {
      headerName: t("Candidate Name"),
      field: "candidateName",
      filter: "agMultiColumnFilter",
      width: 170,
      suppressNavigable: true,
      cellClass: "no-border",
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            display: "subMenu",
          },
          {
            filter: "agSetColumnFilter",
            filterParams: {
              buttons: ["reset"],
            },
          },
        ],
      },
    },
    {
      headerName: t("Qualification"),
      field: "candidateQualification",
      filter: "agMultiColumnFilter",
      width: 160,
      suppressNavigable: true,
      cellClass: "no-border",
      cellRenderer: "qualificationCellRenderer",
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            display: "subMenu",
          },
          {
            filter: "agSetColumnFilter",
            filterParams: {
              buttons: ["reset"],
            },
          },
        ],
      },
    },
    {
      headerName: t("Years of Experience"),
      field: "candidateExperiance",
      filter: "agMultiColumnFilter",
      width: 180,
      suppressNavigable: true,
      cellClass: "no-border",
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            display: "subMenu",
          },
          {
            filter: "agSetColumnFilter",
            filterParams: {
              buttons: ["reset"],
            },
          },
        ],
      },
    },
    {
      headerName: t("Ikano Values Score (%)"),
      field: "candidateScore",
      filter: "agMultiColumnFilter",
      width: 210,
      cellRenderer: function (params: any) {
        return `${params.value}%`;
      },
      suppressNavigable: true,
      cellClass: "no-border",
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            display: "subMenu",
          },
          {
            filter: "agSetColumnFilter",
            filterParams: {
              buttons: ["reset"],
            },
          },
        ],
      },
    },
    {
      headerName: t("Application Status"),
      field: "candidateStatus",
      filter: "agMultiColumnFilter",
      width: 170,
      cellRenderer: "applicationStatusCellRenderer",
      suppressNavigable: true,
      cellClass: "no-border",
      cellRendererParams: {
        selected: function (field: any) {
          setSelectApplicationStatus(field.appStatusChangedByUser);
          UpdateApplicationStatus(
            field.appStatusChangedByUser,
            field.changedBy
          );
        },
      },
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            display: "subMenu",
          },
          {
            filter: "agSetColumnFilter",
            filterParams: {
              buttons: ["reset"],
            },
          },
        ],
      },
    },
    {
      headerName: t("Action"),
      field: "",
      width: 140,
      cellStyle: {
        cursor: "pointer",
      },
      cellRenderer: "viewCellRendererSpecific",
      suppressNavigable: true,
      cellClass: "no-border",
      cellRendererParams: {
        clicked: function (field: any) {
          setIsOpenViewCandidateList(field.isFlag);
          setCandidateInfo(field.candidateInfo);
        },
      },
    },
  ];
  let GridApiFeatures: any;
  const gridApiReady = (params: any) => {
    params.api.sizeColumnsToFit();
    window.onresize = () => {
      params.api.sizeColumnsToFit();
    };
    GridApiFeatures = params.api;
    setGridApi(params.api);
    params.columnApi.autoSizeColumns();
    params.api.resetRowHeights();
  };
  const onPageSizeChanged = (event: any) => {
    let value = event.target.value;
    gridApi.paginationSetPageSize(Number(value));
  };
  const UpdateApplicationStatus = async (
    ApplicationStatusChanged: any,
    ChangedByCandidateId: any
  ) => {
    const response: any = await updateCandidateApplicationStatusAPI(
      ChangedByCandidateId,
      ApplicationStatusChanged
    );
    if (response && response.data) {
      AllCandidateDetails();
    }
  };
  async function AllCandidateDetails() {
    setblockUi(true);
    const ID: any = data.id;
    const response: any =
      await getAllCandidateDetailsFromSpecificJobPositionAPI(ID);
    const specificPosition: any = response.data;
    if (specificPosition) {
      setblockUi(false);
      const candidates: any = [];
      specificPosition.map((item: any) => {
        candidates.push({
          candidateId: item.id,
          candidateName: item.firstName + " " + item.lastName,
          candidateExperiance:
            item.yearsOfExperience === 0 ? "NA" : item.yearsOfExperience,
          candidateQualificationId: item.qualification.id,
          candidateQualification: item.qualification.qualificationName
            ? item.qualification.qualificationName
            : "NA",
          candidateScore: item.ikanoScore,
          candidateStatus: item.applicationStatus,
        });
      });
      if (candidates) {
        setRowData(candidates);
        const capacity = candidates.length;
        if (capacity < 10) {
          if (GridApiFeatures) {
            GridApiFeatures.setDomLayout("autoHeight");
            setStyle({});
          }
        } else {
          setStyle({
            height: "450px",
            width: "100%",
          });
        }
      }
    }
  }
  const gridOptions: any = {
    overlayLoadingTemplate:
      '<span class="ag-overlay-loading-center">Loading...</span>',
    overlayNoRowsTemplate:
      '<span style="margin-top:60px;height:30px;">No Rows To Show</span>',
  };
  const close = () => {
    setIsOpenViewCandidateList(false);
    AllCandidateDetails();
  };
  return (
    <>
      <Header />
      <div className="row justify-content-center my-4 m-0">
        <div className="col-11">
          <div className="adminJobPosition">
            <p>
              {isLang === "en"
                ? data.jobTitle
                : data.jobTitleSpanish
                ? data.jobTitleSpanish
                : t("Not Mentioned")}
            </p>
            <hr className="adminJobPosition__hr my-1"></hr>
            <br></br>
            <div className="ag-theme-balham my-3" style={style} id="aggrid">
              <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                suppressCellSelection={true}
                floatingFilter={true}
                onGridReady={gridApiReady}
                // modules={modulesCommunity}
                modules={modulesEnterprise}
                defaultColDef={{
                  resizable: true,
                  autoHeight: true,
                  suppressMenu: true,
                }}
                frameworkComponents={{
                  viewCellRendererSpecific: AdminJobPositionsViewButton,
                  applicationStatusCellRenderer: AdminApplicationStatusDropdown,
                  qualificationCellRenderer: QualificationCell,
                }}
                headerHeight={50}
                pagination={true}
                paginationPageSize={PAGINATION__SIZE}
                popupParent={document.body}
                gridOptions={gridOptions}
              ></AgGridReact>
              <div className="adminJobPosition__pagination my-2 text-right mx-2">
                {t("Show")} &nbsp;
                <select onChange={onPageSizeChanged}>
                  <option value={20} selected={true}>
                    20
                  </option>
                  <option value={40}>40</option>
                  <option value={60}>60</option>
                  <option value={80}>80</option>
                  <option value={100}>100</option>
                </select>{" "}
                &nbsp; {t("Page")}
              </div>
              {isOpenViewCandidateList && candidateInfo ? (
                <AdminViewCandidateModal
                  candidateInfo={candidateInfo}
                  appStatusChanged={selectApplicationStatus}
                  closeModal={close}
                  candidateDetailsAPI={AllCandidateDetails}
                  JobType={data.jobType ? data.jobType : ""}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <BlockUI loader={{ blocking: blockUi, title: t("Please wait...") }} />
    </>
  );
}
