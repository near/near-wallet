import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Header } from 'semantic-ui-react'

import FormButton from '../common/FormButton'
import StakingFormAmount from './StakingFormAmount'

const StakingForm = ({
   loader,
   handleChange,
   isLegitForm
}) => (
   <Fragment>
      <Header as='h4'>Enter amount to stake</Header>
      <StakingFormAmount
         handleChange={handleChange}
      />
      
      <FormButton
         type='submit'
         color='blue'
         disabled={!isLegitForm()}
         sending={loader}
      >
         STAKE
      </FormButton>
   </Fragment>
)

StakingForm.propTypes = {
   loader: PropTypes.bool.isRequired,
   handleChange: PropTypes.func.isRequired,
   isLegitForm: PropTypes.func.isRequired
}

export default StakingForm
