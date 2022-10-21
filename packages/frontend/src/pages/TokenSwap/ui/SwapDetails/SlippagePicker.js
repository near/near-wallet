import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Tooltip from '../../../../components/common/Tooltip';

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 15px;
    color: #72727a;

    .tooltip {
        margin-right: auto;
        width: 15px;
        margin-top: 2px;
    }
`;

const MarksWrapper = styled.div`
    display: flex;
    flex-direction: row;

    button {
        margin: 0px 4px;
        border-radius: 16px;
        background-color: white;
        border-color: white;
        border-style: solid;
        padding: 4px 10px;

        &.active,
        &:hover {
            border-color: var(--color-2);
            background-color: var(--color-2);
            color: white;
        }
    }
`;

export default function SlippagePicker({ value, setSlippage, marks, className = '' }) {
    return (
        <StyledContainer className={className}>
            <Translate id='swap.slippage' />
            <Tooltip translate='swap.translateIdInfoTooltip.slippage' />

            <MarksWrapper>
                {marks.map((mark) => (
                    <button
                        key={mark}
                        className={value === mark ? 'active' : ''}
                        onClick={() => setSlippage(mark)}
                    >
                        {mark}%
                    </button>
                ))}
            </MarksWrapper>
        </StyledContainer>
    );
}
