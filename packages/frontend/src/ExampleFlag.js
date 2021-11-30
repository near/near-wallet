import React from 'react';

import { Features } from '../../../features';

// Note: Referencing the FF in module scope is recommended over referencing the flag state inside of function calls
// This way if you typo a feature flag name the entire build will fail
const EXAMPLE_FLAG_STATE = Features.EXAMPLE_FLAG;

export default () => {
    return (<div>{`EXAMPLE_FLAG state for ${process.env.NEAR_WALLET_ENV} is: ${EXAMPLE_FLAG_STATE}`}</div>);
};
