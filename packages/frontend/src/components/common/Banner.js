import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from './FormButton';

const Container = styled.div`
    background-color: #fafafa;
    border-radius: 8px;
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: 25px;
    margin: 25px 0;
    line-height: 1.5;

    .content {
        margin-right: 20px;
    }

    .title {
        font-weight: 700;
    }

    .desc {
        margin-top: 10px;
    }

    &&& {
        button {
            margin: 0;
            margin-left: auto;
            padding: 10px;
            min-width: 150px;
            border-radius: 8px;
        }

        @media (max-width: 767px) {
            button {
                width: 100%;
                margin-top: 25px;
            }
        }
    }

    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

const Banner = ({
    title,
    desc,
    buttonTitle,
    onButtonClick,
    linkTo,
    buttonColor
}) => {
    return (
        <Container className='banner-container'>
            <div className='content'>
                <h4 className='title'>
                    <Translate id={title} />
                </h4>
                <div className='desc'>
                    <Translate id={desc} />
                </div>
            </div>
            <FormButton
                onClick={onButtonClick}
                linkTo={linkTo}
                color={buttonColor}
            >
                <Translate id={buttonTitle} />
            </FormButton>
        </Container>
    );
};

export default Banner;
