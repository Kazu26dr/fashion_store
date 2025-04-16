// Start of Selection
import { TextField, TextFieldProps } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
    textField: {
        marginBottom: "16px !important",
    },
}));

const TextInput = (props: TextFieldProps) => {
    const classes = useStyles();
    return (
        <TextField
        className={classes.textField}
        fullWidth={props.fullWidth}
            label={props.label}
            margin="dense"
            multiline={props.multiline}
            required={props.required}
            rows={props.rows}
            value={props.value}
            type={props.type}
            onChange={props.onChange}
            variant="outlined"
            InputLabelProps={{
                shrink: true,
            }}
            error={props.error}
            helperText={props.helperText}
            InputProps={{
                endAdornment: props.InputProps?.endAdornment,
            }}
            {...props}
        />
    );
};

export default TextInput;

