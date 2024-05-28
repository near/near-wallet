import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { IS_MAINNET } from '../../config';

const RedirectToTestnet = () => {
    const location = useLocation();

    useEffect(() => {
    // Function to reconstruct the URL
        const reconstructUrl = (url) => {
            const urlObj = new URL(url);
            const myNearWalletUrl = IS_MAINNET ? 'https://app.mynearwallet.com/' : 'https://testnet.mynearwallet.com';
            const newUrl = new URL(myNearWalletUrl);
            newUrl.pathname = urlObj.pathname;
            newUrl.search = urlObj.search;
            newUrl.hash = urlObj.hash;
            return newUrl.toString();
        };

        // Get the current URL
        const currentUrl = window.location.href;

        // Reconstruct the URL
        const newUrl = reconstructUrl(currentUrl);

        // Redirect to the new URL
        window.location.replace(newUrl);
    }, [location]);

    return null;
};

export default RedirectToTestnet;
