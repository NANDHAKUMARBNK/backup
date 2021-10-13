import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
} from "react";
import { Context } from "../ContextApi/ContextApi";
import { getMotivationAPI } from "../../Services/ApplicantServices/MotivationFactorsGraph";
import { useParams } from "react-router-dom";
import BlockUI from "../../../common-themes/ui-blocker";
import { useTranslation } from "react-i18next";
const MotivationalFactors = forwardRef((props, ref: any) => {
  useImperativeHandle(ref, () => ({
    data() {
      return true;
    },
  }));
  const params: any = useParams();
  const {
    Factors,
    setFactors,
    TooltipInfo,
    setTooltipInfo,
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
          Average: 1,
        });
      });
      setFactors(factors);
      setFactorvalue(factors);
    }
  };
  const MouseTrigger: any = (e: any) => {
    const FilterInfo: any = Factors.filter(
      (element: any) => element.Id === parseInt(e.target.id)
    );
    const onlyInfo: any = [];
    if (params.aplicantType === "manager") {
      FilterInfo.map((item: any) => {
        onlyInfo.push({
          Id: item.Id,
          Title: item.Title,
          Desc: item.Description_Manager,
        });
      });
      setTooltipInfo(onlyInfo);
    } else {
      FilterInfo.map((item: any) => {
        onlyInfo.push({
          Id: item.Id,
          Title: item.Title,
          Desc: item.Description_FloorOperator,
        });
      });
      setTooltipInfo(onlyInfo);
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
        <div className="col-md-6"></div>
        <div className="col-md-6">
          <span className="col-3 leftCorner">
            {t("THIS ISN'T IMPORTANT FOR ME")}
          </span>
          <span className="col-3 rightCorner">
            {t("THIS IS CRUCIAL TO ME")}
          </span>
        </div>
      </div>
      <div className="row d-flex">
        <div className="col-md-3">
          <div className="app_Factors">
            {Factors &&
              Factors.map((item: any) => (
                <>
                  <p
                    id={item.Id}
                    style={{ cursor: "pointer" }}
                    onMouseOver={MouseTrigger}
                    onMouseOut={() => {
                      setTooltipInfo([]);
                    }}
                  >
                    {t(item.Title)}
                  </p>
                </>
              ))}
          </div>
        </div>
        <div className="col-md-2">
          {TooltipInfo &&
            TooltipInfo.length > 0 &&
            TooltipInfo.map((res: any) => (
              <div className="Tooltip">
                <div className="message">
                  <p style={{ color: "#ec0f00", fontWeight: "bold" }}>
                    {t(res.Title)}
                  </p>
                  <p style={{ color: "#4a4946" }}>{res.Desc}</p>
                </div>
              </div>
            ))}
        </div>
        <div className="col-md-6">
          {Factors && Factors.length > 0 && (
            <>
              <div className="app_sliderticks">
                <p>1</p>
                <p>50</p>
                <p>100</p>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value="50"
                className="app_headerSlider"
              />
            </>
          )}
          {Factors &&
            Factors.map((item: any) => (
              <>
                <div className="app_sliderticks2">
                  <p></p>
                  <p></p>
                  <p></p>
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
                    {item.Average > 1 ? item.Average : ""}
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={item.Average}
                    className="app_slider"
                    id={item.Id}
                    onChange={(e: any) => {
                      setFactors(
                        Factors.map((ele: any) => {
                          if (item.Id === ele.Id) {
                            ele.Average = parseInt(e.target.value);
                          }
                          return ele;
                        })
                      );
                    }}
                    onMouseOver={MouseTrigger}
                    onMouseOut={() => {
                      setTooltipInfo([]);
                    }}
                  />
                </div>
              </>
            ))}

          {Factors && Factors[Factors.length - 1] && (
            <>
              <div className="app_lastChild">
                <p></p>
                <p></p>
                <p></p>
              </div>
            </>
          )}
        </div>
      </div>
      <BlockUI loader={{ blocking: blockUi, title: t("Please wait...") }} />
    </React.Fragment>
  );
});

export default React.memo(MotivationalFactors);
