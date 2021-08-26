import React from 'react';
import { Route } from 'react-router-dom';

import NoIndexMetaTag from './NoIndexMetaTag';

const PublicRoute = ({
    component,
    path,
    render,
    indexBySearchEngines
}) => (
    <>
        {!indexBySearchEngines && <NoIndexMetaTag />}
        <Route
            exact
            path={path}
            component={component}
            render={render}
        />
    </>
);

export default PublicRoute;