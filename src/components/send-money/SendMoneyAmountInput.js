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
const MILLI_NEAR = 10 ** 15
const Big = require('big.js')
class SendMoneyAmountInput extends Component {
   state = {
      amountInput: `${this.props.defaultAmount}` || '',
      amountStatus: '',
      amountDisplay: ''
   }

   isDecimalString = (value) => {
      let REG = /^[0-9]*(|[.][0-9]{1,5})$/
      return REG.test(value)
   }

   handleChangeAmount = (e, { name, value }) => {
      let amountStatus = ''
      if (value && !this.isDecimalString(value)) {
         amountStatus = 'NO MORE THAN 5 DECIMAL DIGITS'
      }
      let realValue = ''
      if (value !== '') {
         let input = new Big(value)
         input = input.times(MILLI_NEAR)
         realValue = input.toString()
         let balance = new Big(this.props.amount)
         if (balance.sub(input).s < 0) {
            amountStatus = 'Not enough tokens.'
         }
      }
      console.log("real value, ", realValue)
      this.setState({
         amountDisplay: realValue,
         amountInput: value,
         amountStatus
      })
      this.props.handleChange(e, { name: 'amount', value: realValue })
      this.props.handleChange(e, { name: 'amountStatus', value: amountStatus })
      console.log("[sendmoneyamountinput.js] amountDisplay ", this.state.amountDisplay)
   }

   render() {
      const { amountInput, amountStatus, amountDisplay} = this.state
      const fontSize = amountInput.length > 11 ? 32 : amountInput.length > 8 ? 38 : amountInput.length > 5 ? 50 : 72

      return (
         <CustomDiv fontSize={`${fontSize}px`}>
            <Form.Input
               type="number"
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
            {amountDisplay ? <Balance milli={milli} amount={amountDisplay} /> : "How much would you want to send?"}
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
