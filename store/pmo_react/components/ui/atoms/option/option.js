import React from "react";

const Option = (props) => {
  return (
    <option className={props.className} key={props.key} value={props.value}>
      {props.children}
      {props.content}
    </option>
  );
};
export default Option;
