import { utils } from 'near-api-js';
import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { disableMultisig, loadRecoveryMethods } from '../../../redux/actions/account';
import { selectNearTokenFiatValueUSD } from '../../../redux/slices/tokenFiatValues';
import { actionsPending } from '../../../utils/alerts';
import { MULTISIG_MIN_AMOUNT } from '../../../utils/wallet';
import { getNearAndFiatValue } from '../../common/balance/helpers';
import FormButton from '../../common/FormButton';
import Card from '../../common/styled/Card.css';
import ConfirmDisable from '../hardware_devices/ConfirmDisable';

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
    const account = useSelector(({ account }) => account);
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);
    const dispatch = useDispatch();

    const handleConfirmDisable = async () => {
        await dispatch(disableMultisig());
        await dispatch(loadRecoveryMethods());
        setConfirmDisable(false);
    };

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
                    disabling={actionsPending('DISABLE_MULTISIG')}
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
                            disabled={!account.canEnableTwoFactor}
                        >
                            <Translate id='button.enable'/>
                        </FormButton>
                    </div>
                    {!account.canEnableTwoFactor && 
                        <div className='color-red'>
                            <Translate
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
