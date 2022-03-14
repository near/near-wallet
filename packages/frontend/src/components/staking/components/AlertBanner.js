import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import classNames from '../../../utils/classNames';
import FormButton from '../../common/FormButton';
import SafeTranslate from '../../SafeTranslate';
import AlertTriangleIcon from '../../svg/AlertTriangleIcon.js';

const Container = styled.div`
    background-color: #FFF0DE;
    color: #A15600;
    display: flex;
    padding: 20px;
    border-radius: 4px;

    svg {
        min-width: 21px;
        min-height: 21px;
        margin: 8px 0;
    }

    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-style: italic;
        margin-left: 20px;
        font-size: 13px;
        text-align: left;
        line-break: normal;
    }

    .link {
        color: #452500 !important;
        text-transform: initial !important;
        margin: 20px 0 0 0 !important;
        width: auto !important;
        font-size: 13px !important;
        align-self: flex-start;
    }

    &.error {
        background-color: #FADFDF;
        color: #921C15;

        svg {
            path {
                stroke: #921C15;
            }
        }
    }

`;

export default function AlertBanner({ title, button, linkTo, theme, titleData, 'data-test-id': testId, 'data-test-id-button': buttonTestId  }) {
    return (
        <Container className={classNames(['alert-banner', theme])} data-test-id={testId}>
            <AlertTriangleIcon/>
            <div>
                <SafeTranslate id={title} data={{ data: titleData }}/>
                {linkTo && button && <FormButton data-test-id={buttonTestId} className='link' linkTo={linkTo} trackingId="Click alert banner"><Translate id={button} /></FormButton>}
            </div>
        </Container>
    );
}
