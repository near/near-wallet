import React, { useState } from 'react'
import { Translate } from 'react-localize-redux'
import ListWrapper from './ListWrapper'
import ValidatorBox from './ValidatorBox'

export default function Validators({ validators, stakeFromAccount }) {

    const [validator, setValidator] = useState('')

    const validValidator = validators.map(validator => validator.accountId).includes(validator)

    return (
        <>
            <h1><Translate id='staking.validators.title' /></h1>
            <h2><Translate id={`staking.validators.desc.${stakeFromAccount ? 'account' : 'lockup'}`} /></h2>
            <h4><Translate id='staking.validators.inputLabel' /></h4>
            <div className='color-black font-bw'><Translate id='staking.validators.randomShuffle'/></div>
            <Translate>
                {({ translate }) => (
                    <input
                        className='view-validator'
                        placeholder={translate('staking.validators.inputPlaceholder')}
                        value={validator}
                        onChange={e => setValidator(e.target.value)}
                        autoFocus 
                        spellCheck='false'
                        autoCapitalize='off'
                    />
                )}
            </Translate>
            {validValidator && 
                <div className='input-validation-label success'><Translate id='staking.validators.search.success' /></div>
            }
            <ListWrapper>
                {validators.filter(v => v.accountId.includes(validator)).map((validator, i) => 
                    <ValidatorBox
                        key={i}
                        validator={validator}
                    />
                )}
            </ListWrapper>
        </>
    )
}