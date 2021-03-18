import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import classNames from '../../utils/classNames'

const Container = styled.div`
    overflow: hidden;
    height: 0;
    transition: 250ms;

    &.open {
        height: ${props => props.height}px;
    }
`

const Accordion = ({ className, trigger, children }) => {
    const [open, setOpen] = useState(false)
    const [contentHeight, setContentHeight] = useState('')

    useEffect(() => {
        const el = document.getElementById(trigger)
        const contentHeight = document.getElementById(`${trigger}-wrapper`).getBoundingClientRect().height
        el.addEventListener('click', handleClick)
        setContentHeight(contentHeight)

        return () => {
            el.removeEventListener('click', handleClick)
        }

    }, [open])

    const handleClick = () => {
        setOpen(!open)
        const el = document.getElementById(trigger)
        const container = document.getElementById(`${trigger}-container`)
        if (!open) {
            el.classList.add('open')
            setTimeout(() => container.style.overflow = 'visible', 250)
        } else {
            container.style.overflow = 'hidden'
            el.classList.remove('open')
        }
    }

    return (
        <Container id={`${trigger}-container`} height={contentHeight} className={classNames([className, open ? 'open' : ''])}>
            <div id={`${trigger}-wrapper`}>
                {children}
            </div>
        </Container>
    )
}

export default Accordion
