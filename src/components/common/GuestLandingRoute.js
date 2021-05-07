import React from 'react'
import { KEY_ACTIVE_ACCOUNT_ID } from '../../utils/wallet'
import { GuestLanding } from '../landing/GuestLanding'
import PrivateRoute from './PrivateRoute'

const GuestLandingRoute = ({component: Component, ...rest}) => (
    !localStorage.getItem(KEY_ACTIVE_ACCOUNT_ID)
        ? <GuestLanding />
        : <PrivateRoute
            {...rest} 
            component={Component}
        />
)

export default GuestLandingRoute
