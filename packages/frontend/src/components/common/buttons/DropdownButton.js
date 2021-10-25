import React from 'react';
import styled from 'styled-components';

import ChevronIcon from '../../svg/ChevronIcon';

const StyledButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    background-color: #F0F0F1;
    border: none;
    border-radius: 4px;
    transition: 100ms;

    :hover {
        background-color: #E5E5E6;

        .chevron-wrapper {
            border-color: #dbdbdb;
        }
    }

    .children {
        padding: 0 10px;
        max-width: 200px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .chevron-wrapper {
        border-left: 1px solid #E5E5E6;
        height: 32px;
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;

        svg {
            width: 10px;
            height: 10px;
            transform: rotate(90deg);
        }   
    }

    &.open {
        .chevron-wrapper {
            svg {
                transform: rotate(-90deg);
            }
        }
    }
`;

export default ({ children, id }) => (
    <StyledButton id={id}>
        <div className='children'>{children}</div>
        <div className='chevron-wrapper'>
            <ChevronIcon color='#72727A'/>
        </div>
    </StyledButton>
);