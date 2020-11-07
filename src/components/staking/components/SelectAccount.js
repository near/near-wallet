import React from 'react'
import styled from 'styled-components'
import RadioGroup from '../../common/radio_button/RadioGroup'
import RadioButton from '../../common/radio_button/RadioButton'
import Balance from '../../common/Balance'
import { Translate } from 'react-localize-redux'

const Container = styled.div`
    > div {
        width: max-content;
        max-height: 31px;
        overflow: hidden;

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

        span {
            color: #A2A1A6;
            }
        }

        :last-of-type {
            background-color: #F4F4F4;
            padding: 6px 12px;
            border-radius: 40px;

            .list {
                color: #6E7073;
                :first-of-type {
                    color: #00C08B;
                }
            }
        }
    }

    .divider {
        width: 1px;
        background-color: #E5E5E5;
        height: 31px;
        display: inline-block;
        margin: -10px 5px;
    }

`

export default function SelectAccount({ accounts, onChange, selectedAccount }) {
    return(
        <div>
            <RadioGroup onChange={onChange} selectedValue={selectedAccount}>
                {accounts.map((account, i) => 
                    <RadioButton value={account.accountId} key={i}>
                        <Container>
                            <div>
                                {account.accountId.split('.')[0]}<span>.{account.accountId.substring(account.accountId.indexOf('.') + 1)}</span>
                            </div>
                            <div>
                                <Balance amount={account.totalUnstaked}/> <span className='divider'/> <Balance amount={account.totalStaked}/> <Translate id='staking.staking.staked' />
                            </div>
                        </Container>
                    </RadioButton>
                )}
            </RadioGroup>
        </div>
    )
}