import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Translate } from 'react-localize-redux'

import IconArrowLeft from '../../images/IconArrowLeft'
import IconProblems from '../../images/IconProblems'

import { Grid } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomGrid = styled(Grid)`
    .top-back {
        display: flex;
        padding-bottom: 12px;

        .back-button {
            display: flex;
            cursor: pointer;

            svg {
                margin: 0 12px 0 18px;
                width: 12px;

                polyline {
                    stroke: #0072ce;
                }
            }
        }
    }
    .details {
        background: #f8f8f8;
        padding: 0 18px 36px;

        .details-item {
            padding: 12px 0px;
            border-bottom: 1px solid #e6e6e6;

            .title {
                padding: 6px 0 0 0;
            }
            .details-subitem {
                padding: 12px 12px 0;

                .desc {
                    display: flex;
                    padding-top: 4px;
                    line-height: 16px;

                    .icon {
                        margin-right: 10px;
                        margin-top: 2px;

                        svg {
                            width: 26px;
                        }
                    }
                }
            }
        }
    }
    @media screen and (max-width: 767px) {
        &&& {
            .details {
                min-height: calc(100vh - 126px);
            }
            .transactions {
                padding: 0px;

                > .column {
                    padding: 0px;
                }
            }
        }
    }
`

class SignTransferDetails extends Component {
    render() {
        const { handleDetails, transactions, fees } = this.props

        return (
            <CustomGrid padded>
                <Grid.Row centered className='transactions'>
                    <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                        <div className='top-back'>
                            <div 
                                className='back-button h3 font-benton color-blue'
                                onClick={handleDetails}
                            >
                                <div><IconArrowLeft color='#0072ce' /></div>
                                <div><Translate id='back' /></div>
                            </div>
                        </div>
                        <div className='details'>
                            <div className='details-item title h3'><Translate id='sign.details.detailedDescription' /></div>
                            <TransactionsList transactions={transactions} />

                            <div className='details-item'>
                                <div className='title h3'>
                                    <Translate id='sign.details.transactionFees' />
                                    {/* .00042 &#9411; */}
                                </div>
                                {/* {t.fees} */}
                                <div className='details-subitem color-charcoal-grey'>
                                    <div><Translate id='sign.details.gasLimit' />: {fees.gasLimit}</div>
                                    <div><Translate id='sign.details.gasPriceUnavailable' /></div>
                                    {/* <div>Gas Price: .000000021 &#9411;</div> */}
                                </div>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </CustomGrid>
        )
    }
}

const TransactionsList = ({ transactions }) => 
    transactions.map((t, i) => (
        <div key={`item-${i}`} className='details-item'>
            <div className='title h3'>
                <Translate id='sign.details.forContract' />: <span className='color-blue'>@{t.receiverId}</span>
            </div>
            <ActionsList 
                transaction={t} 
                actions={t.actions}
            />
        </div>
))

const ActionsList = ({ transaction, actions }) => 
    actions
        .sort((a,b) => Object.keys(b)[0] === 'functionCall' ? 1 : -1)
        .map((a, i) => (
            <ActionRow 
                key={`action-${i}`} 
                transaction={transaction} 
                action={a} 
                actionKind={Object.keys(a)[0]}  
            />
))

const ActionRow = ({ transaction, action, actionKind }) => (
    <div key={`subitem-`} className='details-subitem color-charcoal-grey'>
        <ActionMessage 
            transaction={transaction} 
            action={action} 
            actionKind={actionKind}
        />
        <div className='desc font-small'>
            <ActionWarrning 
                actionKind={actionKind} 
            />
        </div>
    </div>
)

const ActionMessage = ({ transaction, action, actionKind }) => (
    <b>
        <Translate 
            id={`actionsSign.${actionKind}`}
            data={{
                receiverId: transaction.receiver_id || '',
                methodName: action.functionCall ? action.functionCall.methodName : '',
                deposit: action.transfer ? action.transfer.deposit : '',
                stake: action.stake ? action.stake.stake : '',
                publicKey: action.stake ? action.stake.publicKey.substring(0, 15) : ''
            }}
        />
    </b>
)

const ActionWarrning = ({ actionKind }) => (
    <Fragment>
        {actionKind === 'functionCall' && (
            <Fragment>
                <div className='icon'><IconProblems color='#999' /></div>
                <Translate id='sign.ActionWarrning.functionCall' />
            </Fragment>
        )}
        {actionKind === 'deployContract' && (
            <Fragment>
                <div className='icon'><IconProblems color='#fca347' /></div>
                <Translate id='sign.ActionWarrning.deployContract' />
            </Fragment>
        )}
        {actionKind === 'stake' && (
            <Fragment>
                <div className='icon'><IconProblems color='#fca347' /></div>
                <Translate id='sign.ActionWarrning.stake' />
            </Fragment>
        )}
        {actionKind === 'deleteAccount' && (
            <Fragment>
                <div className='icon'><IconProblems color='#fca347' /></div>
                <Translate id='sign.ActionWarrning.deleteAccount' />
            </Fragment>
        )}
    </Fragment>
)

const mapDispatchToProps = {}

const mapStateToProps = ({ account, sign }) => ({
    account,
    ...sign,
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignTransferDetails))
