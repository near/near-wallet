import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Translate } from 'react-localize-redux'
import { Header } from 'semantic-ui-react'
import styled from 'styled-components'

import FormButton from '../common/FormButton'
import AccountFormAccountId from './AccountFormAccountId'

const Container = styled.div`
`

const CreateAccountForm = ({
    loader,
    mainLoader,
    handleChange,
    requestStatus,
    checkAvailability,
    accountId,
    clearRequestStatus,
    defaultAccountId
}) => (
    <Container>
        <Header as='h4'><Translate id='createAccount.accountIdInput.title' /></Header>
        <AccountFormAccountId
            mainLoader={mainLoader}
            handleChange={handleChange}
            type='create'
            pattern={/[^a-zA-Z0-9_-]/}
            checkAvailability={checkAvailability}
            requestStatus={requestStatus}
            accountId={accountId}
            clearRequestStatus={clearRequestStatus}
            defaultAccountId={defaultAccountId}
        />
        
        <FormButton
            type='submit'
            color='blue'
            disabled={!(requestStatus && requestStatus.success)}
            sending={loader}
        >
            <Translate id='button.createAccountCapital' />
        </FormButton>
        <div className='recover'>
            <div><Translate id='createAccount.alreadyHaveAnAccount' /></div>
            <Link to={process.env.DISABLE_PHONE_RECOVERY === 'yes' ? '/recover-seed-phrase' : '/recover-account'}><Translate id='createAccount.recoverItHere' /></Link>
        </div>
    </Container>
)

CreateAccountForm.propTypes = {
    loader: PropTypes.bool.isRequired,
    mainLoader: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    requestStatus: PropTypes.object
}

export default CreateAccountForm
