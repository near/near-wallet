function isDataURL(s) {
    return !!s.match(isDataURL.regex);
}
isDataURL.regex = /^(data:)([\w\/\+-]*)(;charset=[\w-]+|;base64){0,1},(.*)/gi;

export default isDataURL;
