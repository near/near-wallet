import BN from 'bn.js';
import React from 'react';
import { Translate } from 'react-localize-redux';

import ListWrapper from './ListWrapper';
import ValidatorBox from './ValidatorBox';

export default function Unstake({ currentValidators }) {

    return (
        <>
            <h1><Translate id='staking.validators.title' /></h1>
            <h2><Translate id={`staking.validators.desc.unstake`} /></h2>
            <h3><Translate id='staking.staking.currentValidators' /></h3>
            <ListWrapper>
                {currentValidators.filter(v => !new BN(v.staked).isZero()).map((validator, i) =>
                    <ValidatorBox
                        key={i}
                        validator={validator}
                        amount={validator.staked}
                        stakeAction='unstake'
                    />
                )}
            </ListWrapper>
        </>
    );
}