import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Balance from '../../common/balance/Balance';
import FormButton from '../../common/FormButton';

const Container = styled.div`
    &&& {
        border: 2px solid #F0F0F0;
        border-radius: 8px;
        padding: 20px;

        .title {
            color: #3F4045;
            font-weight: 600;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            > button {
                margin: 0;
            }
        }

        .key {
            color: #3F4045;
            background-color: #FAFAFA;
            border: 1px solid #F0F0F1;
            border-radius: 4px;
            padding: 8px;
            font-size: 12px;
            line-break: anywhere;
        }
    }
`;

export default ({ app, onClick, deAuthorizing }) => {
    const [showConfirmDeAuthorize, setShowConfirmDeAuthorize] = useState(false);
    return (
        <Container className='authorized-app-box'>
            {!showConfirmDeAuthorize &&
                <>
                    <div className='title'>
                        Public key
                        {onClick &&
                            <FormButton color='gray-red' className='small'
                                onClick={() => setShowConfirmDeAuthorize(true)}
                                disabled={deAuthorizing}
                                sending={deAuthorizing}
                                sendingString='button.deAuthorizing'
                            >
                                <Translate id='button.deauthorize' />
                            </FormButton>}
                    </div>
                    <div className='key font-monospace'>{app.public_key}</div>
                </>
            }
            {showConfirmDeAuthorize &&
                <>
                    <input/>
                    <div>
                        <FormButton onClick={() => setShowConfirmDeAuthorize(false)}>Disable</FormButton>
                    </div>
                </>
            }

        </Container>
    );
};