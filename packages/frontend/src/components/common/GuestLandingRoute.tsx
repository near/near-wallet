import React, {ReactNode} from 'react';

import { GuestLanding } from '../landing/GuestLanding';
import PrivateRoute from './routing/PrivateRoute';
import PublicRoute from './routing/PublicRoute';

type GuestLandingRouteProps = {
    component: () => ReactNode;
    render:(props: any)=> ReactNode;
    accountFound: boolean;
    indexBySearchEngines: boolean;
    rest: {[x:string]:string}
}


const GuestLandingRoute = ({
    component: Component,
    render,
    accountFound,
    indexBySearchEngines,
    ...rest
}:GuestLandingRouteProps) => (
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
