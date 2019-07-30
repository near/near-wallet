import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Segment, Form } from 'semantic-ui-react'

import styled from 'styled-components'

import Balance from '../common/Balance'
import milli from '../../images/n-1000.svg'

const CustomDiv = styled(`div`)`
   &&&&& {
      > .field {
         margin-bottom: 0px;
      }
      
      input {
         height: 80px;
         border: 0px;
         font-family: Bw Seido Round;
         font-size: ${props => props.fontSize};
         font-weight: 500;
         line-height: 80px;
         color: #4a4f54;
         text-align: center;
         padding: 0px;
         
         ::placeholder { font-size: 5rem }

         :focus::-webkit-input-placeholder { color: transparent; }
         :focus:-moz-placeholder { color: transparent; }
         :focus::-moz-placeholder { color: transparent; }
         :focus:-ms-input-placeholder { color: transparent; }

         -moz-appearance: textfield;

         ::-webkit-outer-spin-button,
         ::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
         }
      }
      .alert-info {
         font-weight: 600;
         margin: 0 0 0 0;
         padding: 8px 0;
         line-height: 34px;
         font-size: 14px;
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
      }
   }
`

const BN = require('bn.js')
class SendMoneyAmountInput extends Component {
   state = {
      amount: `${this.props.defaultAmount}` || '',
      amountStatus: ''
   }

   isDecimalString = (value) => {
      let REG = /^[0-9]*(|[.][0-9]{1,5})$/
      return REG.test(value)
   }

   handleChangeAmount = (e, { name, value }) => {
      const amountStatus = value && !this.isDecimalString(value)
            ? 'Invalid Input'
            :  BN(value)  > BN(this.state.amount)
            ? 'Not enough tokens.' 
            : ''

      this.setState(() => ({
         [name]: value,
         amountStatus
      }))

      this.props.handleChange(e, { name, value })
      this.props.handleChange(e, { name: 'amountStatus', value: amountStatus })
   }

   render () {
      const { amount, amountStatus } = this.state
      const fontSize = amount.length > 11 ? 32 : amount.length > 8 ? 38 : amount.length > 5 ? 50 : 72

      return (
         <CustomDiv fontSize={`${fontSize}px`}>
            <Form.Input
               type='number'
               name='amount'
               value={amount}
               onChange={this.handleChangeAmount}
               placeholder='0'
               step='1'
               min='1'
               tabIndex='2'
               required={true}
            />
            {amountStatus && (
               <Segment basic textAlign='center' className='alert-info problem'>
                  {amountStatus}
               </Segment>
            )}
            {amount ? <Balance milli={milli} amount={this.state.amount} /> : '0'}
         </CustomDiv>
      )
   }
}

SendMoneyAmountInput.propTypes = {
   handleChange: PropTypes.func.isRequired,
   amount: PropTypes.string
}

const mapDispatchToProps = {}

const mapStateToProps = ({ account }, { match }) => ({
   ...account,
})

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(SendMoneyAmountInput)
