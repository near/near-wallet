import React, { Fragment } from 'react'
import { Translate } from 'react-localize-redux'
import { Input, Header } from 'semantic-ui-react'
import styled from 'styled-components'
import FormButton from '../common/FormButton'
import RequestStatusBox from '../common/RequestStatusBox'
import classNames from '../../utils/classNames'

const Container = styled.div`
    .input {
        padding-bottom: 30px;

        input {
            width: 100%;
        }
    }
`

const RecoverAccountSeedPhraseForm = ({
    formLoader,
    isLegit,
    handleChange,
    seedPhrase,
    requestStatus
}) => (
        <Container>
            <Fragment>
                <Header as='h4' className='seed-phrase-header'><Translate id='recoverSeedPhrase.seedPhraseInput.title' /></Header>
                <Translate>
                    {({ translate }) => (
                        <Input
                            name='seedPhrase'
                            value={seedPhrase}
                            onChange={handleChange}
                            className={classNames([{'success': requestStatus && requestStatus.success}, {'problem': requestStatus && requestStatus.success === false}])}
                            placeholder={translate('recoverSeedPhrase.seedPhraseInput.placeholder')}
                            required
                            tabIndex='1'
                        />
                    )}
                </Translate>
                <RequestStatusBox requestStatus={requestStatus} />
            </Fragment>

            <FormButton
                type='submit'
                color='blue'
                disabled={!isLegit}
                sending={formLoader}
            >
                <Translate id='button.findMyAccount' />
            </FormButton>
        </Container>
    )

export default RecoverAccountSeedPhraseForm
