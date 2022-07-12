import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Container from '../common/styled/Container.css';

const CustomContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #25282a;
    text-align: center;

    .title {
        margin-top: 23px;

        h2 {
            font-weight: 900;
            font-size: 22px;
            color: #24272a;
        }
    }

    && .text {
        color: #72727a;
        margin-top: 24px;
    }
`;

const SignTransferInvalid = () => (
    <CustomContainer className="small-centered">
        <div className="title">
            <h2>
                <Translate id="sign.invalidTransaction.title" />
            </h2>
        </div>
        <div className="text">
            <Translate id="sign.invalidTransaction.body" />
        </div>
    </CustomContainer>
);

export default SignTransferInvalid;
