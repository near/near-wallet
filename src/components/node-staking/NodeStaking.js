import React, { Component } from 'react'

import { withRouter } from 'react-router-dom'

import NodeStakingContainer from './NodeStakingContainer'
import PageContainer from '../common/PageContainer'
import NodeStakingSteps from './NodeStakingSteps'
import NodeStakingNodes from './NodeStakingNodes'
import NodeStakingStaking from './NodeStakingStaking'

class NodeStaking extends Component {
   state = {
      nodes: [{online: true}, {online: false}],
      // nodes: [],

      staking: [{}, {}],
      // staking: []
   }

   render() {
      const { nodes, staking } = this.state

      return (
         <NodeStakingContainer>
            <PageContainer
               title='Node & Staking'
               additional={<h1>@nodeandstaking.near</h1>}
            />
            {!nodes.length && <NodeStakingSteps />}
            <NodeStakingNodes
               nodes={nodes}
            />
            <NodeStakingStaking
               staking={staking}
            />
         </NodeStakingContainer>
      )
   }
}

export const NodeStakingWithRouter = withRouter(NodeStaking)
