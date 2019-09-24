import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { getAccessKeys, removeAccessKey } from '../../actions/account'

import AuthorizedAppsEmpty from './AuthorizedAppsEmpty'
import PaginationBlock from '../pagination/PaginationBlock'
import PageContainer from '../common/PageContainer';

import KeyListItem from '../dashboard/KeyListItem'

// TODO: Rename and refactor to accomodate full access keys better
class AuthorizedApps extends Component {
   state = {
      loader: true,
      showSub: false,
      showSubOpen: 0,
      showSubData: null,
      authorizedApps: [],
      filterTypes: [
         { img: '', name: 'ALL' },
         { img: '', name: 'ALL' },
         { img: '', name: 'ALL' },
         { img: '', name: 'ALL' }
      ]
   }

   toggleShowSub = (i, accessKey) => {
      i = i == null ? this.state.showSubOpen : i

      this.setState(state => ({
         showSub: true,
         showSubOpen: i,
         showSubData: accessKey
      }))
   }

   toggleCloseSub = () => {
      this.setState(() => ({
         showSub: false,
         showSubOpen: 0,
         showSubData: null
      }))
   }

   handleDeauthorize = () => {
      const publicKey = this.state.showSubData.public_key

      this.setState(() => ({
         loader: true
      }))

      this.props.removeAccessKey(publicKey).then(() => {
         this.toggleCloseSub()
         this.refreshAuthorizedApps()
      })
   }

   refreshAuthorizedApps = () => {
      this.setState(() => ({
         loader: true
      }))

      this.props.getAccessKeys().then(() => {
         this.setState(() => ({
            loader: false
         }))
      })
   }

   componentDidMount() {
      this.refreshAuthorizedApps()
   }

   render() {
      const {
         filterTypes,
         showSub,
         showSubOpen,
         showSubData
      } = this.state

      const { authorizedApps } = this.props

      return (
         <PageContainer
            title='Authorized Apps'
            additional={(
               <h1>
                  {authorizedApps && authorizedApps.length}
                  <span className='color-brown-grey'> total</span>
               </h1>
            )}
         >
            <PaginationBlock
               filterTypes={filterTypes}
               showSub={showSub}
               showSubData={showSubData}
               toggleShowSub={this.toggleShowSub}
               toggleCloseSub={this.toggleCloseSub}
               subPage='authorized-apps'
               handleDeauthorize={this.handleDeauthorize}
            >
               {authorizedApps && (authorizedApps.length 
                  ? authorizedApps.map((accessKey, i) => (
                     <KeyListItem
                        key={`a-${i}`}
                        accessKey={accessKey}
                        i={i}
                        wide={true}
                        showSub={showSub}
                        toggleShowSub={this.toggleShowSub}
                        showSubOpen={showSubOpen}
                     />
                  )) : <AuthorizedAppsEmpty />)}
            </PaginationBlock>
         </PageContainer>
      )
   }
}

const mapDispatchToProps = {
   getAccessKeys,
   removeAccessKey
}

const mapStateToProps = ({ account }) => ({
   ...account,
   authorizedApps: account.authorizedApps
})

export const AuthorizedAppsWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(AuthorizedApps))

const mapStateToPropsFullAccess = ({ account }) => ({
   ...account,
   authorizedApps: account.fullAccessKeys
})

export const FullAccessKeysWithRouter = connect(
   mapStateToPropsFullAccess,
   mapDispatchToProps
)(withRouter(AuthorizedApps))
