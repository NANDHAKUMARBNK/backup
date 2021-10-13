import React from "react";
import { Form } from "react-bootstrap";

const FormLabel = (props) => {
  return (
    <Form.Label className={props.className} htmlFor={props.htmlForLabel}>
      {props.labelName}
    </Form.Label>
  );
};
export default FormLabel;
