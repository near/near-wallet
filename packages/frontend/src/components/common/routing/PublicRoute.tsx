import React, { ReactNode } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { KEY_ACTIVE_ACCOUNT_ID } from '../../../utils/wallet';
import NoIndexMetaTag from '../NoIndexMetaTag';

// PublicRoute is for guest users only and will redirect to dashboard if there is an active account

type PublicRouteProps = {
    component : () => ReactNode;
    path?: string,
    render?: ()=> void;
    indexBySearchEngines: boolean;
}

const PublicRoute = ({
    component,
    path,
    render,
    indexBySearchEngines
}:PublicRouteProps) => (
    <>
        {!indexBySearchEngines && <NoIndexMetaTag />}
        {localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID) ? (
            <Redirect
                to='/'
            />
        ) : (
            <Route
                exact
                path={path}
                component={component}
                render={render}
            />
        )}
    </>
);

export default PublicRoute;
