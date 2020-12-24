import React, { useState } from 'react'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'
import BalanceBox from './BalanceBox'
import StakingFee from './StakingFee'
import AlertBanner from './AlertBanner'
import StakeConfirmModal from './StakeConfirmModal'
import { onKeyDown } from '../../../hooks/eventListeners'
import BN from 'bn.js'

export default function Validator({
    match,
    validator,
    onUnstake,
    onWithdraw,
    loading,
    selectedValidator,
    history,
    currentValidators,
    unableToCalcRewards
}) {
    const [confirm, setConfirm] = useState(null)

    const stakeNotAllowed = selectedValidator && selectedValidator !== match.params.validator && currentValidators.length
    const currentValidator = currentValidators.filter(validator => validator.accountId === match.params.validator)[0]
    const showRewardsBanner = unableToCalcRewards && currentValidator && !new BN(currentValidator.staked).isZero()

    onKeyDown(e => {
        if (e.keyCode === 13 && confirm === 'withdraw') {
            handleStakeAction()
        }
    })

    const handleStakeAction = async () => {
        if (confirm === 'unstake') {
           await onUnstake()
        } else if (confirm === 'withdraw') {
           await onWithdraw()
        }
        setConfirm('done')
    }

    return (
        <>
            {stakeNotAllowed &&
                <AlertBanner
                    title='staking.alertBanner.title'
                    button='staking.alertBanner.button'
                    linkTo={`/staking/${selectedValidator}`}
                />
            }
            <h1><Translate id='staking.validator.title' data={{ validator: match.params.validator }}/></h1>
            <FormButton linkTo={`/staking/${match.params.validator}/stake`} disabled={(stakeNotAllowed || !validator) ? true : false}><Translate id='staking.validator.button' /></FormButton>
            {validator && <StakingFee fee={validator.fee.percentage}/>}
            {validator && !stakeNotAllowed &&
                <>
                    <BalanceBox
                        title='staking.balanceBox.staked.title'
                        info='staking.balanceBox.staked.info'
                        amount={validator.staked || '0'}
                        onClick={() => history.push(`/staking/${match.params.validator}/unstake`)}
                        button='staking.balanceBox.staked.button'
                        buttonColor='gray-red'
                        loading={loading}
                    />
                    <BalanceBox
                        title='staking.balanceBox.unclaimed.title'
                        info='staking.balanceBox.unclaimed.info'
                        amount={validator.unclaimed || '0'}
                        stakingRewardsBanner={showRewardsBanner}
                    />
                    <BalanceBox
                        title='staking.balanceBox.pending.title'
                        info='staking.balanceBox.pending.info'
                        amount={ validator.pending || '0' }
                        disclaimer='staking.validator.withdrawalDisclaimer'
                    />
                    <BalanceBox
                        title='staking.balanceBox.available.title'
                        info='staking.balanceBox.available.info'
                        amount={ validator.available || '0' }
                        onClick={() => setConfirm('withdraw')}
                        button='staking.balanceBox.available.button'
                        loading={loading}
                    />
                    {confirm &&
                        <StakeConfirmModal
                            title={`staking.validator.${confirm}`}
                            label='staking.stake.from'
                            validator={validator}
                            amount={confirm === 'unstake' ? validator.staked : validator.available}
                            open={confirm}
                            onConfirm={handleStakeAction}
                            onClose={() => setConfirm(null)}
                            loading={loading}
                        />
                    }
                </>
            }
        </>
    )
}