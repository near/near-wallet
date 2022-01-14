import React from 'react';
import { Route } from 'react-router-dom';

import NoIndexMetaTag from '../NoIndexMetaTag';

// Route is for any user - guest or logged in

export default ({
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