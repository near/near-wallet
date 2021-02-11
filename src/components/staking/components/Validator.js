import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'
import BalanceBox from './BalanceBox'
import StakingFee from './StakingFee'
import AlertBanner from './AlertBanner'
import StakeConfirmModal from './StakeConfirmModal'
import { onKeyDown } from '../../../hooks/eventListeners'
import { redirectTo } from '../../../actions/account'
import { actionsPending } from '../../../utils/alerts'
import { Mixpanel } from '../../../mixpanel'

export default function Validator({
    match,
    validator,
    onWithdraw,
    loading,
    selectedValidator,
    currentValidators,
}) {
    const [confirm, setConfirm] = useState(null)
    const dispatch = useDispatch()
    const stakeNotAllowed = selectedValidator && selectedValidator !== match.params.validator && currentValidators.length

    onKeyDown(e => {
        if (e.keyCode === 13 && confirm === 'withdraw' && !loading) {
            handleStakeAction()
        }
    })

    const handleStakeAction = async () => {
        if (confirm === 'withdraw') {
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
            <FormButton 
                linkTo={`/staking/${match.params.validator}/stake`} 
                disabled={(stakeNotAllowed || !validator) ? true : false}
                onClick={() => Mixpanel.track("STAKE Click stake with validator button")}
            >
                <Translate id='staking.validator.button' />
            </FormButton>
            {validator && <StakingFee fee={validator.fee.percentage}/>}
            {validator && !stakeNotAllowed && !actionsPending('UPDATE_STAKING') &&
                <>
                    <BalanceBox
                        title='staking.balanceBox.staked.title'
                        info='staking.balanceBox.staked.info'
                        amount={validator.staked || '0'}
                        onClick={() => {
                            dispatch(redirectTo(`/staking/${match.params.validator}/unstake`))
                            Mixpanel.track("UNSTAKE Click unstake button")
                        }}
                        button='staking.balanceBox.staked.button'
                        buttonColor='gray-red'
                        loading={loading}
                    />
                    <BalanceBox
                        title='staking.balanceBox.unclaimed.title'
                        info='staking.balanceBox.unclaimed.info'
                        amount={validator.unclaimed || '0'}
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
                        onClick={() => {
                            setConfirm('withdraw')
                            Mixpanel.track("WITHDRAW Click withdraw button")
                        }}
                        button='staking.balanceBox.available.button'
                        loading={loading}
                    />
                    {confirm &&
                        <StakeConfirmModal
                            title={`staking.validator.${confirm}`}
                            label='staking.stake.from'
                            validator={validator}
                            amount={validator.available}
                            open={confirm}
                            onConfirm={handleStakeAction}
                            onClose={() => setConfirm(null)}
                            loading={loading}
                            sendingString='withdrawing'
                        />
                    }
                </>
            }
        </>
    )
}