import React, { useState } from 'react'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'

export default function Validators() {
    const [validator, setValidator] = useState('');
    
    return (
        <>
            <h1><Translate id='staking.validators.title' /></h1>
            <h2><Translate id='staking.validators.desc' /></h2>
            <h4><Translate id='staking.validators.inputLabel' /></h4>
            <input placeholder='e.g. johndoe.near' value={validator} onChange={e => setValidator(e.target.value)}/>
            <FormButton linkTo='/staking/validator'><Translate id='staking.validators.button' /></FormButton>
        </>
    )
}