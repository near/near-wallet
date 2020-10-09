import React, { useState } from 'react'
import { Translate } from 'react-localize-redux'
import ListWrapper from './ListWrapper'
import ValidatorBox from './ValidatorBox'

export default function Validators({ validators, useLockup, selectedValidator }) {
    const [validator, setValidator] = useState('')

    const validValidator = validators.map(validator => validator.accountId).includes(validator)

    const selectedStaked = validators.filter(v => useLockup && selectedValidator === v.accountId && (v.staked !== '0' || v.available !== '0' || v.pending !== '0'))

    return (
        <>
            <h1><Translate id='staking.validators.title' /></h1>
            <div className='desc'><Translate id='staking.validators.desc' /></div>
            <h4><Translate id='staking.validators.inputLabel' /></h4>
            <Translate>
                {({ translate }) => (
                    <input 
                        className='view-validator'
                        placeholder={translate('staking.validators.inputPlaceholder')}
                        value={validator}
                        onChange={e => setValidator(e.target.value)}
                        autoFocus 
                        spellCheck='false'
                    />
                )}
            </Translate>
            {validValidator && 
                <div className='input-validation-label success'><Translate id='staking.validators.search.success' /></div>
            }
            <ListWrapper>
                {(selectedStaked.length ? selectedStaked : validators)
                .filter(v => v.accountId.includes(validator))
                .map((validator, i) => 
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