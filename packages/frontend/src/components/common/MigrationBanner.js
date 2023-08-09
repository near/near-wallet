import React, {useCallback, useEffect, useState} from 'react';
import { Translate } from 'react-localize-redux';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

import IconOffload from '../../images/IconOffload';
import { selectAvailableAccounts, selectAvailableAccountsIsLoading } from '../../redux/slices/availableAccounts';
import { getNearOrgWalletUrl } from '../../utils/getWalletURL';
import AlertTriangleIcon from '../svg/AlertTriangleIcon';
import CloseSvg from '../svg/CloseIcon';
import InfoIcon from '../svg/InfoIcon';
import FormButton from './FormButton';
import Container from './styled/Container.css';

const StyledContainer = styled.div`
    background-color: #FFF4D5;
    
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    padding: 15px 0;
    margin-top: -15px;
    align-items: center;

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
    align-items: center;
    justify-content: space-between;
    margin-top: 0;
    padding: 0;

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
        align-items: flex-start;
        flex-wrap: none;
        color: #AD5700;

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
    color: #AD5700 !important;
    background: #FFE3A2 !important;
    border: none !important;
    white-space: nowrap;
    padding: 9.5px 16px;
    margin: 0 !important;
    height: 40px !important;
    @media (max-width: 768px) {
        margin-top: 16px !important;
    }
`;

const IconWrapper = styled.div`
    display: inline;
    margin-right: 10px;
    margin-left: -10px;
`;

const CloseButton = styled.button`
    height: 25px;
    width: 25px;
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
    const migrationBannerCloseTime = localStorage.getItem('migrationBannerCloseTime');
    const [showBanner, setShowBanner] = useState(true);
    const EXPIRY_DATE = 604800000; // 7 days in milliseconds
    useEffect(() => {
        if (!migrationBannerCloseTime || (Date.now() - migrationBannerCloseTime) > EXPIRY_DATE) {
            setShowBanner(true);
            localStorage.removeItem('migrationBannerCloseTime');
        } else {
            setShowBanner(false);
        }
    }, []);

    const availableAccounts = useSelector(selectAvailableAccounts);
    const availableAccountsIsLoading = useSelector(selectAvailableAccountsIsLoading);

    const walletUrl = getNearOrgWalletUrl().replace('https://', '');

    const onTransferClick = useCallback(() => {
        if (availableAccounts.length) {
            onTransfer();
            return;
        }

        window.open('/transfer-wizard', '_blank');
    }, [availableAccounts]);

    // If banner is closed and still not past expirary date, don't show the banner
    if (!showBanner)  {
        return null;
    }

    // If accounts area loading, don't show the banner
    if (availableAccountsIsLoading) {
        return null;
    }

    const hideBanner = () => {
        setShowBanner(false);
        localStorage.setItem('migrationBannerCloseTime', Date.now());
    };

    return (
        <StyledContainer id='migration-banner'>
            <ContentWrapper>
                <div className='content'>
                    <div className='alert-container'>
                        <AlertTriangleIcon color={'#FFA01C'} />
                    </div>
                    <div className='message-container'>
                        <Translate id='migration.message' data={{ walletUrl }}/>
                    </div>
                </div>
                
                <CustomButton onClick={onTransferClick}>
                    <IconWrapper>
                        {
                            availableAccounts.length
                                ? <IconOffload stroke="#AD5700" />
                                : <InfoIcon color="#AD5700" />
                        }    
                    </IconWrapper>
                    {
                        availableAccounts.length
                            ? <Translate id='migration.transferCaption' />
                            : <Translate id='migration.redirectCaption' />
                    }
                </CustomButton>
                <CloseButton onClick={hideBanner}>
                    <CloseSvg color={'#AD5700'} />
                </CloseButton>
            </ContentWrapper>
        </StyledContainer>
    );
};

export default MigrationBanner;
