import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Header, Input } from 'semantic-ui-react'
import PhoneInput from 'react-phone-number-input'

import FormButton from '../common/FormButton'
import AccountSkipThisStep from '../common/AccountSkipThisStep'

const SetRecoveryInfoForm = ({
   loader,
   formLoader,
   phoneNumber,
   sentSms,
   isLegit,
   requestStatus,
   handleChange,
   skipRecoverySetup
}) => (
   <Fragment>
      {!sentSms && (
         <Fragment>
            <Header as='h4'>Phone Number</Header>
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
            <Header as='h4' className='digit-code'>Enter 6-digit Code</Header>
            <Input
               name='securityCode'
               onChange={handleChange}
               placeholder='123456'
               required
               tabIndex='2'
               className='sms'
               pattern='[0-9]*'
               maxLength='6'
            />

         </Fragment>
      )}

      <FormButton
         type='submit'
         color='blue'
         disabled={!isLegit}
         sending={loader}
      >
         PROTECT ACCOUNT
      </FormButton>

      <AccountSkipThisStep skipRecoverySetup={skipRecoverySetup} />
   </Fragment>
)

SetRecoveryInfoForm.propTypes = {
   loader: PropTypes.bool.isRequired,
   formLoader: PropTypes.bool.isRequired,
   phoneNumber: PropTypes.string,
   sentSms: PropTypes.bool,
   requestStatus: PropTypes.object,
   handleChange: PropTypes.func.isRequired,
   skipRecoverySetup: PropTypes.func,
}

export default SetRecoveryInfoForm
