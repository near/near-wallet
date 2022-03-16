import React, { useState } from 'react';
import styled from 'styled-components';

import Button from '../components/common/Button';
import Container from '../components/common/styled/Container.css';
import ResetWalletPasswordModal from '../components/security/ResetWalletPasswordModal';
import EmailIcon from '../images/icon-lock-outline.svg';



const StyledContainer = styled(Container)`
    form{
        header{
            text-align: center;
            .iconWrapper{
                background: #F0F0F1;
                border-radius: 50px;
                width: 56px;
                height: 56px;
                margin: auto;
                display: flex;
                align-items: center;
                justify-content: center;
                img{
                    width: 24px;
                    height: 24px;
                }
            }
            .ttl{
                
            }
            .desc{
                margin-top: 16px;
                font-size: 16px;
                color: #72727A;
            }
        }

       .inputWrapper{
            margin-top: 52px;

            input {

            }
       }

       .btn{
           margin-top: 24px;
       }

       .forgotPassword{
           text-align: center;
           margin-top: 20px;
           color: #0072CE;
           cursor: pointer;
       }
    }
`;


const UnlockWallet = () => {
    const initialState ={
        showPasswordResetModal: false
    };
    const [state,setState]=useState(initialState);
    const handleStateUpdate = (data)=>{
        return setState({...state, ...data});
    };
  return (
    <StyledContainer className='small-centered border'>
        <form>
            <header>
               <div className="iconWrapper">
                   <img src={EmailIcon} alt="email icon" />
               </div>
                <h1 className="ttl">Unlock wallet</h1>
                <p className="desc">Your wallet was locked due to inactivity. Enter your browser password to unlock it.</p>
            </header>
           <div className='inputWrapper'>
               <label htmlFor="">Browser Password</label>
                <input
                    type='password'
                    // placeholder={translate('setupRecovery.emailPlaceholder')}
                    // value={verificationEmail}
                    // disabled={disabled}
                    // onChange={onChangeVerificationEmail}
                    // onBlur={onBlur}
                />
                <p>Incorrect password. 2 attempts remaining.</p>
             </div>
            <Button className="btn">
                Unlock
            </Button>

            <div 
                className='forgotPassword' 
                onClick={()=>{handleStateUpdate({showPasswordResetModal:true});}}
            >
                I forgot my password
            </div>
        </form>
        { state.showPasswordResetModal && 
            <ResetWalletPasswordModal onClose={()=>{handleStateUpdate({showPasswordResetModal:false});}}/> 
        }
    </StyledContainer>
  );
};

export default UnlockWallet;
