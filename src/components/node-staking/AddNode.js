import React, { Component } from 'react'
import { Translate } from 'react-localize-redux'

import { withRouter } from 'react-router-dom'

import AccountFormContainer from '../accounts/AccountFormContainer'
import AccountFormSection from '../accounts/AccountFormSection'
import AddNodeForm from './AddNodeForm'

class AddNode extends Component {
    state = {
        loader: false,
        ipAddress: '',
        nickname: ''
    }

    handleChange = (e, { name, value }) => {
        this.setState(() => ({
            [name]: value
        }))
    }

    handleSubmit = e => {
        e.preventDefault()

        if (!this.isLegitForm()) {
            return false
        }

        this.setState(() => ({
            loader: true
        }))

        setTimeout(() => {
            this.setState(() => ({
                loader: false
            }))
        }, 1500);

    }

    isLegitForm = () => {
        return this.state.ipAddress.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
    }

    render() {
        const { loader } = this.state

        return (
            <AccountFormContainer 
                location={this.props.location}
                title={<Translate id='addNode.pageTitle' />}
                text={<Translate id='addNode.pageText' />}
                disclaimer={false}
            >
                <AccountFormSection 
                    handleSubmit={this.handleSubmit}
                >
                    <AddNodeForm
                        loader={loader} 
                        handleChange={this.handleChange}
                        isLegitForm={this.isLegitForm}
                    />
                </AccountFormSection>
            </AccountFormContainer>
        )
    }
}

export const AddNodeWithRouter = withRouter(AddNode)
