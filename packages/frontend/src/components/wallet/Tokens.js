import React from 'react';
import styled from 'styled-components';

import FungibleTokens from '../../services/FungibleTokens';
import TokenBox from './TokenBox';

const { getUniqueTokenIdentity } = FungibleTokens;

const StyledContainer = styled.div`
    width: 100%;

    @media (max-width: 991px) {
        margin-bottom: 50px;
    }

    .token-box {
        border-top: 1px solid #f0f0f1;

        :last-of-type {
            border-bottom: 1px solid #f0f0f1;

            @media (min-width: 992px) {
                /* border-bottom: 0; */
            }
        }
    }
`;

const Tokens = ({ tokens, onClick, currentLanguage }) => {
    return (
        <StyledContainer>
            {tokens.map((token, i) => (
                <TokenBox
                    key={getUniqueTokenIdentity(token)}
                    token={token}
                    onClick={onClick}
                    currentLanguage={currentLanguage}
                />
            ))}
        </StyledContainer>
    );
};

export default Tokens;
