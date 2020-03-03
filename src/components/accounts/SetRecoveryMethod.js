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
            <h1><Translate id='setRecovery.pageTitle' /></h1>
            <h2><Translate id={`setRecovery.pageText.${recoverWithEmail ? 'email' : 'phoneNumber'}`} /></h2>
            <h4><Translate id={`setRecovery.${recoverWithEmail ? 'emailInput' : 'phoneInput'}.title`} /></h4>
            {recoverWithEmail &&
                <Translate>
                    {({ translate }) => (
                        <Input
                            name='email'
                            placeholder={translate('setRecovery.emailInput.placeholder')}
                            required
                            tabIndex='2'
                            value={email}
                            className='email-input-wrapper'
                            type='text'
                            onChange={handleFieldChange}
                        />
                    )}
                </Translate>
            }
            {!recoverWithEmail &&
                <Translate>
                    {({ translate }) => (
                        <PhoneInput
                            className={`create ${requestStatus ? requestStatus.success ? 'success' : 'problem' : ''} ${formLoader ? 'loading' : ''}`}
                            name='phoneNumber'
                            value={phoneNumber}
                            onChange={value => handleFieldChange(null, { name: 'phoneNumber', value })}
                            placeholder={translate('setRecovery.phoneInput.placeholder')}
                            required
                            tabIndex='2'
                        />
                    )}
                </Translate>
            }
            <div className='link' onClick={toggleRecoverMethod}><Translate id={`setRecovery.useInstead.${recoverWithEmail ? 'phoneNumber' : 'email'}`} /></div>
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