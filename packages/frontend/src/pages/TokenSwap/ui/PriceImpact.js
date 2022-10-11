import React from 'react';
import styled from 'styled-components';

import { PRICE_IMPACT_THRESHOLD } from '../utils/constants';

const PriceImpactWrapper = styled.span`
    display: flex;
    align-items: center;
    color: var(--color-success);

    &.error {
        color: var(--color-error);
    }

    &.warning {
        color: var(--color-warning);
    }
`;

export default function PriceImpact({ percent = '-' }) {
    const className =
        percent > PRICE_IMPACT_THRESHOLD.error
            ? 'error'
            : percent > PRICE_IMPACT_THRESHOLD.warning
                ? 'warning'
                : '';

    return (
        <PriceImpactWrapper className={className}>
            {percent <= 0 ? '< 0.01' : percent} %
        </PriceImpactWrapper>
    );
}
