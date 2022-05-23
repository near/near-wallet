import React, { useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

// import { MIGRATION_START_DATE, MIGRATION_END_DATE } from '../../config';
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

    .tooltip {
        margin: 0 0 0 8px;
        svg {
            width: 18px;
            height: 18px;

            path {
                stroke: white;
            }
        }
    }

    .network-link {
        margin-left: 6px;
    }

    a {
        color: white;
        :hover {
            color: white;
            text-decoration: underline;
        }
    }

    &.staging-banner {
        background-color: #F6C98E;
        color: #452500;

        .tooltip {
            svg {
                path {
                    stroke: #452500;
                }
            }
        }

        .alert-triangle-icon {
            margin-right: 8px;
            min-width: 16px;
        }
    }
`;

const ContentWrapper =  styled(Container)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0;
`;

const CustomButton = styled(FormButton)`
    color: #452500 !important;
    background-color: #FFB259 !important;
    border: none !important;
    white-space: nowrap;
    padding: 11px 16px;
    margin: 0 !important;
    height: 40px;
`;

const MigrationBanner = ({ account }) => {
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

    const getInviteCalendarEventURl =()=>{
        const calenderURL = new URL('https://calendar.google.com/calendar/u/0/r/eventedit');
        calenderURL.searchParams.append('dates', '20160917T001500Z');
        calenderURL.searchParams.append('text', 'Migration Event');
        calenderURL.searchParams.append('details', 'Some stuff goes here.');
        return calenderURL;
    };

    const handleAddToCalendar = ()=>{
        window.open(getInviteCalendarEventURl(), '_blank');
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
                <Translate id='preMigration.message' />
                <CustomButton onClick={handleAddToCalendar}>
                    Set a Reminder
                </CustomButton>
            </ContentWrapper>
    );



    return (
        <StyledContainer id='migration-banner'>
           {preMigrationMarkup}
        </StyledContainer>
    );
};

export default MigrationBanner;
