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
    onAuthorize,
    onCancel
}) => {
    const [addFullAccessKeyDisclaimerApproved, setAddFullAccessKeyDisclaimerApproved] = useState(false);
    return (
        <Modal
            id='add-full-access-key-modal'
            isOpen={isOpen}
            onClose={onCancel}
            modalSize='sm'
        >
            <Container>
                <h3><Translate id='sign.addFullAccessKey.title' /></h3>
                <p><Translate id='sign.addFullAccessKey.desc' /></p>
                <label>
                    <Checkbox
                        checked={addFullAccessKeyDisclaimerApproved}
                        onChange={(e) => setAddFullAccessKeyDisclaimerApproved(e.target.checked)}
                    />
                    <span>
                        <SafeTranslate
                            id='sign.addFullAccessKey.disclaimer'
                            data={{ accountId: accountId }}
                        />
                    </span>
                </label>
                <FormButton
                    disabled={!addFullAccessKeyDisclaimerApproved}
                    onClick={onAuthorize}
                >
                    <Translate id='button.authorize' />
                </FormButton>
                <FormButton
                    className='link'
                    onClick={onCancel}
                >
                    <Translate id='button.cancel' />
                </FormButton>
            </Container>
        </Modal>
    );
};
