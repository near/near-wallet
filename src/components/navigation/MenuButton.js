import React from 'react';
import styled from 'styled-components';
import classNames from '../../utils/classNames';


const MenuBtn = styled.div`
    min-width: 22px;
    max-width: 22px;
    min-height: 21px;
    max-height: 21px;
    position: relative;
    overflow: visible;

    div {
        width: 22px;
        height: 2px;
        background-color: white;
        position: absolute;

        :nth-child(1) {
            top: 0;
        }
    
        :nth-child(2) {
            top: 0px;
            bottom: 0;
            margin: auto;
        }
    
        :nth-child(3) {
            bottom: 0;
        }
    }

    &.open {
        div {
            width: 26px;

            :nth-child(1) {
                transform: rotate(45deg);
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
            }
            :nth-child(2) {
                display: none;
            }
            :nth-child(3) {
                transform: rotate(-45deg);
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
            }
        }
    }
`

const MenuButton = ({ onClick, open }) => (
    <MenuBtn className={classNames(['menu-btn', {'open' : open}])} onClick={onClick}>
        <div/>
        <div/>
        <div/>
    </MenuBtn>
)

export default MenuButton;