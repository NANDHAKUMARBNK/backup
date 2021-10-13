import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const customAutoComplete = props => {
  return (
    <Autocomplete
      id={props.id}
      name={props.name}
      label={props.label}
      options={props.options}
      getOptionLabel={props.getOptionLabel}
      value={props.value}
      onChange={props.onChange}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          value={props.value}
          onChange={props.onChange}
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
};

export default customAutoComplete;
