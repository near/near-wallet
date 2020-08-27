import React from 'react'
import { Route, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = ({component: Component, account, ...rest}) => (
    <Route 
        {...rest} 
        render={(props) => (
            !account.accountId
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

const mapStateToProps = ({ account }) => ({
    account
})

export default withRouter(connect(mapStateToProps)(PrivateRoute))
