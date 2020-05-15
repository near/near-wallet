import React from 'react'
import { Translate } from 'react-localize-redux'
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
                <Translate id='login.cliLoginSuccess.pageTitle' />
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
                <Translate id='login.cliLoginSuccess.pageText' />
            </Grid.Column>
        </Grid.Row>
    </Grid>
)

export default LoginCliLoginSuccess
