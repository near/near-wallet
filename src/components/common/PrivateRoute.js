import React from 'react'
import { Route, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { KEY_ACTIVE_ACCOUNT_ID } from '../../utils/wallet'

const PrivateRoute = ({component: Component, account, ...rest}) => (
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
                : <Component {...props} />
        )}
    />
)

const mapStateToProps = ({ account, status }) => ({
    account,
    localAlert: status.localAlert
})

export default withRouter(connect(mapStateToProps)(PrivateRoute))
