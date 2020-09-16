import React from 'react'
import { withRouter } from 'react-router-dom'
import { Translate } from 'react-localize-redux'
import FormButton from '../common/FormButton'
import MobileContainer from './MobileContainer'

import { Image, Grid } from 'semantic-ui-react'

import ProblemsImage from '../../images/icon-problems.svg'

const SignTransferInsufficientFunds = ({ handleDeny, handleAddFunds }) => (
    <MobileContainer>
        <Grid padded>
            <Grid.Row centered>
                <Grid.Column
                    textAlign='center'
                    className='authorize'
                    
                >
                    <Image src={ProblemsImage} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className='title'>
                <Grid.Column
                    as='h2'
                    textAlign='center'
                >
                    <b><Translate id='sign.insufficientFunds' /></b>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className='sub'>
                <Grid.Column
                    textAlign='center'
                    computer={16}
                >
                    <Translate id='sign.hereAreSomeDetails' />
                </Grid.Column>
            </Grid.Row>
        </Grid>
        <Grid padded>
            <Grid.Row centered>
                <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                    <FormButton
                        color='gray-white'
                        onClick={handleDeny}
                    >
                        <Translate id='button.cancel' />
                    </FormButton>
                    <FormButton
                        type='submit'
                        color='blue'
                        onClick={handleAddFunds}
                    >
                        <Translate id='button.addFunds' />
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
                    <Translate id='sign.contract' /> contractname.near
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </MobileContainer>
)

export default withRouter(SignTransferInsufficientFunds)
