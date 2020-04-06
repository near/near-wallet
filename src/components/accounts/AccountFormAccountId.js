import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Responsive } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'

import RequestStatusBox from '../common/RequestStatusBox'
import { ACCOUNT_CHECK_TIMEOUT } from '../../utils/wallet'

class AccountFormAccountId extends Component {
    state = {
        accountId: this.props.defaultAccountId || ''
    }

    handleChangeAccountId = (e, { name, value }) => {
        const { pattern, handleChange, checkAvailability } = this.props

        value = value.trim().toLowerCase()

        if (value.match(pattern)) {
            return false
        }

        this.setState(() => ({
            [name]: value
        }))

        handleChange(e, { name, value })

        this.timeout && clearTimeout(this.timeout)

        this.timeout = setTimeout(() => {
            checkAvailability(value)
        }, ACCOUNT_CHECK_TIMEOUT)
    }

    render() {
        const {
            formLoader,
            requestStatus,
            autoFocus
        } = this.props

        const { accountId } = this.state

        return (
            <>
                <Translate>
                    {({ translate }) => (
                        <Form.Input
                            loading={formLoader}
                            className={`create username-input-icon ${requestStatus ? (requestStatus.success ? 'success' : 'problem') : ''}`}
                            name='accountId'
                            value={accountId}
                            onChange={this.handleChangeAccountId}
                            placeholder={translate('createAccount.accountIdInput.placeholder')}
                            maxLength='32'
                            required
                            autoComplete='off'
                            autoCorrect='off'
                            autoCapitalize='off'
                            spellCheck='false'
                            tabIndex='1'
                            autoFocus={autoFocus && accountId.length === 0}
                        />
                    )}
                </Translate>
                <Responsive as={RequestStatusBox} maxWidth={767} requestStatus={requestStatus} />
            </>
        )
    }
}

AccountFormAccountId.propTypes = {
    formLoader: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    checkAvailability: PropTypes.func.isRequired,
    defaultAccountId: PropTypes.string,
    autoFocus: PropTypes.bool
}

AccountFormAccountId.defaultProps = {
    autoFocus: false,
    pattern: /[^a-zA-Z0-9._-]/
}

export default AccountFormAccountId
