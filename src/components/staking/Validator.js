import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Translate } from 'react-localize-redux'
import { getValidators } from '../../actions/staking'

import styled from 'styled-components'
import { Input as _Input } from 'semantic-ui-react'
import FormButton from '../common/FormButton'

const Root = styled.section`
    text-align: center;
`;

const Input = styled(_Input)`
    width: 300px;
`;


const Validator = (props) => {

    const {
        history,
        validator,
    } = props

    const [amount, setAmount] = useState('')

    const dispatch = useDispatch()
    
    useEffect(() => {
        if (!validator) dispatch(getValidators())
    }, [])

    if (!validator) return <h2>Loading</h2>

    console.log(validator)
    
    return (<Root>
        <h1>{validator.name}</h1>
        <p>fee { validator.fee.percentage } %</p>
        <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Amount to Stake`}
        />
        <br />
        <FormButton onClick={() => history.push('/validator/' + accountId)}>Submit Stake</FormButton>
    </Root>)
}

const mapStateToProps = ({ staking }, { match: { params: { validatorId } } }) => ({
    validator: staking.validators.find((v) => v.name === validatorId),
})

export const ValidatorWithRouter = connect(mapStateToProps)(withRouter(Validator))
