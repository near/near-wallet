import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter, Redirect } from 'react-router-dom';

import { selectAccountSlice } from '../../redux/slices/account';
import { selectStatusLocalAlert } from '../../redux/slices/status';
import { KEY_ACTIVE_ACCOUNT_ID } from '../../utils/wallet';
import NoIndexMetaTag from './NoIndexMetaTag';

const PrivateRoute = ({
    component: Component,
    render,
    account,
    indexBySearchEngines,
    ...rest
}) => (
    <>
        {!indexBySearchEngines && <NoIndexMetaTag />}
        <Route
            {...rest}
            render={(props) => {
                if (!localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID)) {
                    return <Redirect
                        to={{
                            pathname: '/',
                        }}
                    />;
                }

                // <Route component> takes precedence over <Route render></Route>
                if (Component) {
                    return <Component {...props} />;
                }

                if (render) {
                    return render(props);
                }

                return (<></>);
            }}
        />
    </>
);

const mapStateToProps = (state) => ({
    account: selectAccountSlice(state),
    localAlert: selectStatusLocalAlert(state)
});

export default withRouter(connect(mapStateToProps)(PrivateRoute));
