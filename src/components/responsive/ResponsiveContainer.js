import React, { Fragment } from 'react'

import MobileView from './MobileView'
import DesktopView from './DesktopView'

const ResponsiveContainer = ({ children }) => (
   <Fragment>
      <DesktopView>{children}</DesktopView>
      <MobileView>{children}</MobileView>
   </Fragment>
)

export default ResponsiveContainer
