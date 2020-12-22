import React from 'react'
import FormButton from '../../common/FormButton'
import BalanceBox from './BalanceBox'
import ValidatorBox from './ValidatorBox'
import ListWrapper from './ListWrapper'
import { Translate } from 'react-localize-redux'
import NoValidators from './NoValidators'
import SelectAccount from './SelectAccount'
import InfoIcon from '../../svg/InfoIcon.js'
import { Modal } from 'semantic-ui-react'
import SkeletonLoading from '../../common/SkeletonLoading'

export default function Staking({
    currentValidators,
    totalStaked,
    totalUnclaimed,
    totalAvailable,
    totalPending,
    onSwitchAccount,
    accounts,
    activeAccount,
    loading,
    hasLockup,
    unableToCalcRewards
}) {

    return (
        <>
            <h1><Translate id='staking.staking.title' /></h1>
            <h2><Translate id='staking.staking.desc' /></h2>
            <Modal
                size='mini'
                trigger={<span className='account-info'><Translate id='staking.staking.selectAccount' /> <InfoIcon color='#999999' /></span>}
                closeIcon
            >
                <Translate id='staking.stake.accounts' />
            </Modal>
            {!loading &&
                <SelectAccount
                    accounts={accounts}
                    onChange={e => onSwitchAccount(e.target.value)}
                    selectedAccount={activeAccount.accountId}
                />
            }
            <SkeletonLoading
                height='102px'
                number={hasLockup ? 2 : 1}
                show={loading}
                className='account-loader'
            />
            <FormButton disabled={loading} linkTo='/staking/validators'><Translate id='staking.staking.button' /></FormButton>
            <SkeletonLoading
                height='80px'
                number={2}
                show={loading}
                className='account-loader'
            />
            {!loading &&
                <>
                    <BalanceBox
                        title='staking.balanceBox.staked.title'
                        info='staking.balanceBox.staked.info'
                        amount={totalStaked}
                    />
                    <BalanceBox
                        title='staking.balanceBox.unclaimed.title'
                        info='staking.balanceBox.unclaimed.info'
                        amount={totalUnclaimed}
                        stakingRewardsBanner={unableToCalcRewards}
                    />
                </>
            }
            {!loading && currentValidators.length ?
                <>
                    <BalanceBox
                        title='staking.balanceBox.pending.title'
                        info='staking.balanceBox.pending.info'
                        amount={totalPending}
                    />
                    <BalanceBox
                        title='staking.balanceBox.available.title'
                        info='staking.balanceBox.available.info'
                        amount={totalAvailable}
                    />
                </>
                : null}
            <h3><Translate id='staking.staking.currentValidators' /></h3>
            {!loading && currentValidators.length ? (
                <ListWrapper>
                    {currentValidators.map((validator, i) =>
                        <ValidatorBox
                            key={i}
                            validator={validator.accountId}
                            fee={validator.fee.percentage}
                            amount={validator.staked}
                        />
                    )}
                </ListWrapper>
            ) : (
                    <NoValidators />
                )}
        </>
    )
}