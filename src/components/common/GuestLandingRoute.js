import React from 'react';

import { GuestLanding } from '../landing/GuestLanding';
import PrivateRouteLimited from './PrivateRouteLimited';

const GuestLandingRoute = ({component: Component, render, accountFound, ...rest}) => (
    !accountFound
        ? <GuestLanding />
        : <PrivateRouteLimited
            {...rest} 
            component={Component}
            render={render}
        />
);

export default GuestLandingRoute;
