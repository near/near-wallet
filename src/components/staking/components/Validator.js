import React from 'react'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'
import BalanceBox from './BalanceBox'
import StakingFee from './StakingFee'

export default function Validator() {
    return (
        <>
            <h1><Translate id='staking.validator.title' data={{validator: 'nils.near'}}/></h1>
            <FormButton linkTo='/staking/validator/stake'><Translate id='staking.validator.button' /></FormButton>
            <StakingFee fee='1.34%'/>
            <BalanceBox
                title='staking.balanceBox.unclaimed.title'
                info='staking.balanceBox.unclaimed.info'
                amount='200000000000000000000000000'
                version='no-border'
            />
        </>
    )
}