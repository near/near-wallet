const isDecimalString = (value) => {
    const pattern = /^[0-9]*(|[.][0-9]{1,5})$/
    return pattern.test(value)
}

export default isDecimalString;