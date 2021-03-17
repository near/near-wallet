import React from 'react'
import FormButton from '../../common/FormButton'
import BalanceBox from './BalanceBox'
import ValidatorBox from './ValidatorBox'
import ListWrapper from './ListWrapper'
import { Translate } from 'react-localize-redux'
import NoValidators from './NoValidators'
import SelectAccount from './SelectAccount'
import SkeletonLoading from '../../common/SkeletonLoading'
import Tooltip from '../../common/Tooltip'

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
}) {

    return (
        <>
            <h1><Translate id='staking.staking.title' /></h1>
            <h2><Translate id='staking.staking.desc' /></h2>
            <div className='select-account-title'>
                <Translate id='staking.staking.selectAccount' />
                <Tooltip translate='staking.stake.accounts' position='right'/>
            </div>
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
            <FormButton 
                disabled={loading || !accounts.every((account) => !!account.totalUnstaked)} 
                linkTo='/staking/validators'
                trackingId="STAKE Click stake my tokens button"
            >
                <Translate id='staking.staking.button' />
            </FormButton>
            <SkeletonLoading
                height='80px'
                number={2}
                show={loading || !accounts.every((account) => !!account.totalUnstaked)}
                className='account-loader'
            />
            {!loading && accounts.every((account) => !!account.totalUnstaked) &&
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
            {!loading && accounts.every((account) => !!account.totalUnstaked) 
                ? currentValidators.length
                    ? <ListWrapper>
                        {currentValidators.map((validator, i) =>
                            <ValidatorBox
                                key={i}
                                validator={validator}
                                amount={validator.staked}
                            />
                        )}
                    </ListWrapper>
                    : <NoValidators />
                : <SkeletonLoading
                    height='200px'
                    show={true}
                    className='account-loader'
                />
            }
        </>
    )
}