import React, { Fragment } from 'react'

import MobileView from './MobileView'
import DesktopView from './DesktopView'

const ResponsiveContainer = ({ children }) => (
   <Fragment>
      <DesktopView />
      <MobileView />
      <div className='main'>{children}</div>
   </Fragment>
)

export default ResponsiveContainer
