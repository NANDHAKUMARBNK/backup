import React from "react";
import { Card } from "react-bootstrap";

const CardTag = (props) => {
  return <Card className={props.className}>{props.children}</Card>;
};

export default CardTag;
