import React, {useCallback} from 'react';
import { Translate } from 'react-localize-redux';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

import IconOffload from '../../images/IconOffload';
import { selectAvailableAccounts, selectAvailableAccountsIsLoading } from '../../redux/slices/availableAccounts';
import { getMyNearWalletUrl } from '../../utils/getWalletURL';
import AlertTriangleIcon from '../svg/AlertTriangleIcon';
import InfoIcon from '../svg/InfoIcon';
import FormButton from './FormButton';
import Container from './styled/Container.css';

const StyledContainer = styled.div`
    border: 2px solid #DC1F26;
    border-radius: 16px;
    background-color: #FFFCFC;
    
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    padding: 25px;
    margin: 25px auto;
    line-height: 1.5;

    @media (min-width: 768px) {
        width: 720px;
    }

    @media (min-width: 992px) {
        width: 920px;
    }

    @media (min-width: 1200px) {
        width: 1000px;
    }

    .alert-container {
        background-color: #FFEFEF;
        border-radius: 50%;
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
        color: #CD2B31;

        > span > a {
            color: #CD2B31;
            text-decoration: underline;
        }

        @media (max-width: 767px) {
            flex-direction: column;
        }
    }
`;

const CustomButton = styled(FormButton)`
    color: #FEF2F2 !important;
    background: #FC5B5B !important;
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
`;

const MigrationBanner = ({ account, onTransfer }) => {
    const availableAccounts = useSelector(selectAvailableAccounts);
    const availableAccountsIsLoading = useSelector(selectAvailableAccountsIsLoading);

    const onTransferClick = useCallback(() => {
        if (availableAccounts.length) {
            onTransfer();
            return;
        }

        window.open('https://near.org/blog/near-opens-the-door-to-more-wallets/', '_blank');
    }, [availableAccounts]);

    // If accounts area loading, don't show the banner
    if (availableAccountsIsLoading) {
        return null;
    }

    return (
        <StyledContainer id='migration-banner'>
            <ContentWrapper>
                <div className='content'>
                    <div className='alert-container'>
                        <AlertTriangleIcon color={'#E5484D'} />
                    </div>
                    {
                        availableAccounts.length
                            ? <Translate id='migration.message'/>
                            : <Translate id='migration.redirect' data={{ url: getMyNearWalletUrl() }}/>
                    }
                </div>
                
                <CustomButton onClick={onTransferClick}>
                    <IconWrapper>
                        {
                            availableAccounts.length
                                ? <IconOffload stroke="#fff" />
                                : <InfoIcon color="#fff" />
                        }    
                    </IconWrapper>
                    {
                        availableAccounts.length
                            ? <Translate id='migration.transferCaption' />
                            : <Translate id='migration.redirectCaption' />
                    }
                </CustomButton>
            </ContentWrapper>
        </StyledContainer>
    );
};

export default MigrationBanner;
