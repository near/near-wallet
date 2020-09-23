import React from 'react'
import styled from 'styled-components'
import Container from '../common/styled/Container.css'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
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
        margin-top: 20px;
    }

    .transfer-money-icon {
        display block;
        margin: 50px auto;
    }
`

export function StakingContainer() {
    return (
        <StyledContainer className='small-centered'>
            <Router>
                <Switch>
                    <Route
                        exact
                        path='/staking'
                        component={Staking}
                    />
                    <Route
                        exact
                        path='/staking/validators'
                        component={Validators}
                    />
                    <Route
                        exact
                        path='/staking/:validator'
                        component={Validator}
                    />
                    <Route
                        exact
                        path='/staking/:validator/stake'
                        component={Stake}
                    />
                </Switch>
            </Router>
        </StyledContainer>
    )
}