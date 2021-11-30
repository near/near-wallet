import React from 'react';
import { Translate } from 'react-localize-redux';
import { Image, Grid } from 'semantic-ui-react';

import CheckImage from '../../images/icon-check.svg';
import Balance from '../common/balance/Balance';
import FormButton from '../common/FormButton';
import MobileContainer from './MobileContainer';

// TODO: Why handleDeny? It's not an error.
const SignTransferReady = ({ handleClose, txTotalAmount, isMonetaryTransaction }) => (
    <MobileContainer>
        <Grid padded>
            <Grid.Row centered>
                <Grid.Column
                    textAlign='center'
                    className='authorize'
                    
                >
                    <Image src={CheckImage} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className='title'>
                <Grid.Column as='h2' textAlign='center'>
                    {isMonetaryTransaction ? (
                        <b><Balance amount={txTotalAmount} /> <Translate id='sign.wasTransferredSuccessfully' /></b>
                    ) : (
                        <b><Translate id='sign.authorizationRequestSuccessful' /></b>
                    )}
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
                        onClick={handleClose}
                    >
                        <Translate id='button.close' />
                    </FormButton>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </MobileContainer>
);

export default SignTransferReady;
