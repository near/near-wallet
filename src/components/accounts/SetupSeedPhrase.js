import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as bip39 from 'bip39-light'
import { derivePath, getPublicKey } from 'ed25519-hd-key'
import * as bs58 from 'bs58'
import * as nacl from 'tweetnacl'

import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'
import { redirectToApp, clear, clearCode } from '../../actions/account';

class SetupSeedPhrase extends Component {
   state = {
      loader: false
   }

   componentDidMount = () => {
      const seedPhrase = "shoot island position soft burden budget tooth cruel issue economy destroy above" //bip39.generateMnemonic()
      const seed = bip39.mnemonicToSeed(seedPhrase)
      const { key } = derivePath("m/44'/397'/0'", seed.toString('hex'));
      const publicKey = bs58.encode(nacl.sign.keyPair.fromSeed(key).publicKey)
      this.setState((prevState) => ({
         ...prevState,
         seedPhrase,
         publicKey
      }))
   }

   componentWillUnmount = () => {
      // TODO: Figure out how are these used
      this.props.clear()
      this.props.clearCode()
   }

   handleSubmit = e => {
      e.preventDefault()

      this.setState(() => ({
         loader: true
      }))

      // TODO
      /*
      this.props.setupAccountRecovery(this.state.phoneNumber, this.props.accountId, this.state.securityCode)
         .then(({error}) => {
            if (error) return
            this.props.redirectToApp()
         })
         .finally(() => {
            this.setState(() => ({
               loader: false,
               isLegit: false
            }))
         })
      */

      this.props.redirectToApp()
   }

   render() {
      return (
         <AccountFormContainer 
            title={`Protect your Account`}
            text={ `Write down this seed phrase to allow you to recover account in the future.`}
         >
            <AccountFormSection handleSubmit={this.handleSubmit} requestStatus={this.props.requestStatus}>
               <p>{this.state.seedPhrase}</p>
               <p>{this.state.publicKey}</p>
            </AccountFormSection>
         </AccountFormContainer>
      )
   }
}

const mapDispatchToProps = {
   redirectToApp,
   clear,
   clearCode
}

const mapStateToProps = ({ account }, { match }) => ({
   ...account,
   accountId: match.params.accountId
})

export const SetupSeedPhraseWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupSeedPhrase)
