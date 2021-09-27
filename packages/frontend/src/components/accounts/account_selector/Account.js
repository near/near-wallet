import React, { useState } from 'react';
import styled from 'styled-components';

import EyeIcon from './EyeIcon';

const StyledContainer = styled.div`
    border-radius: 8px;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    color: #72727A;
    margin: 8px 0;

    > div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 10px;
    }

    > svg {
        cursor: pointer;
    }

    :hover {
        background-color: #FAFAFA;

        > svg {
            rect {
                fill: white;
            }
        }
    }

    .account-id, .balance {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .account-id {
        font-weight: 600;
        line-height: 170%;
    }

    &.active {
        border: 1px solid #8FCDFF;
        background-color: #F0F9FF;

        .account-id {
            color: #001729;
        }

        .balance {
            color: #0072CE;
        }

        > svg {
            rect {
                fill: #D6EDFF;
            }
        }
    }
`;

export default ({ active }) => {
    const [showBalance, setShowBalance] = useState(false);
    return (
        <StyledContainer className={active ? 'active' : ''}>
            <div>
                <div className='account-id'>corwin.near</div>
                <div className='balance'>
                    {showBalance ? '12.34 NEAR' : '••••••'}
                </div>
            </div>
            <EyeIcon
                show={showBalance}
                onClick={(e) => {
                    setShowBalance(!showBalance);
                    e.stopPropagation();
                }}
            />
        </StyledContainer>
    );
};