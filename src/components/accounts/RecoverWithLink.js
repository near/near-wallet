import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Button from '../common/Button'
import { 
    recoverAccountSeedPhrase,
    handleRefreshAccount 
} from '../../actions/account'
import { Snackbar, snackbarDuration } from '../common/Snackbar'
import { Translate } from 'react-localize-redux'

const Container = styled.div`
    &.error {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 50px;
        text-align: center;

        div {
            @media (min-width: 768px) {
                max-width: 800px;
            }
        }

        button {
            margin-top: 35px;
            @media (min-width: 768px) {
                max-width: 300px;
            }
        }
    }
`

const Title = styled.h1`
    margin-bottom: 10px;
    
    @media (min-width: 768px) {
        margin-bottom: 0;
    }
`

const Desc = styled.div`
    color: #4a4f54;
    font-size: 18px;
    line-height: 150%;
    font-family: BwSeidoRound;
    margin-top: ${props => props.last ? "20px" : "0"};

    @media (min-width: 768px) {
        font-size: 28px;
    }
`

const UserName = styled.span`
    color: #24272a;
    background-color: #f8f8f8;
    padding: 5px;
`

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    @media (min-width: 768px) {
        flex-direction: row;
    }

    button {

        @media (min-width: 768px) {
            max-width: 300px;
        }

        &:last-of-type {
            margin-top: 25px;
            position: relative;
            overflow: hidden;

            @media (min-width: 768px) {
                margin-left: 25px;
                margin-top: 0;
            }

            color: #6AD1E3;
            border: 2px solid #6AD1E3;
            background-color: white;

            &:hover {
                color: white;
                background-color: #6AD1E3;
            }
        }
    }
`

const RecoverUrl = styled.div`
    position: absolute;
    z-index: -1;
    text-transform: initial;
`

class RecoverWithLink extends Component {
    constructor(props) {
        super(props);

        this.recoverUrl = React.createRef();

        this.state = {
            accountId: this.props.accountId,
            seedPhrase: this.props.seedPhrase,
            successSnackbar: false,
            successView: true
        };
    }

    componentWillMount = () => {
        if (!this.isLegit) {
            this.setState({ successView: false });
        }
    }

    validators = {
        seedPhrase: value => true // TODO: Create helper to validate seed phrase
    }

    get isLegit() {
        return Object.keys(this.validators).every(field => this.validators[field](this.state[field]));
    }

    handleCopyUrl = () => {
        const selection = window.getSelection();
        selection.selectAllChildren(this.recoverUrl.current);
        document.execCommand('copy');
        this.setState({ successSnackbar: true }, () => {
            setTimeout(() => {
                this.setState({ successSnackbar: false });
            }, snackbarDuration)
        });
    }

    handleContinue = () => {
        this.props.recoverAccountSeedPhrase(this.state.seedPhrase, this.state.accountId)
            .then(({ error }) => {
                if (error) return;
                this.props.handleRefreshAccount();
            }).then(() => {
                this.props.history.push('/profile');
            })
    }

    render() {

        if (this.state.successView) {
            return (
                <Translate>
                    {({ translate }) => (
                        <Container className='ui container'>
                            <Title>{translate('recoverWithLink.title')}</Title>
                            <Desc>{translate('recoverWithLink.pOne')} <UserName>@{this.state.accountId}</UserName></Desc>
                            <Desc last>{translate('recoverWithLink.pTwo')}</Desc>
                            <ButtonWrapper>
                                <Button onClick={this.handleContinue}>
                                    {translate('button.continue')}
                                </Button>
                                <Button onClick={this.handleCopyUrl}>
                                    {translate('button.copyUrl')}
                                    <RecoverUrl ref={this.recoverUrl}>{window.location.href}</RecoverUrl>
                                </Button>
                            </ButtonWrapper>
                            <Snackbar
                                theme='success'
                                message={translate('recoverWithLink.snackbarCopySuccess')}
                                show={this.state.successSnackbar}
                                onHide={() => this.setState({ successSnackbar: false })}
                            />
                        </Container>
                    )}
                </Translate>
            )
        } else {
            return (
                <Translate>
                    {({ translate }) => (
                        <Container className='ui container error'>
                            <Title>{translate('recoverWithLink.errorTitle')}</Title>
                            <Desc>{translate('recoverWithLink.errorP')}</Desc>
                            <Button onClick={() => this.props.history.push('/create')}>
                                {translate('button.createAccount')}
                            </Button>
                        </Container>
                    )}
                </Translate>
            )
        }
    }
}

const mapDispatchToProps = {
    recoverAccountSeedPhrase, 
    handleRefreshAccount
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    accountId: match.params.accountId || '',
    seedPhrase: match.params.seedPhrase || '',
})

export const RecoverWithLinkWithRouter = connect(
    mapStateToProps, 
    mapDispatchToProps
)(withRouter(RecoverWithLink))
