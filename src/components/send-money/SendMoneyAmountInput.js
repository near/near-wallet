import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Segment, Form } from 'semantic-ui-react'
import { BN } from 'bn.js'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import InfoPopup from '../common/InfoPopup'
import Balance, { formatNEAR } from '../common/Balance'
import { utils } from 'near-api-js'
import isDecimalString from '../../utils/isDecimalString'
import { WALLET_APP_MIN_AMOUNT } from '../../utils/wallet'

const CustomDiv = styled(`div`)`
    &&&&& {
        > .field {
            margin-bottom: 0px;
        }
        
        input {
            height: 80px !important;
            border: 0px !important;
            font-size: ${props => props.fontSize} !important;
            font-weight: 600 !important;
            color: #4a4f54 !important;
            text-align: center !important;
            padding: 0px !important;
            background-color: #fff !important;
            
            ::placeholder { font-size: 5rem }

            :focus::-webkit-input-placeholder { color: transparent; }
            :focus:-moz-placeholder { color: transparent; }
            :focus::-moz-placeholder { color: transparent; }
            :focus:-ms-input-placeholder { color: transparent; }

            -moz-appearance: textfield !important;

            ::-webkit-outer-spin-button,
            ::-webkit-inner-spin-button {
                -webkit-appearance: none !important;
                margin: 0 !important;
            }
        }
        .alert-info {
            font-weight: 500;
            margin: 0;
            padding: 8px 0;
            text-align: center;
            
            &.problem {
                color: #ff585d;
            }
            &.success {
                color: #6ad1e3;
            }
            &.segment {
                padding: 0px !important;
            }
            &.balance {
                margin: 15px;
            }
        }
    }

    @media screen and (max-width: 991px) {
        .alert-info {
            font-size: 12px;
        }
    }
`

const AvailableBalance = styled.div`
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    .list {
        padding: 0 !important;
    }
`

class SendMoneyAmountInput extends Component {
    state = {
        amountInput: this.props.defaultAmount ? formatNEAR(this.props.defaultAmount) : '',
        amountStatusId: '',
        amountDisplay: ''
    }

    isDecimalString = (value) => {
        let REG = /^[0-9]*(|[.][0-9]{0,5})$/
        return REG.test(value)
    }

    get availableBalance() {
        const { available } = this.props.balance
        return new BN(available)
    }

    handleChangeAmount = (e, { name, value }) => {
        if (!/^\d*[.]?\d*$/.test(value)) {
            return
        }

        let amountStatusId = ''
        if (value && !isDecimalString(value)) {
            amountStatusId = 'sendMoney.amountStatusId.noMoreThan'
        }
        let amountInInternalFormat = ''
        if (value !== '') {
            amountInInternalFormat = utils.format.parseNearAmount(value);
            if (this.availableBalance.sub(new BN(utils.format.parseNearAmount(WALLET_APP_MIN_AMOUNT))).lt(new BN(amountInInternalFormat))) {
                amountStatusId = 'sendMoney.amountStatusId.notEnoughTokens'
            }
        }
        this.setState({
            amountDisplay: amountInInternalFormat,
            amountInput: value,
            amountStatusId
        })
        this.props.handleChange(e, { name: 'amount', value: amountInInternalFormat })
        this.props.handleChange(e, { name: 'amountStatusId', value: amountStatusId })
    }

    render() {
        const { amountInput, amountStatusId, amountDisplay} = this.state
        const fontSize = amountInput.length > 11 ? 32 : amountInput.length > 8 ? 38 : amountInput.length > 5 ? 50 : 72

        return (
            <CustomDiv fontSize={`${fontSize}px`}>
                <Form.Input
                    name='amountInput'
                    value={amountInput}
                    onChange={this.handleChangeAmount}
                    placeholder='0'
                    step='1'
                    min='1'
                    tabIndex='2'
                    required={true}
                />
                {amountStatusId && (
                    <Segment basic textAlign='center' className='alert-info problem balance'>
                        <Translate id={amountStatusId} data={{ amount: WALLET_APP_MIN_AMOUNT }}/>
                    </Segment>)}
                {amountDisplay ? (
                    <><Translate id='sendMoney.amountStatusId.sending'/>&nbsp;<Balance symbol='near' amount={amountDisplay}/></> 
                ) : (
                    <Translate id='sendMoney.amountStatusId.howMuch'/>
                )}
                <AvailableBalance>
                    <Translate id='sendMoney.amountStatusId.available'/>&nbsp;
                    <Balance symbol='near' amount={this.availableBalance}/>
                    <InfoPopup content={<Translate id='availableBalanceInfo'/>}/>
                </AvailableBalance>
            </CustomDiv>
        )
    }
}

SendMoneyAmountInput.propTypes = {
    handleChange: PropTypes.func.isRequired,
    amountInput: PropTypes.string
}

const mapDispatchToProps = {}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
})

export default connect(mapStateToProps, mapDispatchToProps)(SendMoneyAmountInput)
