import React, { Fragment } from 'react'
import { Translate } from 'react-localize-redux'

import {
    Header,
    List,
    Form
} from 'semantic-ui-react'

import PageContainer from '../common/PageContainer'
import MobileContainer from '../sign/MobileContainer'
import FormButton from '../common/FormButton'
import AccountFormAccountId from '../accounts/AccountFormAccountId'
import SendMoneyAmountInput from './SendMoneyAmountInput'
import Modal from "../common/modal/Modal";
import ModalTheme from '../accounts/ledger/ModalTheme';
import MobileActionSheet from '../common/modal/MobileActionSheet';
import IconProblems from '../../images/IconProblems'
import isDecimalString from '../../utils/isDecimalString'

const SendMoneyFirstStep = ({
    handleNextStep,
    handleChange,
    isLegitForm,
    formLoader,
    requestStatus,
    amount,
    checkAvailability,
    clearRequestStatus,
    setFormLoader,
    stateAccountId,
    defaultAccountId,
    amountStatus,
    implicitAccountModal,
    handleCloseModal,
    implicitAccount,
    handleUseMax,
    useMax,
    handleChangeAmount
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
                        <List.Content className={implicitAccount ? 'implicitAccount' : ''}>
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
                        <div className='use-max' onClick={handleUseMax}>Use max</div>
                        <SendMoneyAmountInput 
                            handleChange={handleChangeAmount}
                            value={amount}
                            useMax={useMax}
                            amountStatus={amountStatus}
                        />
                    </List.Item>
                </List>
            </Fragment>
            <Fragment>
                <List className='list-bottom border'>
                    <List.Item className='send-money'>
                        <FormButton
                            onClick={handleNextStep}
                            color='green'
                            disabled={!isLegitForm() || !isDecimalString(amount)}
                        >
                            <Translate id='button.send' />
                        </FormButton>
                    </List.Item>
                </List>
                {implicitAccountModal && (
                    <Modal
                        id='next-step-modal'
                        isOpen={implicitAccountModal}
                        onClose={handleCloseModal}
                        closeButton='desktop'
                    >
                        <ModalTheme/>
                        <MobileActionSheet/>

                        <div className='warning'>
                            <IconProblems color='#fca347' />
                            <h1><Translate id='warning' /></h1>
                            <div><Translate id='account.available.implicitAccountModal' /></div>
                        </div>
                        <FormButton
                            onClick={handleNextStep}
                            color='blue'
                        >
                            <Translate id='button.confirm' />
                        </FormButton>
                    </Modal>
                )}
            </Fragment>
        </MobileContainer>
    </Form>
)

export default SendMoneyFirstStep
