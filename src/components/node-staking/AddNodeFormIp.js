import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomFormInput = styled(Form.Input)`
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
            className='create'
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
