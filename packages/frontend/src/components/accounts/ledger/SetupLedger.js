import React, { useEffect, useRef, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';

import { DISABLE_CREATE_ACCOUNT, RECAPTCHA_CHALLENGE_API_KEY } from '../../../config';
import { Mixpanel } from '../../../mixpanel/index';
import {
    addLedgerAccessKey,
    refreshAccount,
    redirectToApp,
    redirectTo,
    checkIsNew,
    fundCreateAccountLedger,
    getLedgerPublicKey
} from '../../../redux/actions/account';
import { showCustomAlert } from '../../../redux/actions/status';
import { selectAccountSlice } from '../../../redux/slices/account';
import { createNewAccount } from '../../../redux/slices/account/createAccountThunks';
import { actions as ledgerActions } from '../../../redux/slices/ledger';
import { actions as linkdropActions } from '../../../redux/slices/linkdrop';
import { selectStatusMainLoader } from '../../../redux/slices/status';
import parseFundingOptions from '../../../utils/parseFundingOptions';
import { setKeyMeta, ENABLE_IDENTITY_VERIFIED_ACCOUNT } from '../../../utils/wallet';
import FormButton from '../../common/FormButton';
import GlobalAlert from '../../common/GlobalAlert';
import Container from '../../common/styled/Container.css';
import { isRetryableRecaptchaError, Recaptcha } from '../../Recaptcha';
import LedgerIcon from '../../svg/LedgerIcon';
import InstructionsModal from './InstructionsModal';

const {
    checkAndHideLedgerModal
} = ledgerActions;

const { setLinkdropAmount } = linkdropActions;

// FIXME: Use `debug` npm package so we can keep some debug logging around but not spam the console everywhere
const ENABLE_DEBUG_LOGGING = false;
const debugLog = (...args) => ENABLE_DEBUG_LOGGING && console.log('SetupLedger:', ...args);

const SetupLedger = (props) => {

    const [showInstructions, setShowInstructions] = useState(false);
    const [connect, setConnect] = useState(null);
    const [isNewAccount, setIsNewAccount] = useState(null);
    // TODO: Custom recaptcha hook
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const recaptchaRef = useRef(null);
    const fundingOptions = parseFundingOptions(props.location.search);
    const shouldRenderRecaptcha = !fundingOptions && RECAPTCHA_CHALLENGE_API_KEY && isNewAccount && !ENABLE_IDENTITY_VERIFIED_ACCOUNT;

    useEffect(() => {
        const performNewAccountCheck = async () => {
            setIsNewAccount(await props.dispatch(checkIsNew(props.accountId)));
        };
        performNewAccountCheck();
    }, []);

    const openShowInstructions = () => {
        setShowInstructions(true);
        Mixpanel.track('SR-Ledger See instructions');
    };
    const closeShowInstructions = () => {
        setShowInstructions(false);
        Mixpanel.track('SR-Ledger Close instructions');
    };

    const handleClick = async () => {
        const {
            dispatch,
            accountId,
        } = props;

        setConnect(true);
        await Mixpanel.withTracking('SR-Ledger Connect ledger',
            async () => {
                if (isNewAccount) {
                    let publicKey;

                    try {

                        debugLog(DISABLE_CREATE_ACCOUNT, fundingOptions);
                        publicKey = await dispatch(getLedgerPublicKey());
                        await setKeyMeta(publicKey, { type: 'ledger' });
                        Mixpanel.track('SR-Ledger Set key meta');

                        // COIN-OP VERIFY ACCOUNT
                        if (DISABLE_CREATE_ACCOUNT && ENABLE_IDENTITY_VERIFIED_ACCOUNT && !fundingOptions) {
                            await dispatch(fundCreateAccountLedger(accountId, publicKey));
                            Mixpanel.track('SR-Ledger Fund create account ledger');
                            return;
                        }

                        // IMPLICIT ACCOUNT
                        if (DISABLE_CREATE_ACCOUNT && !fundingOptions && !recaptchaToken) {
                            await dispatch(fundCreateAccountLedger(accountId, publicKey));
                            Mixpanel.track('SR-Ledger Fund create account ledger');
                            return;
                        }

                        await dispatch(createNewAccount({ accountId, fundingOptions, recoveryMethod: 'ledger', publicKey, recaptchaToken })).unwrap();
                        if (fundingOptions?.fundingAmount) {
                            setLinkdropAmount(fundingOptions.fundingAmount);
                        }
                        dispatch(checkAndHideLedgerModal());
                        Mixpanel.track('SR-Ledger Create new account ledger');
                    } catch (err) {
                        if (isRetryableRecaptchaError(err)) {
                            Mixpanel.track('Funded account creation failed due to invalid / expired reCaptcha response from user');
                            recaptchaRef.current.reset();

                            dispatch(showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: 'walletErrorCodes.invalidRecaptchaCode',
                                errorMessage: err.message
                            }));
                        } else if (err.code === 'NotEnoughBalance') {
                            Mixpanel.track('SR-Ledger NotEnoughBalance creating funded account');
                            dispatch(fundCreateAccountLedger(accountId, publicKey));
                        } else if (err.message.includes('The Ledger client is unavailable.')) {
                            dispatch(showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: 'walletErrorCodes.connectLedger.noClient',
                                errorMessage: err.message
                            }));
                        } else {
                            recaptchaRef.current.reset();

                            dispatch(showCustomAlert({
                                errorMessage: err.message,
                                success: false,
                                messageCodeHeader: 'error',
                            }));
                        }

                        return;
                    }
                } else {
                    try {
                        await dispatch(addLedgerAccessKey());
                    } catch (error) {
                        dispatch(checkAndHideLedgerModal());
                        throw error;
                    }
                    Mixpanel.track('SR-Ledger Add ledger access key');
                }
                await dispatch(refreshAccount());
                if (isNewAccount) {
                    Mixpanel.track('SR-Ledger Go to profile of new account');
                    await dispatch(redirectToApp('/'));
                } else {
                    Mixpanel.track('SR-Ledger Go to setup ledger success');
                    await dispatch(redirectTo('/setup-ledger-success'));
                }
            },
            (e) => {
                setConnect('fail');
                throw e;
            }
        );
    };

    return (
        <Container className='small-centered border ledger-theme'>
            {props.localAlert && !props.localAlert.success &&
                <GlobalAlert
                    globalAlert={{
                        messageCode: `errors.ledger.${props.localAlert.id}`
                    }}
                    closeIcon={false}
                />
            }
            <h1><Translate id='setupLedger.header' /></h1>
            <LedgerIcon />
            <h2>
                <Translate id='setupLedger.one' />
                &nbsp;<Translate id='setupLedger.two' /> <span className='link underline' onClick={openShowInstructions}><Translate id='setupLedger.twoLink' /></span>.
            </h2>
            {
                shouldRenderRecaptcha && <Recaptcha
                    ref={recaptchaRef}
                    onChange={(token) => {
                        debugLog('onChange from recaptcha - setting token in state', token);
                        setRecaptchaToken(token);
                    }}
                    onFundAccountCreation={handleClick}
                />
            }
            <FormButton
                onClick={handleClick}
                sending={connect && props.mainLoader}
                sendingString='button.connecting'
                disabled={(!recaptchaToken && shouldRenderRecaptcha) || isNewAccount === null}
            >
                <Translate id={`button.${connect !== 'fail' ? 'continue' : 'retry'}`} />
            </FormButton>
            <FormButton
                className='link gray'
                onClick={() => props.history.goBack()}
                trackingId='SR-Ledger Click cancel button'
            >
                <Translate id='button.cancel' />
            </FormButton>
            {showInstructions &&
                <InstructionsModal open={showInstructions} onClose={closeShowInstructions} />
            }
        </Container>
    );
};

const mapStateToProps = (state, { match }) => ({
    ...selectAccountSlice(state),
    accountId: match.params.accountId,
    mainLoader: selectStatusMainLoader(state)
});

export const SetupLedgerWithRouter = connect(mapStateToProps)(SetupLedger);
