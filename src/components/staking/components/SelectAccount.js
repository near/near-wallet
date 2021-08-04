import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Balance from '../../common/balance/Balance';
import RadioButton from '../../common/radio_button/RadioButton';
import RadioGroup from '../../common/radio_button/RadioGroup';

const Container = styled.div`
    > div {
        :first-of-type {
            margin-bottom: 8px;
            font-weight: 600;
            max-width: 260px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #24272a;

            @media (max-width: 330px) {
                max-width: 200px;
            }
        }

        :last-of-type {
            > div {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                font-size: 14px;

                .balance {
                    text-align: right;
                }

                :first-of-type {
                    color: #00C08B;
                }

                :last-of-type {
                    margin-top: 5px;
                    color: #6E7073;
                }
            }
        }
    }
`;

export default function SelectAccount({ accounts, onChange, selectedAccount }) {
    return (
        <RadioGroup onChange={accounts.every((account) => !!account.totalUnstaked) ? (e) => onChange(e) : null} selectedValue={selectedAccount}>
            {accounts.map((account, i) => 
                <RadioButton value={account.accountId} key={i}>
                    <Container>
                        <div>
                            {account.accountId}
                        </div>
                        <div>
                            <div>
                                <Translate id='staking.staking.available' />
                                <Balance amount={account.totalUnstaked}/>
                            </div>
                            <div>
                                <Translate id='staking.staking.totalStaked' />
                                <Balance amount={account.totalStaked}/>
                            </div>
                        </div>
                    </Container>
                </RadioButton>
            )}
        </RadioGroup>
    );
}