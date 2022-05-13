import React, {ReactNode} from 'react';
import { Route } from 'react-router-dom';

import NoIndexMetaTag from '../NoIndexMetaTag';

// Route is for any user - guest or logged in

type RouteProps = {
    component: ReactNode;
    path: string;
    render?: (props: any)=> ReactNode,
    indexBySearchEngines?:boolean;
}

export default ({
    component,
    path,
    render,
    indexBySearchEngines
}:RouteProps) => (
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
