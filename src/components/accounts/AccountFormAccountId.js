import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form, Modal } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'
import InfoIcon from '../svg/InfoIcon.js'

import RequestStatusBox from '../common/RequestStatusBox'
import { ACCOUNT_CHECK_TIMEOUT, ACCOUNT_ID_SUFFIX } from '../../utils/wallet'

const InputWrapper = styled.div`
    position: relative;
`

const DomainName = styled.div`
    position: absolute;
    right: 8px;
    top: calc(8px + 8px);
    bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-weight: 400;
    color: #4a4f54;
    font-size: 16px;
    padding: 0 10px;
    line-height: normal;
    background-color: #f8f8f8;
    cursor: pointer;

    svg {
        width: 17px;
        height: 17px;
        margin-left: 6px;
    }
`

const Header = styled.h4`
    margin-bottom: 5px !important;
`

class AccountFormAccountId extends Component {
    state = {
        accountId: this.props.defaultAccountId || '',
        invalidAccountIdLength: false
    }

    handleChangeAccountId = (e, { name, value }) => {
        const { pattern, handleChange, checkAvailability, type } = this.props

        value = value.trim().toLowerCase()

        if (value.match(pattern)) {
            return false
        }
        
        this.setState(() => ({
            [name]: value
        }))
        
        handleChange(e, { name, value })

        this.timeout && clearTimeout(this.timeout)

        !this.props.formLoader && this.props.setFormLoader(!this.handleCheckAccountIdLength(value))

        this.props.requestStatus && this.props.clearRequestStatus()

        this.timeout = setTimeout(() => (
            value
                && !(type === 'create' && this.handleCheckAccountIdLength(value, true))
                && checkAvailability(type === 'create' ? this.props.accountId : value)
        ), ACCOUNT_CHECK_TIMEOUT)
    }

    handleCheckAccountIdLength = (accountId, setInvalidState = false) => {
        !accountId.length && this.setState(() => ({
            invalidAccountIdLength: false
        }))

        if ((accountId.length < 2 || accountId.length > 64)) {
            setInvalidState && this.setState(() => ({
                invalidAccountIdLength: true
            }))
            this.props.clearRequestStatus()
            
            return true
        }
        else {
            this.setState(() => ({
                invalidAccountIdLength: false
            }))
        }
    }

    get loaderRequestStatus() {
        return {
        success: true,
        messageCode: 'account.create.checkingAvailablity'
    }}

    get accountIdLengthRequestStatus() {
        return {
        success: false,
        messageCode: 'account.create.errorInvalidAccountIdLength'
    }}

    handleRequestStatus = () => (
        this.state.accountId
            ? this.props.formLoader
                ? this.loaderRequestStatus
                : this.state.invalidAccountIdLength
                    ? this.accountIdLengthRequestStatus
                    : this.props.requestStatus
            : null
    )

    render() {
        const {
            formLoader,
            autoFocus,
            type
        } = this.props

        const { accountId } = this.state

        const requestStatus = this.handleRequestStatus()

        return (
            <>
                <Translate>
                    {({ translate }) => (
                        <InputWrapper>
                            <Form.Input
                                loading={formLoader}
                                className={`${requestStatus ? (requestStatus.success ? 'success' : 'problem') : ''}`}
                                name='accountId'
                                value={accountId}
                                onChange={this.handleChangeAccountId}
                                placeholder={translate('createAccount.accountIdInput.placeholder')}
                                required
                                autoComplete='off'
                                autoCorrect='off'
                                autoCapitalize='off'
                                spellCheck='false'
                                tabIndex='1'
                                autoFocus={autoFocus && accountId.length === 0}
                            />
                            {type === 'create' &&
                                <Modal
                                    size='mini'
                                    trigger={<DomainName>.{ACCOUNT_ID_SUFFIX}<InfoIcon/></DomainName>}
                                    closeIcon
                                >
                                    <Header>{translate('topLevelAccounts.header')}</Header>
                                    {translate('topLevelAccounts.body', { suffix: ACCOUNT_ID_SUFFIX })}
                                </Modal>
                            }
                        </InputWrapper>
                    )}
                </Translate>
                <RequestStatusBox dots={formLoader} requestStatus={requestStatus} accountId={this.props.accountId}/>
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
