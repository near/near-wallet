import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter, Redirect } from 'react-router-dom';

import { selectAccountSlice } from '../../../redux/slices/account';
import { selectStatusLocalAlert } from '../../../redux/slices/status';
import { isKeyEncrypted } from '../../../utils/keyEncryption';
import { KEY_ACTIVE_ACCOUNT_ID } from '../../../utils/wallet';
import NoIndexMetaTag from '../NoIndexMetaTag';

/**
 * PrivateRoute is for logged in users only and will redirect to the guest landing page
 * if there's no active account or to enter password page if private key is encrypted
 */
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
            render={(props) => {
                if (!localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID)) {
                    return (
                        <Redirect
                            to={{
                                pathname: '/',
                            }}
                        />
                    );
                }

                if (isKeyEncrypted()) {
                    // Avoid infinite loop of redirect
                    const skipRedirect = rest.path === '/enter-password';

                    if (!skipRedirect) {
                        return (
                            <Redirect
                                to={{
                                    pathname: '/enter-password',
                                }}
                            />
                        );
                    }
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
