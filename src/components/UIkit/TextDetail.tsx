import { makeStyles } from "@mui/styles";
import { TextDetailProps } from "./types";

const useStyles = makeStyles(({
    row: {
        display: "flex",
        flexFlow: "row wrap",
        marginBottom: "16px",
    },
    label: {
        marginLeft: "0",
        marginRight: "auto",
    },
    value: {
        fontWeight: "600",
        marginLeft: "auto",
        marginRight: "0",
    },
}));

const TextDetail = (props: TextDetailProps) => {
    const classes = useStyles();
    return (
        <div className={classes.row}>
            <div className={classes.label}>
                {props.label}
            </div>
            <div className={classes.value}>
                {props.value}
            </div>
        </div>
    )
}

export default TextDetail;
