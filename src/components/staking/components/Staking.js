import React from 'react'
import FormButton from '../../common/FormButton'
import BalanceBox from './BalanceBox'
import ValidatorBox from './ValidatorBox'
import ListWrapper from './ListWrapper'
import { Translate } from 'react-localize-redux'

export default function Staking({ currentValidators, totalStaked, totalUnclaimed, totalAvailable, totalPending }) {
    return (
        <>
            <h1><Translate id='staking.staking.title' /></h1>
            <div className='desc'><Translate id='staking.staking.desc' /></div>
            <FormButton linkTo='/staking/validators'><Translate id='staking.staking.button' /></FormButton>
            <BalanceBox
                title='staking.balanceBox.staked.title'
                info='staking.balanceBox.staked.info'
                amount={totalStaked}
            />
            <BalanceBox
                title='staking.balanceBox.unclaimed.title'
                info='staking.balanceBox.unclaimed.info'
                amount={totalUnclaimed}
            />
            <BalanceBox
                title='staking.balanceBox.available.title'
                info='staking.balanceBox.available.info'
                amount={totalAvailable}
            />
            <BalanceBox
                title='staking.balanceBox.pending.title'
                info='staking.balanceBox.pending.info'
                amount={totalPending}
            />
            <h3><Translate id='staking.staking.currentValidators' /></h3>
            {currentValidators.length ? (
            <ListWrapper>
                {currentValidators.map((validator, i) =>
                    <ValidatorBox
                        key={i}
                        validator={validator.accountId}
                        fee={validator.fee.percentage}
                        amount={validator.staked}
                    />
                )}
            </ListWrapper>
            ) : (
                <div style={{ marginTop: '20px' }}><Translate id='staking.staking.noValidators' /></div>
            )}
        </>
    )
}