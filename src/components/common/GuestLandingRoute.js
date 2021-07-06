import React from 'react';

import { GuestLanding } from '../landing/GuestLanding';
import PrivateRouteLimited from './PrivateRouteLimited';

const GuestLandingRoute = ({component: Component, accountFound, ...rest}) => (
    !accountFound
        ? <GuestLanding />
        : <PrivateRouteLimited
            {...rest} 
            component={Component}
        />
);

export default GuestLandingRoute;
