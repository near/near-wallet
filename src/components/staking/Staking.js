import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Translate } from 'react-localize-redux'

import styled from 'styled-components'

import { getValidators } from '../../actions/staking'

import { Input as _Input } from 'semantic-ui-react'
import FormButton from '../common/FormButton'

const Root = styled.section`
    text-align: center;
`;

const Input = styled(_Input)`
    margin-bottom: 24px;
    width: 300px;
`;

const Staking = (props) => {

    const {
        history,
        validators
    } = props

    const [accountId, setAccountId] = useState('')

    const dispatch = useDispatch()
    
    useEffect(() => {
        if (!validators.length) dispatch(getValidators())
    }, [])
    
    return (<Root>
        <h1>Staking</h1>

        { validators.length > 0 ? <>
            <Input
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder={`Enter Validator Account Id`}
            />
            <br/>
            { 
                accountId.length > 0 && validators.filter(({ name }) => {
                    let re = new RegExp(`^${ accountId }`)
                    return re.test(name) && name !== accountId
                }).map(({ name }) => <p key={name} onClick={() => setAccountId(name)}>{name}</p>)
            }
            <FormButton onClick={() => history.push('/validator/' + accountId)}>Stake NEAR</FormButton>
        </> :
        <h2>Loading</h2>
        }
    </Root>)
}

const mapStateToProps = ({ staking }) => ({ ...staking })

export const StakingWithRouter = connect(mapStateToProps)(withRouter(Staking))
