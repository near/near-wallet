import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { handleRefreshAccount, switchAccount } from '../../actions/account'

import { ReactComponent as IconArrowLeft } from '../../images/icon-arrow-left.svg'
import { ReactComponent as IconProblems } from '../../images/icon-problems.svg'

import { Grid } from 'semantic-ui-react'

class SignTransferReady extends Component {
   render() {
      const { handleDetails, tx } = this.props

      return (
         <Grid padded>
            <Grid.Row centered className='tx'>
                  <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                  <div className='top-back'>
                     <div 
                        className='back-button h3 font-benton color-blue'
                        onClick={() => handleDetails(false)}
                     >
                        <div><IconArrowLeft /></div>
                        <div>Back</div>
                     </div>
                  </div>
                  <div className='details'>
                     <div className='details-item'>
                        <div className='title h3'>
                           Detailed description of transaction
                        </div>
                     </div>
                     {tx.map((t, i) => (
                        <div key={`item-${i}`} className='details-item'>
                           {t.contract && (
                              <div className='title h3'>
                                 For Contract: <span className='color-blue'>@{t.contract}</span>
                              </div>
                           )}
                           {t.fees && (
                              <div className='title h3'>
                                 Transaction Fees: @{t.fees}
                              </div>
                           )}
                           {t.methods.map((m,i) => (
                              <div key={`subitem-${i}`} className='details-subitem'>
                                 <div className='font-bold color-charcoal-grey'>
                                    Calling Method: '{m.name}'
                                 </div>
                                 <div className='desc'>
                                    {m.alert && <div className='icon'><IconProblems className={m.alert} /></div>}
                                    <div className='font-small'>
                                       {m.desc || 'No description specified for this method.'}
                                    </div>
                                 </div>
                              </div>
                           ))}
                           <div className='details-subitem color-charcoal-grey'>
                              {t.gasLimit && <div>Gas Limit: {t.gasLimit}</div>}
                              {t.gasPrice && <div>Gas Price: {t.gasPrice}</div>}
                           </div>
                        </div>
                     ))}
                  </div>
               </Grid.Column>
            </Grid.Row>
         </Grid>
      )
   }
}

const mapDispatchToProps = {
   handleRefreshAccount,
   switchAccount,
}

const mapStateToProps = ({ account }) => ({
   account
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignTransferReady))
