import React from 'react'
import { Grid } from 'semantic-ui-react'
import styled from 'styled-components'

const DisclaimerGrid = styled(Grid)`
   && .disclaimer {
      margin-top: 100px;

      > .column {
         padding-left: 0px;
         padding-right: 0px;
      }
   }
   .disclaimer-info {
      font-weight: 600;
      letter-spacing: 2px;
   }

   @media screen and (max-width: 767px) {
      && .disclaimer {
         margin-top: 50px;
         font-size: 12px;
         margin-left: 1rem;
         margin-right: 1rem;
      }
   }
`

const Disclaimer = () => (
   <DisclaimerGrid>
      <Grid.Row className='disclaimer border-top-bold'>
         <Grid.Column computer={16} tablet={16} mobile={16}>
            <span className='disclaimer-info'>DISCLAIMER: </span>
            This is a developers&apos; preview Wallet. It should be used for
            NEAR Protocol DevNet only. Learn more at{' '}
            <a href='http://nearprotocol.com'>nearprotocol.com</a>
         </Grid.Column>
      </Grid.Row>
   </DisclaimerGrid>
)

export default Disclaimer
