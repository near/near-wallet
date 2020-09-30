import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateStaking } from '../../actions/staking'
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
        border-top: 2px solid #E6E6E6;
        padding-top: 20px;
        margin-top: 15px;
    }

    .transfer-money-icon {
        display block;
        margin: 50px auto;
    }

    .already-staked-disclaimer {
        font-style: italic;
        line-height: 140%;
    }
`

export function StakingContainer({ history }) {
    const dispatch = useDispatch()
    const staking = useSelector(({ staking }) => staking)
    const { formLoader, actionsPending, balance } = useSelector(({ account }) => account);
    let validators = staking.validators
    const currentValidators = validators.filter(validator => validator.staked && validator.staked !== '0')
    validators = currentValidators.length ? currentValidators : validators
    const { useLockup } = staking

    useEffect(() => {
        dispatch(updateStaking(staking))
    }, [])

    const handleGetValidators = async () => {
        await dispatch(updateStaking(staking))
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
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/validators'
                        render={(props) => (
                            <Validators {...props} validators={staking.validators} useLockup={useLockup} alreadyStaked={currentValidators.length}/>
                        )}
                    />
                    <Route
                        exact
                        path='/staking/:validator'
                        render={(props) => (
                            <Validator {...props} validators={validators} />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/:validator/stake'
                        render={(props) => (
                            <Stake 
                                {...props} 
                                balance={balance}
                                useLockup={useLockup} 
                                validators={validators}
                                formLoader={formLoader} 
                                actionsPending={actionsPending}
                                handleGetValidators={handleGetValidators}
                            />
                        )}
                    />
                </Switch>
            </ConnectedRouter>
        </StyledContainer>
    )
}