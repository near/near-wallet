import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Container from '../../common/styled/Container.css';
import FullAccessKey from './FullAccessKey';

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
`;

export default ({
    fullAccessKeys,
    onClickDeAuthorizeKey,
    deAuthorizingKey,
    userInputAccountId,
    setUserInputAccountId,
    accountId,
    confirmDeAuthorizeKey,
    setConfirmDeAuthorizeKey
}) => {
    return (
        <StyledContainer className='medium centered'>
            <h1><Translate id='fullAccessKeys.pageTitle' /> ({fullAccessKeys?.length})</h1>
            <div className='access-keys'>
                {fullAccessKeys?.map((accessKey, i) => (
                    <FullAccessKey
                        key={accessKey.public_key}
                        accessKey={accessKey}
                        onClickDeAuthorizeKey={onClickDeAuthorizeKey}
                        deAuthorizing={deAuthorizingKey === accessKey.public_key}
                        userInputAccountId={userInputAccountId}
                        setUserInputAccountId={setUserInputAccountId}
                        accountId={accountId}
                        confirmDeAuthorizeKey={confirmDeAuthorizeKey}
                        setConfirmDeAuthorizeKey={setConfirmDeAuthorizeKey}
                    />
                ))}
                {fullAccessKeys?.length === 0 &&
                    <Translate id='fullAccessKeys.dashboardNoKeys' />
                }
            </div>
        </StyledContainer>
    );
};
