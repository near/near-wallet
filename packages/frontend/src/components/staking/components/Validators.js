import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';

import { getValidatorRegExp } from '../../../utils/constants';
import { wallet } from '../../../utils/wallet';
import ListWrapper from './ListWrapper';
import ValidatorBox from './ValidatorBox';


export default function Validators({ validators, stakeFromAccount }) {

    const [validator, setValidator] = useState('');
    const networkId = wallet.connection.networkId;
    const validatorPrefix = getValidatorRegExp(networkId);
    const validValidator = validators.map(validator => validator.accountId).includes(validator);

    return (
        <>
            <h1><Translate id='staking.validators.title' /></h1>
            <h2><Translate id={`staking.validators.desc.${stakeFromAccount ? 'account' : 'lockup'}`} /></h2>
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
                        autoCapitalize='off'
                        data-test-id="stakingSearchForValidator"
                    />
                )}
            </Translate>
            {validValidator && (
                <div
                    className="input-validation-label success"
                    data-test-id="stakingPageValidatorFoundLabel"
                >
                    <Translate id="staking.validators.search.success" />
                </div>
            )}
            <ListWrapper>
                {validators.filter(v => v.accountId.includes(validator))
                    .sort((first, second) =>
                        (second.accountId.includes(validatorPrefix) - first.accountId.includes(validatorPrefix))
                    )
                    .map((validator, i) =>
                        <ValidatorBox
                            key={i}
                            validator={validator}
                        />
                    )}
            </ListWrapper>
        </>
    );
}