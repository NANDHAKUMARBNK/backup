import React, { useState } from "react";
import "../../styles/AdminApplicationStatusDropdown.scss";
import { useTranslation } from "react-i18next";
export default function IsJobActiveDropdown(props: any) {
  const { data }: any = props;
  const { t } = useTranslation();
  const [status, setStatus]: any = useState(data.isJobActive);
  const JOB_STATUS_LOOKUP: any = [
    {
      Id: 1,
      Status: t("Enabled"),
      isActive: true,
    },
    {
      Id: 2,
      Status: t("Disabled"),
      isActive: false,
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
              jobStatusChangedByUser: e.target.value,
              jobId: data.Id,
            });
          }}
        >
          {JOB_STATUS_LOOKUP.map((item: any) => (
            <option key={item.Id} value={item.isActive}>
              {item.Status}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
