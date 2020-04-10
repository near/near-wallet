import React from 'react'
import { Translate } from 'react-localize-redux'
import { Segment, Header } from 'semantic-ui-react'

import FormButton from '../common/FormButton'

import styled from 'styled-components'

const CustomSegment = styled(Segment)`
    &&& {
        max-width: 700px;
        button {
            margin-bottom: 36px;
        }

        @media screen and (max-width: 767px) {
            max-width: 100%;
            margin-top: 24px;
            text-align: center;
        }
    }
`

const AccessKeysEmpty = () => (
    <CustomSegment basic>
        <Header as='h2'>
            <Translate id='fullAccessKeys.noKeys' />
        </Header>
        <a href='https://builtwithnear.com/' target='_blank' rel="noopener noreferrer">
            <FormButton color='blue'>
                <Translate id='button.browseApps' />
            </FormButton>
        </a>
    </CustomSegment>
)

export default AccessKeysEmpty
