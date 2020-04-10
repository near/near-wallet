import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Header } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'
import FormButton from '../common/FormButton'
import AddNodeFormIp from './AddNodeFormIp'
import AddNodeFormNick from './AddNodeFormNick'

const AddNodeForm = ({
    loader,
    handleChange,
    isLegitForm
}) => (
    <Fragment>
        <Header as='h4'><Translate id='addNode.ipAddressInput.title' /></Header>
        <AddNodeFormIp
            handleChange={handleChange}
        />

        <Header as='h4'><Translate id='addNode.nicknameInput.title' /></Header>
        <AddNodeFormNick
            handleChange={handleChange}
        />
        
        
        <FormButton
            type='submit'
            color='blue'
            disabled={!isLegitForm()}
            sending={loader}
        >
            <Translate id='button.addNode' />
        </FormButton>
        <div className='recover font-small'>
            <Translate id='addNode.desc' />
        </div>
    </Fragment>
)

AddNodeForm.propTypes = {
    loader: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    isLegitForm: PropTypes.func.isRequired
}

export default AddNodeForm
