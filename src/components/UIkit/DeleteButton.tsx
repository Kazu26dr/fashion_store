import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { DeleteButtonProps } from "./types";

// デフォルトテーマを作成
const theme = createTheme();

const useStyles = makeStyles(() => ({
  button: {
    fontSize: "16px",
    height: "50px",
    marginBottom: "16px !important",
    width: "256px",
  },
}));

const DeleteButton = (props: DeleteButtonProps) => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Button className={classes.button} onClick={() => props.onClick()} variant="contained" color="error">
        {props.label}
      </Button>
    </ThemeProvider>
  );
};

export default DeleteButton;