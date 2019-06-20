import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Input, Header, Button } from 'semantic-ui-react'
import PhoneInput from 'react-phone-number-input'

import AccountFormAccountId from './AccountFormAccountId'

const RecoverAccountForm = ({
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
            />
         </Fragment>
      )}

      {sentSms && (
         <Fragment>
            <Header as='h3'>Security Code from SMS</Header>
            <Input
               name='securityCode'
               onChange={handleChange}
               placeholder='example: 123456'
               required
            />
         </Fragment>
      )}

      <Button type='submit' disabled={!isLegitForm()}>
         FIND MY ACCOUNT
      </Button>
   </Fragment>
)

RecoverAccountForm.propTypes = {
   formLoader: PropTypes.bool.isRequired,
   phoneNumber: PropTypes.string,
   sentSms: PropTypes.bool,
   requestStatus: PropTypes.object,
   handleChange: PropTypes.func.isRequired,
   isLegitForm: PropTypes.func,
}

export default RecoverAccountForm
