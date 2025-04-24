import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { makeStyles } from '@mui/styles';
import { SelectBoxProps } from "./types";

const useStyles = makeStyles(() => ({
    formControl: {
      marginBottom: "16px !important",
      minWidth: "128px",
      width: "100%",
    },
  }));

const SelectBox = (props: SelectBoxProps) => {
    const classes = useStyles();
  return (
    <FormControl className={classes.formControl} fullWidth>
      <InputLabel>{props.label}</InputLabel>
      <Select
        required={props.required}
        label={props.label}
        value={props.value}
        onChange={(e) => props.select(e.target.value)}
      >
        {props.options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectBox