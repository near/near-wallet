import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form, Modal } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'
import InfoIcon from '../svg/InfoIcon.js'
import classNames from '../../utils/classNames'

import RequestStatusBox from '../common/RequestStatusBox'
import { ACCOUNT_CHECK_TIMEOUT, ACCOUNT_ID_SUFFIX } from '../../utils/wallet'

const InputWrapper = styled.div`
    position: relative;

    input {
        padding-right: ${props => props.type === 'create' ? '120px' : '12px'} !important;
    }
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
        const { pattern, handleChange, type } = this.props

        value = value.trim().toLowerCase()

        if (value.match(pattern)) {
            return false
        }
        
        this.setState(() => ({
            [name]: value
        }))
        
        handleChange(e, { name, value })

        !this.props.formLoader && this.checkAccountIdLength(value) && this.props.setFormLoader(true)
        this.props.formLoader && !this.checkAccountIdLength(value) && this.props.setFormLoader(false)

        this.props.requestStatus && this.props.clearRequestStatus()

        this.state.invalidAccountIdLength && this.handleAccountIdLengthState(value)

        this.timeout && clearTimeout(this.timeout)
        this.timeout = setTimeout(() => (
            this.handleCheckAvailability(value, type)
        ), ACCOUNT_CHECK_TIMEOUT)
    }

    checkAccountIdLength = (accountId) => accountId.length >= 2 && accountId.length <= 64

    handleAccountIdLengthState = (accountId) => this.setState(() => ({
        invalidAccountIdLength: !!accountId && !this.checkAccountIdLength(accountId)
    }))

    handleCheckAvailability = (accountId, type) => (
        accountId
            && !(
                type === 'create' 
                && (!this.handleAccountIdLengthState(accountId) 
                && !this.checkAccountIdLength(accountId))
            )
            && this.props.checkAvailability(type === 'create' ? this.props.accountId : accountId) 
    )

    checkSameAccount = () => this.props.type !== 'create' && this.props.stateAccountId === this.state.accountId

    get loaderRequestStatus() {
        return {
            messageCode: 'account.create.checkingAvailablity'
    }}

    get accountIdLengthRequestStatus() {
        return {
            success: false,
            messageCode: 'account.create.errorInvalidAccountIdLength'
    }}

    get sameAccountRequestStatus() {
        return {
            success: false,
            messageCode: 'account.available.errorSameAccount'
        }
    }

    handleRequestStatus = () => (
        this.state.accountId
            ? this.props.formLoader
                ? this.loaderRequestStatus
                : this.state.invalidAccountIdLength
                    ? this.accountIdLengthRequestStatus
                    : this.checkSameAccount()
                        ? this.sameAccountRequestStatus
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
                        <InputWrapper type={type}>
                            <Form.Input
                                className={requestStatus && classNames([{'success': requestStatus.success}, {'problem': requestStatus.success === false}])}
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
