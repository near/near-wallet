import React from 'react';
import styled from 'styled-components';
import { Popup } from 'semantic-ui-react';
import InfoIcon from '../svg/InfoIcon.js';

const Trigger = styled.div`
    height: 20px;
    width: 20px;
    display: inline-block;
    margin-left: 5px;

    svg {
        height: 20px;
        width: 20px;
        fill: #F8F8F8;

        circle {
            :first-of-type {
                stroke: none;
            }
            :last-of-type {
                stroke: #b5b5b5;
                fill: #b5b5b5;
            }
        }

        line {
            stroke: #b5b5b5;
        }
    }

`;

const InfoPopup = ({
    content,
    position = 'top center'
}) => (
    <Popup
        content={content}
        trigger={<Trigger className='trigger'><InfoIcon/></Trigger>}
        position={position}
    />
);

export default InfoPopup;