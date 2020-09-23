import React, { useState } from 'react'
import AmountInput from './AmountInput'
import ValidatorBox from './ValidatorBox'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'
import ArrowCircleIcon from '../../svg/ArrowCircleIcon'
import TransferMoneyIcon from '../../svg/TransferMoneyIcon'

export default function Stake() {
    const [amount, setAmount] = useState('');
    const [success, setSuccess] = useState();
    
    if (!success) {
        return (
            <>
                <h1><Translate id='staking.stake.title' /></h1>
                <h2><Translate id='staking.stake.desc' /></h2>
                <h4><Translate id='staking.stake.amount' /></h4>
                <AmountInput value={amount} onChange={setAmount}/>
                <ArrowCircleIcon/>
                <h4><Translate id='staking.stake.stakeWith' /></h4>
                <ValidatorBox
                    validator='Nils.near'
                    fee='1.23%'
                    clickable={false}
                />
                <FormButton onClick={() => setSuccess(true)}><Translate id='staking.stake.button' /></FormButton>
            </>
        )
    } else {
        return (
            <>
                <TransferMoneyIcon/>
                <h1><Translate id='staking.stakeSuccess.title' /></h1>
                <h2><Translate id='staking.stakeSuccess.desc' /></h2>
                <ValidatorBox
                    validator='Nils.near'
                    fee='1.23%'
                    amount='23.442525'
                    clickable={false}
                    style={{margin: '40px 0'}}
                />
                <h4 style={{ textAlign: 'center' }}><Translate id='staking.stakeSuccess.descTwo' /></h4>
                <FormButton linkTo='/staking' className='seafoam-blue'><Translate id='staking.stakeSuccess.button' /></FormButton>
            </>
        )
    }
}