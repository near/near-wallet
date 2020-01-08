import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Responsive } from 'semantic-ui-react'
import RequestStatusBox from '../common/RequestStatusBox'
import { ACCOUNT_CHECK_TIMEOUT } from '../../utils/wallet'

class AccountFormAccountId extends Component {
    state = {
        accountId: this.props.defaultAccountId || ''
    }

    handleChangeAccountId = (e, { name, value }) => {
        const { pattern, handleChange, checkAvailability } = this.props

        if (value.match(pattern)) {
            return false
        }

        this.setState(() => ({
            [name]: value.trim().toLowerCase()
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
            autoFocus,
            type
        } = this.props

        const { accountId } = this.state

        const requestStatusSameAccount = type !== 'create' && this.props.accountId === accountId && {
            success: false,
            messageCode: 'account.available.errorSameAccount',
        }

        return (
            <>
                <Form.Input
                    loading={formLoader}
                    className={`create username-input-icon ${requestStatus ? (requestStatus.success ? 'success' : 'problem') : ''}`}
                    name='accountId'
                    value={accountId}
                    onChange={this.handleChangeAccountId}
                    placeholder='satoshi.test'
                    maxLength='32'
                    required
                    autoComplete='off'
                    autoCorrect='off'
                    autoCapitalize='off'
                    spellCheck='false'
                    tabIndex='1'
                    autoFocus={autoFocus && accountId.length === 0}
                />
                <Responsive as={RequestStatusBox} maxWidth={this.props.type === 'create' ? 767 : undefined} requestStatus={requestStatusSameAccount || requestStatus} />
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
