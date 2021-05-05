import React from 'react'
import { Route, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { KEY_ACTIVE_ACCOUNT_ID } from '../../utils/wallet'

const PrivateRouteLimited = ({component: Component, account, refreshAccountOwnerEnded, ...rest}) => (
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
    localAlert: status.localAlert,
    refreshAccountOwnerEnded: status.actionStatus.REFRESH_ACCOUNT_OWNER?.success === true
})

export default withRouter(connect(mapStateToProps)(PrivateRouteLimited))
