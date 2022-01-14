import React from 'react';
import { Route } from 'react-router-dom';

import NoIndexMetaTag from '../NoIndexMetaTag';

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