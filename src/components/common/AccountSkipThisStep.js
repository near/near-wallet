import React from 'react'
import { Segment } from 'semantic-ui-react'

import FormButton from '../common/FormButton'

import styled from 'styled-components'

const CustomSegment = styled(Segment)`
   &&& {
      padding: 20px 0 0 0;
      color: #24272a;
      border-top: 4px solid #f8f8f8 !important;
      margin-top: 48px;
      line-height: 24px;
   }
`

const AccountSkipThisStep = ({ skipRecoverySetup }) => (
   <CustomSegment basic>
      <span className='font-bold'>Skip this step</span> if you want to backup your account keys manually. However, skipping this will make it impossible for us to assist you with account recovery in the future. 
      <FormButton
         onClick={skipRecoverySetup}
         color='link'
      >
         I choose to backup my account manually
      </FormButton>
   </CustomSegment>
)

export default AccountSkipThisStep
