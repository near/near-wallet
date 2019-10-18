import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as bip39 from 'bip39-light'
import { derivePath } from 'ed25519-hd-key'
import * as bs58 from 'bs58'
import * as nacl from 'tweetnacl'

import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'
import { redirectToApp, addAccessKey } from '../../actions/account';

class SetupSeedPhrase extends Component {
   state = {}

   componentDidMount = () => {
      const seedPhrase = bip39.generateMnemonic()
      const seed = bip39.mnemonicToSeed(seedPhrase)
      const { key } = derivePath("m/44'/397'/0'", seed.toString('hex'));
      const publicKey = bs58.encode(nacl.sign.keyPair.fromSeed(key).publicKey)
      this.setState((prevState) => ({
         ...prevState,
         seedPhrase,
         publicKey
      }))
   }

   handleSubmit = e => {
      e.preventDefault()

      const contractName = null;
      this.props.addAccessKey(this.props.accountId, contractName, this.state.publicKey)
         .then(({error}) => {
            if (error) return
            this.props.history.push('/full-access-keys')
         })
   }

   render() {
      return (
         <AccountFormContainer 
            title={`Protect your Account`}
            text={ `Write down this seed phrase to allow you to recover account in the future.`}
         >
            <AccountFormSection handleSubmit={this.handleSubmit} requestStatus={this.props.requestStatus}>
               <p style={{ fontSize: '2em' }}>{this.state.seedPhrase}</p>
               <p>Public Key: {this.state.publicKey}</p>
               <input type="submit" value="Setup Seed Phrase" />
            </AccountFormSection>
         </AccountFormContainer>
      )
   }
}

const mapDispatchToProps = {
   redirectToApp,
   addAccessKey
}

const mapStateToProps = ({ account }, { match }) => ({
   ...account,
   accountId: match.params.accountId
})

export const SetupSeedPhraseWithRouter = connect(mapStateToProps, mapDispatchToProps)(withRouter(SetupSeedPhrase))
