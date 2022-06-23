export const showAlert = ({ data, onlyError, onlySuccess, console = true, localAlert, messageCodeHeader, success } = {}) => ({
    alert: {
        showAlert: localAlert ? false : true,
        onlyError: onlySuccess ? false : true,
        onlySuccess: onlyError ? false : true,
        console,
        localAlert,
        messageCodeHeader,
        success
    },
    data
});

export const showAlertToolkit = (alertParams) => ({
    serializeError: (error) => ({
        message: error.message,
        type: error.type,
        messageCode: error.messageCode,
        alertMeta: showAlert(alertParams)
    })
});
