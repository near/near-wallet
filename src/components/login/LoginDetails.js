import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Translate } from 'react-localize-redux'
import { EXPLORER_URL } from '../../utils/wallet'

import IconArrowLeft from '../../images/IconArrowLeft'
import IconProblems from '../../images/IconProblems'

import { Grid } from 'semantic-ui-react'

import styled from 'styled-components'
import GlobalAlert from '../responsive/GlobalAlert'

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
            }
        }
    }    
    .details {
        background: #f8f8f8;
        padding: 0 18px 36px;

        .details-item {
            padding: 12px 0px;
            border-bottom: 1px solid #e6e6e6;

            &.alert {
                .content {
                    word-break: break-word;
                }
            }
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

class LoginDetails extends Component {
    render() {
        const { contractId, transactions, fees, appTitle } = this.props

        return (
            <CustomGrid padded>
                <Grid.Row centered className='transactions'>
                    <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                        <div className='top-back'>
                            <Link to='/login'>
                                <div className='back-button h3 font-benton color-blue'>
                                    <div><IconArrowLeft color='#0072ce' /></div>
                                    <div><Translate id='back' /></div>
                                </div>
                            </Link>
                        </div>
                        {contractId && (
                            <div className='details'>
                                <div className='details-item title h3'><Translate id='login.details.detailedDescription' /></div>
                                <TransactionsList transactions={transactions} />

                                {false && <div className='details-item'>
                                    <div className='title h3'>
                                        Transaction Allowance
                                    </div>
                                    <div className='details-subitem color-charcoal-grey'>
                                        <div className='desc font-small'>
                                            This app can use your NEAR for transaction fees
                                        </div>
                                        <div>
                                            <b>Total Allowance: .001 &#9411;</b>
                                        </div>
                                    </div>
                                </div>}
                                {false && <div className='details-item'>
                                    <div className='title h3'>
                                        Transaction Fees
                                    </div>
                                    <div className='details-subitem color-charcoal-grey'>
                                        <div><b>Gas Limit: {fees.gasLimit}</b></div>
                                        <div><b>Gas price estimate is unavailable</b></div>
                                    </div>
                                </div>}
                            </div>
                        )}
                        {!contractId && (
                            <div className='details'>
                                <div className='details-item alert'>
                                    <GlobalAlert 
                                        globalAlert={{
                                            success: false,
                                            messageCodeHeader: 'warning',
                                            messageCode: 'account.login.details.warning'
                                        }}
                                        closeIcon={false}
                                    />
                                </div>
                                <div className='details-item'>
                                    <div className='title h3'>
                                        <Translate id='login.details.thisAllows' data={{ appTitle }} />
                                    </div>
                                    <div className='details-subitem color-charcoal-grey'>
                                        <div><Translate id='login.details.createNewAccounts' /></div>
                                    </div>
                                    <div className='details-subitem color-charcoal-grey'>
                                        <div>
                                        <Translate id='login.details.transferTokens' /></div>
                                    </div>
                                    <div className='details-subitem color-charcoal-grey'>
                                        <div><Translate id='login.details.deploySmartContracts' /></div>
                                    </div>
                                    <div className='details-subitem color-charcoal-grey'>
                                        <div><Translate id='login.details.callFunctions' /></div>
                                    </div>
                                    <div className='details-subitem color-charcoal-grey'>
                                        <div><Translate id='login.details.stakeAndUnstake' /></div>
                                    </div>
                                    <div className='details-subitem color-charcoal-grey'>
                                        <div><Translate id='login.details.createAndDeleteAccessKeys' /></div>
                                    </div>
                                </div>
                            </div>
                        )}
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
                <Translate id='login.details.forContract' />: <a href={`${EXPLORER_URL}/accounts/${t.signerId}`} target='_blank' rel="noopener noreferrer" className='color-blue'>@{t.signerId}</a>
            </div>
            {false &&  <ActionsList 
                transaction={t} 
                actions={t.actions}
            />}
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
    <Translate>
        <b>
            {({ translate }) => actionKind === 'functionCall' && `${translate('login.details.function')}: ${action.functionCall.methodName}`}
        </b>
    </Translate>
)

const ActionWarrning = ({ actionKind }) => (
    <Fragment>
        {actionKind === 'functionCall' && (
            <Fragment>
                <div className='icon'><IconProblems color='#999' /></div>
                <Translate id='login.details.noDescription' />
            </Fragment>
        )}
    </Fragment>
)

const mapDispatchToProps = {}

const mapStateToProps = ({ transactions = [], account }) => {
    transactions = [
        {
            signerId: account.url.contract_id,
            receiverId: 'account id',
            actions: [
                {
                    functionCall: {
                        methodName: 'createCorgi',
                        args: [1,2,3],
                        gas: 123
                    },
                },
                {
                    functionCall: {
                        methodName: 'walkCorgi',
                        args: [1,2,3],
                        gas: 321
                    },
                }
            ]
        }
    ]
    
    return {
        transactions,
        fees: {
            transactionFees: '',
            gasLimit: transactions.reduce((c, t) => 
                c + t.actions.reduce((ca, a) => 
                    Object.keys(a)[0] === 'functionCall'
                        ? ca + a.functionCall.gas
                        : ca
                , 0)
            , 0),
            gasPrice: ''
        },
        sensitiveActionsCounter: transactions.reduce((c, t) => 
            c + t.actions.reduce((ca, a) => 
                ['deployContract', 'stake', 'deleteAccount'].indexOf(Object.keys(a)[0]) > -1
                    ? ca + 1
                    : ca
            , 0)
        , 0)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginDetails))
