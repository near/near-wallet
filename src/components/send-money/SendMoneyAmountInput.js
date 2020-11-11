import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'
import styled from 'styled-components'
import InfoPopup from '../common/InfoPopup'
import Balance from '../common/Balance'
import classNames from '../../utils/classNames'

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
            color: #24272a !important;
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

        .insufficient {
            input {
                color: #ff585d !important
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
    render() {
        const { value, handleChange, balance, amountStatus } = this.props
        const fontSize = value.length > 11 ? 32 : value.length > 8 ? 38 : value.length > 5 ? 50 : 62
        return (
            <CustomDiv fontSize={`${fontSize}px`}>
                <Form.Input
                    name='amountInput'
                    value={value}
                    onChange={handleChange}
                    placeholder='0'
                    step='1'
                    min='1'
                    tabIndex='2'
                    required={true}
                    className={classNames([amountStatus])}
                />
                <AvailableBalance>
                    <Translate id='sendMoney.amountStatusId.available'/>&nbsp;
                    <Balance symbol='near' amount={balance.available || '0'}/>
                    <InfoPopup content={<Translate id='availableBalanceInfo'/>}/>
                </AvailableBalance>
            </CustomDiv>
        )
    }
}

const mapDispatchToProps = {}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
})

export default connect(mapStateToProps, mapDispatchToProps)(SendMoneyAmountInput)
