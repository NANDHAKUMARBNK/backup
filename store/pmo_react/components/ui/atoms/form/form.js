import React from "react";
import { Form } from "react-bootstrap";

const FormTag = (props) => {
  return <Form className={props.className}>{props.children}</Form>;
};

export default FormTag;
