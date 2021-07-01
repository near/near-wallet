import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'
import classNames from '../../utils/classNames'
import { ACCOUNT_CHECK_TIMEOUT, ACCOUNT_ID_SUFFIX } from '../../utils/wallet'
import LocalAlertBox from '../common/LocalAlertBox.js'
import { Mixpanel } from '../../mixpanel/index'

const InputWrapper = styled.div`
    position: relative;
    display: inline-block;
    font: 16px 'Inter';
    width: 100%;
    overflow: hidden;
    padding: 4px;
    margin: 5px -4px 30px -4px;

    input {
        margin-top: 0px !important;
    }
    
    &.wrong-char {
        input {
            animation-duration: 0.4s;
            animation-iteration-count: 1;
            animation-name: border-blink;

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

    &.create {
        .input-suffix {
            position: absolute;
            color: #a6a6a6;
            pointer-events: none;
            top: 50%;
            transform: translateY(-50%);
        }
    }
`

const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
class AccountFormAccountId extends Component {
    state = {
        accountId: this.props.defaultAccountId || '',
        invalidAccountIdLength: false,
        wrongChar: false
    }
    
    canvas = null;
    input = createRef();
    suffix = createRef();

    componentDidMount = () => {
        const { defaultAccountId, type } = this.props
        const { accountId } = this.state

        if (type === 'create') {
            this.suffix.current.style.visibility = 'hidden';
            this.input.current.addEventListener('input', this.updateSuffix);
        }

        if (defaultAccountId) {
            this.handleChangeAccountId(accountId)
        }
    }

    componentWillUnmount() {
        const { type } = this.props
        if (type === 'create') this.input.current.removeEventListener('input', this.updateSuffix);
    }

    updateSuffix = () => {
        const width = this.getTextWidth(this.input.current.value, '16px Inter');
        const extraSpace = isSafari ? 21.5 : 22
        this.suffix.current.style.left = width + extraSpace + 'px';
        this.suffix.current.style.visibility = 'visible';
        if (this.input.current.value.length === 0) this.suffix.current.style.visibility = 'hidden';
    }

    getTextWidth = (text, font) => {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
        }
        let context = this.canvas.getContext('2d');
        context.font = font;
        let metrics = context.measureText(text);
        return metrics.width;
    }

    handleChangeAccountId = (value) => {
        const { pattern, handleChange, type } = this.props

        value = value.trim().toLowerCase()

        if (value.match(pattern)) {
            if (this.state.wrongChar) {
                const el = this.input.current
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
            accountId: value
        }))
        
        handleChange(value)

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
        if (type === 'create') {
            Mixpanel.track("CA Check account availability")
        }
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
            show: true,
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
            type,
            disabled
        } = this.props

        const { accountId, wrongChar } = this.state

        const localAlert = this.localAlertWithFormValidation
        const success = localAlert?.success
        const problem = !localAlert?.success && localAlert?.show

        return (
            <>
                <Translate>
                    {({ translate }) => (
                        <InputWrapper className={classNames([type, {'success': success}, {'problem': problem}, {'wrong-char': wrongChar}])}>
                            <input
                                ref={this.input}
                                value={accountId}
                                onChange={e => this.handleChangeAccountId(e.target.value)}
                                placeholder={type === 'create' ? translate('createAccount.accountIdInput.placeholder', { data: ACCOUNT_ID_SUFFIX}) : translate('input.accountId.placeholder')}
                                required
                                autoComplete='off'
                                autoCorrect='off'
                                autoCapitalize='off'
                                spellCheck='false'
                                tabIndex='1'
                                autoFocus={autoFocus && accountId.length === 0}
                                disabled={disabled}
                            />
                            {type === 'create' && 
                                <span className='input-suffix' ref={this.suffix}>.{ACCOUNT_ID_SUFFIX}</span>
                            }
                            {type !== 'create' && <div className='input-sub-label'>{translate('input.accountId.subLabel')}</div>}
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