import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import StyledModal from './Style.css';
import CloseButton from './CloseButton';
import classNames from '../../../utils/classNames';
import isMobile from '../../../utils/isMobile';
import MobileActionSheet from '../../common/modal/MobileActionSheet';

const modalRoot = document.getElementById('modal-root');

function Modal({ isOpen, onClose, id, modalSize, modalClass, children, closeButton, disableClose, mobileActionSheet = true }) {
    const background = React.createRef();
    const [fadeType, setFadeType] = useState(null);
    const [fullScreen, setFullScreen] = useState(null);

    useEffect(() => {
        if (isMobile()) {
            checkFullScreen()
        }

        const closeEl = document.getElementById('close-button');
        closeEl && closeEl.addEventListener('click', handleClick, false);
        window.addEventListener('keydown', onEscKeyDown, false);
        const fadeIn = setTimeout(() => setFadeType('in'), 0);

        return () => {
            window.removeEventListener('keydown', onEscKeyDown, false);
            closeEl && closeEl.removeEventListener('click', handleClick, false);
            clearTimeout(fadeIn);
        }

    },[]);

    useEffect(() => { setFadeType('out') }, [isOpen]);

    const checkFullScreen = () => {
        const modalHeight = document.getElementById('modal-container').getBoundingClientRect().height
        const clientHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        if (Math.round(modalHeight / clientHeight * 100) > 90) {
            setFullScreen('full-screen')
        }
    }

    const transitionEnd = e => {
        if (e.propertyName !== 'opacity' || fadeType === 'in') return;

        if (fadeType === 'out') {
            onClose();
        }
    };

    const onEscKeyDown = e => {
        if (!disableClose) {
            if (e.key !== 'Escape') return;
            setFadeType('out')
        }
    };

    const handleClick = () => {
        if (!disableClose) {
            setFadeType('out')
        }
    };

    return ReactDom.createPortal(
        <StyledModal
            id={id}
            className={classNames(['modal-wrapper', `size-${modalSize}`, `fade-${fadeType}`, modalClass, fullScreen])}
            role='dialog'
            modalSize={modalSize}
            onTransitionEnd={transitionEnd}
        >
            {mobileActionSheet &&
                <MobileActionSheet/>
            }
            <div id='modal-container' className='modal'>
                {closeButton && 
                    <CloseButton device={closeButton} onClick={handleClick}/>
                }
                {children}
            </div>
            <div className='background' onMouseDown={handleClick} ref={background}/>
        </StyledModal>,
        modalRoot
    );
}

export default Modal;
