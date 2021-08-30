import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import styled from 'styled-components';

import { showCustomAlert } from '../../actions/status';
import IconArrowLeft from '../../images/IconArrowLeft';
import { EXPLORER_URL } from '../../utils/wallet';

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

            .color-blue {
                line-break: anywhere;
            }

            ul {
                padding-left: 20px;
            }
            
            li {
                color: #4a4f54;
                padding: 5px 0;
            }

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
`;

class LoginDetails extends Component {

    componentDidMount = () => {
        const { contractId, accountConfirmationForm, showCustomAlert } = this.props;

        if (!contractId || (contractId && (accountConfirmationForm))) {
            showCustomAlert({
                success: false,
                messageCodeHeader: 'warning',
                messageCode: 'account.login.details.warning'
            });
        }
    }

    render() {
        const { contractId, transactions, appTitle, accountConfirmationForm } = this.props;

        return (
            <CustomGrid padded>
                <Grid.Row centered className='transactions'>
                    <Grid.Column largeScreen={6} computer={8} tablet={10} mobile={16}>
                        <div className='top-back'>
                            <Link to='/login'>
                                <div className='back-button h3 color-blue'>
                                    <div><IconArrowLeft color='#0072ce' /></div>
                                    <div><Translate id='back' /></div>
                                </div>
                            </Link>
                        </div>
                        {contractId && (accountConfirmationForm ? (
                            <div className='details'>
                                <div className='details-item'>
                                    <div className='title h3'>
                                        <Translate>
                                            {({ translate }) => (
                                                <Translate id='login.details.thisAllows' data={{ appTitle: appTitle || translate('sign.unknownApp') }} />
                                            )}
                                        </Translate>
                                    </div>
                                    <ul>
                                        <li><Translate id='login.details.transferTokens' /></li>
                                        <li><Translate id='login.details.stakeAndUnstake' /></li>
                                    </ul>
                                </div>
                                <div className='details-item title h3'><Translate id='login.details.detailedDescription' /></div>
                                <TransactionsList transactions={transactions} />
                            </div>
                        ) : (
                            <div className='details'>
                                <div className='details-item title h3'><Translate id='login.details.detailedDescription' /></div>
                                <TransactionsList transactions={transactions} />
                            </div>
                        ))}
                        {!contractId && (
                            <div className='details'>
                                <div className='details-item'>
                                    <div className='title h3'>
                                        <Translate>
                                            {({ translate }) => (
                                                <Translate id='login.details.thisAllows' data={{ appTitle: appTitle || translate('sign.unknownApp') }} />
                                            )}
                                        </Translate>
                                    </div>
                                    <ul>
                                        <li><Translate id='login.details.createNewAccounts' /></li>
                                        <li><Translate id='login.details.transferTokens' /></li>
                                        <li><Translate id='login.details.deploySmartContracts' /></li>
                                        <li><Translate id='login.details.callFunctions' /></li>
                                        <li><Translate id='login.details.stakeAndUnstake' /></li>
                                        <li><Translate id='login.details.createAndDeleteAccessKeys' /></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </Grid.Column>
                </Grid.Row>
            </CustomGrid>
        );
    }
}

const TransactionsList = ({ transactions }) => 
    transactions.map((t, i) => (
        <div key={`item-${i}`} className='details-item'>
            <div className='title h3'>
                <Translate id='login.details.forContract' />: <a href={`${EXPLORER_URL}/accounts/${t.signerId}`} target='_blank' rel="noopener noreferrer" className='color-blue'>{t.signerId}</a>
            </div>
        </div>
));

const mapDispatchToProps = {
    showCustomAlert
};

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
    ];
    
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginDetails));
