import React from 'react'
import { Translate } from 'react-localize-redux'
import FormButton from '../common/FormButton'
import ActionsList from './ActionsList'
import classNames from '../../utils/classNames'

import { Grid, Image } from 'semantic-ui-react'

import styled from 'styled-components'

const CustomGrid = styled(Grid)`
    &&& {
        margin-bottom: 20px;
        margin-left: 0;
        margin-right: 0;

        .row:first-child {
            padding-bottom: 0px;
        }

        .row:last-child {
            padding: 14px 0 0 4px;
            margin-left: 20px;
            border-left: 4px solid #f8f8f8;
        }

        .dashboard-header {
            padding: 14px 0 10px 0;
        }

        link.view-all,
        button.view-all,
        a.view-all {
            background: #f8f8f8;
            margin: 0;
            padding: 10px 20px;
            color: #0072ce;
            font-weight: 600;
            border-radius: 20px;
            border: 2px solid #f8f8f8;

            :hover {
                background: #fff;
            }
        }

        .column-icon {
            width: 28px;
            display: inline-block;
            margin: -4px 10px 0 8px;
        }

        .dots {
            :after {
                content: '.';
                animation: link 1s steps(5, end) infinite;
            
                @keyframes link {
                    0%, 20% {
                        color: rgba(0,0,0,0);
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    40% {
                        color: #24272a;
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    60% {
                        text-shadow:
                            .3em 0 0 #24272a,
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    80%, 100% {
                        text-shadow:
                            .3em 0 0 #24272a,
                            .6em 0 0 #24272a;
                    }
                }
            }
        }
    }
`

const DashboardActivity = ({ image, title, to, transactions, accountId, formLoader, getTransactionStatus }) => (
    <CustomGrid>
        <Grid.Row>
            <Grid.Column className='dashboard-header' textAlign='left' width={16}>
                <h2 className={classNames({'dots': formLoader})}>
                    <Image className='column-icon' src={image} />
                    {title}
                </h2>
            </Grid.Column>
        </Grid.Row>

        {transactions.map((transaction, i) => (
            <ActionsList
                key={`a-${i}`}
                transaction={transaction} 
                wide={false}
                accountId={accountId}
                getTransactionStatus={getTransactionStatus}
            />
        ))}

        <Grid.Row>
            <Grid.Column textAlign='left' width={16}>
                <a href={to} target='_blank' rel='noopener noreferrer'>
                    <FormButton color='gray-blue' size='small'>
                        <Translate id='button.viewAll' />
                    </FormButton>
                </a>
            </Grid.Column>
        </Grid.Row>
    </CustomGrid>
)

export default DashboardActivity
