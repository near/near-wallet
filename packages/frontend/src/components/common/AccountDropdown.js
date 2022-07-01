import React from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { switchAccount } from '../../redux/actions/account';
import { selectAccountId } from '../../redux/slices/account';
import { selectAvailableAccounts } from '../../redux/slices/availableAccounts';
import classNames from '../../utils/classNames';
import DropDown from '../common/DropDown';


const Container = styled.div`
    .dropdown-container {
        width: 100%;
    }

    .dropdown-title-wrapper, .dropdown-content {
        border-radius: 4px;
    }

    .dropdown-title-wrapper {
        padding: 15px 25px 15px 15px;
    }

    .dropdown-title {
        font-size: 14px !important;
        font-weight: 600 !important;
        color: #72727A;
    }

    .account-dropdown-toggle {
        padding: 15px;
        text-align: left;
        border-bottom: 1px solid #F0F0F1;
        transition: 100ms;
        cursor: pointer;
        color: #72727A;
        font-weight: 500;
        text-overflow: ellipsis;
        overflow: hidden;

        :last-of-type {
            border: 0;
        }

        :hover {
            background-color: #f9f9f9;
            color: #3F4045;
        }
    }

    .account-dropdown-title {
        text-align: left;
        margin-bottom: 8px;
        font-size: 13px;
        color: #A2A2A8;
    }
`;

export default function AccountDropdown({ disabled, 'data-test-id': testId }) {
    const dispatch = useDispatch();
    const accountId = useSelector(selectAccountId);
    const availableAccounts = useSelector(selectAvailableAccounts);
    const singleAccount = availableAccounts.length < 2;
    
    return (
        <Container
            className={classNames(['account-dropdown-container'])}
            data-test-id={testId}
        >
            <div className='account-dropdown-title'>
                <Translate id={`selectAccountDropdown.${singleAccount ? 'account' : 'selectAccount'}`}/>
            </div>
            <DropDown
                disabled={singleAccount || disabled}
                name='account-dropdown'
                title={accountId || ''}
                content={
                    availableAccounts.filter((a) => a !== accountId).map((account, i) => (
                        <div
                            key={i}
                            onClick={() => dispatch(switchAccount({ accountId: account }))}
                            className='account-dropdown-toggle'
                        >
                            {account}
                        </div>
                    ))
                }
            />
        </Container>
    );
}
