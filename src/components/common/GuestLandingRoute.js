import React from 'react'
import { GuestLanding } from '../landing/GuestLanding'
import PrivateRoute from './PrivateRoute'

const GuestLandingRoute = ({component: Component, accountFound, ...rest}) => (
    !accountFound
        ? <GuestLanding />
        : <PrivateRoute
            {...rest} 
            component={Component}
        />
)

export default GuestLandingRoute
