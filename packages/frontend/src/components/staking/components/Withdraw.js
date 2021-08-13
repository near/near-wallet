import React from 'react';
import { Translate } from 'react-localize-redux';

import ListWrapper from './ListWrapper';
import ValidatorBox from './ValidatorBox';

export default function Withdraw({ currentValidators }) {

    return (
        <>
            <h1><Translate id='staking.validators.title' /></h1>
            <h2><Translate id={`staking.validators.desc.withdraw`} /></h2>
            <h3><Translate id='staking.staking.currentValidators' /></h3>
            <ListWrapper>
                {currentValidators.filter(v => v.available).map((validator, i) =>
                    <ValidatorBox
                        key={i}
                        validator={validator}
                        amount={validator.available}
                        showBalanceInUSD={false}
                    />
                )}
            </ListWrapper>
        </>
    );
}