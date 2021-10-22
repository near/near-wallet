import React from 'react';
import { Translate } from 'react-localize-redux';

import AccountSelector from '../../accounts/account_selector/AccountSelector';
import FormButton from '../../common/FormButton';
import FormButtonGroup from '../../common/FormButtonGroup';
import LoadingDots from '../../common/loader/LoadingDots';
import Container from '../../common/styled/Container.css';
import ConnectWithApplication from './ConnectWithApplication';
import { LOGIN_ACCESS_TYPES } from './LoginWrapper';
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
    appReferrer
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
            <ConnectWithApplication appReferrer={appReferrer} />
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
            <FormButtonGroup>
                <FormButton
                    onClick={onClickCancel}
                    color='gray-blue'
                >
                    <Translate id='button.cancel' />
                </FormButton>
                <FormButton
                    onClick={onClickNext}
                >
                    <Translate id='button.next' />
                </FormButton>
            </FormButtonGroup>
        </LoginStyle>
    </Container>
);