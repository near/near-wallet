import React from 'react'

import { Link } from 'react-router-dom'

import { Grid, Image } from 'semantic-ui-react'

import { ReactComponent as NodesImage } from '../../images/icon-nodes.svg'
import { ReactComponent as AddBlueImage } from '../../images/icon-add-blue.svg'
import ArrowRight from '../../images/icon-arrow-right.svg'

const NodeStakingNodes = ({ nodes }) => (
   <Grid padded className='box'>
      <Grid.Row className=''>
         <Grid.Column computer='13'>
            <div className='svg'>
               <NodesImage />
            </div>
            <h2>Nodes</h2>
         </Grid.Column>
         <Grid.Column verticalAlign='middle' computer='3'>
            <Link to='/add-node'>
               <Image as={AddBlueImage} floated='right' />
            </Link>
         </Grid.Column>
      </Grid.Row>
         {nodes.length ? nodes.map((node, i) => (
            <Grid.Row key={`nodes-${i}`}  as={Link} to='/node-details' className='border-top node'>
               <Grid.Column computer='11'>
                  <span className='color-black font-bold'>
                     AWS Instance #34
                  </span>
                  <br/>
                  <span className='font-small'>
                     23.129.64.151
                  </span>
               </Grid.Column>
               <Grid.Column verticalAlign='middle' computer='5'>
                  <Image src={ArrowRight} floated='right' className='arrow' />
                  <div className='node-dot'>
                     <div className={node.online ? `green` : `red`} />
                  </div>
               </Grid.Column>
            </Grid.Row>
         )) : (
            <Grid.Row className='border-top'>
               <Grid.Column computer='16'>
                  <span className='color-black font-bold'>
                     Already have your node setup? Add it here.
                  </span>
                  <br/>
                  <span className='font-small'>
                     This connects your node to your wallet account.
                  </span>
               </Grid.Column>
            </Grid.Row>
         )}
   </Grid>
)

export default NodeStakingNodes
