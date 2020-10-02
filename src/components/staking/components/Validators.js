import React, { useState } from 'react'
import FormButton from '../../common/FormButton'
import { Translate } from 'react-localize-redux'
import ListWrapper from './ListWrapper'
import ValidatorBox from './ValidatorBox'

export default function Validators({ validators, useLockup, selectedValidator, history }) {
    const [validator, setValidator] = useState('')

    const validValidator = validators.map(validator => validator.accountId).includes(validator)

    return (
        <>
            <h1><Translate id='staking.validators.title' /></h1>
            <div className='desc'><Translate id='staking.validators.desc' /></div>
            <h4><Translate id='staking.validators.inputLabel' /></h4>
            <form onSubmit={e => {history.push(`/staking/${validator}`); e.preventDefault();}}>
                <input className='view-validator' placeholder='e.g. johndoe.near' value={validator} onChange={e => setValidator(e.target.value)} autoFocus spellCheck='false'/>
                {validValidator && 
                    <div className='input-validation-label success'><Translate id='staking.validators.search.success' /></div>
                }
                <FormButton disabled={!validValidator} type='submit'><Translate id='staking.validators.button'/></FormButton>
            </form>
            <div className='already-staked-disclaimer'><Translate id='staking.validators.alreadyStaked' /></div>
            <h3><Translate id='staking.validators.available' /></h3>
            <ListWrapper>
                {validators.filter(v => {
                    if (useLockup && selectedValidator.length > 0) {
                        return v.staked !== '0' || v.available !== '0' || v.pending !== '0'
                    } else {
                        return v.accountId.includes(validator)
                    }
                }).map((validator, i) => 
                    <ValidatorBox
                        key={i}
                        validator={validator.accountId}
                        fee={validator.fee.percentage}
                />
                )}
            </ListWrapper>
        </>
    )
}