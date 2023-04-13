import React, { useState } from 'react';
import styled from 'styled-components';
import classNames from '../../utils/classNames';
import FormButton from '../common/FormButton';
import { Translate } from 'react-localize-redux';


// import Container from '../common/styled/Container.css';


const RecoverAccountSeedPhraseForm = ({
    isLegit,
    handleChange,
    seedPhrase,
    localAlert,
    recoveringAccount,
    findMyAccountSending
}) => (
        <>
            <h4><Translate id='recoverSeedPhrase.seedPhraseInput.title' /></h4>
            <Translate>
                {({ translate }) => (
                    <input
                        value={seedPhrase}
                        onChange={(e) => handleChange(e.target.value)}
                        className={classNames([{'success': localAlert && localAlert.success}, {'problem': localAlert && localAlert.success === false}])}
                        placeholder={translate('recoverSeedPhrase.seedPhraseInput.placeholder')}
                        disabled={recoveringAccount}
                        data-test-id="seedPhraseRecoveryInput"
                        required
                        tabIndex='2'
                        autoCapitalize='off'
                    />
                )}
            </Translate>
            <FormButton
                type='submit'
                color='blue'
                // disabled={!isLegit || recoveringAccount}
                sending={findMyAccountSending}
                sendingString='button.recovering'
                data-test-id="seedPhraseRecoverySubmitButton"
            >
                <Translate id='button.findMyAccount' />
            </FormButton>
        </>
);



const StyledContainer = styled.div`
  &&& {
    text-align: center;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .input {
    width: 100%;
}

.input-sub-label {
    margin-bottom: 30px;
}

h4 {
    :first-of-type {
        margin: 30px 0 0 0 !important;
    }
}

button {
    width: 100% !important;
    margin-top: 30px !important;
}

`;

export function Disable2faPage() {

    const [seedPhrase, setSeedPhrase] = useState('')
    console.log('%cseedPhrase', 'color: aqua;font-size: 12px;', seedPhrase);
    

   const handleChange = (value) => {
   
            setSeedPhrase(value)
        
        // this.props.clearLocalAlert();
    }

    // handleChange = (value) => {
    //     this.setState(() => ({
    //         seedPhrase: value
    //     }));
    //     this.props.clearLocalAlert();
    // }



    // handleSubmit = async () => {
    //     if (!this.isLegit) {
    //         return false;
    //     }
    // }
        
        // const combinedState = {
        //     ...this.props,
        //     ...this.state,
        //     isLegit: this.isLegit && !(this.props.localAlert && this.props.localAlert.success === false)
        // }

    return (
        <StyledContainer>


            {/* <h1><Translate id='recoverSeedPhrase.pageTitle' /></h1> */}
            <h1>Disable 2 factor autentication</h1>
                <h2><Translate id='recoverSeedPhrase.pageText' /></h2>
                <form onSubmit={(e) => {
                    // handleSubmit();
                    e.preventDefault();
                }} autoComplete='off'>
                    <RecoverAccountSeedPhraseForm
                        // {...combinedState}
                        handleChange={handleChange}
                    />
                </form>
        </StyledContainer>
    );
}

