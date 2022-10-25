const isMobile = (target) => {
    let userAgent = navigator.userAgent || navigator.vendor || window.opera;

    const windows = /windows phone/i.test(userAgent);
    const android = /android/i.test(userAgent);
    const iOs = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

    if (target === 'iOS') {
        return iOs;
    }

    return windows || android || iOs;
};

export default isMobile;
