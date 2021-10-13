import React from "react";

const H4 = (props) => {
  return (
    <h2 className={props.className}>
      {props.content} {props.children}
    </h2>
  );
};

export default H4;
