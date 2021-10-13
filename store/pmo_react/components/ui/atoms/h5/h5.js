import React from "react";

const H5 = (props) => {
  return (
    <h5 className={props.className}>
      {props.children}
      {props.content}
    </h5>
  );
};
export default H5;
