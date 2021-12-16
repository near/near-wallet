import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import ClickToCopy from '../../../common/ClickToCopy';
import FormButton from '../../../common/FormButton';
import CopyIcon from '../../../svg/CopyIcon';

const StyledContainer = styled.div`
    background-color: #272729;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    color: white;
    font-weight: 600;

    .address {
        margin: 0 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .copy {
        margin: 0;
    }

    &&& {
        button {
            margin: 0;
            height: 46px;
            font-size: 14px;
            min-width: 110px;

            @media (max-width: 767px) {
                width: inherit;
            }

            svg {
                margin-right: 5px;
            }
        }
    }
`;

export default ({ address }) => (
    <StyledContainer>
        <div className='address'>{address}</div>
        <ClickToCopy copy={address} className='copy'>
            <FormButton className='flex-center-center'>
                <CopyIcon color='#8FCDFF' />
                <Translate id='button.copy' />
            </FormButton>
        </ClickToCopy>
    </StyledContainer>
);