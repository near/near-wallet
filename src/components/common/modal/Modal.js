import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import StyledModal from './Style.css';
import CloseButton from './CloseButton';

const modalRoot = document.getElementById('modal-root');

function Modal(props) {
    const background = React.createRef();
    const { isOpen, onClose, id, modalSize, modalClass, children, closeButton } = props;
    const [fadeType, setFadeType] = useState(null);

    useEffect(() => {
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

    const transitionEnd = e => {
        if (e.propertyName !== 'opacity' || fadeType === 'in') return;

        if (fadeType === 'out') {
            onClose();
        }
    };

    const onEscKeyDown = e => {
        if (e.key !== 'Escape') return;
        setFadeType('out')
    };

    const handleClick = () => {
        setFadeType('out')
    };

    return ReactDom.createPortal(
        <StyledModal
            id={id}
            className={`modal-wrapper ${'size-' + modalSize} fade-${fadeType} ${modalClass}`} // TODO: fix undefined
            role='dialog'
            modalSize={modalSize}
            onTransitionEnd={transitionEnd}
        >
            <div className='modal'>
                {closeButton && <CloseButton device={closeButton} onClick={handleClick}/>}
                {children}
            </div>
            <div className='background' onMouseDown={handleClick} ref={background}/>
        </StyledModal>,
        modalRoot
    );
}

export default Modal;
