import React from "react";
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  withStyles,
} from "@material-ui/core";
import "./FormInput.css";

const styles = (theme) => ({
  input: {
    margin: theme.spacing.unit,
    minWidth: 240,
    maxWidth: 240,
  },
});
// custom reusable input component
const FormInput = ({
  label,
  value,
  onChange,
  required,
  id,
  type,
  showError,
  classes,
}) => (
  <FormControl className={classes.input}>
    <InputLabel htmlFor={id}>{label}</InputLabel>
    <Input
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      required={required}
      id={id}
      type={type}
      aria-describedby={id}
    />
    {!value && required && showError ? (
      <FormHelperText error>required</FormHelperText>
    ) : null}
  </FormControl>
);
FormInput.defaultProps = {
  type: "text",
};

export default withStyles(styles)(FormInput);
