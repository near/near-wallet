import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import styled from 'styled-components'
import ProfileQRCode from '../profile/ProfileQRCode'

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px 50px 40px;
    text-align: center;

    h1, h2 {
        font-size: 32px !important;

        @media (max-width: 767px) {
            font-size: 26px !important;
        }
    }

    .divider {
        margin: -25px 0 15px 0;
        position: relative;
        background-color: white;
        padding: 0 10px;

        @media (max-width: 767px) {
            margin: -10px 0 10px 0;
        }

        &:after {
            content: '';
            display: block;
            width: 150px;
            border-top: 3px solid #dadada;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, 0);
            z-index: -1;
        }
    }
`

class ReceiveMoney extends Component {
    render() {
        return (
            <Container>
                <h1>Send to: <Link to='/profile'>{this.props.account.accountId}</Link></h1>
                <h2 className='divider'>or</h2>
                <ProfileQRCode account={this.props.account} />
            </Container>
        )
    }
}

const mapStateToProps = ({ account }) => ({
   account
})

export const ReceiveMoneyWithRouter = connect(
   mapStateToProps
)(withRouter(ReceiveMoney))