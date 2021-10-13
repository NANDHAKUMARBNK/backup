import React from "react";
import { Row } from "react-bootstrap";

const CustomRow = (props) => {
  return <Row className={props.className}>{props.children}</Row>;
};
export default CustomRow;
