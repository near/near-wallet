import React, { useState } from 'react'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'
import BalanceBox from './BalanceBox'
import StakingFee from './StakingFee'
import ListWrapper from './ListWrapper'
import AlertBanner from './AlertBanner'
import StakeConfirmModal from './StakeConfirmModal'
import { onKeyDown } from '../../../hooks/eventListeners'

export default function Validator({ match, validators, onUnstake, onWithdraw, loading, selectedValidator }) {
    const [confirm, setConfirm] = useState(null)
    const validator = validators.filter(validator => validator.accountId === match.params.validator)[0]
    const stakeNotAllowed = selectedValidator && selectedValidator !== match.params.validator

    onKeyDown(e => {
        if (e.keyCode === 13 && (confirm === 'unstake' || confirm === 'withdraw')) {
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
            <FormButton linkTo={`/staking/${match.params.validator}/stake`} disabled={stakeNotAllowed || !validator}><Translate id='staking.validator.button' /></FormButton>
            {validator &&
                <>
                    <StakingFee fee={validator.fee.percentage}/>
                    <ListWrapper>
                        <BalanceBox
                            title='staking.balanceBox.staked.title'
                            info='staking.balanceBox.staked.info'
                            amount={validator.staked || '0'}
                            version='no-border'
                            onClick={() => setConfirm('unstake')}
                            button='staking.balanceBox.staked.button'
                            buttonColor='gray-red'
                            loading={loading}
                        />
                        <BalanceBox
                            title='staking.balanceBox.unclaimed.title'
                            info='staking.balanceBox.unclaimed.info'
                            amount={validator.unclaimed || '0'}
                            version='no-border'
                        />
                        <BalanceBox
                            title='staking.balanceBox.pending.title'
                            info='staking.balanceBox.pending.info'
                            amount={ validator.pending || '0' }
                            version='no-border'
                            disclaimer='staking.validator.withdrawalDisclaimer'
                        />
                        <BalanceBox
                            title='staking.balanceBox.available.title'
                            info='staking.balanceBox.available.info'
                            amount={ validator.available || '0' }
                            version='no-border'
                            onClick={() => setConfirm('withdraw')}
                            button='staking.balanceBox.available.button'
                            loading={loading}
                        />
                    </ListWrapper>
                    {confirm &&
                        <StakeConfirmModal
                            title={`staking.validator.${confirm}`}
                            validatorName={validator.accountId}
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