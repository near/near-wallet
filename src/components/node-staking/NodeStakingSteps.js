import React from 'react'
import { Translate } from 'react-localize-redux'

import { Grid, Image } from 'semantic-ui-react'

import NewWinImage from '../../images/icon-new-win.svg'
import { ReactComponent as RecentImage } from '../../images/icon-recent.svg'

const NodeStakingSteps = () => (
    <Grid padded>
        <Grid.Row>
            <Grid.Column as='h2' textAlign='center'>
                <Translate id='nodeStaking.steps.title' />
            </Grid.Column>
        </Grid.Row>
        <Grid.Row className='border-top'>
            <Grid.Column computer='13'>
                <span className='color-black'>
                    <b><Translate id='nodeStaking.steps.one.title' /></b>
                </span>
                <br/>
                <span className="font-small">
                    <Translate id='nodeStaking.steps.one.desc' />
                </span>
            </Grid.Column>
            <Grid.Column verticalAlign='middle' computer='3'>
                <Image src={NewWinImage} floated='right' />
            </Grid.Column>
        </Grid.Row>
        <Grid.Row className='border-top'>
            <Grid.Column computer='13'>
                <span className='color-black'>
                    <b><Translate id='nodeStaking.steps.two.title' /></b>
                </span>
                <br/>
                <span className="font-small">
                    <Translate id='nodeStaking.steps.two.desc' />
                </span>
            </Grid.Column>
            <Grid.Column verticalAlign='middle' computer='3'>
                <Image as={RecentImage} className='recent' floated='right' />
            </Grid.Column>
        </Grid.Row>
        <Grid.Row className='border-top border-bottom'>
            <Grid.Column computer='13'>
                <span className='color-black'>
                    <b><Translate id='nodeStaking.steps.three.title' /></b>
                </span>
                <br/>
                <span className="font-small">
                    <Translate id='nodeStaking.steps.three.desc' />
                </span>
            </Grid.Column>
            <Grid.Column verticalAlign='middle' computer='3'>
                <Image src={NewWinImage} floated='right' />
            </Grid.Column>
        </Grid.Row>
    </Grid>
)

export default NodeStakingSteps
