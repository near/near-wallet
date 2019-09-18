import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'semantic-ui-react'

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
`

class AddNodeFormNick extends Component {
   state = {
      nickname: '',
   }

   handleChangeNick = (e, { name, value }) => {
      this.setState(() => ({
         [name]: value
      }))

      this.props.handleChange(e, { name, value })
   }

   render () {
      const { nickname } = this.state

      return (
         <CustomFormInput
            name='nickname'
            onChange={this.handleChangeNick}
            placeholder='example: AWS Instance'
            required
            value={nickname}
            autoComplete='off'
            autoCorrect='off'
            spellCheck='false'
            tabIndex='2'
         />
      )
   }
}

AddNodeFormNick.propTypes = {
   handleChange: PropTypes.func.isRequired
}

export default AddNodeFormNick
