import styled from 'styled-components';

export const SwapDetailsWrapper = styled.div`
    width: 100%;
    border-radius: 0.5rem;
    background-color: #eceef0;
    visibility: hidden;
    overflow: hidden;
    transition: max-height 0.12s;
    max-height: 0;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

    &.visible {
        max-height: 43.75rem;
        visibility: visible;
        overflow: visible;
    }

    .detailsRow:not(:last-child) {
        border-bottom: 1px solid var(--color-5);
    }
`;

export const AccordionTitle = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    padding: 1.2rem;
    border-radius: inherit;
    font-weight: 500;
    color: var(--color-4);
    background-color: var(--color-3);

    .chevron-icon {
        transform: rotate(90deg);
    }

    &.active {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        .chevron-icon {
            transform: rotate(-90deg);
        }
    }
`;
