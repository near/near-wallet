import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'

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
            <Translate>
                {({ translate }) => (
                    <CustomFormInput
                        className='create'
                        name='ipAddress'
                        onChange={this.handleChangeIp}
                        placeholder={translate('addNode.ipAddressInput.placeholder')}
                        required
                        value={ipAddress}
                        autoComplete='off'
                        autoCorrect='off'
                        spellCheck='false'
                        tabIndex='1'
                    />
                )}
            </Translate>
        )
    }
}

AddNodeFormIp.propTypes = {
    handleChange: PropTypes.func.isRequired
}

export default AddNodeFormIp
