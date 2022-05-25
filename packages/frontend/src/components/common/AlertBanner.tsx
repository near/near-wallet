import React from 'react';
import { ReactNode } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import classNames from '../../utils/classNames';
import SafeTranslate from '../SafeTranslate';
import AlertRoundedIcon from '../svg/AlertRoundedIcon';
import AlertTriangleIcon from '../svg/AlertTriangleIcon';
import FormButton from './FormButton';

const Container = styled.div`
    &&& {
        display: flex;
        padding: 20px;
        border-radius: 4px;
        margin-bottom: 30px;
        align-items: center;
        word-break: break-word;

        @media (max-width: 450px) {
            margin: -25px -14px 30px -14px;
            border-radius: 0;
        }

        &.warning {
            background-color: #FEF2F2;
            color: #DC1F25;
            margin-bottom: 0;

            svg {
                transform: rotate(0deg);
                path {
                    stroke: #DC1F25;
                }
            }
        }

        &.alert {
            background-color: #FFF0DE;
            color: #A15600;

            button, a {
                &.link {
                    color: #452500 !important;
                }
            }
            a {
                color: inherit;
            }
        }

        &.light-blue {
            background-color: #F0F9FF;
            color: #0072ce;

            svg {
                path {
                    stroke: #0072ce;
                }
            }

            button, a {
                &.link {
                    color: #12345D !important;
                }
            }
        }

        svg {
            min-width: 21px;
            min-height: 21px;
            margin: 8px 0;
            transform: rotate(180deg);
        }

        div {
            font-style: italic;
            margin-left: 20px;
            font-size: 13px;
            line-height: 150%;
        }

        button, a {
            &.link {
                display: block;
                text-transform: initial !important;
                margin: 10px 0 0 0 !important;
                width: auto !important;
                text-decoration: underline !important;
                font-weight: 500 !important;
                font-style: normal !important;
            }
        }

        a {
            text-decoration: underline;
        }
    }
`;

type AlertBannerProps = { 
    title?:string; 
    button?:string; 
    linkTo?:string; 
    data?:string;
    theme:string; 
    children?: ReactNode | ReactNode[];
 }

export default function AlertBanner({ title, button, linkTo, data, theme, children }:AlertBannerProps) {
    return (
        <Container className={classNames(['alert-banner', theme])}>
            {theme !== 'warning'
                ? <AlertRoundedIcon/>
                : <AlertTriangleIcon/>
            }      
            <div>
                {title && <SafeTranslate id={title} data={{ data: data }}> </SafeTranslate>}
                {linkTo ? 
                    <>
                        {linkTo.includes('http') ? (
                            <a target='_blank' rel='noreferrer' className='link' href={linkTo}><Translate id={button} /></a>
                        ) : (
                            //@ts-ignore
                            <FormButton className='link' linkTo={linkTo}><Translate id={button} /></FormButton>
                        )}
                    </>
                    : null
                }
                {children}
            </div>
        </Container>
    );
}
