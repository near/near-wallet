import React, { useState } from 'react'
import AmountInput from './AmountInput'
import ValidatorBox from './ValidatorBox'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'
import ArrowCircleIcon from '../../svg/ArrowCircleIcon'
import TransferMoneyIcon from '../../svg/TransferMoneyIcon'
import StakeConfirmModal from './StakeConfirmModal'
import BN from 'bn.js'
import { utils } from 'near-api-js'
import isDecimalString from '../../../utils/isDecimalString'
import { onKeyDown } from '../../../hooks/eventListeners'
import { toNear } from '../../../utils/amounts'

const {
    parseNearAmount, formatNearAmount
} = utils.format

export default function StakingAction({
    match,
    validators,
    loading,
    availableBalance,
    hasLedger,
    action,
    handleStakingAction
}) {
    const [confirm, setConfirm] = useState()
    const [amount, setAmount] = useState('')
    const [success, setSuccess] = useState()
    const validator = validators.filter(validator => validator.accountId === match.params.validator)[0]
    const hasStakeActionAmount = !loading && amount.length && amount !== '0'
    let staked = (validator && validator.staked) || '0'
    
    const invalidStakeActionAmount = action === 'stake' ? 
    new BN(parseNearAmount(amount)).sub(new BN(availableBalance)).gt(new BN(parseNearAmount('0.00001'))) && isDecimalString(amount)
    :
    new BN(parseNearAmount(amount)).sub(new BN(staked)).gt(new BN(parseNearAmount('0.00001'))) && isDecimalString(amount)

    const stakeActionAllowed = hasStakeActionAmount && !invalidStakeActionAmount

    console.log('available balance:', availableBalance)
    console.log('staked balance:', staked)
    console.log('amount to unstake:', amount)

    onKeyDown(e => {
        if (e.keyCode === 13 && stakeActionAllowed) {
            if (!confirm) {
                setConfirm(true)
            } else {
                onStakingAction()
            }
        }
    })

    const onStakingAction = async () => {
        await handleStakingAction(action, validator.accountId, amount)
        setSuccess(true)
        setConfirm(false)
    }

    const handleSetMax = () => {
        const amount = action === 'stake' ? availableBalance : staked
        setAmount(formatNearAmount(amount, 5))
    }
    
    if (!success) {
        return (
            <>
                <h1><Translate id={`staking.${action}.title`} /></h1>
                <div className='desc'><Translate id={`staking.${action}.desc`} /></div>
                <div className='amount-header-wrapper'>
                    <h4><Translate id='staking.stake.amount' /></h4>
                    <FormButton className='link' onClick={handleSetMax}>Use max</FormButton>
                </div>
                <AmountInput
                    action={action}
                    value={amount} 
                    onChange={setAmount}
                    valid={stakeActionAllowed}
                    availableBalance={action === 'stake' ? availableBalance : (validator && validator.staked) || '0'}
                    availableClick={handleSetMax}
                    insufficientBalance={invalidStakeActionAmount} 
                    loading={loading}
                />
                <ArrowCircleIcon color={stakeActionAllowed ? '#6AD1E3' : ''}/>
                <h4><Translate id={`staking.${action}.stakeWith`} /></h4>
                {validator && 
                    <ValidatorBox
                        validator={validator.accountId}
                        fee={validator.fee.percentage}
                        clickable={false}
                        amount={validator.staked}
                    />
                }
                <FormButton
                    disabled={!stakeActionAllowed} 
                    sending={loading} 
                    onClick={() => setConfirm(true)}
                >
                    <Translate id={`staking.${action}.button`} />
                </FormButton>
                {confirm &&
                    <StakeConfirmModal
                        title={`staking.${action}.confirm`}
                        validatorName={validator.accountId} 
                        amount={toNear(amount)}
                        open={confirm} 
                        onConfirm={onStakingAction} 
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
                <h1><Translate id={`staking.${action}Success.title`} /></h1>
                <div className='desc'><Translate id={`staking.${action}Success.desc`} /></div>
                {validator && 
                    <ValidatorBox
                        validator={validator.accountId}
                        fee={validator.fee.percentage}
                        amount={validator.staked}
                        clickable={false}
                        style={{margin: '40px 0'}}
                    />
                }
                <div className='desc'><Translate id={`staking.${action}Success.descTwo`} /></div>
                <FormButton linkTo='/staking' className='seafoam-blue'><Translate id={`staking.${action}Success.button`} /></FormButton>
            </>
        )
    }
}