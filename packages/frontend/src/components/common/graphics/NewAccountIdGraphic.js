import React from 'react';
import styled from 'styled-components';

import StarIcon from '../../svg/StarIcon.js';

const IdGraphic = styled.div`
    position: relative;
    background-color: #C8F6E0;
    color: #005A46;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
    max-width: 250px;
    word-break: break-word;

    svg {
        position: absolute;

        :nth-of-type(1) {
            top: -30px;
            left: -3px;
            width: 13px;
        }

        :nth-of-type(2) {
            top: -19px;
            left: -22px;
        }

        :nth-of-type(3) {
            bottom: 0px;
            right: -29px;
            width: 16px;
        }
    }
`;

export default ({ accountId }) => {
    return (
        <IdGraphic>
            <StarIcon color='#80E8F8'/>
            <StarIcon color='#ECE750'/>
            <StarIcon/>
            {accountId}
        </IdGraphic>
    );
};
