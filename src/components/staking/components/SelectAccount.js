import React from 'react'
import styled from 'styled-components'
import RadioGroup from '../../common/radio_button/RadioGroup'
import RadioButton from '../../common/radio_button/RadioButton'
import Balance from '../../common/Balance'
import { Translate } from 'react-localize-redux'

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
                align-items: center;
                justify-content: space-between;
                font-size: 13px;

                :first-of-type {
                    color: #00C08B;
                }

                :last-of-type {
                    margin-top: 3px;
                    color: #6E7073;
                }
            }
        }
    }
`

export default function SelectAccount({ accounts, onChange, selectedAccount }) {
    return (
        <RadioGroup onChange={onChange} selectedValue={selectedAccount}>
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
    )
}