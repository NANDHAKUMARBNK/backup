import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
  useState,
} from "react";
import { Context } from "../ContextApi/ContextApi";
import { getMotivationAPI } from "../../Services/ApplicantServices/MotivationFactorsGraph";
import { useParams } from "react-router-dom";
import BlockUI from "../../../common-themes/ui-blocker";
import { useTranslation } from "react-i18next";
import tick from "../../../assets/Images/mftick.png";
const Motivation = forwardRef((props, ref: any) => {
  useImperativeHandle(ref, () => ({
    data() {
      if (Factors && Factors.length) {
        const HandleChanged: any = Factors.filter(
          (item: any) => item.IsHandleChanged
        );
        if (HandleChanged && HandleChanged.length === Factors.length) {
          setErrorMsg("");
          return true;
        } else {
          setErrorMsg(
            t("Please choose a value for all the motivation factors")
          );
          return false;
        }
      } else {
        setErrorMsg(t("Please choose a value for all the motivation factors"));
        return false;
      }
    },
  }));
  const params: any = useParams();
  const {
    Factors,
    setFactors,
    blockUi,
    setblockUi,
    FactorValue,
    setFactorvalue,
  }: any = useContext(Context);
  const { t } = useTranslation();
  useEffect(() => {
    if (FactorValue.length === 0) {
      AllMotivationFactors();
    }
  }, []);
  const [ErrorMsg, setErrorMsg]: any = useState("");
  const AllMotivationFactors = async () => {
    setblockUi(true);
    const response: any = await getMotivationAPI();
    if (response && response.data) {
      setblockUi(false);
      const factors: any = [];
      response.data.map((item: any) => {
        factors.push({
          Id: item.id ? item.id : t("Not Mentioned"),
          Title: item.factorHeader ? item.factorHeader : t("Not Mentioned"),
          Description_Manager: item.managerDesc
            ? item.managerDesc
            : t("Not Mentioned"),
          Description_FloorOperator: item.operatorDesc
            ? item.operatorDesc
            : t("Not Mentioned"),
          Average: 50,
          IsClicked: false,
          IsHandleChanged: false,
        });
      });
      if (factors && factors.length > 0) {
        factors[0].IsClicked = true;
      }
      setFactors(factors);
      setFactorvalue(factors);
    }
  };
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12 mb-4">
          <p className="headerMessage">
            {t("How important are the following elements for you?")}
          </p>
        </div>
      </div>
      <div className="row d-flex">
        <div className="col-md-2 col-lg-3">
          <div className="app_Factors">
            {Factors &&
              Factors.map((item: any) => (
                <>
                  <p
                    id={item.Id}
                    style={{
                      cursor: "pointer",
                      backgroundColor: item.IsClicked
                        ? "#EC0F00"
                        : "transparent",
                      padding: item.IsClicked ? "5px" : "0px",
                      color: item.IsClicked
                        ? "white"
                        : item.IsHandleChanged
                        ? "#CDC8BE"
                        : !item.IsHandleChanged
                        ? "#4A4946"
                        : "normal",
                      whiteSpace: item.IsClicked && "normal",
                    }}
                    onClick={() => {
                      setFactors(
                        Factors.map((element: any) => {
                          if (element.Id === item.Id) {
                            element.IsClicked = true;
                          } else {
                            element.IsClicked = false;
                          }
                          return element;
                        })
                      );
                    }}
                  >
                    {" "}
                    <img
                      src={tick}
                      alt=""
                      className={item.IsClicked && "factorsMoti"}
                      style={{
                        width: item.IsClicked && "10%",
                        position: item.IsClicked && "relative",
                        bottom: item.IsClicked && "1px",
                      }}
                    />
                    <span
                      style={{
                        position: item.IsClicked && "relative",
                        left: item.IsClicked && "40px",
                      }}
                    >
                      {t(item.Title)}
                    </span>
                  </p>
                </>
              ))}
          </div>
        </div>
        <div className="col-md-1"></div>
        <div className="col-md-8 mx-3 my-5 col-lg-7">
          {Factors &&
            Factors.length > 0 &&
            Factors.map((item: any) => (
              <>
                {item.IsClicked && (
                  <>
                    <div className="tooltipMotivation">
                      <p
                        style={{
                          color: "#EC0F00",
                          fontFamily: "Ikano Sans",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        {t(item.Title)}
                      </p>
                      {/* <p
                        style={{
                          color: "#4A4946",
                          fontFamily: "Ikano Sans",
                          fontSize: "14px",
                        }}
                      >
                        {params.aplicantType === "manager"
                          ? t(item.Description_Manager)
                          : t(item.Description_FloorOperator)}
                      </p> */}
                    </div>
                    <div className="app-slider-parent">
                      <div
                        className="buble"
                        style={{
                          left: `calc(${item.Average}% + (${
                            8 - item.Average * 0.15
                          }px))`,
                          fontWeight: 500,
                          marginLeft: "-12px",
                          marginTop: "-13px",
                          height: "17px",
                          color: "#4A4946",
                          fontFamily: "Ikano Sans",
                          fontSize: "14px",
                        }}
                      >
                        {item.Average != 50 ? item.Average : ""}
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={item.Average}
                        className="app_slider"
                        id={item.Id}
                        onChange={(e: any) => {
                          setErrorMsg("");
                          setFactors(
                            Factors.map((ele: any) => {
                              if (item.Id === ele.Id) {
                                ele.IsHandleChanged = true;
                                ele.Average = parseInt(e.target.value);
                              }
                              return ele;
                            })
                          );
                        }}
                      />
                      <div className="app_sliderticks2">
                        <p>
                          {" "}
                          <span>1</span>
                        </p>

                        <p>
                          {" "}
                          <span>50</span>
                        </p>

                        <p>
                          {" "}
                          <span>100</span>
                        </p>
                      </div>
                      <div className="col-md-8 my-3">
                        <span className="col-3 leftCorner">
                          {t("THIS ISN`T IMPORTANT FOR ME")}
                        </span>
                        <span className="col-3 rightCorner">
                          {t("THIS IS CRUCIAL TO ME")}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </>
            ))}
        </div>
        <p
          style={{
            color: "red",
            fontWeight: "bold",
            left: "42%",
            position: "relative",
          }}
        >
          {ErrorMsg ? ErrorMsg : ""}
        </p>
      </div>
      <BlockUI loader={{ blocking: blockUi, title: t("Please wait...") }} />
    </React.Fragment>
  );
});

export default React.memo(Motivation);
