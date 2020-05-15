import React from 'react'
import { Grid, Image } from 'semantic-ui-react'
import IconCheckImage from '../../images/icon-check.svg'

const LoginCliLoginSuccess = () => (
    <Grid padded>
        <Grid.Row centered>
            <Grid.Column
                textAlign='center'
                className='authorize'
            >
                <Image src={IconCheckImage} />
            </Grid.Column>
        </Grid.Row>
        <Grid.Row className='title'>
            <Grid.Column
                as='h2'
                className='font-benton'
                textAlign='center'
                computer={16}
                tablet={16}
                mobile={16}
            >
                You've successfully authorized NEAR Shell!
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column
                textAlign='center'
                computer={16}
                tablet={16}
                mobile={16}
                className='color-black'
            >
                Please close this window and follow the instructions in the terminal.
            </Grid.Column>
        </Grid.Row>
    </Grid>
)

export default LoginCliLoginSuccess
