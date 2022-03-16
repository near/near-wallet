import React from 'react';
import {Translate} from 'react-localize-redux';
import styled from 'styled-components';

import Button from '../components/common/Button';
import Container from '../components/common/styled/Container.css';



const StyledContainer = styled(Container)`
    form{
        header{
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


const ChangePassword = () => {
    // const initialState ={
    //     newPassword: "",
    //     confirmPassword: "",
    // };
    // const [state,setState]=useState(initialState);
    // const handleStateUpdate = (data)=>{
    //     return setState({...state, ...data});
    // };
  return (
    <StyledContainer className='small-centered border'>
        <form>
            <header>
                <h1 className="ttl">
                    <Translate id="changePassword.ttl"/>
                </h1>
                <p className="desc"><Translate id="changePassword.desc"/></p>
            </header>
           <div className='inputWrapper'>
               <label htmlFor=""><Translate id="changePassword.newPassword"/></label>
                <input type='password'/>
             </div>
            <div className='inputWrapper'>
                <label htmlFor=""><Translate id="changePassword.confirmPassword"/></label>
                <input type='password'/>
                {/*<p>Incorrect password. 2 attempts remaining.</p>*/}
            </div>
            <Button className="btn">
                <Translate id="button.continue"/>
            </Button>
        </form>
    </StyledContainer>
  );
};

export default ChangePassword;
