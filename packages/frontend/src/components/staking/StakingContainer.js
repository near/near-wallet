import { ConnectedRouter } from 'connected-react-router';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import { Mixpanel } from '../../mixpanel/index';
import { getBalance } from '../../redux/actions/account';
import {
    updateStaking,
    handleStakingAction,
    handleUpdateCurrent
} from '../../redux/actions/staking';
import { selectAccountHas2fa, selectAccountHasLockup, selectAccountId, selectBalance } from '../../redux/slices/account';
import { selectLedgerHasLedger } from '../../redux/slices/ledger';
import { selectStakingSlice } from '../../redux/slices/staking';
import { selectStatusSlice } from '../../redux/slices/status';
import { selectNearTokenFiatValueUSD } from '../../redux/slices/tokenFiatValues';
import { setStakingAccountSelected, getStakingAccountSelected } from '../../utils/localStorage';
import Container from '../common/styled/Container.css';
import Staking from './components/Staking';
import StakingAction from './components/StakingAction';
import Unstake from './components/Unstake';
import Validator from './components/Validator';
import Validators from './components/Validators';
import Withdraw from './components/Withdraw';

const StyledContainer = styled(Container)`
    h1, h2 {
        text-align: center !important;
    }
    
    button {
        display: block !important;
        margin: 35px auto 40px auto !important;
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
        margin-top: 50px;
        padding-bottom: 15px;

        @media (max-width: 767px) {
            margin: 50px -14px 0px -14px;
            padding: 0 14px 15px 14px;
        }
    }

    h4 {
        margin: 30px 0 10px 0;
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
        margin: -25px -14px 50px -14px;
        border-radius: 0;
        @media (min-width: 451px) {
            margin: 0 0 50px 0;
            border-radius: 4px;
        }
    }

    .amount-header-wrapper,
    .validator-header-wrapper  {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 30px 0 10px 0;

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
        cursor: ${props => props.multipleAccounts ? 'pointer' : 'default'};
        .input-wrapper {
            display: ${props => props.multipleAccounts ? 'block' : 'none'};
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

    .select-account-title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        
        .tooltip {
            margin-bottom: -1px;
        }
    }
`;


export function StakingContainer({ history, match }) {
    const dispatch = useDispatch();
    const accountId = useSelector(selectAccountId);
    const has2fa = useSelector(selectAccountHas2fa);
    const balance = useSelector(selectBalance);
    const status = useSelector(selectStatusSlice);
    const hasLedger = useSelector(selectLedgerHasLedger);
    const staking = useSelector(selectStakingSlice);
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);
    const hasLockup = useSelector(selectAccountHasLockup);

    const { currentAccount } = staking;
    const stakingAccounts = staking.accounts;
    const validators = staking.allValidators;
    const currentValidators = currentAccount.validators;
    const validatorId = history.location.pathname.split('/')[2];
    let validator = currentValidators.filter(validator => validator.accountId === validatorId)[0];
    // validator profile not in account's current validators (with balances) find validator in allValidators
    if (!validator) {
        validator = validators.filter(validator => validator.accountId === validatorId)[0];
    }
    const { totalUnstaked, selectedValidator } = currentAccount;
    const loadingBalance = !stakingAccounts.every((account) => !!account.totalUnstaked);
    const stakeFromAccount = currentAccount.accountId === accountId;

    useEffect(() => {
        if (accountId) {
            dispatch(getBalance());
        }
        if (!!balance.available) {
            dispatch(updateStaking(getStakingAccountSelected()));
        }
    }, [accountId, !!balance.available]);

    const handleSwitchAccount = (accountId) => {
        setStakingAccountSelected(accountId);
        dispatch(handleUpdateCurrent(accountId));
    };

    const handleAction = async (action, validator, amount) => {
        let id = Mixpanel.get_distinct_id();
        Mixpanel.identify(id);
        await Mixpanel.withTracking(action.toUpperCase(),
            async () => {
                const properValidator = action === 'stake'
                    ? validator
                    : selectedValidator || validator;
                await dispatch(handleStakingAction(action, properValidator, amount));
                Mixpanel.people.set({[`last_${action}_time`]: new Date().toString()});
            }
        );
    };

    const multipleAccounts = stakingAccounts.length > 1;

    return (
        <StyledContainer className='small-centered' multipleAccounts={multipleAccounts}>
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
                                loadingDetails={(status.mainLoader && !stakingAccounts.length) || loadingBalance}
                                hasLockup={hasLockup}
                                stakeFromAccount={stakeFromAccount}
                                selectedValidator={selectedValidator}
                                multipleAccounts={multipleAccounts}
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
                                stakeFromAccount={stakeFromAccount}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/unstake'
                        render={(props) => (
                            <Unstake
                                {...props}
                                currentValidators={currentValidators}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/withdraw'
                        render={(props) => (
                            <Withdraw
                                {...props}
                                currentValidators={currentValidators}
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
                                onWithdraw={handleAction}
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
                                handleStakingAction={handleAction}
                                availableBalance={totalUnstaked} 
                                validator={validator}
                                loading={status.mainLoader}
                                hasLedger={hasLedger}
                                has2fa={has2fa}
                                stakeFromAccount={stakeFromAccount}
                                selectedValidator={selectedValidator}
                                currentValidators={currentValidators}
                                nearTokenFiatValueUSD={nearTokenFiatValueUSD}
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
                                handleStakingAction={handleAction}
                                availableBalance={totalUnstaked}
                                validator={validator}
                                loading={status.mainLoader}
                                hasLedger={hasLedger}
                                has2fa={has2fa}
                                nearTokenFiatValueUSD={nearTokenFiatValueUSD}
                            />
                        )}
                    />
                </Switch>
            </ConnectedRouter>
        </StyledContainer>
    );
}