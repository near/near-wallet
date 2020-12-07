import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../../common/styled/Card.css';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import KeysIcon from '../../svg/KeysIcon';
import SkeletonLoading from '../../common/SkeletonLoading';
import { MULTISIG_MIN_AMOUNT } from '../../../utils/wallet'
import Balance from '../../common/Balance'
import { utils } from 'near-api-js'
import ConfirmDisable from '../hardware_devices/ConfirmDisable'
import { disableMultisig } from '../../../actions/account'

const Container = styled(Card)`
    margin-top: 30px;

    .header {
        display: flex;
        align-items: center;

        svg {
            width: 28px;
            height: 28px;
            margin: -5px 10px 0 0;

            path {
                stroke: #CCCCCC;
            }
        }
    }

    .font-rounded {
        margin-top: 15px;
        font-weight: 500;
    }

    .title {
        color: #24272a;
        font-weight: 500;
    }

    .method {
        border-top: 2px solid #f8f8f8;
        margin: 20px -20px 0 -20px;
        padding: 20px 20px 0 20px;

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
    const loading = account.actionsPending.includes('LOAD_RECOVERY_METHODS');

    const handleConfirmDisable = async () => {
        await dispatch(disableMultisig())
        setConfirmDisable(false)
    }

    return (
        <Container>
            <div className='header'>
                <KeysIcon/>
                <h2><Translate id='twoFactor.title'/></h2>
            </div>
            <div className='font-rounded'><Translate id='twoFactor.desc'/></div>
            {twoFactor && !loading && !confirmDisable &&
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
            {
            twoFactor && !loading && confirmDisable &&
                <ConfirmDisable 
                    onConfirmDisable={handleConfirmDisable} 
                    onKeepEnabled={() => setConfirmDisable(false)}
                    accountId={account.accountId}
                    disabling={account.actionsPending.includes('DISABLE_MULTISIG')}
                    component='twoFactor'
                />
            }
            {!twoFactor && !loading &&
                <div className='method'>
                    <div className='top'>
                        <div className='title'><Translate id='twoFactor.notEnabled'/></div>
                        <FormButton onClick={() => history.push('/enable-two-factor')} disabled={!account.canEnableTwoFactor}><Translate id='button.enable'/></FormButton>
                    </div>
                    {!account.canEnableTwoFactor && 
                        <div className='color-red'>
                            <Translate id='twoFactor.notEnoughBalance'/> <Balance symbol='near' amount={utils.format.parseNearAmount(MULTISIG_MIN_AMOUNT)}/>
                        </div>
                    }
                </div>
            }
            {loading &&
                <div className='method'>
                    <SkeletonLoading
                        height='50px'
                        show={loading}
                    />
                </div>
            }
        </Container>
    )
}

export default withRouter(TwoFactorAuth);
