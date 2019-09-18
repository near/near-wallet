import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Form, Segment } from 'semantic-ui-react'

import ProblemsImage from '../../images/icon-problems.svg'
import CheckBlueImage from '../../images/icon-check-blue.svg'

import styled from 'styled-components'

const CustomFormInput = styled(Form.Input)`
   &&&& input {
      width: 100%;
      height: 64px;
      border: 4px solid #f8f8f8;
      padding: 0 0 0 20px;
      font-size: 18px;
      color: #4a4f54;
      font-weight: 400;
      background-color: #f8f8f8;
      position: relative;
      :focus {
         border-color: #f8f8f8;
         background-color: #fff;
      }
      :valid {
         background-color: #fff;
      }
   }
   &.problem > .input > input,
   &.problem > .input > input:focus {
      background: url(${ProblemsImage}) right 22px center no-repeat;
      background-size: 24px 24px;
      border-color: #ff585d !important;
   }
   &.success > .input > input,
   &.success > .input > input:focus {
      background: url(${CheckBlueImage}) right 22px center no-repeat;
      background-size: 24px 24px;
   }
`

const CustomSegment = styled(Segment)`
   &&& {
      margin: 0px;
      padding: 12px 0 0 0;
   }
`

class StakingFormAmount extends Component {
   state = {
      amountStaking: '',
      amountPercent: 0
   }

   handleChangeAccountId = (e, { name, value }) => {
      if (value.match(/[^0-9.]/)) {
         return false
      }

      this.setState(() => ({
         [name]: value,
         amountPercent: Math.round((value / this.props.amount) * 100) / 100
      }))

      this.props.handleChange(e, { name, value })
   }

   render () {
      const { amount } = this.props
      const { amountStaking, amountPercent } = this.state

      return (
         <Fragment>
            <CustomFormInput
               className={`create ${
                  amountStaking ? (amountPercent <= 100 ? 'success' : 'problem') : ''
               }`}
               name='amountStaking'
               onChange={this.handleChangeAccountId}
               placeholder='example: 0.0.0.0'
               required
               value={amountStaking}
               autoComplete='off'
               autoCorrect='off'
               spellCheck='false'
               tabIndex='1'
            />
            <CustomSegment basic textAlign='right' className={`color-black font-bold ${amountPercent <= 100 ? `` : `color-red`}`}>
               {amountPercent}% of Total: {amount}
            </CustomSegment>
         </Fragment>
      )
   }
}

StakingFormAmount.propTypes = {
   handleChange: PropTypes.func.isRequired
}

const mapStateToProps = ({ account }) => ({
   ...account,
})

export default connect(
   mapStateToProps
)(StakingFormAmount)
