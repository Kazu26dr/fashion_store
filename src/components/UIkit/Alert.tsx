import { Alert as MuiAlert, Snackbar  } from "@mui/material";
import { useState } from "react";
import { AlertSeverity } from "./types";
import { AlertMessage } from "./types";

interface AlertProps {
    severity: AlertSeverity;
    message: AlertMessage;
}

const Alert = (props: AlertProps) => {
    const [open, setOpen] = useState(false);
    const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={props.severity}>
                {props.message}
            </MuiAlert>
        </Snackbar>
    )
}

export default Alert;