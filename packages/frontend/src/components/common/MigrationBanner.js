import React, {useCallback, useEffect} from 'react';
import { Translate } from 'react-localize-redux';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

import { MIGRATION_START_DATE } from '../../config';
import IconAlertTriangle from '../../images/IconAlertTriangle';
import IconOffload from '../../images/IconOffload';
import {selectAvailableAccounts} from '../../redux/slices/availableAccounts';
import getMyNearWalletUrl from '../../utils/getWalletURL';
import FormButton from './FormButton';
import Container from './styled/Container.css';

const StyledContainer = styled.div`
    color: #995200;
    background-color: #FFECD6;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;

    a {
        color: #995200;
        text-decoration: underline;
        cursor: pointer;

        :hover {
            color: #995200;
        }
    }
`;

const ContentWrapper =  styled(Container)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0;

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

        svg {
            margin-right: 18px;
            min-width: 24px;
        }
    }
`;

const CustomButton = styled(FormButton)`
    color: #452500 !important;
    background-color: #FFB259 !important;
    border: none !important;
    white-space: nowrap;
    padding: 11px 16px;
    margin: 0 !important;
    height: 40px;

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

    const setBannerHeight = () => {
        const migrationBanner = document.getElementById('migration-banner');
        const bannerHeight = migrationBanner ? migrationBanner.offsetHeight : 0;
        const networkBanner = document.getElementById('top-banner');
        if (networkBanner){
            networkBanner.style.top = bannerHeight ? `${bannerHeight}px` : 0;
        } else {
            const app = document.getElementById('app-container');
            const navContainer = document.getElementById('nav-container');
            navContainer.style.top = bannerHeight ? `${bannerHeight}px` : 0;
            app.style.paddingTop = bannerHeight ? `${bannerHeight + 85}px` : '75px';
        }
    };

    const onTransferClick = useCallback(() => {
        if (availableAccounts.length) {
            onTransfer();
            return;
        }

        window.open(getMyNearWalletUrl(), '_blank');
    }, [availableAccounts]);


    useEffect(() => {
        setBannerHeight();
        window.addEventListener('resize', setBannerHeight);
        return () => {
            window.removeEventListener('resize', setBannerHeight);
        };
    }, [account]);

    return (
        <StyledContainer id='migration-banner'>
            <ContentWrapper>
               <div className='content'>
                    <IconAlertTriangle/>
                   {
                       availableAccounts.length ?
                           <Translate id='migration.message' data={{
                               startDate: MIGRATION_START_DATE.toLocaleDateString(),
                               url: getMyNearWalletUrl()
                           }}/> :
                           <Translate id='migration.redirect' data={{ url: getMyNearWalletUrl() }}/>
                   }
               </div>
               <Translate>
                    {({ translate }) =>
                        <CustomButton onClick={onTransferClick}>
                            <IconWrapper>
                                <IconOffload/>
                            </IconWrapper>
                            {
                                availableAccounts.length ?
                                    <Translate id='migration.transferCaption' /> :
                                    <Translate id='migration.redirectCaption' />
                            }

                        </CustomButton>
                    }
                </Translate>
            </ContentWrapper>
        </StyledContainer>
    );
};

export default MigrationBanner;
