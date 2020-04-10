const copyText = (el) => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(el.textContent);
    } else {
        const selection = window.getSelection();
        selection.selectAllChildren(el);
        document.execCommand('copy');
        selection.removeAllRanges();
    }
}

export default copyText;