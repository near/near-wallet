import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Form, Button, Responsive } from 'semantic-ui-react'
import PhoneInput from 'react-phone-number-input'

import ProblemsImage from '../../images/icon-problems.svg'
import CheckBlueImage from '../../images/icon-check-blue.svg'

import styled from 'styled-components'

const RecoveryInfoForm = styled(Form)`
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

   select.react-phone-number-input__country-select {
      height: 100%;
   }
`

const SetRecoveryInfoForm = ({
   formLoader,
   phoneNumber,
   isLegit,
   successMessage,
   errorMessage,
   handleSubmit,
   handleChange
}) => (
   <RecoveryInfoForm autoComplete='off' onSubmit={handleSubmit}>
      <PhoneInput
         className={`create ${successMessage ? 'success' : ''}${
            errorMessage ? 'problem' : ''
         } ${formLoader ? 'loading' : '' } `}
         name='phoneNumber'
         value={phoneNumber}
         onChange={ value => handleChange(null, { name: 'phoneNumber', value })}
         placeholder='example: +1 555 123 4567'
      />

      {successMessage && (
         <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
            <Segment basic className='alert-info success'>
               TODO: Message to wait for SMS
            </Segment>
         </Responsive>
      )}
      {errorMessage && (
         <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
            <Segment basic className='alert-info problem'>
               TODO: Show error message
            </Segment>
         </Responsive>
      )}

      <Button type='submit' disabled={!isLegit}>
         PROTECT ACCOUNT
      </Button>
   </RecoveryInfoForm>
)

SetRecoveryInfoForm.propTypes = {
   formLoader: PropTypes.bool.isRequired,
   phoneNumber: PropTypes.string,
   isLegit: PropTypes.bool.isRequired,
   successMessage: PropTypes.bool.isRequired,
   errorMessage: PropTypes.bool.isRequired,
   handleSubmit: PropTypes.func.isRequired,
   handleChange: PropTypes.func.isRequired
}

export default SetRecoveryInfoForm
