import React from "react";
import { useTranslation } from "react-i18next";
function QualificationCell(props: any) {
  const { value }: any = props;
  const { t } = useTranslation();
  return <>{value && t(value)}</>;
}
export default QualificationCell;
