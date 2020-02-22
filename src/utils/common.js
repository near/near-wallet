/*  
    classNames example usage:
    <div className={classNames(['base-class', {'second' : someFlag, 'third' : true}])}></div>
*/
const classNames = (names) => {
    let isArray = Array.isArray;

    if (typeof(names) === "string") {
        return names || "";
    }

    if (isArray(names) && names.length > 0) {
        return names.map(name => classNames(name)).filter(name => !!name).join(" ");
    } 

    return Object.keys(names).filter(key => names[key]).join(" ");

}

const webShare = (data) => {
    if (navigator.share) { 
        navigator.share({
           title: data.title,
           text: data.text,
           url: data.url
        }).then(() => {
            if (typeof data.successCallback === 'function') {
                data.successCallback();
            }
        }).catch(console.error);
    } else {
        if (typeof data.noSupportCallback === 'function') {
            data.noSupportCallback();
        }
    }
}

const copyText = (el) => {
    const selection = window.getSelection();
    selection.selectAllChildren(el);
    document.execCommand('copy');
}

export { classNames, webShare, copyText };