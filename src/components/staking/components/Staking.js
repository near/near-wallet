import React, { useState } from 'react'
import FormButton from '../../common/FormButton'
import BalanceBox from './BalanceBox'
import ValidatorBox from './ValidatorBox'
import ListWrapper from './ListWrapper'
import { Translate } from 'react-localize-redux'
import NoValidators from './NoValidators'
import AccountSwitcher from './AccountSwitcher'
import InfoIcon from '../../svg/InfoIcon.js'
import { Modal } from 'semantic-ui-react'

export default function Staking({
    currentValidators,
    totalStaked,
    totalUnclaimed,
    totalAvailable,
    totalPending,
    selectedValidator,
    onSwitchAccount,
    accounts,
    activeAccount,
    accountId
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
            <Modal
                size='mini'
                trigger={<span className='account-info'>Staking from <InfoIcon color='#999999'/></span>}
                closeIcon
            >
                <Translate id='staking.stake.accounts' />
            </Modal>
            <AccountSwitcher
                open={switchAccount}
                handleOnClick={handleSwitchAccount}
                accounts={accounts}
                activeAccount={activeAccount}
                accountId={accountId}
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