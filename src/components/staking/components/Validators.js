import React, { useState } from 'react'
import { Translate } from 'react-localize-redux'
import ListWrapper from './ListWrapper'
import ValidatorBox from './ValidatorBox'

export default function Validators({ validators }) {
    const [validator, setValidator] = useState('')

    const validValidator = validators.map(validator => validator.accountId).includes(validator)

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
                {validators.map((validator, i) => 
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