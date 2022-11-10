import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Modal from '../../../common/modal/Modal';

const Container = styled.div`
    padding: 15px 0;
    text-align: center;
    margin: 0 auto;

    @media (max-width: 360px) {
        padding: 0;
    }

    @media (min-width: 500px) {
        padding: 48px 28px 12px;
    }

    .accountsTitle {
        text-align: left;
        font-size: 12px;
        padding-top: 72px;
        padding-bottom: 6px;
    }

    .title{
        font-weight: 800;
        font-size: 20px;
        margin-top: 40px;
    }
`;

const EnterSecretKey = ({ accountId }) => {
    return  (
        <Modal
            modalClass="slim"
            id='migration-modal'
            onClose={() => {}}
            modalSize='md'
            style={{ maxWidth: '431px' }}
        >
            <Container>
                <h4 className='title'>
                    <Translate id='walletMigration.cleanKeys.verifyPassphrase.title' />
                </h4>
                <p>
                    <Translate id='walletMigration.cleanKeys.verifyPassphrase.desc' data={{ accountId }} />
                </p>
            </Container>
        </Modal>
    );
};

export default EnterSecretKey;
