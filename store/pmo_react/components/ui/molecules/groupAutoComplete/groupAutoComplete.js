import React from "react";
import Atoms from "../../atoms";
import TextField from "@material-ui/core/TextField";

const GroupAutoComplete = (props) => {
  return (
    <Atoms.FormGroup className={props.className}>
      <Atoms.FormLabel labelName={props.labelName} />
      <Atoms.customAutoComplete
        id={props.id}
        options={props.options}
        getOptionLabel={props.getOptionLabel}
        value={props.value}
        onChange={props.onChange}
        style={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="" variant="outlined" fullWidth />
        )}
      />
    </Atoms.FormGroup>
  );
};
export default GroupAutoComplete;
