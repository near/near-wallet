import React from 'react'
import { Form, Input, Button } from 'semantic-ui-react'
import PhoneInput from 'react-phone-number-input'

import ProblemsImage from '../../images/icon-problems.svg'
import CheckBlueImage from '../../images/icon-check-blue.svg'

import styled from 'styled-components'

const RecoveryInfoForm = styled(Form)`
   margin-left: -1rem;

   &&&& input {
      width: 100%;
      height: 64px;
      border: 4px solid #f8f8f8;
      padding: 0 0 0 20px;
      font-size: 18px;
      color: #4a4f54;
      font-weight: 400;
      background-color: #f8f8f8;
      position: relative;
      :focus {
         border-color: #f8f8f8;
         background-color: #fff;
      }
      :valid {
         background-color: #fff;
      }
   }
   .create {
      position: relative;

      .react-phone-number-input__country {
         position: absolute;
         top: 24px;
         right: 22px;
         z-index: 1;

         &-select-arrow {
            display: none;
         }
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
   &&& button {
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
   .ui.button {
      height: 60px;
      margin: 10px 0 0 1em;
      background-color: #fff;
      border-radius: 30px;
      border: 4px solid #e6e6e6;
      color: #999999;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 2px;
      :hover {
         background-color: #e6e6e6;
         color: #fff;
      }
   }
   & h3 {
      margin-bottom: 1rem;
   }
   select.react-phone-number-input__country-select {
      height: 100%;
   }

   @media screen and (max-width: 767px) {
      margin-left: 0;
   }
`

const RecoverAccountForm = ({
   formLoader,
   accountId,
   phoneNumber,
   sentSms,
   isLegit,
   requestStatus,
   handleSubmit,
   handleChange
}) => (
   <RecoveryInfoForm autoComplete='off' onSubmit={handleSubmit}>
      <Form.Field>
         <h3>Username</h3>
         <Form.Input
            loading={formLoader}
            className={`create ${
               requestStatus
                  ? requestStatus.success
                     ? 'success'
                     : 'problem'
                  : ''
            }`}
            name='accountId'
            value={accountId}
            onChange={handleChange}
            placeholder='example: satoshi.near'
            disabled={sentSms}
            required
         />
      </Form.Field>
      {!sentSms && (
         <Form.Field>
            <h3>Phone Number</h3>
            <PhoneInput
               className={`create ${
                  requestStatus
                     ? requestStatus.success
                        ? 'success'
                        : 'problem'
                     : ''
               } ${formLoader ? 'loading' : ''}`}
               name='phoneNumber'
               value={phoneNumber}
               onChange={value =>
                  handleChange(null, { name: 'phoneNumber', value })
               }
               placeholder='example: +1 555 123 4567'
               required
            />
         </Form.Field>
      )}

      {sentSms && (
         <Form.Field>
            <h3>Security Code from SMS</h3>
            <Input
               name='securityCode'
               onChange={handleChange}
               placeholder='example: 123456'
            />
         </Form.Field>
      )}

      <Form.Field>
         <Button type='submit' disabled={!isLegit}>
            FIND MY ACCOUNT
         </Button>
      </Form.Field>
   </RecoveryInfoForm>
)

export default RecoverAccountForm
