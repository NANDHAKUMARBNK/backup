import React from "react";
import Button from "react-bootstrap/Button";

const CustomButton = (props) => {
  return (
    <Button
      className={props.className}
      onClick={props.action}
      variant={props.variant}
    >
      {props.buttonName}
    </Button>
  );
};
export default CustomButton;
