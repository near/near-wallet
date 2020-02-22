import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Responsive } from 'semantic-ui-react';
import ProfileQRCode from '../profile/ProfileQRCode';
import Divider from '../common/Divider';
import { Translate } from 'react-localize-redux';
import {Snackbar, snackbarDuration } from '../common/Snackbar';
import { webShare, copyText } from '../../utils/common';

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    max-width: 450px;
    text-align: center;
    margin: 0 auto;
    color: #25282A;
    padding: 20px 0 40px 0;

    .divider-container {
        margin: 25px 0;
    }

    .qr-code-container {
        margin-top: 25px;
        max-width: 250px;
    }

    @media (min-width: 768px) {
        padding: 30px 0 40px 0;

        .divider-container {
            margin: 35px 0;
        }

        .qr-code-container {
            margin-top: 35px;
        }

    }
`

const Title = styled.div`
    font-size: 22px;
    font-weight: 600;
    align-self: flex-start;
    font-family: BwSeidoRound !important;

    @media (min-width: 768px) {
        font-size: 36px;
        align-self: center;
    }
`

const Address = styled.div`
    border: 1px dashed #dadada;
    border-radius: 4px;
    position: relative;
    width: 100%;
    padding: 15px;
    font-size: 28px;
    word-break: break-all;
    line-height: normal;
    margin-top: 25px;
    font-weight: 600;
    position: relative;
    background-color: white;
    overflow: hidden;

    @media (min-width: 768px) {
        padding: 15px 70px;
        margin-top: 35px;
    }
`

const CopyAddress = styled(Responsive)`
    color: #0072CE;
    margin-top: 10px;
    font-size: 16px;
    cursor: pointer;
    font-weight: 400;

    @media (min-width: 768px) {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        margin: 0;
    }
`

const UrlAddress = styled.div`
    position: absolute;
    z-index: -1;
    text-transform: initial;
`

class ReceiveMoney extends Component {
    constructor(props) {
        super(props);
        this.urlRef = React.createRef();

        this.state = {
            successSnackbar: false,
        };
    }

    handleCopyAddress = () => {
        webShare({
            url: this.receiveUrl,
            noSupportCallback: this.handleCopyDesktop
        });
    }

    handleCopyDesktop = () => {
        copyText(this.urlRef.current);
        this.setState({ successSnackbar: true }, () => {
            setTimeout(() => {
                this.setState({successSnackbar: false});
            }, snackbarDuration)
        });
    }

    get receiveUrl() {
        return `${window.location.protocol}//${window.location.host}/send-money/${this.props.account.accountId}`;
    }

    render() {

        const {
            successSnackbar
        } = this.state;

        return (
            <Translate>
                {({ translate }) => (
                    <div className='ui container'>
                        <Container>
                            <Title>{translate('receivePage.addressTitle')}</Title>
                            <Address>
                                {this.props.account.accountId}
                                <UrlAddress ref={this.urlRef}>
                                    {this.receiveUrl}
                                </UrlAddress>
                                <CopyAddress
                                    minWidth={768}
                                    onClick={this.handleCopyDesktop}
                                    title={translate('receivePage.copyAddressLinkLong')}
                                >
                                    {translate('receivePage.copyAddressLinkShort')}
                                </CopyAddress>
                            </Address>
                            <CopyAddress
                                maxWidth={767}
                                onClick={this.handleCopyAddress}
                            >
                                {translate('receivePage.copyAddressLinkLong')}
                            </CopyAddress>
                            <Divider/>
                            <Title>
                                {translate('receivePage.qrCodeTitle')}
                            </Title>
                            <ProfileQRCode account={this.props.account}/>
                        </Container>
                        <Snackbar
                            theme='success'
                            message={translate('receivePage.snackbarCopySuccess')}
                            show={successSnackbar}
                            onHide={() => this.setState({ successSnackbar: false })}
                        />
                    </div>
                )}
            </Translate>
        )
    }
}

const mapStateToProps = ({ account }) => ({
   account
})

export const ReceiveMoneyWithRouter = connect(
   mapStateToProps
)(withRouter(ReceiveMoney))