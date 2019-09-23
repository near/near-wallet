import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

import ReCAPTCHA from 'react-google-recaptcha'

import FormButton from '../common/FormButton'
import AccountFormAccountId from './AccountFormAccountId'

const CreateAccountForm = ({
   loader,
   formLoader,
   handleChange,
   handleRecaptcha,
   requestStatus
}) => (
   <Fragment>
      <Header as='h4'>Choose a Username</Header>
      <AccountFormAccountId
         formLoader={formLoader}
         handleChange={handleChange}
         type='create'
      />

      {false ? (
         <ReCAPTCHA
            sitekey='6LfNjp8UAAAAAByZu30I-2-an14USj3yVbbUI3eN'
            onChange={handleRecaptcha}
         />
      ) : null}
      
      <FormButton
         type='submit'
         color='blue'
         disabled={!(requestStatus && requestStatus.success)}
         sending={loader}
      >
         CREATE ACCOUNT
      </FormButton>
      <div className='recover'>
         <div>Already have an account?</div>
         <Link to='/recover-account'>Recover it here</Link>
      </div>
   </Fragment>
)

CreateAccountForm.propTypes = {
   loader: PropTypes.bool.isRequired,
   formLoader: PropTypes.bool.isRequired,
   handleChange: PropTypes.func.isRequired,
   handleRecaptcha: PropTypes.func.isRequired,
   requestStatus: PropTypes.object
}

export default CreateAccountForm
