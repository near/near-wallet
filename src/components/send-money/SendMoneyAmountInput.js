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
      amountInput: `${this.props.defaultAmount}` || '',
      amountStatus: ''
   }

   isDecimalString = (value) => {
      let REG = /^[0-9]*(|[.][0-9]{1,5})$/
      return REG.test(value)
   }

   handleChangeAmount = (e, { name, value }) => {
      let amountStatus = ''
      if (value && !this.isDecimalString(value)){
         amountStatus = 'Invalid Input'
      }
      let input = new BN(value)
      let balance = new BN(this.props.amount)
      if (balance.sub(input).negative === 1) {
         amountStatus = 'Not enough tokens.'
      }
      console.log("amount status outside",amountStatus)
      this.setState(() => ({
         [name]: value,
         amountStatus
      }))

      this.props.handleChange(e, { name, value })
      this.props.handleChange(e, { name: 'amountStatus', value: amountStatus })
   }

   componentDidMount() {
      console.log("amount input mount", this.state.amountInput, "balance", this.props.amount)
   }

   render() {
      const { amountInput, amountStatus } = this.state
      const fontSize = amountInput.length > 11 ? 32 : amountInput.length > 8 ? 38 : amountInput.length > 5 ? 50 : 72

      return (
         <CustomDiv fontSize={`${fontSize}px`}>
            <Form.Input
               type='number'
               name='amountInput'
               value={amountInput}
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
               </Segment>)}
            {amountInput ? <Balance milli={milli} amount={amountInput} /> : ""}
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
