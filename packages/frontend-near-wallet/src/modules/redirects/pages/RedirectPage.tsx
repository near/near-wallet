import React from 'react'
import { useLocation } from 'react-router-dom'
import { getMyNearWalletUrl } from '../../../utils/constants';

const RedirectPage = () => {
    const location = useLocation()
    const destinationWalletBaseURL = getMyNearWalletUrl();
    const urlString = location.pathname + location.search
    let redirectURL = new URL(urlString, destinationWalletBaseURL);

    window.location.href = redirectURL.toString();
    return null
}

export default RedirectPage;