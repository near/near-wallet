import React from 'react'
import FormButton from '../../common/FormButton'
import BalanceBox from './BalanceBox'
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
                number='200000000000000000000000000'
            />
            <BalanceBox
                title='staking.balanceBox.unclaimed.title'
                info='staking.balanceBox.unclaimed.info'
                number='200000000000000000000000000'
            />
            <BalanceBox
                title='staking.balanceBox.available.title'
                info='staking.balanceBox.available.info'
                number='200000000000000000000000000'
            />
            <h3><Translate id='staking.staking.currentValidators' /></h3>
        </>
    )
}