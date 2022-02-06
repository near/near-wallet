import { utils } from 'near-api-js';
import React, {useEffect, useState} from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { MULTISIG_MIN_AMOUNT } from '../../../config';
import { disableMultisig } from '../../../redux/actions/account';
import { selectAccountSlice } from '../../../redux/slices/account';
import { actions as recoveryMethodsActions } from '../../../redux/slices/recoveryMethods';
import { selectActionsPending } from '../../../redux/slices/status';
import { selectNearTokenFiatValueUSD } from '../../../redux/slices/tokenFiatValues';
import { getNearAndFiatValue } from '../../common/balance/helpers';
import FormButton from '../../common/FormButton';
import Card from '../../common/styled/Card.css';
import SafeTranslate from '../../SafeTranslate';
import ConfirmDisable from '../hardware_devices/ConfirmDisable';
import {wallet} from "../../../utils/wallet";

const { fetchRecoveryMethods } = recoveryMethodsActions;

const {
    parseNearAmount
} = utils.format;

const Container = styled(Card)`
    margin-top: 30px;

    .title {
        color: #24272a;
        font-weight: 500;
    }

    .detail {
        color: #A1A1A9;
    }

    .method {
        .top {
            display: flex;
            align-items: center;
            justify-content: space-between;

            button {
                height: 36px;
                width: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
            }
        }

        .bottom {
            margin-top: 20px;
            color: #A1A1A9;
        }

        .color-red {
            margin-top: 20px;
        }

    }
`;

const TwoFactorAuth = ({ twoFactor, history }) => {
    const [confirmDisable, setConfirmDisable] = useState(false);
    const [existingContract, setExistingContract] = useState(true);
    const account = useSelector(selectAccountSlice);
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);
    const dispatch = useDispatch();
    const confirmDisabling = useSelector((state) => selectActionsPending(state, { types: ['DISABLE_MULTISIG'] }));

    const handleConfirmDisable = async () => {
        await dispatch(disableMultisig());
        await dispatch(fetchRecoveryMethods({ accountId: account.accountId }));
        setConfirmDisable(false);
    };

    useEffect(() => {
        (async () => {
            const { code_hash } = await wallet.getAccountBasic(account.accountId).state();
            const isExistingContract = (code_hash !== '11111111111111111111111111111111');
            setExistingContract(isExistingContract);
        })();
    }, []);

    return (
        <Container>
            {twoFactor && !confirmDisable &&
                <div className='method'>
                    <div className='top'>
                        <div>
                            <div className='title'>
                                <Translate id={`twoFactor.${twoFactor.kind === '2fa-email' ? 'email' : 'phone'}`}/>
                            </div>
                            <div className='detail'>{twoFactor.detail}</div>
                        </div>
                        <FormButton onClick={() => setConfirmDisable(true)} className='gray-red'><Translate id='button.disable'/></FormButton>
                    </div>
                    <div className='bottom'>
                        <span className='color-green'>
                            <Translate id='twoFactor.active'/>
                        </span> <Translate id='twoFactor.since'/> {new Date(twoFactor.createdAt).toDateString().replace(/^\S+\s/,'')}
                    </div>
                </div>
            }
            {twoFactor && confirmDisable &&
                <ConfirmDisable
                    onConfirmDisable={handleConfirmDisable}
                    onKeepEnabled={() => setConfirmDisable(false)}
                    accountId={account.accountId}
                    disabling={confirmDisabling}
                    component='twoFactor'
                />
            }
            {!twoFactor &&
                <div className='method'>
                    <div className='top'>
                        <div className='title'><Translate id='twoFactor.notEnabled'/></div>
                        <FormButton
                            onClick={() => history.push('/enable-two-factor')}
                            trackingId="2FA Click enable button"
                            disabled={!account.canEnableTwoFactor || existingContract}
                        >
                            <Translate id='button.enable'/>
                        </FormButton>
                    </div>
                    {!account.canEnableTwoFactor &&
                        <div className='color-red'>
                            <SafeTranslate
                                id='twoFactor.notEnoughBalance'
                                data={{
                                    amount: getNearAndFiatValue(parseNearAmount(MULTISIG_MIN_AMOUNT), nearTokenFiatValueUSD)
                                }}
                            />
                        </div>
                    }
                </div>
            }
        </Container>
    );
};

export default withRouter(TwoFactorAuth);
