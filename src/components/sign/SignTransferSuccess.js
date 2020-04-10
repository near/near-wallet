import React from 'react'
import { Translate } from 'react-localize-redux'

import Balance from '../common/Balance'
import FormButton from '../common/FormButton'
import MobileContainer from './MobileContainer'

import { Image, Grid } from 'semantic-ui-react'

import CheckImage from '../../images/icon-check.svg'

// TODO: Why handleDeny? It's not an error.
const SignTransferReady = ({ handleDeny, txTotalAmount, isMonetaryTransaction }) => (
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
            {/*
            <Grid.Row centered>
                <Grid.Column
                    largeScreen={12}
                    computer={14}
                    tablet={16}
                    className='cont'
                    textAlign='center'
                >
                    <div className="fees">
                        Transaction cost: .00043 Ⓝ
                    </div>
                    <div className="gas">
                        Gas Limit: 21000
                    </div>
                    <div className="gas">
                        Gas Price: .0000000021 Ⓝ
                    </div>
                </Grid.Column>
            </Grid.Row>
            */}
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
            {/*
            <Grid.Row centered className='contract'>
                <Grid.Column
                    largeScreen={12}
                    computer={14}
                    tablet={16}
                    textAlign='center'
                >
                    Contract: @contractname.near
                </Grid.Column>
            </Grid.Row>
            */}
        </Grid>
    </MobileContainer>
)

export default SignTransferReady
