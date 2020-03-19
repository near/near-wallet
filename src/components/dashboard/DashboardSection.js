import React from 'react'

import DashboardNotice from './DashboardNotice'

import { Grid } from 'semantic-ui-react'

const DashboardSection = ({ children, notice, handleNotice }) => (
    <Grid columns={2} stackable>
        <Grid.Column computer={10}>
            {notice && <DashboardNotice handleNotice={handleNotice} />}
            {children[0]}
        </Grid.Column>
        <Grid.Column computer={6} className='right-section'>
            {children[1]}
            {children[2]}
        </Grid.Column>
    </Grid>
)

export default DashboardSection
