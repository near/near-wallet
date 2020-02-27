import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux'
import { Input } from 'semantic-ui-react';
import PhoneInput from 'react-phone-number-input';
import FormButton from '../common/FormButton';

const SetRecoveryMethod = ({
    recoverWithEmail,
    toggleRecoverMethod,
    requestStatus,
    formLoader,
    phoneNumber,
    handleFieldChange,
    submitRecovery,
    isLegit,
    email,
}) => {

    return (
        <form
            autoComplete='off'
            onSubmit={e => {e.preventDefault(); submitRecovery();}}
        >
            <h1>Protect your Account</h1>
            <h2>{`Enter your ${recoverWithEmail ? 'email' : 'phone number'} to make your account easily recoverable in the future.`}</h2>
            <h4>{recoverWithEmail ? 'Email Address' : 'Phone Number'}</h4>
            {recoverWithEmail &&
                <Input
                    name='email'
                    placeholder='example@email.com'
                    required
                    tabIndex='2'
                    value={email}
                    className='email-input-wrapper'
                    type='text'
                    onChange={handleFieldChange}
                />
            }
            {!recoverWithEmail &&
                <PhoneInput
                    className={`create ${requestStatus ? requestStatus.success ? 'success' : 'problem' : ''} ${formLoader ? 'loading' : ''}`}
                    name='phoneNumber'
                    value={phoneNumber}
                    onChange={value => handleFieldChange(null, { name: 'phoneNumber', value })}
                    placeholder='+1 415 123 4567'
                    required
                    tabIndex='2'
                />
            }
            <div className='link' onClick={toggleRecoverMethod}>
                {`Use ${recoverWithEmail ? 'phone' : 'email'} instead`}
            </div>
            <FormButton
                color='blue'
                type='submit'
                disabled={!isLegit}
                sending={formLoader}
            >
                <Translate id='button.protectAccount' />
            </FormButton>
        </form>
    );
}

SetRecoveryMethod.propTypes = {
    recoverWithEmail: PropTypes.bool.isRequired,
    toggleRecoverMethod: PropTypes.func.isRequired,
    requestStatus: PropTypes.object,
    formLoader: PropTypes.bool.isRequired,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    handleFieldChange: PropTypes.func.isRequired,
    submitRecovery: PropTypes.func.isRequired,
    isLegit: PropTypes.bool.isRequired,
}

export default SetRecoveryMethod;