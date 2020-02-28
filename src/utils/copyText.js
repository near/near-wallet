const copyText = (el) => {
    const selection = window.getSelection();
    selection.selectAllChildren(el);
    document.execCommand('copy');
    selection.removeAllRanges();
}

export default copyText;