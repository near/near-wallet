import throttle from 'lodash.throttle';
import React, { useCallback, useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import getCurrentLanguage from '../../../../hooks/getCurrentLanguage';
import BackArrowButton from '../../../common/BackArrowButton';
import Tokens from '../../../wallet/Tokens';

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

function filterTokens(tokens, searchSubstring) {
    return tokens.filter((token) => {
        if (!searchSubstring) {
            return true; 
        }

        return token.onChainFTMetadata?.symbol
            .toLowerCase()
            .includes(searchSubstring.toLowerCase());
    });
}

const SelectToken = ({ onClickGoBack, fungibleTokens, onSelectToken, isMobile }) => {
    const [searchValue, setSearchValue] = useState('');
    const [filteredFungibleTokens, setFilteredFungibleTokens] = useState(() => filterTokens(fungibleTokens));
    const currentLanguage = getCurrentLanguage();

    const throttledSetFilteredTokens = useCallback(throttle(
        (tokens, searchSubstring) => {
            const filteredTokens = filterTokens(tokens, searchSubstring);
            setFilteredFungibleTokens(filteredTokens);
        },
        500,
        { leading: false, trailing: true }
    ), []);

    useEffect(() => {
        throttledSetFilteredTokens(fungibleTokens, searchValue);
    }, [fungibleTokens, searchValue]);

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
                        autoFocus={isMobile ? false : true}
                    />
                )}
            </Translate>
            <div className='list-header'>
                <span><Translate id='sendV2.selectAsset.assetListNameTitle'/></span>
                <span><Translate id='sendV2.selectAsset.asssetListBalanceTitle'/></span>
            </div>
            <Tokens tokens={filteredFungibleTokens} onClick={onSelectToken} currentLanguage={currentLanguage}/>
        </StyledContainer>
    );
};

export default SelectToken;
