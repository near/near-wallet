import React, { useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { MIGRATION_START_DATE, MIGRATION_END_DATE } from '../../config';
import IconAlertTriangle from '../../images/IconAlertTriangle';
import IconBell from '../../images/IconBell';
import IconShare from '../../images/IconShare';
import { getMyNearWalletUrl } from '../../utils/getWalletURL';
import WalletMigration from '../wallet-migration/WalletMigration';
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

        svg{
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

const MigrationBanner = ({ account }) => {
    const [showMigrationModal, setShowMigrationModal] = React.useState(false);

    const showPostMigrationBanner = new Date() > MIGRATION_START_DATE;

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


    const getInviteCalendarEventURl =({ text, details })=>{
        const calenderURL = new URL('https://calendar.google.com/calendar/u/0/r/eventedit');
        const calendarStartDate= MIGRATION_START_DATE.toISOString().replace(/-|:|\.\d\d\d/g,'');
        const calendarEndDate= MIGRATION_END_DATE.toISOString().replace(/-|:|\.\d\d\d/g,'');

        calenderURL.searchParams.append('dates', `${calendarStartDate}/${calendarEndDate}`);
        calenderURL.searchParams.append('text', text);
        calenderURL.searchParams.append('details', details);
        return calenderURL;
    };

    const handleAddToCalendar = (eventInfo)=>{
        window.open(getInviteCalendarEventURl(eventInfo), '_blank');
    };


    useEffect(() => {
        setBannerHeight();
        window.addEventListener('resize', setBannerHeight);
        return () => {
            window.removeEventListener('resize', setBannerHeight);
        };
    }, [account]);
    

    const preMigrationMarkup = (
            <ContentWrapper>
               <div className='content'>
                    <IconAlertTriangle/>
                    <Translate id='preMigration.message' data={{ startDate: MIGRATION_START_DATE.toLocaleDateString(), migrationDestinationURL: getMyNearWalletUrl() }} />
               </div>
               <Translate>
                    {({ translate }) =>
                    <CustomButton onClick={()=>{handleAddToCalendar({
                        text: translate('preMigration.calendarEvent.text'),
                        details: translate('preMigration.calendarEvent.details'),
                    });}}>
                        <IconBell/> <Translate id='preMigration.cta' />
                    </CustomButton>
                    }
                </Translate>
               
            </ContentWrapper>
    );
    // getMyNearWallet

    const postMigrationMarkup = (
       <>
            <ContentWrapper>
                <div className='content'>
                    <IconAlertTriangle/>
                    <Translate id='postMigration.message' data={{ endDate: MIGRATION_END_DATE.toLocaleDateString(), migrationDestinationURL: getMyNearWalletUrl() }} />
                </div>
                <CustomButton onClick={()=>{setShowMigrationModal(true);}}>
                <IconShare/> <Translate id='postMigration.cta' />
                </CustomButton>
            </ContentWrapper>
            {showMigrationModal && <WalletMigration setShowMigrationModal={setShowMigrationModal}/>}
        </>
    );

    return (
        <StyledContainer id='migration-banner'>
           {showPostMigrationBanner ? postMigrationMarkup: preMigrationMarkup}
        </StyledContainer>
    );
};

export default MigrationBanner;
