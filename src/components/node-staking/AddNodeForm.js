import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Header } from 'semantic-ui-react'

import FormButton from '../common/FormButton'
import AddNodeFormIp from './AddNodeFormIp'
import AddNodeFormNick from './AddNodeFormNick'

const AddNodeForm = ({
   loader,
   handleChange,
   isLegitForm
}) => (
   <Fragment>
      <Header as='h4'>Enter the IP Address of your Node</Header>
      <AddNodeFormIp
         handleChange={handleChange}
      />

      <Header as='h4'>Give it a nickname (optional)</Header>
      <AddNodeFormNick
         handleChange={handleChange}
      />
      
      
      <FormButton
         type='submit'
         color='blue'
         disabled={!isLegitForm()}
         sending={loader}
      >
         ADD NODE
      </FormButton>
      <div className='recover font-small'>
         Your node must be setup via CLI before adding it here.
      </div>
   </Fragment>
)

AddNodeForm.propTypes = {
   loader: PropTypes.bool.isRequired,
   handleChange: PropTypes.func.isRequired,
   isLegitForm: PropTypes.func.isRequired
}

export default AddNodeForm
