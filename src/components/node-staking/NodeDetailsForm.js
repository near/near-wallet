import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { Header } from 'semantic-ui-react'

import FormButton from '../common/FormButton'
import AddNodeFormIp from './AddNodeFormIp'
import AddNodeFormNick from './AddNodeFormNick'

const AddNodeForm = ({
   loader,
   loaderRemoveNode,
   handleChange,
   handleRemoveNode,
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
         SAVE CHANGES
      </FormButton>
      <br/>
      <FormButton
         onClick={handleRemoveNode}
         color='red'
         sending={loaderRemoveNode}
      >
         REMOVE NODE
      </FormButton>
   </Fragment>
)

AddNodeForm.propTypes = {
   loader: PropTypes.bool.isRequired,
   loaderRemoveNode: PropTypes.bool.isRequired,
   handleChange: PropTypes.func.isRequired,
   handleRemoveNode: PropTypes.func.isRequired,
   isLegitForm: PropTypes.func.isRequired
}

export default AddNodeForm
