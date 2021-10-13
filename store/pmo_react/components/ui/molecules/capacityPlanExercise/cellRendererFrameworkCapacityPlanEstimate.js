import React, { useState, useEffect } from "react";
import Atoms from "../../atoms";
import { getEstimateAPI } from "../../../../services/activeProjectListService";

const CellRendererFrameworkCapacityPlanEstimate = (props) => {
  let [estimate, setEstimate] = useState("");
  let [allocationHours, setAllocattionHours] = useState(props.value);
  useEffect(() => {
    fetchEstimate();
  }, []);
  const fetchEstimate = async () => {
    let response = await getEstimateAPI();
    if (response) {
      setEstimate(response);
    }
  };
  const changeEstimate = (e) => {
    let inputValue = e.target.value;
    setAllocattionHours(inputValue);
    props.updateDropdown(inputValue, props.rowIndex);
  };
  return (
    <Atoms.FormInput
      as="select"
      changeValue={changeEstimate}
      Value={allocationHours}
      options={estimate}
    />
  );
};
export default CellRendererFrameworkCapacityPlanEstimate;
