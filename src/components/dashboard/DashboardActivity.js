import React from 'react'

import { Link } from 'react-router-dom'

import ListItem from './ListItem'

import { Loader, Grid, Dimmer, Button, Header, Image } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomGrid = styled(Grid)`
   &&& {
      margin-bottom: 20px;

      .row:first-child {
         padding-bottom: 0px;
      }

      .row:last-child {
         padding: 14px 0 0 4px;
         margin-left: 20px;
         border-left: 4px solid #f8f8f8;
      }

      .dashboard-header {
         padding: 14px 0 10px 0;
      }

      link.view-all,
      button.view-all,
      a.view-all {
         background: #f8f8f8;
         margin: 0;
         padding: 10px 20px;
         color: #0072ce;
         font-weight: 600;
         border-radius: 20px;
         border: 2px solid #f8f8f8;

         :hover {
            background: #fff;
         }
      }

      .column-icon {
         width: 28px;
         display: inline-block;
         margin: -4px 10px 0 8px;
      }
   }
`

const DashboardActivity = ({ loader, image, title, to, activity }) => (
   <CustomGrid>
      <Grid.Row>
         <Grid.Column className='dashboard-header' textAlign='left' width={16}>
            <Header as={Link} to={to} className='h2'>
               <Image className='column-icon' src={image} />
               {title}
            </Header>
         </Grid.Column>
      </Grid.Row>
      <Dimmer inverted active={loader}>
         <Loader />
      </Dimmer>

      {activity.map(row => (
         <ListItem row={row} />
      ))}

      <Grid.Row>
         <Grid.Column textAlign='left' width={16}>
            <Button as={Link} to={to} className='view-all'>
               VIEW ALL
            </Button>
         </Grid.Column>
      </Grid.Row>
   </CustomGrid>
)

export default DashboardActivity
