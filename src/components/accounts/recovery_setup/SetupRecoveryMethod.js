import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import { generateSeedPhrase } from 'near-seed-phrase';
import {
    requestCode,
    setupRecoveryMessage,
    redirectToApp,
    clear,
    clearCode
} from '../../../actions/account';
import RecoveryOption from './RecoveryOption';
import Button from '../../common/Button';
import Input from '../../common/Input';

const Container = styled.div`
    
    button {
        @media (min-width: 768px) {
            width: auto;
            padding: 0 40px;
        }
    }

`

const OptionHeader = styled.h4`

`

const OptionSubHeader = styled.div`

`

class SetupRecoveryMethod extends Component {

    state = {
        option: 'email'
    }

    render() {

        const { option } = this.state;

        return (
            <Container className='ui container'>

                <h1><Translate id='setupRecovery.pageTitle'/></h1>
                <h2><Translate id='setupRecovery.subTitleOne'/></h2>
                <h2><Translate id='setupRecovery.subTitleTwo'/></h2>

                <OptionHeader><Translate id='setupRecovery.basicSecurity'/></OptionHeader>
                <OptionSubHeader><Translate id='setupRecovery.basicSecurityDesc'/></OptionSubHeader>
                <RecoveryOption
                    onClick={() => this.setState({ option: 'email' })}
                    option='email'
                    active={option === 'email'}
                    title={<Translate id='setupRecovery.emailTitle'/>}
                    desc={<Translate id='setupRecovery.emailDesc'/>}
                >
                    <Input placeHolder='example@email.com'/>
                </RecoveryOption>
                <RecoveryOption
                    onClick={() => this.setState({ option: 'phone' })}
                    option='phone'
                    active={option === 'phone'}
                    title={<Translate id='setupRecovery.phoneTitle'/>}
                    desc={<Translate id='setupRecovery.phoneDesc'/>}
                >
                    hello there children
                </RecoveryOption>
                
                <OptionHeader><Translate id='setupRecovery.advancedSecurity'/></OptionHeader>
                <OptionSubHeader><Translate id='setupRecovery.advancedSecurityDesc'/></OptionSubHeader>
                <RecoveryOption
                    onClick={() => this.setState({ option: 'phrase' })}
                    option='phrase'
                    active={option === 'phrase'}
                    title={<Translate id='setupRecovery.phraseTitle'/>}
                    desc={<Translate id='setupRecovery.phraseDesc'/>}
                />

                <Button>
                    {option !== 'phrase' ? 'Protect Account' : 'Setup Recovery Phrase'}
                </Button>

            </Container>
        )
    }
}

const mapDispatchToProps = {
    requestCode,
    setupRecoveryMessage,
    redirectToApp,
    clear,
    clearCode
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    accountId: match.params.accountId
})

export const SetupRecoveryMethodWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupRecoveryMethod);