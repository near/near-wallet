import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'
import InfoIconRounded from '../svg/InfoIconRounded'
import Modal from '../common/modal/Modal'
import isMobile from '../../utils/isMobile'

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
        bottom: 35px;
        pointer-events: none;
        font-weight: 400;
        width: max-content;
        max-width: 250px;
        z-index: 1;
    }

    :hover {
        svg {
            path {
                stroke: #0072ce
            }
        }
    }
`

const Tooltip = ({ className, children, translate }) => {
    const [show, setShow] = useState(false);
    const [mobile, setMobile] = useState(null);

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
        return (window.innerWidth < 992 || isMobile())
    }

    return (
        <Container
            className='tooltip'
            onMouseOver={() => !mouseEventDisabled() ? setShow(true) : null}
            onMouseOut={() => !mouseEventDisabled() ? setShow(false) : null}
            onClick={() => setShow(true)}
        >
            {children ? children : <InfoIconRounded/>}
            {show && !mobile && 
                <div className='hover-content'><Translate id={translate}/></div>
            }
            {show && mobile &&
                <Modal
                    isOpen={show}
                    onClose={() => setShow(false)}
                    closeButton='true'
                    modalSize='sm'
                    mobileActionSheet={false}
                    modalClass='tooltip'
                >
                    <Translate id={translate}/>
                </Modal>
            }
        </Container>
    )
}

export default Tooltip