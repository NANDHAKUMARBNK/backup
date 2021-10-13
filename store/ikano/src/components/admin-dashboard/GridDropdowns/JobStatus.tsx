import React from "react";
import { useTranslation } from "react-i18next";
function JobStatus(props: any) {
  const { value }: any = props;
  const { t } = useTranslation();
  return (
    <>
      <p>{value === "Enabled" ? t("Enabled") : t("Disabled")}</p>
    </>
  );
}

export default JobStatus;
