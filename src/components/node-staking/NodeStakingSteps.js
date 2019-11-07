import React from 'react'

import { Grid, Image } from 'semantic-ui-react'

import NewWinImage from '../../images/icon-new-win.svg'
import { ReactComponent as RecentImage } from '../../images/icon-recent.svg'

const NodeStakingSteps = () => (
   <Grid padded>
      <Grid.Row>
         <Grid.Column as='h2' textAlign='center'>
            To run a node or stake, please fallow these steps:
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='13'>
            <span className='color-black font-bold'>
               1. Setup & Run a Node via CLI
            </span>
            <br/>
            <span className="font-small">
               Instructions available in the Docs
            </span>
         </Grid.Column>
         <Grid.Column verticalAlign='middle' computer='3'>
            <Image src={NewWinImage} floated='right' />
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top'>
         <Grid.Column computer='13'>
            <span className='color-black font-bold'>
               2. Wait for Node to Sync
            </span>
            <br/>
            <span className="font-small">
               An out of sync node cannot produce or validate
            </span>
         </Grid.Column>
         <Grid.Column verticalAlign='middle' computer='3'>
            <Image as={RecentImage} className='recent' floated='right' />
         </Grid.Column>
      </Grid.Row>
      <Grid.Row className='border-top border-bottom'>
         <Grid.Column computer='13'>
            <span className='color-black font-bold'>
               3. Start Staking
            </span>
            <br/>
            <span className="font-small">
               Stake from here or CLI. See docs for help.
            </span>
         </Grid.Column>
         <Grid.Column verticalAlign='middle' computer='3'>
            <Image src={NewWinImage} floated='right' />
         </Grid.Column>
      </Grid.Row>
   </Grid>
)

export default NodeStakingSteps
