
export const validateEmail = (email) => {
    /* Checks for anystring@anystring.anystring */
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
}