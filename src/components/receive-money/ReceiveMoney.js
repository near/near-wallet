import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import ProfileQRCode from '../profile/ProfileQRCode';
import Divider from '../common/Divider';
import { Translate } from 'react-localize-redux';
import {Snackbar, snackbarDuration } from '../common/Snackbar';
import copyText from '../../utils/copyText'
import isMobile from '../../utils/isMobile'
import iconShare from '../../images/icon-share-blue.svg'

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
    font-size: 28px;
    font-weight: 500;
    font-family: BwSeidoRound !important;

    @media (min-width: 768px) {
        font-size: 36px;
        align-self: center;
    }
`

const Address = styled.div`
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    position: relative;
    width: 100%;
    font-size: 22px;
    word-break: break-all;
    line-height: 120%;
    margin-top: 25px;
    font-weight: 500;
    position: relative;
    background-color: white;
    overflow: hidden;
    padding: 15px 75px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 768px) {
        margin-top: 35px;
        font-size: 28px;
    }
`

const CopyAddress = styled.div`
    color: #0072CE;
    font-size: 16px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0;
    cursor: pointer;
    font-weight: 600;
    background-color: #f8f8f8;
    border-radius: 4px;
    padding: 6px 10px;
    line-height: normal;
`

const UrlAddress = styled.div`
    position: absolute;
    z-index: -1;
    text-transform: initial;
`

const MobileShare = styled.div`
    background: url(${iconShare}) center no-repeat;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0;
    background-color: #f8f8f8;
    height: 40px;
    width: 40px;
    border-radius: 4px;
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
        if (navigator.share && isMobile()) {
            navigator.share({
                url: this.receiveUrl
            }).catch(err => {
                console.log(err.message);
            });
        } else {
            this.handleCopyDesktop();
        }
    }

    handleCopyDesktop = () => {
        copyText(this.urlRef.current);
        this.setState({ successSnackbar: true }, () => {
            setTimeout(() => {
                this.setState({ successSnackbar: false });
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
                            <Address onClick={this.handleCopyAddress}>
                                @{this.props.account.accountId}
                                <UrlAddress ref={this.urlRef}>
                                    {this.receiveUrl}
                                </UrlAddress>
                                {navigator.share && isMobile() ? (
                                    <MobileShare/>
                                ) : (
                                    <CopyAddress title={translate('receivePage.copyAddressLinkLong')}>
                                        {translate('receivePage.copyAddressLinkShort')}
                                    </CopyAddress>
                                )}
                            </Address>
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