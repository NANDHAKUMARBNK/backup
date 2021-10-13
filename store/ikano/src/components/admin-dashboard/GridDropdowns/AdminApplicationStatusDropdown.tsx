import React, { useState } from "react";
import "../../styles/AdminApplicationStatusDropdown.scss";
import { useTranslation } from "react-i18next";
export default function AdminApplicationStatusDropdown(props: any) {
  const { data }: any = props;
  const { t } = useTranslation();
  const [status, setStatus]: any = useState(data.candidateStatus);
  const APPLICATION_STATUS_LOOKUP: any = [
    {
      statusId: 1,
      statusName: "Accepted",
    },
    {
      statusId: 2,
      statusName: "Rejected",
    },
    {
      statusId: 3,
      statusName: "Pending",
    },
  ];

  return (
    <>
      <div className="form-group">
        <select
          className="form-control"
          id="applicationStatus"
          value={status}
          onChange={(e: any) => {
            setStatus(e.target.value);
            props.selected({
              appStatusChangedByUser: e.target.value,
              changedBy: data.candidateId,
            });
          }}
        >
          {APPLICATION_STATUS_LOOKUP.map((item: any) => (
            <option key={item.statusId} value={item.statusName}>
              {t(item.statusName)}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
