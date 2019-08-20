import React from 'react'

import MobileContainer from './MobileContainer'
import SignAnimatedArrow from './SignAnimatedArrow'

import { Grid } from 'semantic-ui-react'

const SignTransferReady = ({ transferTransferingStart, transferTransferingPending, transferTransferingEnd }) => (
   <MobileContainer>
      <Grid>
         <Grid.Row centered>
            <Grid.Column
               textAlign='center'
               className='authorize'
            >
               <SignAnimatedArrow
                  start={transferTransferingStart}
                  pending={transferTransferingPending}
                  end={transferTransferingEnd}
               />
            </Grid.Column>
         </Grid.Row>
         <Grid.Row className='title'>
            <Grid.Column
               as='h2'
               textAlign='center'
            >
               <span className='font-bold transfering-dots'>Transfering</span> 
            </Grid.Column>
         </Grid.Row>
      </Grid>
      <Grid>
         <Grid.Row className='contract'>
            <Grid.Column>
               Contract: @contractname.near
            </Grid.Column>
         </Grid.Row>
      </Grid>
   </MobileContainer>
)

export default SignTransferReady
