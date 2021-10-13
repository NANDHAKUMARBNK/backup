import React from "react";
import "../../../styles/qs.scss";
import { useTranslation } from "react-i18next";
function QualitiesAndScore({ QualityScoreGrid, Total }: any) {
  const { t } = useTranslation();
  return (
    <>
      {QualityScoreGrid && QualityScoreGrid.length > 0 && (
        <div className="tableQs">
          <table className="table qsTableContainer">
            <thead className="qsHeader">
              <tr>
                <th scope="col">
                  <span>{t("Qualities")}</span>
                </th>
                <th scope="col">
                  <span>{t("Score")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {QualityScoreGrid.map((item: any) => {
                return (
                  <tr key={item.Id}>
                    <td>{t(item.Quality)}</td>
                    <td>{item.Score}</td>
                  </tr>
                );
              })}
              {QualityScoreGrid && QualityScoreGrid.length > 0 && (
                <>
                  <tr>
                    <td className="total">{t("Total")}</td>
                    <td className="total">{Total ? Total : 0}%</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default QualitiesAndScore;
