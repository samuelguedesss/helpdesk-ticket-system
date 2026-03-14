import { Snackbar, Alert, Slide } from "@mui/material";

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

export default function AppAlert({
    open,
    onClose,
    severity = "success",
    message,
    duration = 3000,
}) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            TransitionComponent={SlideTransition}
            sx={{ marginTop: "4%" }}
        >

            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{
                    width: "100%",
                    borderRadius: "12px",
                    fontSize: 14,
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
