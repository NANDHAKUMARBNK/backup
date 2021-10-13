import React, { useState } from "react";
import Atoms from "../components/ui/atoms";
import Moment from "moment";
const DatepickerAgGrid = (props) => {
  let [dateFromGrid, setDateFromGrid] = useState(
    Moment(props.value).format("YYYY-MM-DD")
  );
  const changeDate = (e) => {
    let valueTarget = e.target.value;
    setDateFromGrid(valueTarget);
    props.updateDate(valueTarget, props.rowIndex);
  };
  return (
    <Atoms.FormInput
      type="date"
      changeValue={changeDate}
      Value={dateFromGrid}
    />
  );
};
export default DatepickerAgGrid;
