import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../../common/styled/Card.css';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import KeysIcon from '../../svg/KeysIcon';
import SkeletonLoading from '../../common/SkeletonLoading';
import { get2faMethod, getAccountAndState } from '../../../actions/account';

const Container = styled(Card)`
    margin-top: 30px;

    .header {
        display: flex;
        align-items: center;

        h2 {
            line-height: normal;
        }

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
                height: 40px;
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
        }

    }
`

const TwoFactorAuth = (props) => {

    const account = useSelector(({ account }) => account);
    const dispatch = useDispatch();
    const loading = account.actionsPending.includes('LOAD_RECOVERY_METHODS') || account.actionsPending.includes('REFRESH_ACCOUNT');
    const [method, setMethod] = useState();
    const [multiSigDeployed, setMultiSigDeployed] = useState();

    useEffect(() => {
        let isMounted = true;

        const handleGetTwoFactor = async () => {
            setMethod(await dispatch(get2faMethod()))
        };

        const checkMultiSigDeployed = async () => { 
            let response;
            try {
                response = await dispatch(getAccountAndState(account.accountId))
            } catch(e) {
                return;
            } finally {
                if (response && response.has2fa) {
                    setMultiSigDeployed(response.has2fa)
                }
            }

        };

        if (isMounted) {
            handleGetTwoFactor()
            checkMultiSigDeployed()
        }
        
        return () => { isMounted = false }
    }, []);

    return (
        <Container>
            <div className='header'>
                <KeysIcon/>
                <h2><Translate id='twoFactor.title'/></h2>
            </div>
            <div className='font-rounded'><Translate id='twoFactor.desc'/></div>
            {multiSigDeployed && method && !loading &&
                <div className='method'>
                    <div className='top'>
                        <div>
                            <div className='title'>
                                <Translate id={`twoFactor.${method.kind === '2fa-email' ? 'email' : 'phone'}`}/>
                            </div>
                            <div>{method.detail}</div>
                        </div>
                        {/*<FormButton onClick={() => {}} className='gray-red'><Translate id='button.disable'/></FormButton>*/}
                    </div>
                    <div className='bottom'>
                        <span className='color-green'>
                            <Translate id='twoFactor.active'/>
                        </span> <Translate id='twoFactor.since'/> {new Date(method.createdAt).toDateString().replace(/^\S+\s/,'')}
                    </div>
                </div>
            }
            {(!multiSigDeployed || !method) && !loading &&
                <div className='method'>
                    <div className='top'>
                        <div className='title'><Translate id='twoFactor.notEnabled'/></div>
                        <FormButton onClick={() => props.history.push('/enable-two-factor')}><Translate id='button.enable'/></FormButton>
                    </div>
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
