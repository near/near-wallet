import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Translate } from 'react-localize-redux'

import AccountFormContainer from '../accounts/AccountFormContainer'
import AccountFormSection from '../accounts/AccountFormSection'
import NodeDetailsForm from './NodeDetailsForm'

class NodeDetails extends Component {
    state = {
        loader: false,
        loaderRemoveNode: false,
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

    handleRemoveNode = e => {
        e.preventDefault()

        this.setState(() => ({
            loaderRemoveNode: true
        }))

        setTimeout(() => {
            this.setState(() => ({
                loaderRemoveNode: false
            }))
        }, 1500);
    }

    isLegitForm = () => {
        return this.state.ipAddress.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
    }

    render() {
        const { loader, loaderRemoveNode } = this.state

        return (
            <AccountFormContainer 
                title={<Translate id='nodeDetails.pageTitle' />}
                text={<Translate id='nodeDetails.pageText' />}
                disclaimer={false}
            >
                <AccountFormSection 
                    handleSubmit={this.handleSubmit}
                >
                    <NodeDetailsForm
                        loader={loader}
                        loaderRemoveNode={loaderRemoveNode}
                        handleChange={this.handleChange}
                        isLegitForm={this.isLegitForm}
                        handleRemoveNode={this.handleRemoveNode}
                    />
                </AccountFormSection>
            </AccountFormContainer>
        )
    }
}

export const NodeDetailsWithRouter = withRouter(NodeDetails)
