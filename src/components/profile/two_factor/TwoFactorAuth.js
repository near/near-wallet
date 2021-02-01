import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../../common/styled/Card.css';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';import { MULTISIG_MIN_AMOUNT } from '../../../utils/wallet'
import Balance from '../../common/Balance'
import { utils } from 'near-api-js'
import ConfirmDisable from '../hardware_devices/ConfirmDisable'
import { disableMultisig, loadRecoveryMethods } from '../../../actions/account'
import { actionsPending } from '../../../utils/alerts'
import {Mixpanel} from "../../../mixpanel/index";

const Container = styled(Card)`
    margin-top: 30px;

    .title {
        color: #24272a;
        font-weight: 500;
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
                letter-spacing: 1px !important;
            }
        }

        .bottom {
            margin-top: 20px;
        }

        .color-red {
            margin-top: 20px;
        }

    }
`

const TwoFactorAuth = ({ twoFactor, history }) => {
    const [confirmDisable, setConfirmDisable] = useState(false);
    const account = useSelector(({ account }) => account);
    const dispatch = useDispatch();

    const handleConfirmDisable = async () => {
        await dispatch(disableMultisig())
        await dispatch(loadRecoveryMethods())
        setConfirmDisable(false)
    }

    return (
        <Container>
            {twoFactor && !confirmDisable &&
                <div className='method'>
                    <div className='top'>
                        <div>
                            <div className='title'>
                                <Translate id={`twoFactor.${twoFactor.kind === '2fa-email' ? 'email' : 'phone'}`}/>
                            </div>
                            <div>{twoFactor.detail}</div>
                        </div>
                        {
                            false && <FormButton onClick={() => setConfirmDisable(true)} className='gray-red'><Translate id='button.disable'/></FormButton>
                        }
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
                            onClick={() => {
                                history.push('/enable-two-factor');
                                Mixpanel.track("2FA Click Enable Button", {url_link: "/enable-two-factor"});
                            }} 
                            disabled={!account.canEnableTwoFactor}
                        >
                            <Translate id='button.enable'/>
                        </FormButton>
                    </div>
                    {!account.canEnableTwoFactor && 
                        <div className='color-red'>
                            <Translate id='twoFactor.notEnoughBalance'/> <Balance symbol='near' amount={utils.format.parseNearAmount(MULTISIG_MIN_AMOUNT)}/>
                        </div>
                    }
                </div>
            }
        </Container>
    )
}

export default withRouter(TwoFactorAuth);
