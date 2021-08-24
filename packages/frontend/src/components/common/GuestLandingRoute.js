import React from 'react';

import { GuestLanding } from '../landing/GuestLanding';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const GuestLandingRoute = ({
    component: Component,
    render,
    accountFound,
    indexBySearchEngines,
    ...rest
}) => (
    !accountFound
        ? <PublicRoute
            component={GuestLanding}
            indexBySearchEngines={indexBySearchEngines}
        />
        : <PrivateRoute
            {...rest}
            component={Component}
            render={render}
        />
);

export default GuestLandingRoute;
