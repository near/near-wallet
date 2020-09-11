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
    button {
        display: block !important;
        margin: 35px auto 45px auto !important;
        width: 100% !important;
    }

    h3 {
        border-bottom: 2px solid #E6E6E6;
        margin-top: 35px;
        padding-bottom: 15px;
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