import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateStaking, switchAccount, stake, unstake, withdraw } from '../../actions/staking'
import { clearAlert } from '../../actions/account';
import styled from 'styled-components'
import Container from '../common/styled/Container.css'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Staking from './components/Staking'
import Validators from './components/Validators'
import Validator from './components/Validator'
import StakingAction from './components/StakingAction'
import BN from 'bn.js'

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
    const { accountId, has2fa, formLoader, hasLockup } = useSelector(({ account }) => account);
    const { hasLedger } = useSelector(({ ledger }) => ledger)
    
    const staking = useSelector(({ staking }) => staking)
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
    const { totalUnstaked, selectedValidator, totalStaked } = currentAccount

    const unableToCalcRewards = currentAccount.accountId === accountId && has2fa && !new BN(totalStaked).isZero()

    useEffect(() => {
        dispatch(updateStaking())
    }, [])

    const handleSwitchAccount = async (accountId) => {
        await dispatch(switchAccount(accountId, stakingAccounts))
    }
    
    const handleStakingAction = async (action, validator, amount) => {
        if (action === 'stake') {
            await dispatch(stake(currentAccount.accountId, validator, amount))
        } else if (action === 'unstake') {
            await dispatch(unstake(currentAccount.accountId, selectedValidator || validator, amount))
        }
        await dispatch(clearAlert())
        await dispatch(updateStaking(currentAccount.accountId, [validator]))
    }

    const handleWithDraw = async () => {
        await dispatch(withdraw(currentAccount.accountId, selectedValidator || validator.accountId))
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
                                loading={formLoader}
                                hasLockup={hasLockup}
                                unableToCalcRewards={unableToCalcRewards}
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
                                loading={formLoader}
                                selectedValidator={selectedValidator}
                                currentValidators={currentValidators}
                                unableToCalcRewards={unableToCalcRewards}
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
                                loading={formLoader}
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
                                loading={formLoader}
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