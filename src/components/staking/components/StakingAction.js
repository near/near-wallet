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
import { STAKING_AMOUNT_DEVIATION } from '../../../utils/staking'
import { onKeyDown } from '../../../hooks/eventListeners'
import { toNear } from '../../../utils/amounts'
import AlertBanner from './AlertBanner'
import { ACCOUNT_MIN_AMOUNT } from '../../../utils/wallet'

const {
    parseNearAmount, formatNearAmount
} = utils.format

export default function StakingAction({
    match,
    validator,
    loading,
    availableBalance,
    hasLedger,
    has2fa,
    action,
    handleStakingAction,
    stakeFromAccount
}) {
    const [confirm, setConfirm] = useState()
    const [amount, setAmount] = useState('')
    const [success, setSuccess] = useState()
    const [useMax, setUseMax] = useState(null)
    const hasStakeActionAmount = !loading && amount.length && amount !== '0'
    let staked = (validator && validator.staked) || '0'
    const stake = action === 'stake' ? true : false
    const displayAmount = useMax ? formatNearAmount(amount, 5) : amount
    const availableToStake = stakeFromAccount ? new BN(availableBalance).sub(new BN(utils.format.parseNearAmount(ACCOUNT_MIN_AMOUNT))).toString() : availableBalance
    const invalidStakeActionAmount = new BN(useMax ? amount : parseNearAmount(amount)).sub(new BN(stake ? availableToStake : staked)).gt(new BN(STAKING_AMOUNT_DEVIATION)) || !isDecimalString(amount)
    const stakeActionAllowed = hasStakeActionAmount && !invalidStakeActionAmount



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
        let stakeActionAmount = amount
        const userInputAmountIsMax = new BN(parseNearAmount(amount)).sub(new BN(stake ? availableBalance : staked)).abs().lte(new BN(STAKING_AMOUNT_DEVIATION))

        if (!stake) {
            if (!useMax && userInputAmountIsMax) {
                stakeActionAmount = staked
            } else if (useMax || userInputAmountIsMax) {
                stakeActionAmount = null
            }
        }

        await handleStakingAction(action, validator.accountId, stakeActionAmount)
        setSuccess(true)
        setConfirm(false)
    }

    const handleSetMax = () => {
        let amount = stake ? availableBalance : staked

        if (stake && stakeFromAccount) {
            amount = availableToStake
        }

        setAmount(amount)
        setUseMax(true)
    }

    const handleOnChange = (amount) => {
        setAmount(amount)
        setUseMax(false)
    }

    const getStakeActionDisclaimer = () => {
        let disclaimer = ''
        if (stake) {
            if ((hasLedger || has2fa) && !stakeFromAccount) {
                disclaimer = 'staking.stake.ledgerDisclaimer'
            }
        } else {
            disclaimer = 'staking.unstake.beforeUnstakeDisclaimer'
        }
        return disclaimer
    }
    
    if (!success) {
        return (
            <>
                {stake && stakeFromAccount && (useMax || invalidStakeActionAmount) &&
                    <AlertBanner
                        title={`staking.stake.banner.${useMax ? 'stakeMax' : 'insufficientBalance'}`}
                        theme={invalidStakeActionAmount ? 'error' : ''}
                        titleData={ACCOUNT_MIN_AMOUNT}
                    />
                }
                <h1><Translate id={`staking.${action}.title`} /></h1>
                <div className='desc'><Translate id={`staking.${action}.desc`} /></div>
                <div className='amount-header-wrapper'>
                    <h4><Translate id='staking.stake.amount' /></h4>
                    <FormButton className='link' onClick={handleSetMax}><Translate id='staking.stake.useMax' /></FormButton>
                </div>
                <AmountInput
                    action={action}
                    value={displayAmount} 
                    onChange={handleOnChange}
                    valid={stakeActionAllowed}
                    availableBalance={stake ? availableBalance : staked}
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
                        label={`staking.stake.${stake ? 'with' : 'from'}`}
                        validator={validator}
                        amount={useMax ? amount : toNear(amount)}
                        open={confirm} 
                        onConfirm={onStakingAction} 
                        onClose={() => setConfirm(false)}
                        loading={loading}
                        disclaimer={getStakeActionDisclaimer()}
                    />
                }
            </>
        )
    } else {
        return (
            <>
                <TransferMoneyIcon/>
                <h1><Translate id={`staking.${action}Success.title`} /></h1>
                <div className='desc'><Translate id={`staking.${action}Success.desc`} data={{ amount: displayAmount }}/></div>
                {validator && 
                    <ValidatorBox
                        validator={validator.accountId}
                        fee={validator.fee.percentage}
                        amount={validator.staked}
                        clickable={false}
                        style={{margin: '40px 0'}}
                    />
                }
                <div className='desc'><Translate id={`staking.${action}Success.descTwo`}/></div>
                <FormButton linkTo='/staking' className='gray-blue'><Translate id={`staking.${action}Success.button`} /></FormButton>
            </>
        )
    }
}