import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateStaking, unstake, withdraw } from '../../actions/staking'
import styled from 'styled-components'
import Container from '../common/styled/Container.css'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Staking from './components/Staking'
import Validators from './components/Validators'
import Validator from './components/Validator'
import Stake from './components/Stake'


const StyledContainer = styled(Container)`

    line-height: normal;

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
        border-bottom: 2px solid #E6E6E6;
        margin-top: 35px;
        padding-bottom: 15px;
    }

    h4 {
        margin: 30px 0 15px 0;
    }

    .arrow-circle {
        display: block;
        margin: 50px auto 20px auto;
    }

    .no-border {
        border-top: 2px solid #F8F8F8;
        padding-top: 15px;
        margin-top: 15px;
    }

    .transfer-money-icon {
        display block;
        margin: 50px auto;
    }

    .already-staked-disclaimer,
    .withdrawal-disclaimer {
        font-style: italic;
        line-height: 140%;
        margin-top: 20px;
    }

    .withdrawal-disclaimer {
        max-width: 400px;
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
`

export function StakingContainer({ history }) {
    const dispatch = useDispatch()
    const staking = useSelector(({ staking }) => staking)
    const { hasLedger } = useSelector(({ ledger }) => ledger)
    const { actionsPending, balance } = useSelector(({ account }) => account);
    let validators = staking.validators
    const currentValidators = validators.filter(v => v.staked !== '0' || v.available !== '0' || v.pending !== '0')
    const { useLockup, totalUnstaked, selectedValidator } = staking
    const availableBalance = useLockup ? totalUnstaked : balance.available
    const loading = actionsPending.some(action => ['STAKE', 'UNSTAKE', 'WITHDRAW', 'UPDATE_STAKING'].includes(action))

    useEffect(() => {
        dispatch(updateStaking(useLockup))
    }, [])

    const handleGetValidators = async () => {
        await dispatch(updateStaking(useLockup))
    }

    const handleUnstake = async () => {
        await dispatch(unstake(useLockup))
        await dispatch(updateStaking(useLockup))
    }

    const handleWithDraw = async () => {
        await dispatch(withdraw(useLockup))
        await dispatch(updateStaking(useLockup))
    }

    return (
        <StyledContainer className='small-centered'>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route
                        exact
                        path='/staking'
                        render={() => (
                            <Staking
                                {...staking} 
                                currentValidators={currentValidators}
                                selectedValidator={selectedValidator}
                                availableBalance={availableBalance}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/validators'
                        render={(props) => (
                            <Validators
                                {...props}
                                validators={staking.validators}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/:validator'
                        render={(props) => (
                            <Validator 
                                {...props} 
                                validators={validators} 
                                onUnstake={handleUnstake}
                                onWithdraw={handleWithDraw}
                                loading={loading}
                                selectedValidator={selectedValidator}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/:validator/stake'
                        render={(props) => (
                            <Stake 
                                {...props} 
                                availableBalance={availableBalance}
                                useLockup={useLockup} 
                                validators={validators}
                                handleGetValidators={handleGetValidators}
                                loading={loading}
                                hasLedger={hasLedger}
                            />
                        )}
                    />
                </Switch>
            </ConnectedRouter>
        </StyledContainer>
    )
}