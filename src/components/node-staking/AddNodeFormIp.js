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

class AddNodeFormIp extends Component {
   state = {
      ipAddress: ''
   }

   handleChangeIp = (e, { name, value }) => {
      if (value.match(/[^0-9.]/)) {
         return false
      }
      
      this.setState(() => ({
         [name]: value
      }))

      this.props.handleChange(e, { name, value })
   }

   render () {
      const { ipAddress } = this.state

      return (
         <CustomFormInput
            name='ipAddress'
            onChange={this.handleChangeIp}
            placeholder='example: 0.0.0.0'
            required
            value={ipAddress}
            autoComplete='off'
            autoCorrect='off'
            spellCheck='false'
            tabIndex='1'
         />
      )
   }
}

AddNodeFormIp.propTypes = {
   handleChange: PropTypes.func.isRequired
}

export default AddNodeFormIp
