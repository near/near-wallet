import React from 'react';
import styled from 'styled-components';


const Hambuger = styled.div`
    min-width: 20px;
    max-width: 20px;
    min-height: 19px;
    max-height: 19px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    display: flex;
    align-items: center;
    justify-content: center;

    &:after {
        content: '';
        min-width: 20px;
        max-width: 20px;
        height: 1px;
        background-color: white;
    }
`

const MenuButton = () => (
    <Hambuger className='hamburger'/>
)

export default MenuButton;