import React from 'react';

import PrivateRoute from './routing/PrivateRoute';
import PublicRoute from './routing/PublicRoute';
import { GuestLanding } from '../landing/GuestLanding';

const GuestLandingRoute = ({
    component: Component,
    render,
    accountFound,
    indexBySearchEngines,
    ...rest
}) => (
    !accountFound
        ? (
            <PublicRoute
                component={GuestLanding}
                indexBySearchEngines={indexBySearchEngines}
            />
        )
        : (
            <PrivateRoute
                {...rest}
                component={Component}
                render={render}
            />
        )
);

export default GuestLandingRoute;
