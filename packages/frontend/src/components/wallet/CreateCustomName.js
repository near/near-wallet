import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../common/FormButton';
import NewAccountIdGraphic from '../common/graphics/NewAccountIdGraphic';

const Container = styled.div`
    &&& {
        background-color: black;
        border-radius: 8px;
        padding: 30px 24px;
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        color: #d5d4d8;
        font-size: 14px;
        margin-bottom: 40px;

        h2 {
            color: white;
            align-self: center;
            margin: 15px 0;
            text-align: center;
        }

        .desc {
            margin-bottom: 16px;
        }

        button {
            width: 100%;
        }

        .id-graphic {
            background-color: #3F4045;
            color: white;
        }
    }
`;

export default () => {
    return (
        <Container>
            <NewAccountIdGraphic accountId='bob.near'/>
            <h2>
                <Translate id='account.createImplicitAccount.createCustomNameModal.title' />
            </h2>
            <div className='desc'>
                <Translate id='account.createImplicitAccount.createCustomNameModal.desc' />
            </div>
            <FormButton
                linkTo='/create'
                color='dark-gray-light-blue'
                trackingId='Click explore apps button'
            >
                <Translate id='button.addACustomAddress' />
            </FormButton>
        </Container>
    );
};
