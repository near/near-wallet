import React from 'react'
import { Segment, Button } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomSegment = styled(Segment)`
   &&& {
      padding: 20px 0 0 0;
      color: #24272a;
      border-top: 4px solid #f8f8f8 !important;
      margin-top: 48px;
      line-height: 24px;
      a {
         text-decoration: underline;
         :hover {
            text-decoration: none;
         }
      }
      button.link {
         font-size: 14px;
         line-height: 14px;
         font-weight: 500;
         background-color: transparent;
         border: none;
         cursor: pointer;
         text-decoration: underline;
         display: inline;
         margin: 0;
         padding: 0;
         color: #0072ce;

         :hover,
         :focus {
            text-decoration: none;
            color: #0072ce;
         }
      }
   }
`

const AccountSkipThisStep = ({ skipRecoverySetup }) => (
   <CustomSegment basic>
      <span className='font-bold'>Skip this step</span> if you want to backup your account keys manually. However, skipping this will make it impossible for us to assist you with account recovery in the future. 
      <Button className='link' onClick={skipRecoverySetup}>
         I choose to backup my account manually
      </Button>
   </CustomSegment>
)

export default AccountSkipThisStep
