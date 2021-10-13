import React from "react";
import { Card } from "react-bootstrap";

const CardBody = (props) => {
  return <Card.Body className={props.className}>{props.children}</Card.Body>;
};

export default CardBody;
