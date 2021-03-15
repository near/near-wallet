import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'
import { checkNearDropBalance, claimLinkdropToAccount, redirectTo } from '../../actions/account'
import { clearLocalAlert } from '../../actions/status'
import Container from '../common/styled/Container.css'
import FormButton from '../common/FormButton'
import { Mixpanel } from '../../mixpanel/index'
import Balance from '../common/Balance'

const StyledContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
        :last-of-type {
            margin-top: 0;
        }
    }

    button {
        height: auto !important;
        line-height: 120% !important;
    }
`

class LinkdropLanding extends Component {
    state = {
        balance: null,
        invalidNearDrop: null
    }

    componentDidMount() {
        if (this.props.fundingContract && this.props.fundingKey) {
            this.handleCheckNearDropBalance()
        }
    }

    handleCheckNearDropBalance = async () => {
        await Mixpanel.withTracking("CA Check near drop balance",
            async () => {
                const balance = await this.props.checkNearDropBalance(this.props.fundingContract, this.props.fundingKey)
                this.setState({ balance: balance })
            },
            () => this.setState({ invalidNearDrop: true })
        )
    }

    handleClaimNearDrop = async () => {
        await this.props.claimLinkdropToAccount(this.props.fundingContract, this.props.fundingKey)
        this.props.redirectTo('/')
    }

    render() {
        return (
            <StyledContainer className='small-centered'>
                <h1><span role='img' aria-label='hooray'>🎉</span> Hooray! <span role='img' aria-label='hooray'>🎉</span></h1>
                <h1>You've got <Balance amount={this.state.balance} symbol='near'/>!</h1>
                <FormButton onClick={this.handleClaimNearDrop} sending={this.props.mainLoader}>Claim to My Account:<br/>{this.props.accountId}</FormButton>
                <FormButton color='gray-blue'>Create a New Account</FormButton>
            </StyledContainer>
        )
    }
}

const mapDispatchToProps = {
    clearLocalAlert,
    checkNearDropBalance,
    claimLinkdropToAccount,
    redirectTo
}

const mapStateToProps = ({ account, status }, { match }) => ({
    ...account,
    fundingContract: match.params.fundingContract,
    fundingKey: match.params.fundingKey
})

export const LinkdropLandingWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkdropLanding)
