import React, { useState } from 'react'
import styled from 'styled-components'
import classNames from '../../utils/classNames'
import { Translate } from 'react-localize-redux'
import { Mixpanel } from '../../mixpanel/index'

const Container = styled.div`
    position: relative;
    cursor: copy;

    .copy-success {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
        text-align: center;
        background-color: #8DECC6;
        color: #005A46;
        border-radius: 4px;
        padding: 6px 8px;
        font-size: 13px;
        top: -30px;
        opacity: 0;
        pointer-events: none;
        transition: 200ms;
        font-weight: 400;
    }

    &.show {
        .copy-success {
            top: -40px;
            opacity: 1;
        }
    }
`

const ClickToCopy = ({ className, children, copy, translate = 'default' }) => {
    const [show, setShow] = useState(false)

    const handleCopy = () => {
        Mixpanel.track(`Click to copy text`)
        setShow(true)
        setTimeout (() => setShow(false), 2000)
        const input = document.createElement('textarea')
        input.innerHTML = copy
        document.body.appendChild(input)
        input.select()
        const result = document.execCommand('copy')
        document.body.removeChild(input)
        return result
    }

    return (
        <Container title={copy} className={classNames([className, show ? 'show' : ''])} onClick={handleCopy}>
            {children}
            <div className='copy-success'>
                <Translate id={`copy.${translate}`}/>
            </div>
        </Container>
    )
}

export default ClickToCopy