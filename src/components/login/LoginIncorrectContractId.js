import React from 'react'

import MobileContainer from '../sign/MobileContainer'
import GlobalAlert from '../responsive/GlobalAlert'
import FormButton from '../common/FormButton'

const LoginIncorrectContractId = ({ contractId, failureUrl }) => (
    <MobileContainer>
        <GlobalAlert 
            globalAlert={{
                success: false,
                messageCodeHeader: 'error',
                messageCode: 'account.login.incorrectContractId.error',
                data: {
                    contractId
                }
            }}
            closeIcon={false}
        />
        <div className='return-to-app'>
            <FormButton
                color='blue'
                onClick={() => window.location.href = failureUrl}
            >
                RETURN TO APP
            </FormButton>
        </div>
    </MobileContainer>
)

export default LoginIncorrectContractId
