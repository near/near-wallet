import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { KEY_ACTIVE_ACCOUNT_ID } from '../../../utils/wallet';
import NoIndexMetaTag from '../NoIndexMetaTag';

const PublicRoute = ({
    component,
    path,
    render,
    indexBySearchEngines
}) => (
    <>
        {!indexBySearchEngines && <NoIndexMetaTag />}
        {localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID) ? (
            <Redirect
                to={{ pathname: '/' }}
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