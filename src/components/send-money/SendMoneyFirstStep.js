import React, { Fragment } from 'react'
import { Translate } from 'react-localize-redux'

import {
    Header,
    TextArea,
    List,
    Form
} from 'semantic-ui-react'

import PageContainer from '../common/PageContainer'
import MobileContainer from '../sign/MobileContainer'
import FormButton from '../common/FormButton'
import AccountFormAccountId from '../accounts/AccountFormAccountId'
import SendMoneyAmountInput from './SendMoneyAmountInput'

const SendMoneyFirstStep = ({
    handleNextStep,
    handleChange,
    note,
    accountId,
    isLegitForm,
    formLoader,
    requestStatus,
    amount,
    checkAvailability,
    clearRequestStatus,
    setFormLoader,
    stateAccountId,
    defaultAccountId,
    amountStatusId
}) => (
    <Form autoComplete='off'>
        <MobileContainer>
            <Fragment>
                <PageContainer
                    title={<Translate id='sendMoney.pageTitle.default' />}
                    type='center'
                />
                <List className='list-top border'>
                    <List.Item>
                        <List.Content>
                            <Header as='h4' textAlign='left'><Translate id='sendMoney.accountIdInput.title' /></Header>
                            <AccountFormAccountId
                                formLoader={formLoader}
                                handleChange={handleChange}
                                defaultAccountId={defaultAccountId}
                                checkAvailability={checkAvailability}
                                requestStatus={requestStatus}
                                autoFocus={true}
                                setFormLoader={setFormLoader}
                                clearRequestStatus={clearRequestStatus}
                                stateAccountId={stateAccountId}
                            />
                        </List.Content>
                    </List.Item>
                    <List.Item className='amount border-top'>
                        <SendMoneyAmountInput 
                            handleChange={handleChange} 
                            defaultAmount={amount}
                        />
                    </List.Item>
                    {false ? (
                        <List.Item className='add-note border-bottom border-top'>
                            <TextArea
                                name='note'
                                value={note}
                                onChange={handleChange}
                                placeholder='Add a note...'
                            />
                        </List.Item>
                    ) : null}
                </List>
            </Fragment>
            <Fragment>
                <List className='list-bottom border'>
                    <List.Item className='send-money'>
                        <FormButton
                            onClick={handleNextStep}
                            color='green'
                            disabled={!isLegitForm() || amountStatusId.includes('notEnoughTokens')}
                        >
                            <Translate id='button.send' />
                        </FormButton>
                    </List.Item>
                </List>
            </Fragment>
        </MobileContainer>
    </Form>
)

export default SendMoneyFirstStep
