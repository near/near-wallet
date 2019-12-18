import React from 'react'
import { withRouter } from 'react-router-dom'
import { Responsive, Input } from 'semantic-ui-react'
import { Translate } from 'react-localize-redux'

import RequestStatusBox from '../common/RequestStatusBox'
import FormButton from '../common/FormButton'

import styled from 'styled-components'

const CustomDiv = styled(`div`)`
    .start-over {
        padding: 20px 0 0 0;
        color: #24272a;
        border-top: 2px solid #f8f8f8;
        margin-top: 48px;
        line-height: 24px;

        button {
            font-size: 16px !important;
            font-weight: 500;
            font-family: BwSeidoRound !important;
            margin: 0 0 0 6px !important;
        }
    }
`

const SetupSeedPhraseVerify = ({
    enterWord,
    wordId,
    handleChangeWord,
    handleStartOver,
    formLoader,
    requestStatus,
    globalAlert
}) => (
    <CustomDiv>
        <h4><Translate id='input.enterWord.title' /> #{wordId + 1}</h4>
        <Translate>
            {({ translate }) => (
                <Input
                    name='enterWord'
                    value={enterWord}
                    onChange={handleChangeWord}
                    placeholder={translate('input.enterWord.placeholder')}
                    required
                    tabIndex='1'
                    pattern='[a-zA-Z ]*'
                    className={requestStatus ? (requestStatus.success ? 'success' : 'problem') : ''}
                />
            )}
        </Translate>
        <Responsive as={RequestStatusBox} maxWidth={767} requestStatus={requestStatus} />
        <FormButton
            type='submit'
            color='blue'
            disabled={enterWord ? (globalAlert && globalAlert.success) : true}
            sending={formLoader}
        >
            <Translate id='button.verify' />
        </FormButton>

        <div className='start-over h4'>
            <Translate id='setupSeedPhraseVerify.startOverText' />
            <FormButton
                onClick={handleStartOver}
                color='link'
            >
                <Translate id='button.startOver' />
            </FormButton>
        </div>
    </CustomDiv>
)

export default withRouter(SetupSeedPhraseVerify)
