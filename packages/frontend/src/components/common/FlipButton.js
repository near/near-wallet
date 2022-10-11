import React from 'react';
import styled from 'styled-components';

import WrapIcon from '../svg/WrapIcon';

const FlipButtonWrapper = styled.button`
    height: 2.5rem;
    width: 4.5rem;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3.125rem;
    border-color: transparent;
    background-color: #e1f0ff;
    transition: 100ms;

    --color-icon: var(--color-1);

    :hover {
        background-color: var(--color-1);

        --color-icon: #ffffff;
    }
`;

export default function FlipButton({ onClick }) {
    return (
        <FlipButtonWrapper onClick={onClick}>
            <WrapIcon color="var(--color-icon)" />
        </FlipButtonWrapper>
    );
}
