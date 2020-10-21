import React, { useState } from 'react'
import FormButton from '../../common/FormButton'
import BalanceBox from './BalanceBox'
import ValidatorBox from './ValidatorBox'
import ListWrapper from './ListWrapper'
import { Translate } from 'react-localize-redux'
import BalanceBanner from './BalanceBanner'
import NoValidators from './NoValidators'
import AccountSwitcher from './AccountSwitcher'

export default function Staking({
    currentValidators,
    totalStaked,
    totalUnclaimed,
    totalAvailable,
    totalPending,
    selectedValidator,
    availableBalance,
    onSwitchAccount,
    accounts,
    activeAccount
}) {
    const [switchAccount, setSwitchAccount] = useState(false)

    const handleSwitchAccount = (accountId) => {
        if (switchAccount) {
            if (activeAccount.accountId !== accountId) {
                onSwitchAccount(accountId)
            }
            setSwitchAccount(false)
        } else {
            setSwitchAccount(true)
        }
    }

    return (
        <>
            <h1><Translate id='staking.staking.title' /></h1>
            <div className='desc'><Translate id='staking.staking.desc' /></div>
            <AccountSwitcher
                open={switchAccount}
                handleOnClick={handleSwitchAccount}
                accounts={accounts}
                activeAccount={activeAccount}
            />
            <FormButton linkTo='/staking/validators'><Translate id='staking.staking.button' /></FormButton>
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
            {selectedValidator &&
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
            }
            <h3><Translate id='staking.staking.currentValidators' /></h3>
            {currentValidators.length ? (
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
                <NoValidators/>
            )}
        </>
    )
}