import React from 'react'

import { Grid } from 'semantic-ui-react'

const ProfileSection = ({ children }) => (
   <Grid columns={2} stackable>
      <Grid.Column computer={10}>{children[0]}</Grid.Column>
      <Grid.Column computer={6}>
         {children.slice(1)}
      </Grid.Column>
   </Grid>
)

export default ProfileSection
