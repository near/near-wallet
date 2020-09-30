import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import AmountInput from './AmountInput'
import ValidatorBox from './ValidatorBox'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'
import ArrowCircleIcon from '../../svg/ArrowCircleIcon'
import TransferMoneyIcon from '../../svg/TransferMoneyIcon'
import { stake } from '../../../actions/staking'
import StakeConfirmModal from './StakeConfirmModal'
import BN from 'bn.js'
import { utils } from 'near-api-js'
import isDecimalString from '../../../utils/isDecimalString'
import { onKeyDown } from '../../../hooks/eventListeners'

export default function Stake({ match, validators, formLoader, actionsPending, handleGetValidators, balance }) {
    const dispatch = useDispatch()
    const [confirm, setConfirm] = useState()
    const [amount, setAmount] = useState('')
    const [success, setSuccess] = useState()
    const validator = validators.filter(validator => validator.accountId === match.params.validator)[0]
    const invalidAmount = new BN(balance.available).lt(new BN(utils.format.parseNearAmount(amount))) || !isDecimalString(amount)
    const stakeAllowed = !formLoader && amount.length && amount !== '0' && !invalidAmount

    onKeyDown(e => {
        if (e.keyCode === 13 && stakeAllowed) {
            if (!confirm) {
                setConfirm(true)
            } else {
                handleStake()
            }
        }
    })

    const handleStake = async () => {
        await dispatch(stake(validator.accountId, amount))
        await handleGetValidators()
        setSuccess(true)
        setConfirm(false)
    }
    
    if (!success) {
        return (
            <>
                <h1><Translate id='staking.stake.title' /></h1>
                <div className='desc'><Translate id='staking.stake.desc' /></div>
                <h4><Translate id='staking.stake.amount' /></h4>
                <AmountInput value={amount} onChange={setAmount} valid={stakeAllowed}/>
                <ArrowCircleIcon color={stakeAllowed ? '#6AD1E3' : ''}/>
                <h4><Translate id='staking.stake.stakeWith' /></h4>
                {validator && 
                    <ValidatorBox
                        validator={validator.accountId}
                        fee={validator.fee.percentage}
                        clickable={false}
                    />
                }
                <FormButton
                    disabled={!stakeAllowed} 
                    sending={actionsPending.includes('STAKE')} 
                    onClick={() => setConfirm(true)}
                >
                    <Translate id='staking.stake.button' />
                </FormButton>
                {confirm &&
                    <StakeConfirmModal
                        validatorName={validator.accountId} 
                        amount={amount}
                        open={confirm} 
                        onConfirm={handleStake} 
                        onClose={() => setConfirm(false)}
                        loading={formLoader || actionsPending.some(action => ['STAKE', 'GET_VALIDATORS'].includes(action))}
                    />
                }
            </>
        )
    } else {
        return (
            <>
                <TransferMoneyIcon/>
                <h1><Translate id='staking.stakeSuccess.title' /></h1>
                <div className='desc'><Translate id='staking.stakeSuccess.desc' /></div>
                {validator && 
                    <ValidatorBox
                        validator={validator.accountId}
                        fee={validator.fee.percentage}
                        amount={validator.stakedBalance}
                        clickable={false}
                        style={{margin: '40px 0'}}
                    />
                }
                <div className='desc'><Translate id='staking.stakeSuccess.descTwo' /></div>
                <FormButton linkTo='/staking' className='seafoam-blue'><Translate id='staking.stakeSuccess.button' /></FormButton>
            </>
        )
    }
}