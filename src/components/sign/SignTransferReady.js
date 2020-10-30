import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'
import InfoPopup from '../common/InfoPopup'
import { refreshAccount, switchAccount } from '../../actions/account'
import SignAnimatedArrow from './SignAnimatedArrow'
import SignTransferDetails from './SignTransferDetails'
import SelectAccountDropdown from '../login/SelectAccountDropdown'
import Balance from '../common/Balance'
import Button from '../common/Button'
import InlineNotification from '../common/InlineNotification'
import FormButton from '../common/FormButton'


const Container = styled.div`
    max-width: 450px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #25282A;
`

const Title = styled.div`
    font-size: 26px;
    font-weight: 600;
    margin-top: 30px;
    text-align: center;
`

const Desc = styled.div`
    font-size: 26px;
    margin-top: 25px;
`

const TransferAmount = styled.div`
    margin-top: 25px;
    text-align: center;

    div {
        font-size: 26px !important;
        font-weight: 600;
    }
`

const CurrentBalance = styled.div`
    margin-top: 5px;
    text-align: center;
    color: #888888;
    font-size: 14px;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;

    .list {
        margin: 0 !important;
    }
`

const MoreInfo = styled.div`
    background-color: #f5f5f5;
    color: #888888;
    border-radius: 40px;
    cursor: pointer;
    padding: 10px 50px;
    margin-top: 30px;
    height: 39px;
    position: relative;
`

const ActionsCounter = styled.div`
    height: 30px;
    width: 30px;
    background-color: orange;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 6px;
    font-size: 12px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Footer = styled.div`
    width: 100%;
    margin-top: 40px;

    @media (max-width: 767px) {
        position: fixed;
        bottom: 0;
        padding: 20px;
        background-color: white;
        border-top: 1px solid #f5f5f5;
    }
`

const ButtonWrapper = styled.div`
    display: flex;
    width: 100%;
    margin-top: 20px;

    @media (min-width: 768px) {
        margin-top: 20px;
    }

    button {
        flex: 1;

        &:last-of-type {
            margin-left: 30px !important;

            @media (min-width: 768px) {
                margin-left: 50px !important;
            }
        }
    }
`

class SignTransferReady extends Component {
    state = {
        dropdown: false,
        showMoreInfo: false
    }

    componentDidMount() {
        // NOTE: We need to make sure to use signer ID from transactions as account to sign
        // TODO: Do this for signing process without changing current account in wallet globally
        const { signerId } = this.props.transactions[0]
        if (signerId !== this.props.account.accountId) {
            this.handleSelectAccount(signerId)
        }
    }

    handleToggleDropdown = () => {
        this.setState(prevState => ({
            dropdown: !prevState.dropdown
        }));
    }

    handleToggleInfo = () => {
        this.setState(prevState => ({
            showMoreInfo: !prevState.showMoreInfo
        }));
    }

    handleSelectAccount = accountId => {
        this.props.switchAccount(accountId)
        this.props.refreshAccount()
    }

    redirectCreateAccount = () => {
        this.props.history.push('/create')
    }

    handleGoBack = () => {
        // TODO: Send user back w/ error message?
    }

    renderMainView = () => {
        const {
            appTitle,
            actionsCounter,
            account,
            sending,
            handleAllow,
            handleDeny,
            txTotalAmount,
            isMonetaryTransaction,
            insufficientFunds,
            availableAccounts,
            availableBalance
        } = this.props;

        return (
            <Container>
                <SignAnimatedArrow/>
                <Title>{appTitle || <Translate id='sign.unknownApp' />}</Title>
                <Desc><Translate id={`sign.isRequesting.${isMonetaryTransaction ? 'transferOf' : 'authorization'}`} /></Desc>
                {isMonetaryTransaction &&
                    <>
                        <TransferAmount>
                            <Balance amount={txTotalAmount}/>
                        </TransferAmount>
                        <CurrentBalance>
                            <Translate id='sign.availableBalance' />:&nbsp;
                            {availableBalance && <Balance amount={availableBalance}/>}
                            <InfoPopup content={<Translate id='availableBalanceInfo'/>}/>
                        </CurrentBalance>
                        <InlineNotification
                            show={insufficientFunds}
                            onClick={handleDeny}
                            messageId='sign.insufficientFunds'
                            theme='error'
                            buttonMsgId='button.goBack'
                        />
                    </>
                }
                <MoreInfo onClick={this.handleToggleInfo}>
                    <Translate id='button.moreInformation' />
                    {actionsCounter &&
                        <ActionsCounter>
                            {actionsCounter > 9 ? '9+' : actionsCounter}
                        </ActionsCounter>
                    }
                </MoreInfo>
                <Footer>
                    <SelectAccountDropdown
                        handleOnClick={this.handleToggleDropdown}
                        account={account}
                        availableAccounts={availableAccounts}
                        dropdown={this.state.dropdown}
                        handleSelectAccount={this.handleSelectAccount}
                        redirectCreateAccount={this.redirectCreateAccount}
                        disabled={true}
                    />
                    <ButtonWrapper>
                        <Button 
                            theme='secondary' 
                            onClick={handleDeny}
                        >
                            <Translate id='button.deny' />
                        </Button>
                        <FormButton
                            onClick={handleAllow}
                            disabled={isMonetaryTransaction && insufficientFunds}
                            sending={sending}
                        >
                            <Translate id='button.allow' />
                        </FormButton>
                    </ButtonWrapper>
                </Footer>
            </Container>
        )

    }

    render() {
        if (this.state.showMoreInfo)
            return <SignTransferDetails handleDetails={this.handleToggleInfo}/>;
        else
            return this.renderMainView();
    }
}

const mapDispatchToProps = {
    refreshAccount,
    switchAccount,
}

const mapStateToProps = ({ account, sign, availableAccounts }) => ({
    account,
    availableAccounts,
    ...sign
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignTransferReady))
