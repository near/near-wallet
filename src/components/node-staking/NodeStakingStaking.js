import React from 'react'
import { Translate } from 'react-localize-redux'
import { Link } from 'react-router-dom'

import { Grid, Image } from 'semantic-ui-react'

import { ReactComponent as StakingImage } from '../../images/icon-staking.svg'
import ArrowRight from '../../images/icon-arrow-right.svg'

const NodeStakingStaking = ({ staking }) => (
    <Grid padded className='box'>
        <Grid.Row className=''>
            <Grid.Column computer='14' style={{display: 'inline'}}>
                <div className='svg'>
                    <StakingImage />
                </div>
                <h2><Translate id='nodeStaking.staking.title' /></h2>
            </Grid.Column>
        </Grid.Row>
        {staking.length ? staking.map((node, i) => (
            <Grid.Row key={`nodes-${i}`} as={Link} to='/staking' className='border-top node'>
                <Grid.Column computer='12'>
                    <span className='color-black'>
                        <b><Translate id='nodeStaking.staking.youAreStaking' /> Ⓝ 201,045.00</b>
                    </span>
                    <br/>
                    <span className='font-small'>
                        99% <Translate id='of' /> 202,250.0025 <Translate id='total' />
                    </span>
                </Grid.Column>
                <Grid.Column verticalAlign='middle' computer='4'>
                    <Image src={ArrowRight} floated='right' className='arrow' />
                </Grid.Column>
            </Grid.Row>
        )) : (
            <Grid.Row className='border-top'>
                <Grid.Column computer='16'>
                    Please setup your node before staking
                </Grid.Column>
            </Grid.Row>
        )}
    </Grid>
)

export default NodeStakingStaking
