/*  
    classNames example usage:
    <div className={classNames(['base-class', {'second' : someFlag, 'third' : true}])}></div>
*/
const classNames = (names) => {
    let isArray = Array.isArray;
    let i;
    let len;
    let tmp = typeof names;
    let out = "";

    if (tmp === "string" || tmp === "number") {
        return names || "";
    }
    if (isArray(names) && names.length > 0) {
        for (i = 0, len = names.length; i < len; i++) {
            if ((tmp = classNames(names[i])) !== "") out += (out && " ") + tmp;
        }
    } else {
        for (i in names) {
            if (names.hasOwnProperty(i) && names[i]) out += (out && " ") + i;
        }
    }

    return out;
}

export { classNames };