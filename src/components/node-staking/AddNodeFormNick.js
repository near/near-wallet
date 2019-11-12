import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomFormInput = styled(Form.Input)``

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
            className='create'
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
