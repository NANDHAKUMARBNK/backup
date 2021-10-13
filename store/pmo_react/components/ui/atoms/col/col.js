import React from "react";
import { Col } from "react-bootstrap";

const CustomCol = (props) => {
  return (
    <Col
      xl={props.xl}
      lg={props.lg}
      md={props.md}
      sm={props.md}
      className={props.className}
      key={props.key}
      value={props.value}
      onClick={props.onClick}
    >
      {props.children}
    </Col>
  );
};

export default CustomCol;
