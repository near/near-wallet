import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Tokens from '../../../wallet/Tokens';
import BackArrowButton from '../BackArrowButton';


const StyledContainer = styled.div`
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
            <Translate>
                {({ translate }) => (
                    <input
                        placeholder={translate('sendV2.selectAsset.assetInputPlaceholder')}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                )}
            </Translate>
            <div className='list-header'>
                <span><Translate id='sendV2.selectAsset.assetListNameTitle'/></span>
                <span><Translate id='sendV2.selectAsset.asssetListBalanceTitle'/></span>
            </div>
            <Tokens tokens={fungibleTokens} showTokenContract={false} onClick={onSelectToken}/>
        </StyledContainer>
    );
};

export default SelectToken;