import React from "react";
import Atoms from "../../atoms";

const HeaderCard = (props) => {
  return (
    <Atoms.Div>
      <Atoms.CardTag>
        <Atoms.CardBody className="text-left">
          <Atoms.Paragraph className={props.paraClassName}>
            {props.paraContent}
          </Atoms.Paragraph>
          <Atoms.H5 className={props.h5classPrimary}>
            {props.h5ContentSecondary}
          </Atoms.H5>
        </Atoms.CardBody>
      </Atoms.CardTag>
    </Atoms.Div>
  );
};
export default HeaderCard;
