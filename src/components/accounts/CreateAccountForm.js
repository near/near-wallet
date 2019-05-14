import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Form, Button, Responsive } from 'semantic-ui-react'

import ReCAPTCHA from 'react-google-recaptcha'

import CreateAccoungFormInput from './CreateAccoungFormInput'

import styled from 'styled-components'

const AccountForm = styled(Form)`
   && button {
      width: 288px;
      height: 60px;
      border-radius: 30px;
      border: 4px solid #0072ce;

      background: #0072ce;
      margin: 10px 0 0 0;

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
   }
`

const CreateAccountForm = ({
   formLoader,
   accountId,
   successMessage,
   errorMessage,
   handleSubmit,
   handleChangeAccountId,
   handleRecaptcha
}) => (
   <AccountForm autoComplete='off' onSubmit={handleSubmit}>
      <CreateAccoungFormInput
         formLoader={formLoader}
         accountId={accountId}
         handleChangeAccountId={handleChangeAccountId}
         successMessage={successMessage}
         errorMessage={errorMessage}
      />

      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
         {successMessage && (
            <Segment basic className='alert-info success'>
               Congrats! this name is available.
            </Segment>
         )}
         {errorMessage && (
            <Segment basic className='alert-info problem'>
               Username is taken. Try something else.
            </Segment>
         )}
      </Responsive>

      <ReCAPTCHA
         sitekey='6LfNjp8UAAAAAByZu30I-2-an14USj3yVbbUI3eN'
         onChange={handleRecaptcha}
      />

      <Button type='submit' disabled={!successMessage}>
         CREATE ACCOUNT
      </Button>
   </AccountForm>
)

CreateAccountForm.propTypes = {
   formLoader: PropTypes.bool.isRequired,
   accountId: PropTypes.string,
   successMessage: PropTypes.bool.isRequired,
   errorMessage: PropTypes.bool.isRequired,
   handleSubmit: PropTypes.func.isRequired,
   handleChangeAccountId: PropTypes.func.isRequired
}

export default CreateAccountForm
