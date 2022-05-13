import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import classNames from '../../utils/classNames';
import isMobile from '../../utils/isMobile';
import Modal from './modal/Modal';
import SafeTranslate from '../SafeTranslate';
import InfoIconRounded from '../svg/InfoIconRounded';
import { ReactNode } from 'react';
import { StreamOptions } from 'node:stream';

const Container = styled.div`
    position: relative;
    margin: 0 8px;
    display: flex;
    z-index: 3;

    svg {
        pointer-events: none;
    }

    @keyframes fadeInTop {
        from {
            opacity: 0.2;
            transform: translate(-50%, 3px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }

    .hover-content {
        position: absolute;
        left: 50%;
        text-align: left;
        background-color: #24272a;
        color: white;
        border-radius: 4px;
        padding: 12px;
        font-size: 13px;
        bottom: 30px;
        font-weight: 400;
        width: max-content;
        max-width: 250px;
        z-index: 1;
        box-shadow: 0px 3px 12px 0px rgb(0 0 0 / 15%);

        &.show {
            animation-name: fadeInTop;
            animation-duration: 200ms;
            animation-fill-mode: forwards;
        }
    }

    &.right {
        .hover-content {
            left: 30px;
            top: 50%;
            bottom: unset;
            transform: translate(0,-50%);
        }
    }

    &.bottom {
        .hover-content {
            top: 30px;
            bottom: unset;
        }
    }

    :hover {
        svg {
            path {
                stroke: #0072ce
            }
        }
    }

    .rounded-info-icon {
        width: 18px;
        height: 18px;
    }

    &.icon-lg {
        .rounded-info-icon {
            width: 23px;
            height: 23px;
        }
    }
`;

type TooltipProps = { 
    className?:string; 
    children?: ReactNode | ReactNode[]
    translate: string;
    data?: string; 
    position?: string;
    icon?:string;
    modalOnly?:boolean; 
}

const Tooltip = ({ className, children, translate, data, position, icon, modalOnly = false }:TooltipProps) => {
    const [show, setShow] = useState(false);
    const [mobile, setMobile] = useState(null);
    const [mouseDisabled, setMouseDisabled] = useState(false);

    useEffect(() => {
        handleCheckDevice();
        window.addEventListener('resize', handleCheckDevice);

        return () => {
            window.removeEventListener('resize', handleCheckDevice);
        };
    }, []);

    const handleCheckDevice = () => {
        if (window.innerWidth < 992 || isMobile()) {
            setMobile(true);
        } else {
            setMobile(false);
        }
    };

    const mouseEventDisabled = () => {
        return (mouseDisabled || modalOnly || window.innerWidth < 992 || isMobile());
    };

    const handleClick = () => {
        setShow(true);
        if (!mobile && !modalOnly) {
            setMouseDisabled(true);
            setTimeout(() => {
                setMouseDisabled(false);
                setShow(false);
            }, 3000);
        }
    };

    return (
        <Container
            className={classNames(['tooltip', position, icon])}
            onMouseOver={() => !mouseEventDisabled() ? setShow(true) : null}
            onMouseOut={() => !mouseEventDisabled() ? setShow(false) : null}
            onClick={handleClick}
            style={{ cursor: modalOnly ? 'pointer' : 'default' }}
        >
            {children ? children : <InfoIconRounded/>}
            {show && !mobile && !modalOnly &&
                <div className={classNames(['hover-content', show ? 'show' : ''])}><SafeTranslate id={translate} data={{ data: data }}> </SafeTranslate></div>
            }
            {show && (mobile || modalOnly) &&
                <Modal
                    isOpen={show}
                    onClose={() => setShow(false)}
                    closeButton='true'
                    modalSize='sm'
                    mobileActionSheet={false}
                    modalClass='tooltip'
                >
                    <SafeTranslate id={translate} data={{ data: data }}> </SafeTranslate>
                </Modal>
            }
        </Container>
    );
};

export default Tooltip;
