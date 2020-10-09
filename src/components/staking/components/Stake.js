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
import { toNear } from '../../../utils/amounts'

export default function Stake({ match, validators, useLockup, loading, handleGetValidators, availableBalance, hasLedger }) {
    const dispatch = useDispatch()
    const [confirm, setConfirm] = useState()
    const [amount, setAmount] = useState('')
    const [success, setSuccess] = useState()
    const validator = validators.filter(validator => validator.accountId === match.params.validator)[0]
    const insufficientBalance = new BN(availableBalance).lt(new BN(utils.format.parseNearAmount(amount)))
    const invalidAmount = insufficientBalance || !isDecimalString(amount)
    const stakeAllowed = !loading && amount.length && amount !== '0' && !invalidAmount

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
        await dispatch(stake(useLockup, validator.accountId, amount))
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
                <AmountInput 
                    value={amount} 
                    onChange={setAmount} 
                    valid={stakeAllowed}
                    availableBalance={availableBalance}
                    insufficientBalance={insufficientBalance} 
                    loading={loading}
                />
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
                    sending={loading} 
                    onClick={() => setConfirm(true)}
                >
                    <Translate id='staking.stake.button' />
                </FormButton>
                {confirm &&
                    <StakeConfirmModal
                        title='staking.stake.confirm'
                        validatorName={validator.accountId} 
                        amount={toNear(amount)}
                        open={confirm} 
                        onConfirm={handleStake} 
                        onClose={() => setConfirm(false)}
                        loading={loading}
                        disclaimer={hasLedger ? 'staking.stake.ledgerDisclaimer' : ''}
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
                        amount={validator.staked}
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