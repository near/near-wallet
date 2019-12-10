import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Input, Header } from 'semantic-ui-react'
import PhoneInput from 'react-phone-number-input'

import FormButton from '../common/FormButton'
import AccountFormAccountId from './AccountFormAccountId'
import AccountStartOver from './AccountStartOver'

const RecoverAccountForm = ({
    loader,
    formLoader,
    phoneNumber,
    sentMessage,
    isLegit,
    requestStatus,
    handleChange,
    handleStartOver,
    handleResendCode,
    resendLoader,
    accountId
}) => (
   <Fragment>
      {!sentMessage && (
         <Fragment>
            <Header as='h4'>Username</Header>
            <AccountFormAccountId
               formLoader={formLoader}
               handleChange={handleChange}
               defaultAccountId={accountId}
            />
            
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

      {sentMessage && (
         <Fragment>
            <Header as='h4' className='digit-code empty'>&nbsp;</Header>
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
            FIND MY ACCOUNT
      </FormButton>
      <div className='recover'>
            <div>Have a seed phrase?</div>
            <Link to='/recover-seed-phrase'>Recover using seed phrase</Link>
      </div>
      {sentMessage && (
            <AccountStartOver
               handleStartOver={handleStartOver}
               handleResendCode={handleResendCode}
               resendLoader={resendLoader}
            />
      )}
   </Fragment>
)

RecoverAccountForm.propTypes = {
    loader: PropTypes.bool.isRequired,
    formLoader: PropTypes.bool.isRequired,
    phoneNumber: PropTypes.string,
    sentMessage: PropTypes.bool,
    requestStatus: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    handleStartOver: PropTypes.func.isRequired,
    handleResendCode: PropTypes.func.isRequired
}

export default RecoverAccountForm
