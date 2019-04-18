import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { Wallet } from '../../utils/wallet'

import { handleRefreshAccount, handleRefreshUrl } from '../../actions/account'

import { Container, Loader, Grid, Dimmer, Header } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomContainer = styled(Container)`
   &&& .creating-info {
      padding-right: 0px;
      padding-top: 48px;

      h1 {
         color: #4a4f54;
         padding-bottom: 24px;
      }
   }

   .column {
      word-break: break-all;
   }
`

class DashboardDetail extends Component {
   state = {
      loader: true
   }

   componentDidMount() {
      this.wallet = new Wallet()
      this.props.handleRefreshUrl(this.props.location)
      this.props.handleRefreshAccount(this.wallet, this.props.history)
   }

   render() {
      const { account } = this.props

      return (
         <Fragment>
            <CustomContainer>
               <Grid className=''>
                  <Dimmer inverted active={account.loader}>
                     <Loader />
                  </Dimmer>

                  <Grid.Row className='creating-info'>
                     <Grid.Column
                        computer={8}
                        tablet={8}
                        mobile={16}
                        className=''
                     >
                        <Header as='h1'>Account: {account.account_id}</Header>
                     </Grid.Column>
                     <Grid.Column
                        computer={8}
                        tablet={8}
                        mobile={16}
                        className=''
                     />
                  </Grid.Row>
                  <Grid.Row as='h2'>
                     <Grid.Column>account id: {account.account_id}</Grid.Column>
                  </Grid.Row>
                  <Grid.Row as='h2'>
                     <Grid.Column>amount: {account.amount}</Grid.Column>
                  </Grid.Row>
                  <Grid.Row as='h2'>
                     <Grid.Column>stake: {account.stake}</Grid.Column>
                  </Grid.Row>
                  <Grid.Row as='h2'>
                     <Grid.Column>nonce: {account.nonce}</Grid.Column>
                  </Grid.Row>
                  <Grid.Row as='h2'>
                     <Grid.Column>code hash: {account.code_hash}</Grid.Column>
                  </Grid.Row>
               </Grid>
            </CustomContainer>
         </Fragment>
      )
   }
}

const mapDispatchToProps = {
   handleRefreshAccount,
   handleRefreshUrl
}

const mapStateToProps = ({ account }) => ({
   account
})

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(DashboardDetail))
