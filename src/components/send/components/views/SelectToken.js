import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Tokens from '../../../wallet/Tokens';
import BackArrowButton from '../BackArrowButton';


const StyledContainer = styled.div`
    .header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #272729;
        font-weight: 600;
        font-size: 20px;

        > div {
            position: absolute;
            left: 0;
        }
    }

    .token-box {
        cursor: pointer;

        &:first-of-type {
            border: 0;
        }

        @media (min-width: 768px) {
            padding: 15px 0;
        }
    }

    input {
        margin: 40px 0;
    }

    .list-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #72727A;

        @media (max-width: 767px) {
            font-size: 12px;
        }
    }
`;

const SelectToken = ({ onClickGoBack, fungibleTokens, onSelectToken }) => {
    const [searchValue, setSearchValue] = useState('');
    fungibleTokens = fungibleTokens.filter(v => v.symbol.toLowerCase().includes(searchValue.toLowerCase()) && v.balance !== '0');

    return (
        <StyledContainer>
            <div className='header'>
                <BackArrowButton onClick={onClickGoBack}/>
                <Translate id='sendV2.selectAsset.title'/>
            </div>
            <input
                placeholder='Search asset name'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className='list-header'>
                <span>Name</span>
                <span>Available to send</span>
            </div>
            <Tokens tokens={fungibleTokens} showTokenContract={false} onClick={onSelectToken}/>
        </StyledContainer>
    );
};

export default SelectToken;