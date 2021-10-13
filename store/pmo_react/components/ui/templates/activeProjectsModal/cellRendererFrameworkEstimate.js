import React, { useEffect, useState } from "react";
import Atoms from "../../atoms";
import { getEstimateAPI } from "../../../../services/activeProjectListService";
const CellRendererFrameworkEstimate = (props) => {
  let [estimate, setEstimate] = useState("");
  let [estimateCost, setEstimateCost] = useState(props.value);
  useEffect(() => {
    fetchEstimate();
  }, []);
  const fetchEstimate = async () => {
    let responseFromEmpApi = await getEstimateAPI();
    if (responseFromEmpApi) {
      setEstimate(responseFromEmpApi);
    }
  };
  const changeEstimateHours = (e) => {
    let inputValue = e.target.value;
    setEstimateCost(inputValue);
    props.updateDropdown(inputValue, props.rowIndex);
  };
  return (
    <Atoms.FormInput
      as="select"
      changeValue={changeEstimateHours}
      Value={estimateCost}
      options={estimate}
    />
  );
};
export default CellRendererFrameworkEstimate;
