import React from "react";
import { Form } from "react-bootstrap";
import Atoms from "../../atoms";

const FormInput = (props) => {
  return props.as ? (
    <Form.Control
      as={props.as}
      className={props.class}
      placeholder={props.placeholder}
      name={props.name}
      onChange={props.changeValue}
      value={props.Value}
      readOnly={props.readOnly}
    >
      {props.options &&
        props.options.map((res) => {
          if (res.emp_id) {
            return (
              <Atoms.Option key={res.emp_id} value={res.emp_id}>
                Employee {res.emp_id}
              </Atoms.Option>
            );
          } else if (res.sprint_issue_status_id) {
            return (
              <Atoms.Option
                key={res.sprint_issue_status_id}
                value={res.sprint_issue_status_id}
              >
                {res.sprint_issue_status_name}
              </Atoms.Option>
            );
          } else if (res.project_capacity_type_id) {
            return (
              <Atoms.Option
                key={res.project_capacity_type_id}
                value={res.project_capacity_type_id}
              >
                {res.project_capacity_type_name}
              </Atoms.Option>
            );
          } else if (res.sprint_status_id) {
            return (
              <Atoms.Option
                key={res.sprint_status_id}
                value={res.sprint_status_id}
              >
                {res.sprint_status_name}
              </Atoms.Option>
            );
          }
        })}
    </Form.Control>
  ) : (
    <Form.Control
      type={props.type}
      className={props.class}
      placeholder={props.placeholder}
      name={props.name}
      onChange={props.changeValue}
      value={props.Value}
      onKeyPress={props.keyPressValue}
      onKeyUp={props.keyUpValue}
      as={props.as}
      options={props.options}
    />
  );
};

export default FormInput;
