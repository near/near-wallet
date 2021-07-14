import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter, Redirect } from 'react-router-dom';

import { KEY_ACTIVE_ACCOUNT_ID } from '../../utils/wallet';

const PrivateRouteLimited = ({component: Component, render, account, refreshAccountOwnerEnded, ...rest}) => (
    <Route 
        {...rest} 
        render={(props) => (
            !localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID)
                ? (
                    <Redirect
                        to={{
                            pathname: '/',
                        }}
                    />
                )
                : ( Component // <Route component> takes precedence over <Route render></Route>
                    ? <Component {...props} />
                    : (render ? render(props) : <></>)
                )
        )}
    />
);

const mapStateToProps = ({ account, status }) => ({
    account,
    localAlert: status.localAlert,
    refreshAccountOwnerEnded: status.actionStatus.REFRESH_ACCOUNT_OWNER?.success === true
});

export default withRouter(connect(mapStateToProps)(PrivateRouteLimited));
