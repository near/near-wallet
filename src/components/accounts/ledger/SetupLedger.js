import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { parse as parseQuery } from 'query-string';
import Container from '../../common/styled/Container.css';
import InstructionsModal from './InstructionsModal';
import LedgerIcon from '../../svg/LedgerIcon';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import {
    addLedgerAccessKey,
    createNewAccount,
    refreshAccount,
    redirectToApp,
    redirectTo,
    checkIsNew,
    fundCreateAccountLedger,
    getLedgerPublicKey
} from '../../../actions/account'
import { ACCOUNT_HELPER_URL, DISABLE_CREATE_ACCOUNT, setKeyMeta } from '../../../utils/wallet'
import GlobalAlert from '../../common/GlobalAlert'
import { Mixpanel } from '../../../mixpanel/index'
import { isRetryableRecaptchaError, Recaptcha } from '../../Recaptcha';
import { showCustomAlert } from '../../../actions/status';
import sendJson from '../../../tmp_fetch_send_json';

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

    // TODO: Combine similar effect code into custom hook
    const [fundedAccountAvailable, setFundedAccountAvailable] = useState(false);
    useEffect(() => {
        debugLog('Checking available funded account status');
        const fetchIsFundedAccountAvailable = async () => {
            let available;

            try {
                ({ available } = await sendJson('GET', ACCOUNT_HELPER_URL + '/checkFundedAccountAvailable'));
            } catch (e) {
                debugLog('Failed check available funded account status');
                setFundedAccountAvailable(false);
                return;
            }

            debugLog('Funded account availability', { available });
            setFundedAccountAvailable(available);
        }

        fetchIsFundedAccountAvailable();
    }, []);

    const shouldRenderRecaptcha = process.env.RECAPTCHA_CHALLENGE_API_KEY && isNewAccount && fundedAccountAvailable;

    useEffect(() => {
        const performNewAccountCheck = async () => {
            setIsNewAccount(await props.dispatch(checkIsNew(props.accountId)));
        }
        performNewAccountCheck();
    }, [])

    const openShowInstructions = () => {
        setShowInstructions(true)
        Mixpanel.track("SR-Ledger See instructions")
    }
    const closeShowInstructions = () => {
        setShowInstructions(false)
        Mixpanel.track("SR-Ledger Close instructions")
    }

    const handleClick = async () => {
        const {
            dispatch,
            location,
            accountId,
        } = props

        setConnect(true)
        await Mixpanel.withTracking("SR-Ledger Connect ledger",
            async () => {
                if (isNewAccount) {
                    let publicKey;

                    try {
                        const queryOptions = parseQuery(location.search);
                        const fundingOptions = JSON.parse(queryOptions.fundingOptions || 'null')

                        debugLog(DISABLE_CREATE_ACCOUNT, fundingOptions)
                        publicKey = await dispatch(getLedgerPublicKey())
                        await setKeyMeta(publicKey, { type: 'ledger' })
                        Mixpanel.track("SR-Ledger Set key meta")

                        if (DISABLE_CREATE_ACCOUNT && !fundingOptions && !recaptchaToken) {
                            await dispatch(fundCreateAccountLedger(accountId, publicKey))
                            Mixpanel.track("SR-Ledger Fund create account ledger")
                            return
                        }

                        await dispatch(createNewAccount(accountId, fundingOptions, 'ledger', publicKey, undefined, recaptchaToken))
                        Mixpanel.track("SR-Ledger Create new account ledger")
                    } catch(err) {
                        if (isRetryableRecaptchaError(err)) {
                            recaptchaRef.current.reset();

                            dispatch(showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: 'walletErrorCodes.invalidRecaptchaCode'
                            }))
                        } else if(err.code === 'NotEnoughBalance') {
                            dispatch(fundCreateAccountLedger(accountId, publicKey))
                        } else {
                            recaptchaRef.current.reset();

                            // FIXME: I can't seem to get this to display a messageContent
                            dispatch(showCustomAlert({
                                errorMessage: err.message,
                                success: false,
                                messageCodeHeader: 'error',
                            }))
                        }

                        return;
                    }
                } else {
                    await dispatch(addLedgerAccessKey())
                    Mixpanel.track("SR-Ledger Add ledger access key")
                }
                await dispatch(refreshAccount())
                if (isNewAccount) {
                    Mixpanel.track("SR-Ledger Go to profile of new account")
                    await dispatch(redirectToApp('/profile'))
                } else {
                    Mixpanel.track("SR-Ledger Go to setup ledger success")
                    await dispatch(redirectTo('/setup-ledger-success'));
                }
            },
            (e) => {
                setConnect('fail');
                throw e;
            }
        )
    }

    return (
        <Container className='small-centered ledger-theme'>
            {props.localAlert && !props.localAlert.success &&
                <GlobalAlert
                    globalAlert={{
                        messageCode: `errors.ledger.${props.localAlert.id}`
                    }}
                    closeIcon={false}
                />
            }
            <h1><Translate id='setupLedger.header'/></h1>
            <LedgerIcon/>
            <h2>
                <Translate id='setupLedger.one'/>
                &nbsp;<Translate id='setupLedger.two'/> <span className='link underline' onClick={openShowInstructions}><Translate id='setupLedger.twoLink'/></span>.
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
                <Translate id={`button.${connect !== 'fail' ? 'continue' : 'retry'}`}/>
            </FormButton>
            <FormButton
                className='link red'
                onClick={() => props.history.goBack()}
                trackingId='SR-Ledger Click cancel button'
            >
                <Translate id='button.cancel'/>
            </FormButton>
            {showInstructions &&
                <InstructionsModal open={showInstructions} onClose={closeShowInstructions}/>
            }
        </Container>
    );
}

const mapStateToProps = ({ account, status }, { match }) => ({
    ...account,
    accountId: match.params.accountId,
    mainLoader: status.mainLoader
})

export const SetupLedgerWithRouter = connect(mapStateToProps)(SetupLedger);
