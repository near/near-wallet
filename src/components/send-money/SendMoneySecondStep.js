import React, { Fragment } from 'react'
import { Translate } from 'react-localize-redux'
import { List, Header } from 'semantic-ui-react'

import PageContainer from '../common/PageContainer';
import MobileContainer from '../sign/MobileContainer'
import FormButton from '../common/FormButton'
import Balance from '../common/Balance'

const SendMoneySecondStep = ({
    handleNextStep,
    handleExpandNote,
    handleGoBack,
    handleCancelTransfer,
    expandNote,
    note,
    amount,
    accountId,
    loader
}) => (
    <MobileContainer>
        <Fragment>
            <PageContainer
                title={<Translate id='sendMoney.pageTitle.default' />}
                type='center'
            />
            <List className='list-top border'>
                <List.Item as='h2' className='sending'><Translate id='sendMoney.youAreSending' /></List.Item>
                <List.Item className='amount-sending border-bottom'>
                    {amount 
                    ? <Balance amount={amount} /> 
                    : "NaN"}
                </List.Item>
                <List.Item className='to'>
                    <Header as='h2'><Translate id='sendMoney.to' /></Header>
                </List.Item>
                <List.Item as='h2'>{accountId}</List.Item>
                <List.Item>@{accountId}</List.Item>
                {note && (
                    <List.Item className='with-note '>
                        with note:
                        <br />
                        {expandNote ? (
                            <span className='color-black'>{note}</span>
                        ) : (
                            <span className='expand-note' onClick={handleExpandNote}>
                                Expand note
                            </span>
                        )}
                    </List.Item>
                )}
            </List>
        </Fragment>
        <Fragment>
            <List className='list-bottom border'>
                <List.Item className='send-money border-top'>
                    <FormButton
                        onClick={handleNextStep}
                        color='green'
                        disabled={loader}
                        sending={loader}
                    >
                        <Translate id='button.confirmAndSend' />
                    </FormButton>
                </List.Item>
                <List.Item className='confirmed'><Translate id='sendMoney.onceConfirmed' /></List.Item>
                <List.Item className='goback border-top'>
                    <FormButton
                        onClick={handleGoBack}
                        color='link bold'
                        disabled={loader}
                    >
                        <Translate id='button.needToEditGoBack' />
                    </FormButton>
                </List.Item>
            </List>
            <List className='cancel'>
                <FormButton
                        onClick={handleCancelTransfer}
                        color='link gray bold'
                        disabled={loader}
                    >
                    <Translate id='button.cancelTransfer' />
                </FormButton>
            </List>
        </Fragment>
    </MobileContainer>
)

export default SendMoneySecondStep
