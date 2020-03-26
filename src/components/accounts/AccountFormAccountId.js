import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form, Responsive } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'

import RequestStatusBox from '../common/RequestStatusBox'
import { ACCOUNT_CHECK_TIMEOUT, ACCOUNT_ID_SUFFIX } from '../../utils/wallet'

const InputWrapper = styled.div`
    position: relative;

    .network {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(calc(-50% + 4px));
        pointer-events: none;
        font-weight: 400;
        color: rgba(0,0,0,.87);
        font-size: 16px;
    }
`
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

        return (
            <>
                <Translate>
                    {({ translate }) => (
                        <InputWrapper>
                            <Form.Input
                                loading={formLoader}
                                className={` username-input-icon ${requestStatus ? (requestStatus.success ? 'success' : 'problem') : ''}`}
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
                            {type === 'create' && 
                                <span className='network'>
                                    {ACCOUNT_ID_SUFFIX}
                                </span>}
                        </InputWrapper>
                    )}
                </Translate>
                <RequestStatusBox requestStatus={requestStatus} />
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
