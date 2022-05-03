import React from 'react';
import styled from 'styled-components';

import Token from '../../send/components/entry_types/Token';
import ChevronIcon from '../../svg/ChevronIcon';

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: #F1F3F5;
    border-radius: 8px;
    transition: 100ms;
    height: 64px;

    > div {
        width: 100%;
        padding: 0px;
        color: #272729;
        font-weight: 600;
    }

    .icon {
        margin-right: 15px;
    }
`;

const SelectTokenButton = ({ token, onClick }) => {
    return (
        <StyledContainer
            onClick={onClick}
            className="select-token-btn"
            data-test-id="sendMoneyPageSelectTokenButton"
        >
            <Token
                symbol={token.onChainFTMetadata?.symbol}
                icon={token.onChainFTMetadata?.icon}
            />
            <ChevronIcon color="#0072ce" />
        </StyledContainer>
    );
};

export default SelectTokenButton;
