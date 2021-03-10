import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'
import InfoIconRounded from '../svg/InfoIconRounded'
import Modal from '../common/modal/Modal'
import isMobile from '../../utils/isMobile'
import classNames from '../../utils/classNames'

const Container = styled.div`
    position: relative;
    margin: 0 8px;
    display: flex;

    .hover-content {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
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
        width: 20px;
        height: 20px;
    }

    &.icon-lg {
        .rounded-info-icon {
            width: 24px;
            height: 24px;
        }
    }
`

const Tooltip = ({ className, children, translate, data, position, icon, modalOnly = false }) => {
    const [show, setShow] = useState(false);
    const [mobile, setMobile] = useState(null);
    const [mouseDisabled, setMouseDisabled] = useState(false);

    useEffect(() => {
        handleCheckDevice()
        window.addEventListener('resize', handleCheckDevice)

        return () => {
            window.removeEventListener('resize', handleCheckDevice)
        }
    }, [])

    const handleCheckDevice = () => {
        if (window.innerWidth < 992 || isMobile()) {
            setMobile(true)
        } else {
            setMobile(false)
        }
    }

    const mouseEventDisabled = () => {
        return (mouseDisabled || modalOnly || window.innerWidth < 992 || isMobile())
    }

    const handleClick = () => {
        setShow(true)
        if (!mobile) {
            setMouseDisabled(true)
            setTimeout(() => setMouseDisabled(false), 1000)
        }
    }

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
                <div className='hover-content'><Translate id={translate} data={{ data: data }}/></div>
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
                    <Translate id={translate} data={{ data: data }}/>
                </Modal>
            }
        </Container>
    )
}

export default Tooltip