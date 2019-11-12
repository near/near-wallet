import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Form, Responsive } from 'semantic-ui-react'

import RequestStatusBox from '../common/RequestStatusBox'
import { checkAccountAvailable, checkNewAccount } from '../../actions/account'


import styled from 'styled-components'

const CustomFormInput = styled(Form.Input)`
   
`

class AccountFormAccountId extends Component {
   state = {
      accountId: this.props.defaultAccountId || ''
   }

   handleChangeAccountId = (e, { name, value }) => {
      if (value.match(/[^a-zA-Z0-9@._-]/)) {
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
         <Fragment>
            <CustomFormInput
               loading={formLoader}
               className={`create ${
                  requestStatus ? (requestStatus.success ? 'success' : 'problem') : ''
               }`}
               name='accountId'
               value={accountId}
               onChange={this.handleChangeAccountId}
               placeholder='example: satoshi.test'
               maxLength='32'
               required
               autoComplete='off'
               autoCorrect='off'
               autoCapitalize='off'
               spellCheck='false'
               tabIndex='1'
            />
            <Responsive as={RequestStatusBox} maxWidth={767} requestStatus={requestStatus} />
         </Fragment>
      )
   }
}

AccountFormAccountId.propTypes = {
   formLoader: PropTypes.bool.isRequired,
   handleChange: PropTypes.func.isRequired,
   type: PropTypes.string,
   defaultAccountId: PropTypes.string
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
