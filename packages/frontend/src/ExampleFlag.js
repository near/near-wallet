import React from 'react';

// Note: Referencing the FF in module scope is recommended over referencing the flag state inside of function calls
// This way if you typo a feature flag name the entire build will fail
import { EXAMPLE_FLAG } from '../../../features';
import { NEAR_WALLET_ENV } from './config';

export default () => {
    return (<div>{`EXAMPLE_FLAG state for ${NEAR_WALLET_ENV} is: ${EXAMPLE_FLAG}`}</div>);
};
