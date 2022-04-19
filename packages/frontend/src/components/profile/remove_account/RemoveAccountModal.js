import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Checkbox from '../../common/Checkbox';
import FormButton from '../../common/FormButton';
import Modal from '../../common/modal/Modal';
import SafeTranslate from '../../SafeTranslate';

const Container = styled.div`
    &&&&& {
        padding: 15px 0 10px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        h3 {
            margin: 15px 0;
            font-size: 18px;
            font-weight: 700;
        }

        p {
            line-height: 1.5;
        }

        label {
            text-align: left;
            display: flex;
            background-color: #F5FAFF;
            margin: 25px -25px 0 -25px;
            padding: 15px 25px;
            line-height: 1.5;

            > div {
                > div {
                    border-color: #0081F1;
                }
            }

            > span {
                margin-left: 10px;
                word-break: break-word;
                color: #006ADC;
            }

            b {
                color: #272729;
            }
        }

        > button {
            margin-top: 25px;
            width: 100%;
        }
    }
`;

export default ({
    accountId,
    isOpen,
    onRemoveAccount,
    onClose
}) => {
    const [removeAccountDisclaimerApproved, setRemoveAccountDisclaimerApproved] = useState(false);
    return (
        <Modal
            id='remove-account-modal'
            isOpen={isOpen}
            onClose={onClose}
            modalSize='sm'
        >
            <Container>
                <h3><Translate id='removeAccount.title' /></h3>
                <p><Translate id='removeAccount.desc' /></p>
                <label>
                    <Checkbox
                        checked={removeAccountDisclaimerApproved}
                        onChange={(e) => setRemoveAccountDisclaimerApproved(e.target.checked)}
                    />
                    <span>
                        <SafeTranslate
                            id='removeAccount.disclaimer'
                            data={{ accountId: accountId }}
                        />
                    </span>
                </label>
                <FormButton
                    disabled={!removeAccountDisclaimerApproved}
                    onClick={onRemoveAccount}
                >
                    <Translate id='button.removeAccount' />
                </FormButton>
                <FormButton
                    className='link'
                    onClick={onClose}>
                    <Translate id='button.cancel' />
                </FormButton>
            </Container>
        </Modal>
    );
};
