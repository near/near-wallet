import React from 'react';
import styled from 'styled-components';

import Container from '../common/styled/Container.css';
import Disable2FactoryAuthenticateForm from './disable-2fa-form';

const StyledContainer = styled(Container)`
    .input {
        width: 100%;
    }

    .input-sub-label {
        margin-bottom: 30px;
    }

    button {
        width: 100% !important;
        margin-top: 30px !important;
    }
`;

export function Disable2faPage() {

    // const [seedPhrase, setSeedPhrase] = useState('');
    // console.log('%cseedPhrase', 'color: aqua;font-size: 12px;', seedPhrase);
    

    // const handleChange = (value) => {
   
    //     setSeedPhrase(value);
        
    //     // this.props.clearLocalAlert();
    // };

    // handleSubmit = async () => {
    //     // if (!this.isLegit) {
    //     //     return false;
    //     // }
    //     console.log('clicked');
    // }
        
    // const combinedState = {
    //     ...this.props,
    //     ...this.state,
    //     isLegit: this.isLegit && !(this.props.localAlert && this.props.localAlert.success === false)
    // }

    return (
        <StyledContainer className='small-centered border'>

            <h1>Disable Two-Factor Authentication</h1>
            <h2>Enter passphrase to disable your 2FA </h2>
            <form onSubmit={(e) => {
                this.handleSubmit();
                e.preventDefault();
            }} autoComplete='off'>
                <Disable2FactoryAuthenticateForm
                />
            </form>
        </StyledContainer>
    );
}
