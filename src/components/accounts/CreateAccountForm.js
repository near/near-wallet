import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

import ReCAPTCHA from 'react-google-recaptcha'

import FormButton from '../common/FormButton'
import AccountFormAccountId from './AccountFormAccountId'

const CreateAccountForm = ({
    loader,
    formLoader,
    handleChange,
    requestStatus,
    checkAvailability,
    userVerified,
    recaptchaTwo,
    verifyRecaptchaTwo
}) => (
    <Fragment>
        <Header as='h4'>Choose a Username</Header>
        <AccountFormAccountId
            formLoader={formLoader}
            handleChange={handleChange}
            type='create'
            pattern={/[^a-zA-Z0-9_-]/}
            checkAvailability={checkAvailability}
            requestStatus={requestStatus}
        />
        {recaptchaTwo &&
            <ReCAPTCHA
                sitekey='6LcZJtsUAAAAAN0hXzam-vEAPiFKMVsFY75Mn8AT'
                onChange={verifyRecaptchaTwo}
                style={{ marginTop: '25px' }}
            />
        }
        <FormButton
            type='submit'
            color='blue'
            disabled={!(requestStatus && requestStatus.success && userVerified)}
            sending={loader}
        >
            CREATE ACCOUNT
        </FormButton>
        <div className='recover'>
            <div>Already have an account?</div>
            <Link to={process.env.DISABLE_PHONE_RECOVERY === 'yes' ? '/recover-seed-phrase' : '/recover-account'}>Recover it here</Link>
        </div>
    </Fragment>
)

CreateAccountForm.propTypes = {
    loader: PropTypes.bool.isRequired,
    formLoader: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    verifyRecaptchaTwo: PropTypes.func.isRequired,
    requestStatus: PropTypes.object
}

export default CreateAccountForm
