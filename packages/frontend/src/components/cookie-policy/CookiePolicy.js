import React from 'react';
import styled from 'styled-components';

import cookiePolicyPdf from '../../documents/cookie-policy.pdf';
import { Cookie } from '../../utils/cookies';
import { StyledButton } from '../common/Button';

// Copypasted close icon from modal/CloseButton.js
const CloseIcon = () => (<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path className='icon' d="M22.9954 11.6817L11.6817 22.9954M11.6817 11.632L22.9954 22.9458" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
</svg>);

const useCookieModel = () => {
    const persistedCookie = Cookie.get('cookie-policy');
    const [isCookieAccepted, setCookieAccepted] = React.useState(persistedCookie);

    const acceptCookie = () => {
        setCookieAccepted(true);
        Cookie.set('cookie-policy', 'true', 365);
    };

    return {
        isCookieAccepted,
        acceptCookie,
    };
};

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const CloseButton = styled.button`
    background-color: transparent;
    border: 0;
    outline: 0;
    cursor: pointer;
    :hover {
        filter: brightness(0.95);
    }
`;

const Container = styled.div`
    z-index: 99999999;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    widht: 100%;
    height: 100%;
    pointer-events: none;
    align-items: flex-end;
    display: flex;
    overflow: hidden;
`;

const CookiePolicyBanner = styled.div`
    display: flex;
    justify-content: center;
    pointer-events: all;
    background-color: #fff;
    padding: 24px;
    width: 100%;
`;

const CookiePolicyBannerInner = styled.div`
    max-width: 960px;
    flex-grow: 1;
`;

const TextContainer = styled.div`
    margin-right: 20px;
    margin-bottom: 24px;
`;

const SmallButton = styled(StyledButton)`
    height: 36px;
`;

const ControlsContainer = styled.div`
    display: flex;
    flex-direction: column-reverse;

    @media (max-width: 768px) {
        & > * {
            margin-bottom: 16px;
            width: 100%;
        }
    }

    @media (min-width: 768px) {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
`;

export function CookiePolicy() {
    const { isCookieAccepted, acceptCookie } = useCookieModel();
    const openPdf = () => {
        window.open(cookiePolicyPdf, '_blank', 'noopener,noreferrer');
    };

    if (isCookieAccepted) {
        return null;
    }

    return (
        <Container>
            <CookiePolicyBanner>
                <CookiePolicyBannerInner>
                    <HeaderContainer>
                        <h4>Notice</h4>
                        <CloseButton onClick={acceptCookie}>
                            <CloseIcon />
                        </CloseButton>
                    </HeaderContainer>
                    <TextContainer>
                        <p>
                            We and selected third parties use cookies or similar technologies for technical purposes and, with your consent, for other purposes as specified in the <a href={cookiePolicyPdf} target="_blank" rel="noreferrer noopener">cookie policy</a>.

                        </p>
                        <p>
                            You can consent to the use of such technologies by using the “Accept” button, by closing this notice, by scrolling this page, by interacting with any link or button outside of this notice or by continuing to browse otherwise.
                        </p>
                    </TextContainer>

                    <ControlsContainer>
                        <SmallButton theme={'secondary'} onClick={openPdf} fullWidth={false}>Learn More</SmallButton>
                        <SmallButton onClick={isCookieAccepted ? () => { } : acceptCookie} fullWidth={false}>Accept</SmallButton>
                    </ControlsContainer>

                </CookiePolicyBannerInner>
            </CookiePolicyBanner>
        </Container>
    );
}
