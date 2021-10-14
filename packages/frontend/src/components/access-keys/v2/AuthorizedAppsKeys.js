import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { EXPLORE_APPS_URL } from '../../../../config/settings';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import AuthorizedApp from '../../profile/authorized_apps/AuthorizedApp';

const StyledContainer = styled(Container)`
    .authorized-app-box {
        margin: 30px 0;
    }

    h1 {
        display: flex;
        align-items: center;
        svg {
            width: 30px;
            height: 30px;
            margin-right: 15px;
        }
    }

    > button {
        padding: 0 14px;
        min-width: 250px;
    }
`;

export default ({
    authorizedAppsKeys,
    onClickDeAuthorizeKey,
    deAuthorizingKey
}) => {
    return (
        <StyledContainer className='medium centered'>
            <h1><Translate id='profile.authorizedApps.title' /> ({authorizedAppsKeys?.length})</h1>
            <div className='access-keys'>
                {authorizedAppsKeys?.map((appKeyData, i) => (
                    <AuthorizedApp
                        key={appKeyData.public_key}
                        app={appKeyData}
                        onClick={() => onClickDeAuthorizeKey(appKeyData.public_key)}
                        deAuthorizing={deAuthorizingKey === appKeyData.public_key}
                    />
                ))}
            </div>
            {authorizedAppsKeys?.length === 0 &&
                <>
                    <Translate id='fullAccessKeys.noKeys' />
                    <br/>
                    <FormButton linkTo={EXPLORE_APPS_URL}>
                        <Translate id='exploreApps.exploreApps' />
                    </FormButton>
                </>
            }
        </StyledContainer>
    );
};