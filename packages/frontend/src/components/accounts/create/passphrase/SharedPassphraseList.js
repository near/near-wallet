import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
    background-color: #F0F9FF;
    border: 2px dashed #8FCDFF;
    border-radius: 16px;
    padding: 16px;

    > div {
        border-radius: 8px;
        background-color: #FFFFFF;
        margin-bottom: 8px;
        padding: 0 16px;
        height: 52px;
        color: #72727A;
        font-weight: 700;
        display: flex;
        align-items: center;

        :first-of-type {
            justify-content: space-between;
            background-color: #C8F6E0;
            color: #005A46;

            span {
                color: #008D6A;
                font-size: 12px;
                background-color: #90E9C5;
                border-radius: 40px;
                padding: 6px 14px;
            }
        }

        :last-of-type {
            margin-bottom: 0;
        }

        > div {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }
`;

export default ({ newAccount, sharedAccounts }) => {
    return (
        <StyledContainer className='shared-passphrase-list'>
            <div><div>{newAccount}</div> <span>New</span></div>
            {
                sharedAccounts.map((account) => <div key={account}><div>{account}</div></div>)
            }
        </StyledContainer>
    );
};
