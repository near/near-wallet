import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateStaking, switchAccount, stake, unstake, withdraw } from '../../actions/staking'
import { clearGlobalAlert }from '../../actions/status'
import styled from 'styled-components'
import Container from '../common/styled/Container.css'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Staking from './components/Staking'
import Validators from './components/Validators'
import Validator from './components/Validator'
import StakingAction from './components/StakingAction'
import { setStakingAccountSelected, getStakingAccountSelected } from '../../utils/localStorage'
import { getBalance } from '../../actions/account'
import { Mixpanel } from '../../mixpanel/index'

const StyledContainer = styled(Container)`
    button {
        display: block !important;
        margin: 35px auto 45px auto !important;
        width: 100% !important;

        &.seafoam-blue {
            &:hover {
                border-color: #6ad1e3 !important;
                background: #6ad1e3 !important;
            }
        }
    }

    .desc {
        text-align: center;
        line-height: 150% !important;
        margin: 25px 0;
        font-size: 16px;
    }

    input {
        margin: 0 !important;

        &.view-validator {
            margin-bottom: 25px !important;
        }
    }
    
    .input-validation-label {
        margin-top: -14px !important;
    }

    h3 {
        border-bottom: 2px solid #F2F2F2;
        margin-top: 35px;
        padding-bottom: 15px;

        @media (max-width: 767px) {
            margin: 35px -14px 0px -14px;
            padding: 0 14px 15px 14px;
        }
    }

    h4 {
        margin: 30px 0 15px 0;
    }

    .transfer-money-icon {
        display block;
        margin: 50px auto;
    }

    .withdrawal-disclaimer {
        font-style: italic;
        margin-top: 15px;
        max-width: 375px;
        font-size: 13px;
    }

    .balance-banner {
        margin-bottom: 40px;
    }

    .alert-banner {
        margin: -35px -15px 50px -15px;
        border-radius: 0;
        @media (min-width: 495px) {
            margin: 0 0 50px 0;
            border-radius: 4px;
        }
    }

    .amount-header-wrapper,
    .validator-header-wrapper  {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 30px 0 15px 0;

        h4 {
            margin: 0;
        }

        button {
            margin: 0 !important;
            width: auto !important;
            text-decoration: none !important;
            font-weight: 500 !important;
            text-transform: capitalize !important;
        }
    }

    .account-info {
        display: block;
        margin-bottom: 15px;
        svg {
            margin-left: 8px;
            width: 16px;
            height: 16px;
            margin-bottom: -3px;
        }
    }

    .radio-label {
        cursor: ${props => props.numAccounts > 1 ? 'pointer' : 'default'};
        .input-wrapper {
            display: ${props => props.numAccounts > 1 ? 'block' : 'none'};
        }
    }

    .account-loader {
        .animation-wrapper {
            :first-of-type {
                margin-bottom: 10px;
            }
        }
        .animation {
            border-radius: 8px;
        }
    }
`

export function StakingContainer({ history, match }) {
    const dispatch = useDispatch()
    const { accountId, has2fa } = useSelector(({ account }) => account);
    const status = useSelector(({ status }) => status);
    const { hasLedger } = useSelector(({ ledger }) => ledger)
    
    const staking = useSelector(({ staking }) => staking)
    const hasLockup = !!staking.lockupId
    const { currentAccount } = staking
    const stakingAccounts = staking.accounts
    const validators = staking.allValidators
    const currentValidators = currentAccount.validators
    const validatorId = history.location.pathname.split('/')[2]
    let validator = currentValidators.filter(validator => validator.accountId === validatorId)[0]
    // validator profile not in account's current validators (with balances) find validator in allValidators
    if (!validator) {
        validator = validators.filter(validator => validator.accountId === validatorId)[0]
    }
    const { totalUnstaked, selectedValidator } = currentAccount

    useEffect(() => {
        dispatch(updateStaking(getStakingAccountSelected()))
        dispatch(getBalance())
    }, [accountId])

    const handleSwitchAccount = async (accountId) => {
        setStakingAccountSelected(accountId)
        await dispatch(switchAccount(accountId, stakingAccounts))
    }
    
    const handleStakingAction = async (action, validator, amount) => {
        let id = Mixpanel.get_distinct_id()
        Mixpanel.identify(id)
        if (action === 'stake') {
            await Mixpanel.withTracking("STAKE",
                async () => {
                    await dispatch(stake(currentAccount.accountId, validator, amount))
                    Mixpanel.people.set({last_stake_time: new Date().toString()})
                }
            )
        } else if (action === 'unstake') {
            await Mixpanel.withTracking("UNSTAKE",
                async () => {
                    await dispatch(unstake(currentAccount.accountId, selectedValidator || validator, amount))
                    Mixpanel.people.set({last_unstake_time: new Date().toString()})
                }
            )
        }
        await dispatch(clearGlobalAlert())
        await dispatch(updateStaking(currentAccount.accountId, [validator]))
    }

    const handleWithDraw = async () => {
        let id = Mixpanel.get_distinct_id()
        Mixpanel.identify(id)
        await Mixpanel.withTracking("WITHDRAW",
                async () => {
                    await dispatch(withdraw(currentAccount.accountId, selectedValidator || validator.accountId))
                    Mixpanel.people.set({last_withdraw_time: new Date().toString()})
                }
            )
        await dispatch(updateStaking(currentAccount.accountId))
    }

    return (
        <StyledContainer className='small-centered' numAccounts={stakingAccounts.length}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route
                        exact
                        path='/staking'
                        render={() => (
                            <Staking
                                {...currentAccount}
                                currentValidators={currentValidators}
                                onSwitchAccount={handleSwitchAccount}
                                accounts={stakingAccounts}
                                activeAccount={currentAccount}
                                accountId={accountId}
                                loading={status.mainLoader && !stakingAccounts.length}
                                hasLockup={hasLockup}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/validators'
                        render={(props) => (
                            <Validators
                                {...props}
                                validators={validators}
                                stakeFromAccount={currentAccount.accountId === accountId}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/:validator'
                        render={(props) => (
                            <Validator 
                                {...props} 
                                validator={validator}
                                onWithdraw={handleWithDraw}
                                loading={status.mainLoader}
                                selectedValidator={selectedValidator}
                                currentValidators={currentValidators}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/:validator/stake'
                        render={(props) => (
                            <StakingAction
                                {...props}
                                action='stake'
                                handleStakingAction={handleStakingAction}
                                availableBalance={totalUnstaked} 
                                validator={validator}
                                loading={status.mainLoader}
                                hasLedger={hasLedger}
                                has2fa={has2fa}
                                stakeFromAccount={currentAccount.accountId === accountId}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/:validator/unstake'
                        render={(props) => (
                            <StakingAction
                                {...props}
                                action='unstake'
                                handleStakingAction={handleStakingAction}
                                availableBalance={totalUnstaked}
                                validator={validator}
                                loading={status.mainLoader}
                                hasLedger={hasLedger}
                                has2fa={has2fa}
                            />
                        )}
                    />
                </Switch>
            </ConnectedRouter>
        </StyledContainer>
    )
}