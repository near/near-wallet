import { parse } from 'query-string';
import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import CloseSvg from '../svg/CloseIcon';
import FormButton from './FormButton';
import Container from './styled/Container.css';

const StyledContainer = styled.div`
    background-color: #FAC7BE;
    
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    padding: 15px 0;
    margin-top: -15px;
    align-items: center;

    @media (max-width: 768px) {
        margin-bottom: 20px;
    }

    .alert-container {
        padding: 9px;
        margin-right: 16px;
        display: flex;
        justify-content: center;
        @media (max-width: 768px) {
            margin: 0 auto 15px;
        }
        .alert-triangle-icon {
            width: 25px;
            height: 25px;
        }
     
    }

    .message-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 100%;
        line-height: 1.5;
    }
`;

const ContentWrapper =  styled(Container)`
    display: flex;
    margin-top: 0;
    padding: 0;

    align-items: center;
    justify-content: space-around;
    margin-top: 10px;

    &>*:first-child{
        margin-right: 10px;
    }

    @media (max-width: 992px) {
        padding: 16px;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
    }

    & .content {
        display: flex;
        align-items: center;
        flex-wrap: none;
        color: black;

        > div > span > span > a,
        > div > span > a {
            color: #AD5700;
            text-decoration: underline;
        }

        @media (max-width: 767px) {
            flex-direction: column;
        }
    }
`;

const CustomButton = styled(FormButton)`
    color: black !important;
    background: transparent !important;
    border: black 1px solid !important;
    white-space: nowrap;
    padding: 9.5px 16px;
    margin: 0 !important;
    height: 40px !important;
    font-weight: 300 !important;
    @media (max-width: 768px) {
        margin-top: 16px !important;
    }
    margin-left: 24px !important;
`;

const CloseButton = styled.button`
    height: 20px;
    width: 20px;
    border: none;
    margin-left: 30px;
    cursor: pointer;
    background-color: transparent;
    padding: 0;

    @media (max-width: 768px) {
        margin: 15px auto 0;
    }
`;

const MigrationBanner = ({ account, onTransfer }) => {
    const [showBanner, setShowBanner] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const isRedirect = parse(window.location.search).previousPath;
        setShowBanner(isRedirect);
    }, []);
    
    
    
    if (!showBanner) {
        return null;
    }

    const hideBanner = () => {
        setShowBanner(false);
        history.replace('/');
    };

    const onLearnMoreClick = () => {
        window.open('https://near.org/blog/embracing-decentralization-whats-next-for-the-near-wallet', '_blank');
    };

    return (
        <StyledContainer id='migration-banner'>
            <ContentWrapper>
                <div className='content'>
                    <div className='message-container'>
                        <Translate id='migration.redirect' />
                    </div>
                    <CustomButton onClick={onLearnMoreClick}>
                        <Translate id='migration.redirectCaption' />
                    </CustomButton>
                </div>
                <CloseButton onClick={hideBanner}>
                    <CloseSvg color={'black'} />
                </CloseButton>
            </ContentWrapper>
        </StyledContainer>
    );
};

export default MigrationBanner;
