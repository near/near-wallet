import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Input, Header } from 'semantic-ui-react'
import PhoneInput from 'react-phone-number-input'

import FormButton from '../common/FormButton'
import AccountFormAccountId from './AccountFormAccountId'

const RecoverAccountForm = ({
   loader,
   formLoader,
   phoneNumber,
   sentSms,
   requestStatus,
   handleChange,
   isLegitForm
}) => (
   <Fragment>
      <Header as='h3'>Username</Header>
      <AccountFormAccountId
         formLoader={formLoader}
         handleChange={handleChange}
      />

      {!sentSms && (
         <Fragment>
            <Header as='h3'>Phone Number</Header>
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
               tabIndex='2'
            />
         </Fragment>
      )}

      {sentSms && (
         <Fragment>
            <Header as='h3'>Enter 6-digit Code</Header>
            <Input
               name='securityCode'
               onChange={handleChange}
               placeholder='example: 123456'
               required
               tabIndex='2'
               className='sms'
            />
         </Fragment>
      )}

      <FormButton
         type='submit'
         color='blue'
         disabled={!isLegitForm()}
         sending={loader}
      >
         FIND MY ACCOUNT
      </FormButton>
   </Fragment>
)

RecoverAccountForm.propTypes = {
   loader: PropTypes.bool.isRequired,
   formLoader: PropTypes.bool.isRequired,
   phoneNumber: PropTypes.string,
   sentSms: PropTypes.bool,
   requestStatus: PropTypes.object,
   handleChange: PropTypes.func.isRequired,
   isLegitForm: PropTypes.func,
}

export default RecoverAccountForm
