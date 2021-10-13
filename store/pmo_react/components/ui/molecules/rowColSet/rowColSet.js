import React from "react";
import { Col, Row } from "react-bootstrap";

const RowColSet = (props) => {
  return (
    <Row className={props.rowClass}>
      <Col className={props.colClass}>{props.children}</Col>
    </Row>
  );
};
export default RowColSet;
