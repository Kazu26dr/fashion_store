import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { PrimaryButtonProps } from "./types";

const useStyles = makeStyles(() => ({
  button: {
    backgroundColor: "#666 !important",
    color: "#fff",
    fontSize: "16px",
    height: "50px",
    marginBottom: "16px !important",
    width: "256px",
  },
}));

const PrimaryButton = (props: PrimaryButtonProps) => {
  const classes = useStyles();
  return (
    <Button className={classes.button} onClick={() => props.onClick()} variant="contained">
      {props.label}
    </Button>
  );
};

export default PrimaryButton