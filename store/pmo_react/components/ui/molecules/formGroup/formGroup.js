import React from "react";
import Atoms from "../../atoms";
import { Form } from "react-bootstrap";

const FormGroup = (props) => {
  return (
    <Form.Group className={props.className}>
      <Atoms.FormLabel
        htmlForLabel={props.htmlForLabel}
        labelName={props.labelName}
      />
      <Atoms.FormInput
        as={props.as}
        type={props.type}
        options={props.options}
        className={props.className}
        name={props.name}
        placeholder={props.placeholder}
        changeValue={props.changeValue}
        Value={props.Value}
        keyPressValue={props.keyPressValue}
        keyUpValue={props.keyUpValue}
        readOnly={props.readOnly}
      />
    </Form.Group>
  );
};
export default FormGroup;
