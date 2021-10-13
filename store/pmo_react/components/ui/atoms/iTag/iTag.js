import React from "react";

const ITag = (props) => {
  return (
    <i className={props.className} onClick={props.click} class={props.class}>
      {props.content}
    </i>
  );
};
export default ITag;
