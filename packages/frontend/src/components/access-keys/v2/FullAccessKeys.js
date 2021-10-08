import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import CheckCircleIcon from '../../svg/CheckCircleIcon';
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
    onClick,
    deAuthorizingKey
}) => {
    return (
        <StyledContainer className='medium centered'>
            <h1><CheckCircleIcon /><Translate id='profile.authorizedApps.title' /> ({fullAccessKeys?.length})</h1>
            <div className='access-keys'>
                {fullAccessKeys?.map((appKeyData, i) => (
                    <FullAccessKey
                        key={i}
                        app={appKeyData}
                        onClick={() => onClick(appKeyData)}
                        deAuthorizing={deAuthorizingKey === appKeyData.public_key}
                    />
                ))}
            </div>
        </StyledContainer>
    );
};