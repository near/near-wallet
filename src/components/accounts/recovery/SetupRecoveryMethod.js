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

const Container = styled.div`

`

const OptionHeader = styled.h4`

`

class SetupRecoveryMethod extends Component {
    render() {
        return (
            <Container className='ui container'>
                <h1><Translate id='setupRecovery.pageTitle'/></h1>
                <h2><Translate id='setupRecovery.subTitleOne'/></h2>
                <h2><Translate id='setupRecovery.subTitleTwo'/></h2>
                <OptionHeader>Basic Security</OptionHeader>
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