import React from "react"
import { Route, withRouter, Redirect } from "react-router-dom"
import { connect } from "react-redux"

import { isEmpty } from '../../actions/account'

const PrivateRoute = ({component: Component, ...rest}) => (
   <Route 
      {...rest} 
      render={(props) => (
         isEmpty().payload
            ? (
               <Redirect
                  to={{
                     pathname: '/create/',
                     search: props.location.search,
                  }}
               />
            )
            : <Component {...props} />
      )}
   />
)

const mapDispatchToProps = {
   isEmpty
}

const mapStateToProps = () => ({})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateRoute))
