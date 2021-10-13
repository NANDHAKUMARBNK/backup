import React from "react";

const Div = (props) => {
  return (
    <div
      className={props.className}
      onClick={props.onClick}
      title={props.title}
    >
      {props.children}
    </div>
  );
};

export default Div;
