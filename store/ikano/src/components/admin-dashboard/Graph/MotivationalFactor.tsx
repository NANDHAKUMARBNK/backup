import React from "react";
import "../../styles/motivationalfactor.scss";
import { useTranslation } from "react-i18next";
function MotivationalFactor({ Factors }: any) {
  const { t } = useTranslation();
  return (
    <>
      <div className="row d-flex">
        <div className="col-md-4">
          <div className="Factors">
            {Factors &&
              Factors.map((item: any) => (
                <>
                  <p>{t(item.Title)}</p>
                </>
              ))}
          </div>
        </div>
        <div className="col-md-7">
          {Factors && Factors.length > 0 && (
            <>
              <div className="sliderticks">
                <p>1</p>
                <p>50</p>
                <p>100</p>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value="50"
                className="headerSlider"
              />
            </>
          )}
          {Factors &&
            Factors.map((item: any) => (
              <>
                <div className="sliderticks2">
                  <p></p>
                  <p></p>
                  <p></p>
                </div>
                <div className="slider-parent">
                  <div
                    className="buble"
                    style={{
                      left: `calc(${item.Average}% + (${
                        8 - item.Average * 0.15
                      }px))`,
                      fontWeight: 500,
                      marginLeft: "-10px",
                      marginTop: "-10px",
                      height: "17px",
                      // width: "18px",
                      color: "#4A4946",
                      fontFamily: "Ikano Sans",
                      fontSize: "14px",
                    }}
                  >
                    {item.Average > 0 ? item.Average : ""}
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={item.Average}
                    className="slider"
                    id={item.Id}
                  />
                </div>
              </>
            ))}
          {Factors && Factors[Factors.length - 1] && (
            <>
              <div className="lastChild">
                <p></p>
                <p></p>
                <p></p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MotivationalFactor;
