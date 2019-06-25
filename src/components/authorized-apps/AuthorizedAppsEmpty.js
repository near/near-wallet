import React from 'react'
import { Segment, Header, Button } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomSegment = styled(Segment)`
   &&& {
      max-width: 700px;
      .button {
         width: 288px;
         height: 60px;
         line-height: 24px;
         border-radius: 30px;
         border: 4px solid #0072ce;
         font-weight: 600;
         background: #0072ce;
         margin: 12px 0 36px 0;
         font-size: 18px;
         color: #fff;
         letter-spacing: 2px;
         :hover {
            background: #fff;
            color: #0072ce;
         }
         :disabled {
            border: 4px solid #e6e6e6;
            background: #e6e6e6;
            opacity: 1 !important;
         }
         :active,
         :focus {
            background: #fff;
            color: #0072ce;
         }
      }
      @media screen and (max-width: 767px) {
         max-width: 100%;
         margin-top: 24px;
         text-align: center;
      }
   }
`

const AuthorizedAppsEmpty = () => (
   <CustomSegment basic>
      <Header as='h2'>You have not connected your NEAR Wallet to any applications. When you do, you can manage them here.</Header>
      <Header as='h2'>See what's been built with NEAR:</Header>
      <Button as='a' href='https://builtwithnear.com/'>BROWSE APPS</Button>
   </CustomSegment>
)

export default AuthorizedAppsEmpty
