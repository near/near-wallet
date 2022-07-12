import React from 'react';
import { Translate } from 'react-localize-redux';

import { LOGIN_ACCESS_TYPES } from '../../../routes/LoginWrapper';
import AccountSelector from '../../accounts/account_selector/AccountSelector';
import FormButton from '../../common/FormButton';
import FormButtonGroup from '../../common/FormButtonGroup';
import LoadingDots from '../../common/loader/LoadingDots';
import Container from '../../common/styled/Container.css';
import DepositNearBanner from '../../wallet/DepositNearBanner';
import ConnectWithApplication from './ConnectWithApplication';
import LoginStyle from './style/LoginStyle.css';

export default ({
    signedInAccountId,
    availableAccounts,
    accountsBalances,
    getAccountBalance,
    onSelectAccount,
    onSignInToDifferentAccount,
    onClickCancel,
    onClickNext,
    loginAccessType,
    appReferrer,
    contractIdUrl,
    failureAndSuccessUrlsAreValid,
    accountExists
}) => (
    <Container className='small-centered border'>
        <LoginStyle className={loginAccessType === LOGIN_ACCESS_TYPES.FULL_ACCESS ? 'full-access' : ''}>
            <h3><Translate id='login.v2.connectWithNear.title' /></h3>
            <div className='desc'>
                <Translate>
                    {({ translate }) => (
                        <Translate
                            id='login.v2.connectWithNear.desc'
                            data={{ accessType: translate(`login.v2.connectWithNear.${loginAccessType}`) }}
                        />
                    )}
                </Translate>
            </div>
            <ConnectWithApplication
                appReferrer={appReferrer}
                contractIdUrl={contractIdUrl}
            />
            <LoadingDots />
            <AccountSelector
                signedInAccountId={signedInAccountId}
                availableAccounts={availableAccounts}
                accountsBalances={accountsBalances}
                getAccountBalance={getAccountBalance}
                onSelectAccount={onSelectAccount}
                onSignInToDifferentAccount={onSignInToDifferentAccount}
                showBalanceInUSD={false}
            />
            {accountExists === false && <DepositNearBanner />}
            <FormButtonGroup>
                <FormButton
                    onClick={onClickCancel}
                    color='gray-blue'
                    disabled={!failureAndSuccessUrlsAreValid}
                >
                    <Translate id='button.cancel' />
                </FormButton>
                <FormButton
                    onClick={onClickNext}
                    disabled={!failureAndSuccessUrlsAreValid || accountExists === false}
                >
                    <Translate id='button.next' />
                </FormButton>
            </FormButtonGroup>
        </LoginStyle>
    </Container>
);
