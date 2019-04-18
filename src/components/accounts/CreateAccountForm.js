import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Form, Button, Responsive } from 'semantic-ui-react'

import ProblemsImage from '../../images/icon-problems.svg'
import CheckBlueImage from '../../images/icon-check-blue.svg'

import styled from 'styled-components'

const AccountForm = styled(Form)`
   &&& input {
      width: 100%;
      height: 64px;
      border: 4px solid #f8f8f8;
      padding: 0 0 0 20px;

      font-size: 18px;
      color: #4a4f54;
      font-weight: 400;
      background: 0;

      position: relative;

      :focus {
         border-color: #6ad1e3;
      }
   }

   &&&&& .spinner {
      margin-right: 20px;

      :before,
      :after {
         top: 28px;
         width: 24px;
         height: 24px;
      }
   }

   .problem > .input > input {
      background: url(${ProblemsImage}) right 22px center no-repeat;
      background-size: 24px 24px;
   }
   .problem > .input > input:focus {
      background: url(${ProblemsImage}) right 22px center no-repeat;
      background-size: 24px 24px;
   }

   .success > .input > input {
      background: url(${CheckBlueImage}) right 22px center no-repeat;
      background-size: 24px 24px;
   }
   .success > .input > input:focus {
      background: url(${CheckBlueImage}) right 22px center no-repeat;
      background-size: 24px 24px;
   }

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
`

const CreateAccountForm = ({
   form_loader,
   account_id,
   is_legit,
   success_message,
   error_message,
   handleSubmit,
   handleChange
}) => (
   <AccountForm autoComplete='off' onSubmit={handleSubmit}>
      <Form.Input
         loading={form_loader}
         className={`create ${success_message ? 'success' : ''}${
            error_message ? 'problem' : ''
         }`}
         name='account_id'
         value={account_id}
         onChange={handleChange}
         placeholder='example: satoshi.near'
      />

      {success_message && (
         <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
            <Segment basic className='alert-info success'>
               Congrats! this name is available.
            </Segment>
         </Responsive>
      )}
      {error_message && (
         <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
            <Segment basic className='alert-info problem'>
               Username is taken. Try something else.
            </Segment>
         </Responsive>
      )}

      <Button type='submit' disabled={!is_legit}>
         CREATE ACCOUNT
      </Button>
   </AccountForm>
)

CreateAccountForm.propTypes = {
   form_loader: PropTypes.bool.isRequired,
   account_id: PropTypes.string,
   is_legit: PropTypes.bool.isRequired,
   success_message: PropTypes.bool.isRequired,
   error_message: PropTypes.bool.isRequired,
   handleSubmit: PropTypes.func.isRequired,
   handleChange: PropTypes.func.isRequired
}

export default CreateAccountForm
