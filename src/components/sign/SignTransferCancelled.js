import React from 'react'
import { Translate } from 'react-localize-redux'
import FormButton from '../common/FormButton'
import MobileContainer from './MobileContainer'

import { Image, Grid } from 'semantic-ui-react'

import DenyImage from '../../images/icon-deny.svg'

const SignTransferCancelled = ({ handleDeny }) => (
    <MobileContainer>
        <Grid padded>
            <Grid.Row centered>
                <Grid.Column
                    textAlign='center'
                    className='authorize'
                >
                    <Image src={DenyImage} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className='title'>
                <Grid.Column
                    textAlign='center'
                >
                    <h2><b><Translate id='sign.transactionCancelled' /></b></h2>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className='sub'>
                <Grid.Column
                    textAlign='center'
                    computer={16}
                >
                    <Translate id='sign.nothingHasBeenTransferred' />
                </Grid.Column>
            </Grid.Row>
        </Grid>
        <Grid padded>
            <Grid.Row>
                <Grid.Column
                    className='close'
                    textAlign='center'
                >
                    <FormButton
                        color='gray-white'
                        onClick={handleDeny}
                    >
                        <Translate id='button.close' />
                    </FormButton>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row centered className='contract'>
                <Grid.Column
                    largeScreen={12}
                    computer={14}
                    tablet={16}
                    textAlign='center'
                >
                    {/*Contract: contractname.near*/}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </MobileContainer>
)

export default SignTransferCancelled
