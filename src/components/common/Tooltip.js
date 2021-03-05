import React, { useEffect } from 'react'
import styled from 'styled-components'
import classNames from '../../utils/classNames'
import { Translate } from 'react-localize-redux'
import InfoIconRounded from '../svg/InfoIconRounded'

const Container = styled.div`
    position: relative;

    .hover-content {
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
        text-align: left;
        background-color: #24272a;
        color: white;
        border-radius: 4px;
        padding: 8px;
        font-size: 13px;
        bottom: 35px;
        pointer-events: none;
        opacity: 0;
        transition: 200ms;
        font-weight: 400;
        width: max-content;
        max-width: 250px;
        z-index: 1;
        visibility: hidden;
    }

    :hover {
        svg {
            path {
                stroke: #0072ce
            }
        }
        .hover-content {
            opacity: 1;
            visibility: visible;
        }
        
    }
`

const Tooltip = ({ className, children, translate }) => {

    useEffect(() => {
        handlePosition()
        window.addEventListener('resize', handlePosition)

        return () => {
            window.removeEventListener('resize', handlePosition)
        }
    }, [])

    const handlePosition = () => {
        const tooltip = document.getElementById(translate)
        const hoverContentRight = tooltip.getBoundingClientRect().right
        const hoverContentLeft = tooltip.getBoundingClientRect().left
        const screenWidth = window.screen.width
        const offSetRight = screenWidth - hoverContentRight
        const offset = 20
        tooltip.style.transform = `translate(-50%,0)`
        if (offSetRight < offset) {
            tooltip.style.transform = `translate(calc(-50% - ${Math.abs(offSetRight) + offset}px),0)`
        } else if (hoverContentLeft < offset) {
            tooltip.style.transform = `translate(calc(-50% - ${hoverContentLeft - offset}px),0)`
        }
    }
    // onMouseOver is a must because need to mount the div after to fix positioning problem
    return (
        <Container className={classNames([className])}>
            {children ? children : <InfoIconRounded/>}
            <div id={translate} className='hover-content'>
                <Translate id={translate}/>
            </div>
        </Container>
    )
}

export default Tooltip