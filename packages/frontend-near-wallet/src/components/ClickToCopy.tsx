import React, { useState } from 'react';
import { styled } from '../styles';

const Container = styled('div', {
    position: "relative",
    cursor: "copy",

    '&.show': {
        '& .copy-success': {
            top: '-40px',
            opacity: 1
        },
    },

    '& > .copy-success': {
        position: "absolute",
        left: '50%',
        transform: 'translate(-50%, 0)',
        textAlign: 'center',
        backgroundColor: '#8DECC6',
        color: '#005A46',
        borderRadius: '4px',
        padding: '6px 8px',
        fontSize: '13px',
        top: '-30px',
        opacity: 0,
        pointerEvents: 'none',
        transition: '200ms',
        fontWeight: '400',

    },

    variants: {
        compact: {
            true: {
                '.copy-success': {
                    top: '-18px'
                },

                '.show.copy-success': {
                    top: '-28px'
                },
            }
        },
    }
});


const ClickToCopy = ({ className, children, compact, copy, onClick, successTranslation = 'default' }) => {
    const [show, setShow] = useState(false);

    const handleCopy = (e) => {
        setShow(true);
        setTimeout(() => setShow(false), 2000);
        const input = document.createElement('textarea');
        input.innerHTML = copy;
        document.body.appendChild(input);
        input.select();
        const result = document.execCommand('copy');
        document.body.removeChild(input);
        if (onClick) {
            onClick(e);
        }
        return result;
    };

    return (
        <>
            <Container
                title={'Copy'}
                className={`${className} ${show ? 'show' : ''}`}
                compact={compact}
                onClick={handleCopy}
            >
                {children}
                <div className='copy-success'>
                    Copied to clipboard!
                </div>
            </Container>
        </>
    );
};

export default ClickToCopy;
