import React from "react";
import Atoms from "../../atoms";
import { deleteResourceUtilizationAPI_BasedOnId } from "../../../../services/resourceUtilizationService";
const DeleteResourceUtilization = (props) => {
  const close = () => {
    props.handleClosebtn();
  };
  const handleSubmit = async () => {
    let id = props.data.pa_id;
    let response = await deleteResourceUtilizationAPI_BasedOnId(id);
    if (response) {
      props.handleClose();
    }
  };
  return (
    <Atoms.Section id="openModal-about" className="modalDialog">
      <Atoms.Div>
        <Atoms.Div onClick={close} title="Close" className="close">
          {" "}
          X{" "}
        </Atoms.Div>
        <Atoms.Paragraph>Are you want to Delete</Atoms.Paragraph>
        <Atoms.CustomButton
          variant="success"
          className="mr-3"
          action={handleSubmit}
          buttonName="Confirm"
        />
        <Atoms.CustomButton
          variant="success"
          className="mr-3"
          action={close}
          buttonName="Cancel"
        />
      </Atoms.Div>
    </Atoms.Section>
  );
};
export default DeleteResourceUtilization;
