import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Modal, Input } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'
import InfoIcon from '../svg/InfoIcon.js'
import classNames from '../../utils/classNames'

import { ACCOUNT_CHECK_TIMEOUT, ACCOUNT_ID_SUFFIX } from '../../utils/wallet'
import LocalAlertBox from '../common/LocalAlertBox.js'
import { Mixpanel } from '../../mixpanel/index'

const InputWrapper = styled.div`
    position: relative;
    margin-bottom: 30px !important;
    margin: 0;

    input {
        padding-right: ${props => props.type === 'create' ? '120px' : '12px'} !important;
    }
    
    .wrong-char {
        input {
            animation-duration: 0.4s;
            animation-iteration-count: 1;
            animation-name: border-blink;
            background-color: #8fd6bd;

            @keyframes border-blink {
                0% {
                    box-shadow: 0 0 0 0 rgba(255, 88, 93, 0.8);
                }
                100% {
                    box-shadow: 0 0 0 6px rgba(255, 88, 93, 0);
                }
            }
        }
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
    font-weight: 300;
    color: #4a4f54;
    font-size: 16px;
    padding: 0 10px;
    cursor: pointer;

    svg {
        width: 17px;
        height: 17px;
        margin: 0 0 0 6px;
    }
`

const Header = styled.h4`
    margin-bottom: 5px !important;
`

class AccountFormAccountId extends Component {
    state = {
        accountId: this.props.defaultAccountId || '',
        invalidAccountIdLength: false,
        wrongChar: false
    }

    input = createRef()
    componentDidMount = () => {
        const { defaultAccountId } = this.props
        const { accountId } = this.state
        if (defaultAccountId) {
            this.handleChangeAccountId({}, { name: 'accountId', value: accountId})
        }
    }

    handleChangeAccountId = (e, { name, value }) => {
        const { pattern, handleChange, type } = this.props

        value = value.trim().toLowerCase()

        if (value.match(pattern)) {
            if (this.state.wrongChar) {
                const el = this.input.current.inputRef.current
                el.style.animation = 'none'
                void el.offsetHeight
                el.style.animation = null
            } else {
                this.setState(() => ({
                    wrongChar: true
                }))
            }
            return false
        } else {
            this.setState(() => ({
                wrongChar: false
            }))
        }
        
        this.setState(() => ({
            [name]: value
        }))
        
        handleChange(e, { name, value })

        this.props.localAlert && this.props.clearLocalAlert()

        this.state.invalidAccountIdLength && this.handleAccountIdLengthState(value)

        this.timeout && clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.handleCheckAvailability(value, type);
        }, ACCOUNT_CHECK_TIMEOUT)
    }

    checkAccountIdLength = (accountId) => {
        const accountIdWithSuffix = `${accountId}.${ACCOUNT_ID_SUFFIX}`
        return accountIdWithSuffix.length >= 2 && accountIdWithSuffix.length <= 64
    }

    handleAccountIdLengthState = (accountId) => this.setState(() => ({
        invalidAccountIdLength: !!accountId && !this.checkAccountIdLength(accountId)
    }))

    handleCheckAvailability = (accountId, type) => {
        Mixpanel.track("CA Check account availability")
        if (!accountId) {
            return false
        }
        if (this.isImplicitAccount(accountId)) {
            return true
        }
        if (!(type === 'create' && !this.handleAccountIdLengthState(accountId) && !this.checkAccountIdLength(accountId))) {
            return this.props.checkAvailability(type === 'create' ? this.props.accountId : accountId) 
        }
        return false
    }

    isSameAccount = () => this.props.type !== 'create' && this.props.stateAccountId === this.state.accountId

    isImplicitAccount = (accountId) => this.props.type !== 'create' && accountId.length === 64

    get loaderLocalAlert() {
        return {
            messageCode: `account.create.checkingAvailablity.${this.props.type}`
        }
    }

    get accountIdLengthLocalAlert() {
        return {
            success: false,
            messageCode: 'account.create.errorInvalidAccountIdLength'
        }
    }

    get sameAccountLocalAlert() {
        return {
            success: false,
            messageCode: 'account.available.errorSameAccount'
        }
    }

    get implicitAccountLocalAlert() {
        return {
            success: true,
            messageCode: 'account.available.implicitAccount'
        }
    }

    get localAlertWithFormValidation() {
        const { accountId, invalidAccountIdLength } = this.state
        const { mainLoader, localAlert } = this.props

        if (!accountId) {
            return null
        }
        if (this.isImplicitAccount(accountId)) {
            return this.implicitAccountLocalAlert
        }
        if (mainLoader) {
            return this.loaderLocalAlert
        }
        if (invalidAccountIdLength) {
            return this.accountIdLengthLocalAlert
        }
        if (this.isSameAccount()) {
            return this.sameAccountLocalAlert
        }
        return localAlert
    }

    render() {
        const {
            mainLoader,
            autoFocus,
            type
        } = this.props

        const { accountId, wrongChar } = this.state

        const localAlert = this.localAlertWithFormValidation

        return (
            <>
                <Translate>
                    {({ translate }) => (
                        <InputWrapper type={type}>
                            <Input
                                className={classNames([{'success': localAlert && localAlert.success}, {'problem': localAlert && localAlert.success === false}, {'wrong-char': wrongChar}])}
                                name='accountId'
                                ref={this.input}
                                value={accountId}
                                onChange={this.handleChangeAccountId}
                                placeholder={type === 'create' ? translate('createAccount.accountIdInput.placeholder') : translate('input.accountId.placeholder')}
                                required
                                autoComplete='off'
                                autoCorrect='off'
                                autoCapitalize='off'
                                spellCheck='false'
                                tabIndex='1'
                                autoFocus={autoFocus && accountId.length === 0}
                            />
                            {type !== 'create' && <div className='input-sub-label'>{translate('input.accountId.subLabel')}</div>}
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
                <LocalAlertBox dots={mainLoader} localAlert={localAlert} accountId={this.props.accountId}/>
            </>
        )
    }
}

AccountFormAccountId.propTypes = {
    mainLoader: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    checkAvailability: PropTypes.func.isRequired,
    defaultAccountId: PropTypes.string,
    autoFocus: PropTypes.bool
}

AccountFormAccountId.defaultProps = {
    autoFocus: false,
    pattern: /[^a-zA-Z0-9._-]/,
    type: 'check'
}

export default AccountFormAccountId
