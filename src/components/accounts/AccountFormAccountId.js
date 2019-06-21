import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Form } from 'semantic-ui-react'

import { checkAccountAvailable, checkNewAccount } from '../../actions/account'

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
   &&&&& .spinner {
      margin-right: 20px;
      :before,
      :after {
         top: 28px;
         width: 24px;
         height: 24px;
      }
   }
   &.problem > .input > input,
   &.problem > .input > input:focus {
      background: url(${ProblemsImage}) right 22px center no-repeat;
      background-size: 24px 24px;
   }
   &.success > .input > input,
   &.success > .input > input:focus {
      background: url(${CheckBlueImage}) right 22px center no-repeat;
      background-size: 24px 24px;
   }
`

class AccountFormAccountId extends Component {
   state = {
      accountId: ''
   }

   handleChangeAccountId = (e, { name, value }) => {
      if (value.match(/[^a-z0-9@._-]/)) {
         return false
      }

      this.setState(() => ({
         [name]: value.trim().toLowerCase()
      }))

      this.props.handleChange(e, { name, value })

      this.timeout && clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
         this.props.type === 'create'
            ? this.props.checkNewAccount(value)
            : this.props.checkAccountAvailable(value)
      }, 500)
   }


   render () {
      const { formLoader, requestStatus } = this.props
      const { accountId } = this.state

      return (
         <CustomFormInput
            loading={formLoader}
            className={`create ${
               requestStatus ? (requestStatus.success ? 'success' : 'problem') : ''
            }`}
            name='accountId'
            value={accountId}
            onChange={this.handleChangeAccountId}
            placeholder='example: satoshi.near'
            maxLength='32'
            required
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
         />
      )
   }
}

AccountFormAccountId.propTypes = {
   formLoader: PropTypes.bool.isRequired,
   handleChange: PropTypes.func.isRequired,
   type: PropTypes.string
}

const mapDispatchToProps = {
   checkAccountAvailable,
   checkNewAccount
}

const mapStateToProps = ({ account }, { match }) => ({
   ...account,
})

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(AccountFormAccountId)
