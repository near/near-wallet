import React from 'react'
import FormButton from '../../common/FormButton'
import BalanceBox from './BalanceBox'
import ValidatorBox from './ValidatorBox'
import ListWrapper from './ListWrapper'
import { Translate } from 'react-localize-redux'

export default function Staking() {
    return (
        <>
            <h1><Translate id='staking.staking.title' /></h1>
            <h2><Translate id='staking.staking.desc' /></h2>
            <FormButton linkTo='/staking/validators'><Translate id='staking.staking.button' /></FormButton>
            <BalanceBox
                title='staking.balanceBox.staked.title'
                info='staking.balanceBox.staked.info'
                amount='200000000000000000000000000'
            />
            <BalanceBox
                title='staking.balanceBox.unclaimed.title'
                info='staking.balanceBox.unclaimed.info'
                amount='200000000000000000000000000'
            />
            <BalanceBox
                title='staking.balanceBox.available.title'
                info='staking.balanceBox.available.info'
                amount='200000000000000000000000000'
            />
            <h3><Translate id='staking.staking.currentValidators' /></h3>
            <ListWrapper>
                <ValidatorBox
                    validator='Nils.near'
                    fee='1.23%'
                    amount='23.442525'
                />
            </ListWrapper>
        </>
    )
}