import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'
import classNames from '../../../utils/classNames'
import { ACCOUNT_CHECK_TIMEOUT } from '../../../utils/wallet'
import CheckCircleIcon from '../../svg/CheckCircleIcon'

const InputWrapper = styled.div`
    position: relative;
    font: 16px 'Inter';
    width: 100%;

    input {
        margin-top: 0px;
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

    &.success, &.problem {
        input {
            border: 0;
        }
    }

    input {
        text-align: right;
        border: 0;
        padding-right: 15px;

        &:focus {
            box-shadow: none;
        }
    }

    .check-circle-icon {
        width: 19px;
        height: 19px;
    }

    .success-prefix {
        position: absolute;
        pointer-events: none;
        top: 50%;
        transform: translateY(-50%);
        height: 19px;
        opacity: 0;
        margin-top: 1px;
    }

    &.success {
        input {
            color: #008D6A;
            &:focus {
                box-shadow: none;
            }
        }
        .success-prefix {
            opacity: 1;
        }
    }

    &.problem {
        input {
            color: #FC5B5B;
            &:focus {
                box-shadow: none;
            }
        }
    }
`
class AccountIDInput extends Component {
    state = {
        wrongChar: false
    }

    canvas = null;
    input = createRef();
    prefix = createRef();

    componentDidMount = () => {
        const { accountId } = this.props

        this.prefix.current.style.visibility = 'hidden';
        this.input.current.addEventListener('input', this.updatePrefix);

        if (accountId) {
            this.handleChangeAccountId(accountId)
        }
    }

    componentWillUnmount() {
        this.input.current.removeEventListener('input', this.updatePrefix);
    }

    updatePrefix = () => {
        const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        const width = this.getTextWidth(this.input.current.value, '16px Inter');
        const extraSpace = isSafari ? 22 : 23
        this.prefix.current.style.right = width + extraSpace + 'px';
        this.prefix.current.style.visibility = 'visible';
        if (this.input.current.value.length === 0) this.prefix.current.style.visibility = 'hidden';
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

    handleChangeAccountId = (accountId) => {
        const { handleChange, localAlert, clearLocalAlert } = this.props
        const { wrongChar } = this.state
        const pattern = /[^a-zA-Z0-9._-]/;

        accountId = accountId.trim().toLowerCase()

        if (accountId.match(pattern)) {
            if (wrongChar) {
                const el = this.input.current
                el.style.animation = 'none'
                void el.offsetHeight
                el.style.animation = null
            } else {
                this.setState({ wrongChar: true })
            }
            return;
        } else {
            this.setState({ wrongChar: false })
        }

        handleChange(accountId)

        localAlert && clearLocalAlert()

        this.timeout && clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.handleCheckAvailability(accountId)
        }, ACCOUNT_CHECK_TIMEOUT)
    }

    isImplicitAccount = (accountId) => accountId.length === 64

    handleCheckAvailability = (accountId) => {
        const { checkAvailability } = this.props

        if (!accountId) {
            return false
        }
        if (this.isImplicitAccount(accountId)) {
            return true
        }
        checkAvailability(accountId)
    }

    render() {
        const {
            disabled,
            localAlert,
            accountId
        } = this.props

        const { wrongChar } = this.state
        const success = localAlert?.success
        const problem = !localAlert?.success && localAlert?.show

        return (
            <Translate>
                {({ translate }) => (
                    <InputWrapper className={classNames([{ 'success': success }, { 'problem': problem }, { 'wrong-char': wrongChar }])}>
                        <input
                            ref={this.input}
                            value={accountId}
                            onChange={e => this.handleChangeAccountId(e.target.value)}
                            placeholder={translate('input.accountId.placeholder')}
                            required
                            autoComplete='off'
                            autoCorrect='off'
                            autoCapitalize='off'
                            spellCheck='false'
                            tabIndex='1'
                            disabled={disabled}
                        />
                        <span className='success-prefix' ref={this.prefix}>
                            <CheckCircleIcon color='#00C08B' />
                        </span>
                    </InputWrapper>
                )}
            </Translate>
        )
    }
}

export default AccountIDInput