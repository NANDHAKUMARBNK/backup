import React from "react";
import "../../../styles/lw.scss";
import { useTranslation } from "react-i18next";
function LeadershipWords({
  iterationsCount,
  Care,
  Inspire,
  Drive,
  Deliver,
}: any) {
  const iterationArr: any = [];
  const { t } = useTranslation();
  for (let i = 0; i < iterationsCount; i++) {
    iterationArr.push(i);
  }
  return (
    <>
      {iterationArr && iterationArr.length > 0 && (
        <div className="tableLw">
          <table className="table lwTableContainer">
            <thead className="lwHeader">
              <tr>
                <th scope="col" className="lwCutter">
                  <span>{t("Care")}</span>
                </th>
                <th scope="col" className="lwCutter">
                  <span>{t("Inspire")}</span>
                </th>
                <th scope="col" className="lwCutter">
                  <span>{t("Drive")}</span>
                </th>
                <th scope="col">
                  <span>{t("Deliver")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {iterationArr.map((item: any, index: any) => {
                return (
                  <>
                    <tr>
                      <td
                        style={{
                          color:
                            index < Care.length && Care[index].isSelected
                              ? "red"
                              : "black",
                          fontWeight:
                            index < Care.length && Care[index].isSelected
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {index < Care.length
                          ? t(Care[index].word)
                          : t("Not Mentioned")}
                      </td>
                      <td
                        style={{
                          color:
                            index < Inspire.length && Inspire[index].isSelected
                              ? "red"
                              : "black",
                          fontWeight:
                            index < Inspire.length && Inspire[index].isSelected
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {index < Inspire.length
                          ? t(Inspire[index].word)
                          : t("Not Mentioned")}
                      </td>
                      <td
                        style={{
                          color:
                            index < Drive.length && Drive[index].isSelected
                              ? "red"
                              : "black",
                          fontWeight:
                            index < Drive.length && Drive[index].isSelected
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {index < Drive.length
                          ? t(Drive[index].word)
                          : t("Not Mentioned")}
                      </td>
                      <td
                        style={{
                          color:
                            index < Deliver.length && Deliver[index].isSelected
                              ? "red"
                              : "black",
                          fontWeight:
                            index < Deliver.length && Deliver[index].isSelected
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {index < Deliver.length
                          ? t(Deliver[index].word)
                          : t("Not Mentioned")}
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default LeadershipWords;
