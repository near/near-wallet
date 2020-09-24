import React from 'react'
import FormButton from '../../common/FormButton'
import BalanceBox from './BalanceBox'
import ValidatorBox from './ValidatorBox'
import ListWrapper from './ListWrapper'
import { Translate } from 'react-localize-redux'
import { BN } from 'bn.js'

export default function Staking({ validators, totalStaked = 1 }) {
    const currentValidators = validators.filter(validator => validator.stakedBalance !== '0')
    const allBalances = currentValidators.map(validator => validator.stakedBalance)

    let total = totalStaked
    
    return (
        <>
            <h1><Translate id='staking.staking.title' /></h1>
            <h2><Translate id='staking.staking.desc' /></h2>
            <FormButton linkTo='/staking/validators'><Translate id='staking.staking.button' /></FormButton>
            <BalanceBox
                title='staking.balanceBox.staked.title'
                info='staking.balanceBox.staked.info'
                amount={total}
            />
            <h3><Translate id='staking.staking.currentValidators' /></h3>
            <ListWrapper>
                {currentValidators.map((validator, i) =>
                    <ValidatorBox
                        key={i}
                        validator={validator.name}
                        fee={validator.fee.percentage}
                        amount={validator.stakedBalance}
                    />
                )}
            </ListWrapper>
        </>
    )
}