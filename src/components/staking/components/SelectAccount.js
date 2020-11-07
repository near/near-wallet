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

function Account({ accountId, totalUnstaked, totalStaked }) {
    return (
        <Container>
            <div>
                {accountId.split('.')[0]}<span>.{accountId.substring(accountId.indexOf('.') + 1)}</span>
            </div>
            <div>
                <Balance amount={totalUnstaked}/> <span className='divider'/> <Balance amount={totalStaked}/> <Translate id='staking.staking.staked' />
            </div>
        </Container>
    )
}

export default function SelectAccount({ accounts, onChange, selectedAccount }) {
    return(
        <div>
            <RadioGroup onChange={onChange} selectedValue={selectedAccount}>
                {accounts.map((account, i) => 
                    <RadioButton value={account.accountId} key={i}>
                        <Account
                            accountId={account.accountId}
                            totalUnstaked={account.totalUnstaked}
                            totalStaked={account.totalStaked}
                        />
                    </RadioButton>
                )}
            </RadioGroup>
        </div>
    )
}