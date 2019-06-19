import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Header, Button } from 'semantic-ui-react'

import ReCAPTCHA from 'react-google-recaptcha'

import AccountFormAccountId from './AccountFormAccountId'

const CreateAccountForm = ({
   formLoader,
   accountId,
   handleChangeAccountId,
   handleRecaptcha,
   requestStatus
}) => (
   <Fragment>
      <Header as='h3'>Choose a Username</Header>
      <AccountFormAccountId
         formLoader={formLoader}
         accountId={accountId}
         handleChangeAccountId={handleChangeAccountId}
         requestStatus={requestStatus}
      />

      {false ? (
         <ReCAPTCHA
            sitekey='6LfNjp8UAAAAAByZu30I-2-an14USj3yVbbUI3eN'
            onChange={handleRecaptcha}
         />
      ) : null}
      <Button
         type='submit'
         disabled={!(requestStatus && requestStatus.success)}
      >
         CREATE ACCOUNT
      </Button>
      <div className='recover'>
         <div>Already have an account?</div>
         <Link to='/recover-account'>Recover it here</Link>
      </div>
   </Fragment>
)

CreateAccountForm.propTypes = {
   formLoader: PropTypes.bool.isRequired,
   accountId: PropTypes.string,
   handleChangeAccountId: PropTypes.func.isRequired,
   handleRecaptcha: PropTypes.func.isRequired,
   requestStatus: PropTypes.object
}

export default CreateAccountForm
