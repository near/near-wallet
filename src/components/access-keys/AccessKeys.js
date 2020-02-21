import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'
import { withRouter } from 'react-router-dom'

import { getAccessKeys, removeAccessKey, addLedgerAccessKey } from '../../actions/account'

import AccessKeysEmpty from './AccessKeysEmpty'
import PaginationBlock from '../pagination/PaginationBlock'
import PageContainer from '../common/PageContainer';

import KeyListItem from '../dashboard/KeyListItem'
import FormButton from '../common/FormButton'

class AccessKeys extends Component {
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
         this.refreshAccessKeys()
      })
   }

   refreshAccessKeys = () => {
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
      this.refreshAccessKeys()
   }

   render() {
      const {
         filterTypes,
         showSub,
         showSubOpen,
         showSubData
      } = this.state

      const { authorizedApps, title } = this.props

      return (
         <PageContainer
            title={title}
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
               subPage='access-keys'
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
                  )) : <AccessKeysEmpty />)}
            </PaginationBlock>
            { false &&
            <FormButton onClick={() => this.props.addLedgerAccessKey(this.props.accountId).then(() => this.props.getAccessKeys()) }>
                <Translate id='button.connectLedger' />
            </FormButton>
            }
         </PageContainer>
      )
   }
}

const mapDispatchToProps = {
   getAccessKeys,
   removeAccessKey,
   addLedgerAccessKey
}

const mapStateToPropsAuthorizedApps = ({ account }) => ({
   ...account,
   authorizedApps: account.authorizedApps,
   title: 'Authorized Apps'
})

export const AuthorizedAppsWithRouter = connect(
   mapStateToPropsAuthorizedApps,
   mapDispatchToProps
)(withRouter(AccessKeys))

const mapStateToPropsFullAccess = ({ account }) => ({
   ...account,
   authorizedApps: account.fullAccessKeys,
   title: 'Full Access Keys'
})

export const FullAccessKeysWithRouter = connect(
   mapStateToPropsFullAccess,
   mapDispatchToProps
)(withRouter(AccessKeys))
