import React from 'react'
import { Grid } from 'semantic-ui-react'

import RequestStatusBox from '../common/RequestStatusBox'

const AccountFormSection = ({ requestStatus, children }) => (
   <Grid className=''>
      <Grid.Column computer={8} tablet={8} mobile={16} className=''>
         {children}
      </Grid.Column>
      <Grid.Column computer={8} tablet={8} mobile={16}>
         <RequestStatusBox requestStatus={requestStatus} />
      </Grid.Column>
   </Grid>
)

export default AccountFormSection
